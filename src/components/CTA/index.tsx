import type { UserInputs, Tier } from '../../lib/types'
import { CONTACT_URL } from '../Header'

interface Props {
  inputs: UserInputs
  tier: Tier
  moduleCount: number
}

const ENV_LABELS: Record<string, string> = {
  on_prem: 'On-Premises',
  hybrid: 'Hybrid Cloud',
  multi_cloud: 'Cloud-First',
}

const SIZE_LABELS: Record<string, string> = {
  small: 'Under 500 users',
  mid: '500–2,000 users',
  large: '2,000–10,000 users',
  xlarge: '10,000+ users',
}

const INDUSTRY_LABELS: Record<string, string> = {
  bfsi: 'BFSI',
  manufacturing_ot: 'Manufacturing & OT',
  healthcare: 'Healthcare & Pharma',
  it_ites: 'IT / ITES / SaaS',
  retail_ecomm: 'Retail & eCommerce',
  govt_psu: 'Government & PSU',
}

export default function CTA({ inputs, tier, moduleCount }: Props) {
  // Pre-fill query params so the contact page can surface context if it ever supports them
  const params = new URLSearchParams({
    source: 'architecture-builder',
    environment: ENV_LABELS[inputs.environment] ?? inputs.environment,
    size: SIZE_LABELS[inputs.size] ?? inputs.size,
    industry: INDUSTRY_LABELS[inputs.industry] ?? inputs.industry,
    tier: tier.charAt(0).toUpperCase() + tier.slice(1),
    modules: String(moduleCount),
  })
  const contactHref = `${CONTACT_URL}?${params.toString()}`

  return (
    <div className="mt-8 bg-gradient-to-br from-[#2D3748] to-[#1A202C] rounded-2xl p-8 md:p-10 text-white text-center shadow-lg overflow-hidden relative">
      {/* Subtle decorative rings */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative">
        <h3 className="text-2xl md:text-3xl font-bold mb-3">Ready to build this stack with Airtel?</h3>
        <p className="text-gray-300 text-sm md:text-base mb-7 max-w-2xl mx-auto">
          Our security consultants will sit with your team, pressure-test this architecture
          against your {INDUSTRY_LABELS[inputs.industry] ?? 'organisation'} reality, and put
          together a deployment roadmap that actually fits.
        </p>
        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E40000] text-white font-bold rounded-xl hover:bg-[#C00000] transition-all duration-150 shadow-lg hover:shadow-xl"
        >
          Talk to an Expert
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  )
}
