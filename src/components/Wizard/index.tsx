import { useState } from 'react'
import type { UserInputs, Environment, OrgSize, Industry, Concern, Maturity } from '../../lib/types'
import industriesData from '../../data/industries.json'
import concernsData from '../../data/concerns.json'
import Header from '../Header'
import Footer from '../Footer'

interface Props {
  onComplete: (inputs: UserInputs) => void
  onBack?: () => void
}

const STEPS = ['Environment', 'Organization Size', 'Industry', 'Security Concerns', 'Security Maturity']

const ENV_OPTIONS: { id: Environment; label: string; icon: string; sub: string }[] = [
  { id: 'on_prem',     label: 'On-Premises', icon: '🏢', sub: '' },
  { id: 'hybrid',      label: 'Hybrid',      icon: '🔀', sub: '' },
  { id: 'multi_cloud', label: 'Cloud-First', icon: '☁️', sub: '' },
]

const SIZE_OPTIONS: { id: OrgSize; label: string; sub: string }[] = [
  { id: 'small', label: 'Under 500', sub: 'Small team, lean security posture' },
  { id: 'mid', label: '500 – 2,000', sub: 'Growing complexity, structured controls needed' },
  { id: 'large', label: '2,000 – 10,000', sub: 'Enterprise scale, multi-team security' },
  { id: 'xlarge', label: '10,000+', sub: 'Large enterprise, comprehensive program' },
]

const MATURITY_OPTIONS: { id: Maturity; label: string; sub: string }[] = [
  { id: 'nascent', label: 'Getting Started', sub: 'Basic controls only, significant gaps remain' },
  { id: 'developing', label: 'Developing', sub: 'Some controls in place, gaps remain' },
  { id: 'mature', label: 'Mature', sub: 'Comprehensive program, looking to optimize' },
]

