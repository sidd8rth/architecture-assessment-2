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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {show ? (
          <>
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </>
        ) : (
          <>
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8M16 17H8M10 9H8" />
          </>
        )}
      </svg>
      {show ? 'Hide' : 'Show'} Regulatory Coverage
    </button>
  )
}
