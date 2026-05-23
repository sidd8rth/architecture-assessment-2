import type { UserInputs, Maturity, ScoredCapability } from './types'
import capabilities from '../data/capabilities.json'

export interface AdvisoryItem {
  id: string
  name: string
  description: string
  bucket: string
  reason: string
}

export function inferMaturity(inputs: UserInputs): Maturity {
  if (inputs.maturity) return inputs.maturity
  const { size, industry } = inputs
  // xlarge: BFSI / Govt / IT-ITES assumed mature (heavy regulatory pressure);
  // other xlarge industries default to 'developing' (not nascent).
  if (size === 'xlarge') {
    return ['bfsi', 'govt_psu', 'it_ites'].includes(industry) ? 'mature' : 'developing'
  }
  if (size === 'large' || size === 'mid') return 'developing'
  return 'nascent'
}

function getCap(id: string): { name: string; description: string; bucket: string } {
  const found = (capabilities as { id: string; name: string; description: string; bucket: string }[]).find(c => c.id === id)
  return found ?? { name: id, description: '', bucket: '' }
}

export function computeAdvisory(
  inputs: UserInputs,
  maturity: Maturity,
  industryRegs: string[],
  standardModuleCount: number
): AdvisoryItem[] {
  const items: AdvisoryItem[] = []
  const { size, industry, concerns } = inputs

  // Gap & Risk Assessment
  if (maturity === 'nascent' || maturity === 'developing') {
    const c = getCap('gap_risk')
    items.push({
      id: 'gap_risk',
      ...c,
      reason: `Recommended because your maturity level (${maturity}) indicates baseline gaps need to be assessed before deploying controls.`,
    })
  }

  // VAPT — applies to all regulated industries (including manufacturing OT) and
  // any organisation worried about data exfiltration, compliance or OT/IoT exposure.
  const vaptIndustries = ['bfsi', 'it_ites', 'retail_ecomm', 'govt_psu', 'healthcare', 'manufacturing_ot']
  if (
    vaptIndustries.includes(industry) ||
    concerns.includes('data_exfiltration') ||
    concerns.includes('compliance_pressure') ||
    concerns.includes('ot_iot_exposure')
  ) {
    const c = getCap('vapt')
    items.push({
      id: 'vapt',
      ...c,
      reason: `Required for ${industry.toUpperCase()} sector${concerns.includes('compliance_pressure') ? ' and your compliance requirements' : ''}.`,
    })
  }

  // Red Team-Blue Team
  const redBlueIndustries = ['bfsi', 'govt_psu', 'it_ites']
  if (maturity === 'mature' && ['large', 'xlarge'].includes(size) && redBlueIndustries.includes(industry)) {
    const c = getCap('red_blue')
    items.push({
      id: 'red_blue',
      ...c,
      reason: `Adversary simulation is appropriate for mature programs of your scale in ${industry.toUpperCase()}.`,
    })
  }

  // Complex Implementations
  if (standardModuleCount >= 5) {
    const c = getCap('complex_impl')
    items.push({
      id: 'complex_impl',
      ...c,
      reason: `With ${standardModuleCount} modules in your recommended stack, expert-led deployment keeps the integrations clean and prevents gaps between layers.`,
    })
  }

  // IR Planning
  const irIndustries = ['bfsi', 'healthcare', 'govt_psu']
  const irRegs = ['RBI', 'IRDAI', 'CERT-In']
  if (irIndustries.includes(industry) || industryRegs.some(r => irRegs.includes(r))) {
    const c = getCap('ir_planning')
    items.push({
      id: 'ir_planning',
      ...c,
      reason: `${industryRegs.filter(r => irRegs.includes(r)).join(', ')} mandates documented incident response procedures.`,
    })
  }

  // Forensics & RCA
  const forensicsIndustries = ['bfsi', 'healthcare', 'govt_psu']
  if (['mid', 'large', 'xlarge'].includes(size) && forensicsIndustries.includes(industry)) {
    const c = getCap('forensics_rca')
    items.push({
      id: 'forensics_rca',
      ...c,
      reason: `At your scale, rapid RCA after incidents is critical for ${industry.toUpperCase()} regulatory reporting requirements.`,
    })
  }

  // Deduplicate
  const seen = new Set<string>()
  return items.filter(i => {
    if (seen.has(i.id)) return false
    seen.add(i.id)
    return true
  })
}
