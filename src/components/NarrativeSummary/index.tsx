import type { Tier } from '../../lib/types'

interface Props {
  tier: Tier
  intro: string
  moduleReasons: { name: string; reason: string }[]
  regulationsCovered: string[]
  growthPath: string | null
  advisoryCount: number
}

const REG_COLORS: Record<string, string> = {
  DPDP: 'bg-purple-100 text-purple-700',
  RBI: 'bg-blue-100 text-blue-700',
  SEBI: 'bg-sky-100 text-sky-700',
  IRDAI: 'bg-emerald-100 text-emerald-700',
  'CERT-In': 'bg-amber-100 text-amber-700',
}

const TIER_LABELS: Record<Tier, string> = {
  starter: 'Starter',
  standard: 'Standard',
  advanced: 'Advanced',
}

export default function NarrativeSummary({ tier, intro, moduleReasons, regulationsCovered, growthPath }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-8 bg-[#E40000] rounded-full" />
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Recommendation Summary</div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">
            Your recommended stack  ·  {TIER_LABELS[tier]} tier
          </h3>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-5">{intro}</p>

      <div className="mb-5">
        <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">Why these modules:</h4>
        <div className="space-y-2.5">
          {moduleReasons.map(({ name, reason }) => (
            <div key={name} className="flex gap-3">
              <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-[#FFF0F0] border border-[#E40000] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E40000]" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#1A1A1A]">{name}: </span>
                <span className="text-sm text-gray-600">{reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {regulationsCovered.length > 0 && (
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-[#1A1A1A] mb-2">Regulations covered:</h4>
          <div className="flex flex-wrap gap-2">
            {regulationsCovered.map(r => (
              <span
                key={r}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${REG_COLORS[r] ?? 'bg-gray-100 text-gray-600'}`}
              >
                ✓ {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {growthPath && (
        <div className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-lg p-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Growth Path</h4>
          <p className="text-sm text-gray-700">{growthPath}</p>
        </div>
      )}
    </div>
  )
}
