/**
 * Inline SVG icon system for the Architecture Builder wizard.
 * Replaces emoji icons (which render inconsistently across OSes) with
 * consistent, stroke-based line icons in the Airtel design language.
 */

interface Props {
  name: IconName
  size?: number
  className?: string
}

export type IconName =
  // environments
  | 'building'        // on-prem
  | 'shuffle'         // hybrid
  | 'cloud'           // cloud-first
  // sizes
  | 'users'           // small
  | 'building-2'      // mid
  | 'buildings'       // large
  | 'globe'           // xlarge
  // industries
  | 'bank'            // BFSI
  | 'medical'         // healthcare
  | 'columns'         // PSU / govt
  | 'factory'         // manufacturing / OT
  | 'laptop'          // IT / ITeS
  | 'shopping-cart'   // retail
  // concerns
  | 'lock'            // ransomware
  | 'arrow-out'       // data exfiltration
  | 'bolt'            // DDoS
  | 'document'        // compliance
  | 'user-circle'     // insider threat
  | 'cloud-warning'   // cloud misconfig
  | 'envelope'        // phishing / email
  | 'cog'             // OT / IoT
  | 'link'            // third-party
  // maturity
  | 'seedling'        // nascent
  | 'tools'           // developing
  | 'shield-check'    // mature

const PATHS: Record<IconName, React.ReactNode> = {
  // ── environments ──────────────────────────────────────────────
  'building': (
    <>
      <path d="M3 21V7l9-4 9 4v14" />
      <path d="M9 21V11M15 21V11M3 21h18" />
      <path d="M11 7h2" />
    </>
  ),
  'shuffle': (
    <>
      <path d="M16 3h5v5" />
      <path d="M4 20l16.5-16.5" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </>
  ),
  'cloud': (
    <path d="M17.5 19a4.5 4.5 0 100-9h-1.26A8 8 0 104 14.3" />
  ),

  // ── sizes ─────────────────────────────────────────────────────
  'users': (
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  'building-2': (
    <>
      <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18" />
      <path d="M6 12H4a2 2 0 00-2 2v8h4M18 12h2a2 2 0 012 2v8h-4" />
      <path d="M10 6h.01M14 6h.01M10 10h.01M14 10h.01M10 14h.01M14 14h.01M10 18h.01M14 18h.01" />
    </>
  ),
  'buildings': (
    <>
      <path d="M3 22V8a2 2 0 012-2h6v16" />
      <path d="M13 22V4a2 2 0 012-2h4a2 2 0 012 2v18" />
      <path d="M3 22h18" />
      <path d="M7 10h.01M7 14h.01M7 18h.01M17 6h.01M17 10h.01M17 14h.01M17 18h.01" />
    </>
  ),
  'globe': (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </>
  ),

  // ── industries ────────────────────────────────────────────────
  'bank': (
    <>
      <path d="M3 21h18" />
      <path d="M3 10h18" />
      <path d="M12 3L2 9h20L12 3z" />
      <path d="M5 21V10M9 21V10M15 21V10M19 21V10" />
    </>
  ),
  'medical': (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M12 10v6M9 13h6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </>
  ),
  'columns': (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V8M19 21V8M12 21V8" />
      <path d="M2 8h20" />
      <path d="M12 3L4 8h16l-8-5z" />
    </>
  ),
  'factory': (
    <>
      <path d="M2 20h20" />
      <path d="M3 20V10l5 3V10l5 3V10l5 3v7" />
      <path d="M3 6l2-3h3l-1 4M19 6V3M19 10V8" />
    </>
  ),
  'laptop': (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M1 20h22" />
      <path d="M9 20l1-4h4l1 4" />
    </>
  ),
  'shopping-cart': (
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h2.5l3 13h12l2-9H6" />
    </>
  ),

  // ── concerns ──────────────────────────────────────────────────
  'lock': (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </>
  ),
  'arrow-out': (
    <>
      <path d="M14 3h7v7" />
      <path d="M10 14L21 3" />
      <path d="M21 14v7H3V3h7" />
    </>
  ),
  'bolt': (
    <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
  ),
  'document': (
    <>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
      <path d="M14 2v6h6" />
      <path d="M9 13l2 2 4-4" />
    </>
  ),
  'user-circle': (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M5.5 18.5a8 8 0 0113 0" />
    </>
  ),
  'cloud-warning': (
    <>
      <path d="M17.5 19a4.5 4.5 0 100-9h-1.26A8 8 0 104 14.3" />
      <path d="M12 14v3M12 20v.01" />
    </>
  ),
  'envelope': (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 7l10 7L22 7" />
    </>
  ),
  'cog': (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </>
  ),
  'link': (
    <>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </>
  ),

  // ── maturity ──────────────────────────────────────────────────
  'seedling': (
    <>
      <path d="M12 22V12" />
      <path d="M12 12C12 8 8 7 4 8c1 4 4 5 8 4z" />
      <path d="M12 12c0-4 4-5 8-4-1 4-4 5-8 4z" />
    </>
  ),
  'tools': (
    <>
      <path d="M14.7 6.3a4 4 0 11-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2-2-3 3-1-1 3-3-2-2z" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
}

export default function Icon({ name, size = 22, className = '' }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
