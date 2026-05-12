import type { Tier } from '../../lib/types'

interface Props {
  active: Tier
  onChange: (t: Tier) => void
  counts: { starter: number; standard: number; advanced: number }
}

export default function TierToggle({ active, onChange, counts }: Props) {
  const tiers: { id: Tier; label: string }[] = [
    { id: 'starter', label: 'Starter' },
    { id: 'standard', label: 'Standard' },
    { id: 'advanced', label: 'Advanced' },
  ]

  return (
    <div className="flex items-center gap-1 bg-white border border-[#E5E5E5] rounded-lg p-1 shadow-sm">
      {tiers.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-150 ${
            active === t.id
              ? 'bg-[#E40000] text-white shadow-sm'
              : 'text-gray-500 hover:text-[#1A1A1A]'
          }`}
        >
          {t.label}
          <span className={`ml-2 text-xs font-normal ${active === t.id ? 'text-red-200' : 'text-gray-400'}`}>
            {counts[t.id]}
          </span>
        </button>
      ))}
    </div>
  )
}
