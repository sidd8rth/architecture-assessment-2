import Header from '../Header'
import Footer from '../Footer'

interface Props {
  onStart: () => void
}

export default function Landing({ onStart }: Props) {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#FAFAFA] via-[#F5F5F5] to-[#F0F0F0] overflow-hidden">
      <Header
        caption="Architecture Builder"
        breadcrumb={[
          { label: 'Home', href: 'https://www.airtel.in/business' },
          { label: 'Security', href: 'https://www.airtel.in/b2b/secure-workforce' },
          { label: 'Architecture Builder' },
        ]}
      />

      {/* Subtle decorative element */}
      <div className="pointer-events-none absolute right-0 top-0 w-[40%] h-[60%] opacity-[0.04]"
           style={{ background: 'radial-gradient(circle at top right, #E40000 0%, transparent 70%)' }} />

      <main className="flex-1 flex items-center justify-center px-6 py-6 md:py-8 relative">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)] p-8 md:p-10 lg:p-12 animate-fadeUp">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-center">
              {/* Left column — Hero copy */}
              <div>
                {/* Stat pill */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFE5E5] text-[#E40000] text-xs font-bold tracking-wider uppercase">
                  5 Questions &middot; ~60 Seconds
                </div>

                {/* Headline */}
                <h1 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A]">
                  How should your<br />
                  <span className="bg-gradient-to-r from-[#E40000] to-[#B30000] bg-clip-text text-transparent">
                    security stack actually look?
                  </span>
                </h1>

                {/* Body */}
                <p className="mt-5 text-sm md:text-base text-gray-600 leading-relaxed">
                  Get a personalised Airtel Secure architecture with the reasoning behind every
                  module and a clear view of how it maps to the Indian regulations you care about.
                </p>

                {/* CTA row */}
                <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
                  <button
                    onClick={onStart}
                    className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1A1A1A] text-white font-semibold rounded-xl hover:bg-black transition-all duration-150 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Start Building
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <span className="text-xs text-gray-400">
                    No sign-up · No data leaves your browser
                  </span>
                </div>
              </div>

              {/* Right column — Trust + features */}
              <div className="lg:border-l lg:border-[#EAEAEA] lg:pl-12">
                {/* Trust stats */}
                <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-[#EAEAEA]">
                  <TrustStat number="29" label="Security modules" />
                  <TrustStat number="6" label="Bucket layers" />
                  <TrustStat number="5" label="Regulations" />
                </div>

                {/* Feature list (compact) */}
                <div className="space-y-3">
                  <FeatureRow
                    title="Personalised in real time"
                    body="Every recommendation comes from your specific inputs, not a template."
                  />
                  <FeatureRow
                    title="Regulation-aware"
                    body="DPDP, RBI, SEBI, IRDAI and CERT-In coverage shown upfront."
                  />
                  <FeatureRow
                    title="Built for how you'll actually grow"
                    body="See what to deploy today and what becomes relevant as you scale."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function TrustStat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] leading-none">{number}</div>
      <div className="text-[10px] md:text-xs text-gray-500 mt-1.5 font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}

function FeatureRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#FFE5E5] flex items-center justify-center">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L20 7" stroke="#E40000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-sm text-[#1A1A1A] leading-snug">{title}</div>
        <div className="text-xs text-gray-500 mt-0.5 leading-snug" dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  )
}