export default function Wizard({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(0)
  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [size, setSize] = useState<OrgSize | null>(null)
  const [industry, setIndustry] = useState<Industry | null>(null)
  const [concerns, setConcerns] = useState<Concern[]>([])
  const [maturity, setMaturity] = useState<Maturity | undefined>(undefined)

  function toggleConcern(id: Concern) {
    setConcerns(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    )
  }

  function canAdvance(): boolean {
    if (step === 0) return environment !== null
    if (step === 1) return size !== null
    if (step === 2) return industry !== null
    if (step === 3) return concerns.length >= 1
    return true
  }

  function handleNext() {
    if (step < 4) {
      setStep(s => s + 1)
    } else {
      onComplete({
        environment: environment!,
        size: size!,
        industry: industry!,
        concerns,
        maturity,
      })
    }
  }

  function handleSkipMaturity() {
    onComplete({
      environment: environment!,
      size: size!,
      industry: industry!,
      concerns,
      maturity: undefined,
    })
  }

  const progress = ((step) / STEPS.length) * 100

  return (
    <div className="h-screen bg-gradient-to-br from-[#FAFAFA] via-[#F5F5F5] to-[#F0F0F0] flex flex-col overflow-hidden">
      <Header
        caption="Architecture Builder"
        breadcrumb={[
          { label: 'Home', href: 'https://www.airtel.in/business' },
          { label: 'Security', href: 'https://www.airtel.in/b2b/secure-workforce' },
          { label: 'Architecture Builder', onClick: onBack },
          { label: `Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}` },
        ]}
      />

      {/* Progress bar */}
      <div className="h-1 bg-[#E5E5E5]">
        <div
          className="h-1 bg-gradient-to-r from-[#E40000] to-[#B30000] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-6 md:py-8 overflow-y-auto">
        <div className="w-full max-w-2xl animate-fadeUp">
          {/* Compact step dots */}
          <div className="flex items-center gap-1.5 mb-7">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < step
                    ? 'w-6 bg-[#E40000]'
                    : i === step
                    ? 'w-12 bg-[#E40000]'
                    : 'w-6 bg-[#E5E5E5]'
                }`}
                title={s}
              />
            ))}
            <span className="ml-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {STEPS[step]}
            </span>
          </div>

          {/* Step 0: Environment */}
          {step === 0 && (
            <StepShell title="What is your infrastructure environment?" subtitle="Select the option that best describes where your workloads live.">
              <div className="grid grid-cols-3 gap-3">
                {ENV_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setEnvironment(opt.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-150 hover:shadow-sm ${
                      environment === opt.id
                        ? 'border-[#E40000] bg-[#FFF0F0]'
                        : 'border-[#E5E5E5] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{opt.icon}</div>
                    <div className="font-semibold text-sm text-[#1A1A1A]">{opt.label}</div>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {/* Step 1: Size */}
          {step === 1 && (
            <StepShell title="How large is your organization?" subtitle="We'll calibrate module recommendations to your scale.">
              <div className="grid grid-cols-2 gap-3">
                {SIZE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSize(opt.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-150 hover:shadow-sm ${
                      size === opt.id
                        ? 'border-[#E40000] bg-[#FFF0F0]'
                        : 'border-[#E5E5E5] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-lg text-[#E40000]">{opt.label}</div>
                    <div className="text-xs text-[#1A1A1A] font-medium mt-1">users</div>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {/* Step 2: Industry */}
          {step === 2 && (
            <StepShell title="What is your industry vertical?" subtitle="Industry determines applicable regulations and critical controls.">
              <div className="grid grid-cols-1 gap-2">
                {industriesData.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setIndustry(opt.id as Industry)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-150 hover:shadow-sm ${
                      industry === opt.id
                        ? 'border-[#E40000] bg-[#FFF0F0]'
                        : 'border-[#E5E5E5] bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium text-sm text-[#1A1A1A]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {/* Step 3: Concerns */}
          {step === 3 && (
            <StepShell
              title="What are your top security concerns?"
              subtitle={`Select up to 4 concerns. ${concerns.length}/4 selected.`}
            >
              <div className="grid grid-cols-3 gap-2">
                {concernsData.map(opt => {
                  const selected = concerns.includes(opt.id as Concern)
                  const disabled = !selected && concerns.length >= 4
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleConcern(opt.id as Concern)}
                      disabled={disabled}
                      className={`p-3 rounded-lg border-2 text-left transition-all duration-150 ${
                        selected
                          ? 'border-[#E40000] bg-[#FFF0F0]'
                          : disabled
                          ? 'border-[#E5E5E5] bg-gray-50 opacity-40 cursor-not-allowed'
                          : 'border-[#E5E5E5] bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {selected && <span className="text-[#E40000] text-xs font-bold">✓ </span>}
                      <span className="text-xs font-medium text-[#1A1A1A]">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </StepShell>
          )}

          {/* Step 4: Maturity (optional) */}
          {step === 4 && (
            <StepShell title="What is your current security maturity?" subtitle="Optional. Helps tailor advisory recommendations; we'll infer it if you skip.">
              <div className="grid grid-cols-1 gap-3">
                {MATURITY_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setMaturity(opt.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-150 hover:shadow-sm ${
                      maturity === opt.id
                        ? 'border-[#E40000] bg-[#FFF0F0]'
                        : 'border-[#E5E5E5] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-sm text-[#1A1A1A]">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="px-5 py-2 rounded-lg border border-[#E5E5E5] text-sm font-medium text-gray-600 hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Back
            </button>
            <div className="flex gap-3">
              {step === 4 && (
                <button
                  onClick={handleSkipMaturity}
                  className="px-5 py-2 rounded-lg border border-[#E5E5E5] text-sm font-medium text-gray-600 hover:border-gray-300 transition-all"
                >
                  Skip (auto-infer)
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#E40000] to-[#C00000] text-white text-sm font-semibold hover:from-[#C00000] hover:to-[#A00000] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 shadow-sm hover:shadow-md"
              >
                {step === 4 ? 'Build My Architecture →' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function StepShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-[#1A1A1A] mb-1.5 tracking-tight">{title}</h2>
      <p className="text-sm text-gray-500 mb-5">{subtitle}</p>
      {children}
    </div>
  )
}
