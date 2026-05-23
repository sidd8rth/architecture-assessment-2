import Logo from '../Logo'

const FOOTER_LINKS = [
  { label: 'Terms & Conditions', href: 'https://www.airtel.in/about-bharti/equity/terms-and-conditions' },
  { label: 'Privacy Policy',     href: 'https://www.airtel.in/forme/privacy-policy' },
  { label: 'Cookie Notice',      href: 'https://www.airtel.in/forme/cookie-policy' },
  { label: 'Contact Us',         href: 'https://www.airtel.in/b2b/contact-us' },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E5E5] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <Logo height={32} />
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-[#1A1A1A] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-5 pt-5 border-t border-[#F0F0F0] text-xs text-gray-400">
          © 2026 Bharti Airtel Limited. Airtel Secure is a product of Airtel Business.
          <span className="hidden sm:inline"> · Architecture recommendations are advisory in nature based on inputs provided. Consult an Airtel security expert for a formal assessment.</span>
        </div>
      </div>
    </footer>
  )
}
