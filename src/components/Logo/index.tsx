interface Props {
  height?: number
  className?: string
}

/**
 * Airtel Secure brand logo — official grey lockup.
 * Source: /public/airtel-secure-logo.png  (official Airtel brand asset).
 */
export default function Logo({ height = 32, className = '' }: Props) {
  return (
    <img
      src="/airtel-secure-logo.png"
      alt="Airtel Secure"
      height={height}
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      className={className}
    />
  )
}
