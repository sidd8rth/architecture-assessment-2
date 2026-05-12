interface Props {
  show: boolean
  onToggle: () => void
}

export default function ComplianceOverlayToggle({ show, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
        show
          ? 'border-[#16A34A] bg-green-50 text-[#16A34A]'
          : 'border-[#E5E5E5] text-gray-600 hover:border-gray-300 bg-white'
      }`}
    >
      <span className="text-base">{show ? '✅' : '📋'}</span>
      {show ? 'Hide' : 'Show'} Regulatory Coverage
    </button>
  )
}
