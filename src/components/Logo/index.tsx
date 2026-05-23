interface Props {
  height?: number
  className?: string
}

/**
 * Airtel Secure brand logo — official grey lockup.
 * Curved "a" swoosh mark + "Secure" wordmark in slate grey (#2D3748).
 * To replace with the official SVG asset, swap the <svg> contents below.
 */
export default function Logo({ height = 32, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 280 90"
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Airtel Secure"
    >
      {/* Airtel swoosh — stylized curved 'a' brand mark */}
      <g fill="#2D3748">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M 44 6
             C 22 6, 4 24, 4 46
             C 4 68, 22 86, 44 86
             C 58 86, 70 80, 78 70
             L 70 64
             C 64 72, 54 76, 44 76
             C 28 76, 16 64, 16 46
             C 16 28, 28 16, 44 16
             C 60 16, 72 28, 72 46
             C 72 50, 71 54, 70 58
             L 50 70
             C 46 72, 42 70, 42 66
             C 42 62, 44 60, 48 58
             L 62 50
             L 56 40
             L 40 50
             C 32 54, 30 64, 38 70
             C 46 76, 58 72, 64 64
             L 84 50
             L 84 46
             C 84 24, 66 6, 44 6 Z"
        />
      </g>
      {/* Secure wordmark */}
      <text
        x="100"
        y="62"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="42"
        fontWeight="500"
        fill="#2D3748"
        letterSpacing="-0.5"
      >
        Secure
      </text>
    </svg>
  )
}
