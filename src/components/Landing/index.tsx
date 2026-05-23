import Header from '../Header'
import Footer from '../Footer'

interface Props {
  onStart: () => void
}

export default function Landing({ onStart }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <Header
        caption="ARCHITECTURE BUILDER"
        breadcrumb={[
          { label: 'Home', href: 'https://www.airtel.in/business' },
          { label: 'Security', href: 'https://www.airtel.in/b2b/secure-workforce' },
          { label: 'Architecture Builder' },
        ]}
      />

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 md:py-20">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-sm p-8 md:p-14 animate-fadeUp">
            {/* Stat pill */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FFE5E5] text-[#E40000] text-xs font-bold tracking-wider uppercase">
              5 Questions &middot; 29 Modules &middot; ~60 Seconds
            </div>

            {/* Headline */}
            <h1 className="mt-7 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#1A1A1A]">
              How should your<br />
              <span className="text-[#E40000]">security stack actually look?</span>
            </h1>

            {/* Body */}
            <p className="mt-7 text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
              Answer five questions about your environment, scale, industry, and top concerns.
              Get a personalised Airtel Secure architecture — visualised, explained, and mapped
              to Indian regulations &mdash; generated instantly, all in your browser.
            </p>

            {/* Trust row */}
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl">
              <TrustStat number="29" label="Security modules" />
              <TrustStat number="6" label="Bucket layers" />
              <TrustStat number="5" label="Regulations mapped" />
            </div>

            {/* CTA row */}
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-gray-400">
                No sign-up. No data leaves your browser.
              </p>
              <button
                onClick={onStart}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1A1A1A] text-white font-semibold rounded-xl hover:bg-black transition-all duration-150 shadow-lg hover:shadow-xl"
              >
                Start Building
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Below-hero feature row */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              title="Personalised in real time"
              body="Every recommendation is computed from your inputs — no boilerplate, no generic stacks."
            />
            <FeatureCard
              title="Regulation-aware"
              body="Modules are mapped to DPDP, RBI, SEBI, IRDAI and CERT-In so compliance is visible upfront."
            />
            <FeatureCard
              title="Growth-aware roadmap"
              body="See what to deploy now, and what becomes relevant as your organisation scales."
            />
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
      <div className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">{number}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  )
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EAEAEA] p-5">
      <div className="w-8 h-8 rounded-lg bg-[#FFE5E5] flex items-center justify-center mb-3">
        <div className="w-2 h-2 rounded-full bg-[#E40000]" />
      </div>
      <h3 className="font-semibold text-sm text-[#1A1A1A] mb-1.5">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
    </div>
  )
}
