import type { ScoredCapability, UserInputs, Tier } from './types'
import type { AdvisoryItem } from './advisory'

const ENV_LABELS: Record<string, string> = {
  on_prem: 'on-premises',
  hybrid: 'hybrid cloud',
  multi_cloud: 'cloud-first',
}

const SIZE_LABELS: Record<string, string> = {
  small: 'small (< 500 users)',
  mid: 'mid-size (500–2,000 users)',
  large: 'large (2,000–10,000 users)',
  xlarge: 'enterprise (10,000+ users)',
}

const INDUSTRY_LABELS: Record<string, string> = {
  bfsi: 'Banking, Financial Services & Insurance',
  manufacturing_ot: 'Manufacturing & OT/Industrial',
  healthcare: 'Healthcare & Pharma',
  it_ites: 'IT / ITES / SaaS',
  retail_ecomm: 'Retail & eCommerce',
  govt_psu: 'Government & PSU',
}

const CONCERN_LABELS: Record<string, string> = {
  ransomware: 'Ransomware',
  data_exfiltration: 'Data Exfiltration',
  ddos: 'DDoS',
  compliance_pressure: 'Compliance Pressure',
  insider_threat: 'Insider Threats',
  cloud_misconfig: 'Cloud Misconfiguration',
  phishing_email: 'Phishing / Email Attacks',
  ot_iot_exposure: 'OT/IoT Exposure',
  third_party_risk: 'Third-Party Risk',
}

const SIZE_NEXT: Record<string, string> = {
  small: '500 users',
  mid: '2,000 users',
  large: '10,000 users',
  xlarge: '',
}

export function generateNarrative(
  inputs: UserInputs,
  modules: ScoredCapability[],
  advisoryItems: AdvisoryItem[],
  tier: Tier,
  futureState: ScoredCapability[],
  industryRegs: string[]
): {
  intro: string
  moduleReasons: { name: string; reason: string }[]
  regulationsCovered: string[]
  growthPath: string | null
} {
  const tierLabel = tier === 'starter' ? 'Starter' : tier === 'standard' ? 'Standard' : 'Advanced'

  // Join concerns naturally: "A", "A and B", or "A, B and C"
  const concernNames = inputs.concerns.slice(0, 3).map(c => CONCERN_LABELS[c])
  const topConcerns =
    concernNames.length <= 1
      ? concernNames.join('')
      : concernNames.length === 2
      ? `${concernNames[0]} and ${concernNames[1]}`
      : `${concernNames.slice(0, -1).join(', ')} and ${concernNames[concernNames.length - 1]}`

  // Pick "a" vs "an" based on the first sound of the environment label
  const envLabel = ENV_LABELS[inputs.environment]
  const article = /^[aeiou]/i.test(envLabel) ? 'an' : 'a'

  const moduleWord = modules.length === 1 ? 'core module' : 'core modules'
  const advisoryWord = advisoryItems.length === 1 ? 'advisory engagement' : 'advisory engagements'

  const intro = `For a ${SIZE_LABELS[inputs.size]} ${INDUSTRY_LABELS[inputs.industry]} organisation in ${article} ${envLabel} environment, with top concerns around ${topConcerns}, we've put together ${modules.length} ${moduleWord} and ${advisoryItems.length} ${advisoryWord} at the ${tierLabel} tier.`

  const moduleReasons = modules.map(m => {
    const parts: string[] = []

    const concernHits = inputs.concerns.filter(c => m.concerns_addressed.includes(c))
    if (concernHits.length > 0) {
      parts.push(`directly addresses ${concernHits.map(c => CONCERN_LABELS[c]).join(' and ')}`)
    }

    if (m.matchedRegulations.length > 0) {
      parts.push(`required for ${m.matchedRegulations.join(' and ')} compliance`)
    }

    if (m.status === 'foundational') {
      parts.push('foundational control for your industry')
    } else if (m.status === 'mandated') {
      parts.push('mandated by applicable regulations')
    }

    if (m.critical_for_industries.includes(inputs.industry) && m.status !== 'foundational') {
      parts.push(`high-priority for ${INDUSTRY_LABELS[inputs.industry]}`)
    }

    const reason = parts.length > 0
      ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + (parts.length > 1 ? '; ' + parts.slice(1).join('; ') : '') + '.'
      : m.description

    return { name: m.name, reason }
  })

  const regulationsCovered = [...new Set(modules.flatMap(m => m.matchedRegulations))]

  let growthPath: string | null = null
  if (futureState.length > 0 && SIZE_NEXT[inputs.size]) {
    const names = futureState.slice(0, 3).map(f => f.name).join(', ')
    growthPath = `As you scale past ${SIZE_NEXT[inputs.size]}, consider adding ${names}${futureState.length > 3 ? ` and ${futureState.length - 3} more` : ''}.`
  }

  return { intro, moduleReasons, regulationsCovered, growthPath }
}
