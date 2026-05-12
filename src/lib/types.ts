export type Environment = 'on_prem' | 'hybrid' | 'multi_cloud' | 'saas_heavy'
export type OrgSize = 'small' | 'mid' | 'large' | 'xlarge'
export type Industry = 'bfsi' | 'manufacturing_ot' | 'healthcare' | 'it_ites' | 'retail_ecomm' | 'govt_psu'
export type Concern =
  | 'ransomware'
  | 'data_exfiltration'
  | 'ddos'
  | 'compliance_pressure'
  | 'insider_threat'
  | 'cloud_misconfig'
  | 'phishing_email'
  | 'ot_iot_exposure'
  | 'third_party_risk'
export type Maturity = 'nascent' | 'developing' | 'mature'
export type Tier = 'starter' | 'standard' | 'advanced'
export type CapabilityStatus = 'foundational' | 'mandated' | 'recommended' | 'future_state' | 'excluded'

export interface UserInputs {
  environment: Environment
  size: OrgSize
  industry: Industry
  concerns: Concern[]
  maturity?: Maturity
}

export interface Capability {
  id: string
  name: string
  bucket: string
  layer: string
  concerns_addressed: string[]
  environments: string[]
  min_size: string
  critical_for_industries: string[]
  regulations: string[]
  is_foundational: boolean
  description: string
}

export interface ScoredCapability extends Capability {
  score: number
  status: CapabilityStatus
  reasons: string[]
  futureUnlockReason?: string
  matchedRegulations: string[]
}

export interface TieredResult {
  starter: ScoredCapability[]
  standard: ScoredCapability[]
  advanced: ScoredCapability[]
  futureState: ScoredCapability[]
}
