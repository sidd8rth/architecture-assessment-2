import type { Capability, ScoredCapability, TieredResult, UserInputs, CapabilityStatus } from './types'

const SIZE_ORDINAL: Record<string, number> = { small: 1, mid: 2, large: 3, xlarge: 4 }

const SIZE_CAP: Record<string, number> = { small: 6, mid: 10, large: 15, xlarge: Infinity }

function getNextSize(size: string): string {
  const order = ['small', 'mid', 'large', 'xlarge']
  const i = order.indexOf(size)
  return order[i + 1] ?? 'xlarge'
}

function sizeLabel(size: string): string {
  const map: Record<string, string> = {
    small: '< 500 users',
    mid: '500 – 2,000 users',
    large: '2,000 – 10,000 users',
    xlarge: '10,000+ users',
  }
  return map[size] ?? size
}

// Buckets handled by the Advisory Overlay (NOT the main scoring engine).
// Spec: "Advisory items (Professional Services + Incident Response) don't slot
// into the architecture diagram the same way. They wrap around it. Apply these
// rules SEPARATELY from the main scoring."
const ADVISORY_BUCKETS = new Set(['professional_services', 'incident_response'])

export function scoreCapability(
  cap: Capability,
  inputs: UserInputs,
  industryRegs: string[]
): ScoredCapability {
  const userSizeOrdinal = SIZE_ORDINAL[inputs.size]
  const capSizeOrdinal = SIZE_ORDINAL[cap.min_size]

  // Advisory bucket items must never appear in the main diagram layers.
  if (ADVISORY_BUCKETS.has(cap.bucket)) {
    return {
      ...cap,
      score: 0,
      status: 'excluded',
      reasons: [],
      matchedRegulations: [],
    }
  }

  const envMatch = cap.environments.includes(inputs.environment)
  const sizeOk = userSizeOrdinal >= capSizeOrdinal

  // Would qualify if only size was blocking
  const wouldQualifyWithoutSize = envMatch

  const reasons: string[] = []
  let score = 0

  // Concern hits (+3 each)
  const matchedConcerns = inputs.concerns.filter(c => cap.concerns_addressed.includes(c))
  score += matchedConcerns.length * 3
  if (matchedConcerns.length > 0) {
    const concernLabels = matchedConcerns.map(c => concernLabel(c))
    reasons.push(`Addresses your concern${matchedConcerns.length > 1 ? 's' : ''}: ${concernLabels.join(', ')}`)
  }

  // Env match (+2)
  if (envMatch) {
    score += 2
    reasons.push(`Designed for ${envLabel(inputs.environment)} environments`)
  }

  // Industry critical (+2)
  if (cap.critical_for_industries.includes(inputs.industry)) {
    score += 2
    reasons.push(`Critical for ${industryLabel(inputs.industry)}`)
  }

  // Regulation match (+3)
  const matchedRegs = industryRegs.filter(r => cap.regulations.includes(r))
  if (matchedRegs.length > 0) {
    score += 3
    reasons.push(`Required for ${matchedRegs.join(', ')} compliance`)
  }

  // Determine status
  let status: CapabilityStatus = 'excluded'
  let futureUnlockReason: string | undefined

  if (!envMatch) {
    status = 'excluded'
  } else if (!sizeOk) {
    // Only blocked by size — future state
    if (wouldQualifyWithoutSize && score >= 5) {
      status = 'future_state'
      futureUnlockReason = `Becomes relevant at ${sizeLabel(getNextSize(inputs.size))}`
    } else {
      status = 'excluded'
    }
  } else {
    // Passes size + env
    const foundational =
      cap.is_foundational &&
      cap.critical_for_industries.includes(inputs.industry)

    const mandated = matchedRegs.length > 0

    if (foundational) {
      status = 'foundational'
    } else if (mandated) {
      status = 'mandated'
    } else if (score >= 5) {
      status = 'recommended'
    } else {
      status = 'excluded'
    }
  }

  return {
    ...cap,
    score,
    status,
    reasons,
    futureUnlockReason,
    matchedRegulations: matchedRegs,
  }
}

function dedup(arr: ScoredCapability[]): ScoredCapability[] {
  const seen = new Set<string>()
  return arr.filter(m => { const ok = !seen.has(m.id); seen.add(m.id); return ok })
}

export function buildTiers(
  scored: ScoredCapability[],
  size: string
): TieredResult {
  const cap = SIZE_CAP[size]

  // Deduplicate source first — guards against any import/HMR double-load edge cases
  const unique = dedup(scored)

  // Foundational items must always come first so size caps never drop them.
  // Sort: foundational → mandated, then by score desc within each group.
  const foundationalMandated = unique
    .filter(s => s.status === 'foundational' || s.status === 'mandated')
    .sort((a, b) => {
      if (a.status === 'foundational' && b.status !== 'foundational') return -1
      if (a.status !== 'foundational' && b.status === 'foundational') return 1
      return b.score - a.score
    })
  const recommended = unique
    .filter(s => s.status === 'recommended')
    .sort((a, b) => b.score - a.score)
  const futureState = unique.filter(s => s.status === 'future_state')

  const starterPool = dedup(foundationalMandated)
  const starter = starterPool.slice(0, cap)

  const standard = dedup([...starter, ...recommended]).slice(0, cap)

  // Advanced = Standard + remaining recommended
  const standardIds = new Set(standard.map(m => m.id))
  const advanced = dedup([...standard, ...recommended.filter(r => !standardIds.has(r.id))])
    .slice(0, Math.max(cap, standard.length + recommended.length))

  return { starter, standard, advanced, futureState: dedup(futureState) }
}

function concernLabel(id: string): string {
  const map: Record<string, string> = {
    ransomware: 'Ransomware',
    data_exfiltration: 'Data Exfiltration',
    ddos: 'DDoS',
    compliance_pressure: 'Compliance Pressure',
    insider_threat: 'Insider Threats',
    cloud_misconfig: 'Cloud Misconfiguration',
    phishing_email: 'Phishing / Email',
    ot_iot_exposure: 'OT/IoT Exposure',
    third_party_risk: 'Third-Party Risk',
  }
  return map[id] ?? id
}

function envLabel(id: string): string {
  const map: Record<string, string> = {
    on_prem: 'on-premises',
    hybrid: 'hybrid cloud',
    multi_cloud: 'cloud-first',
  }
  return map[id] ?? id
}

function industryLabel(id: string): string {
  const map: Record<string, string> = {
    bfsi: 'BFSI',
    manufacturing_ot: 'Manufacturing & OT',
    healthcare: 'Healthcare & Pharma',
    it_ites: 'IT/ITES',
    retail_ecomm: 'Retail & eCommerce',
    govt_psu: 'Government & PSU',
  }
  return map[id] ?? id
}
