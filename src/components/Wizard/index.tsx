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
  { id: 'on_prem',     label: 'On-Premises', icon: '🏢', sub: 'Mostly on-prem infrastructure' },
  { id: 'hybrid',      label: 'Hybrid',      icon: '🔀', sub: 'Mix of on-prem and cloud' },
  { id: 'multi_cloud', label: 'Cloud-First', icon: '☁️', sub: 'Multi-cloud or SaaS-heavy stack' },
]

const SIZE_OPTIONS: { id: OrgSize; label: string; icon: string; sub: string }[] = [
  { id: 'small',  label: 'Under 500',       icon: '👥', sub: 'Small team, lean security posture' },
  { id: 'mid',    label: '500 – 2,000',     icon: '🏢', sub: 'Growing complexity, structured controls' },
  { id: 'large',  label: '2,000 – 10,000',  icon: '🏬', sub: 'Enterprise scale, multi-team security' },
  { id: 'xlarge', label: '10,000+',         icon: '🌐', sub: 'Large enterprise, comprehensive program' },
]

const MATURITY_OPTIONS: { id: Maturity; label: string; icon: string; sub: string }[] = [
  { id: 'nascent',    label: 'Getting Started', icon: '🌱', sub: 'Basic controls, significant gaps remain' },
  { id: 'developing', label: 'Developing',      icon: '🛠️', sub: 'Some controls in place, gaps remain' },
  { id: 'mature',     label: 'Mature',          icon: '🛡️', sub: 'Comprehensive program, looking to optimise' },
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
      <div className="flex-1 flex items-center justify-center px-4 py-4 md:py-6 overflow-y-auto">
        <div className="w-full max-w-3xl animate-fadeUp">
          <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-[0_2px_24px_-8px_rgba(0,0,0,0.08)] p-6 md:p-8 lg:p-10">

          {/* Step 0: Environment */}
          {step === 0 && (
            <StepShell stepNum={1} totalSteps={STEPS.length} title="What is your infrastructure environment?" subtitle="Tells us where your workloads actually run.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ENV_OPTIONS.map(opt => (
                  <OptionCard
                    key={opt.id}
                    icon={opt.icon}
                    title={opt.label}
                    subtitle={opt.sub}
                    selected={environment === opt.id}
                    onClick={() => setEnvironment(opt.id)}
                  />
                ))}
              </div>
            </StepShell>
          )}

          {/* Step 1: Size */}
          {step === 1 && (
            <StepShell stepNum={2} totalSteps={STEPS.length} title="How large is your organization?" subtitle="We calibrate module recommendations to your scale.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SIZE_OPTIONS.map(opt => (
                  <OptionCard
                    key={opt.id}
                    icon={opt.icon}
                    title={`${opt.label} users`}
                    subtitle={opt.sub}
                    selected={size === opt.id}
                    onClick={() => setSize(opt.id)}
                  />
                ))}
              </div>
            </StepShell>
          )}

          {/* Step 2: Industry */}
          {step === 2 && (
            <StepShell stepNum={3} totalSteps={STEPS.length} title="Which industry are you from?" subtitle="We weight your recommendations against what matters most for your sector.">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {industriesData.map(opt => (
                  <OptionCard
                    key={opt.id}
                    icon={(opt as { icon?: string }).icon ?? '•'}
                    title={opt.label}
                    subtitle={(opt as { sub?: string }).sub ?? ''}
                    selected={industry === opt.id}
                    onClick={() => setIndustry(opt.id as Industry)}
                  />
                ))}
              </div>
            </StepShell>
          )}

          {/* Step 3: Concerns */}
          {step === 3 && (
            <StepShell
              stepNum={4}
              totalSteps={STEPS.length}
              title="What are your top security concerns?"
              subtitle={`Pick up to 4. ${concerns.length}/4 selected.`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {concernsData.map(opt => {
                  const selected = concerns.includes(opt.id as Concern)
                  const disabled = !selected && concerns.length >= 4
                  return (
                    <OptionCard
                      key={opt.id}
                      icon={(opt as { icon?: string }).icon ?? '•'}
                      title={opt.label}
                      subtitle={(opt as { sub?: string }).sub ?? ''}
                      selected={selected}
                      disabled={disabled}
                      onClick={() => toggleConcern(opt.id as Concern)}
                    />
                  )
                })}
              </div>
            </StepShell>
          )}

          {/* Step 4: Maturity (optional) */}
          {step === 4 && (
            <StepShell stepNum={5} totalSteps={STEPS.length} title="What is your current security maturity?" subtitle="Optional. Helps tailor advisory recommendations; we'll infer it if you skip.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MATURITY_OPTIONS.map(opt => (
                  <OptionCard
                    key={opt.id}
                    icon={opt.icon}
                    title={opt.label}
                    subtitle={opt.sub}
                    selected={maturity === opt.id}
                    onClick={() => setMaturity(opt.id)}
                  />
                ))}
              </div>
            </StepShell>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => step === 0 ? onBack?.() : setStep(s => s - 1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#E5E5E5] text-sm font-semibold text-[#1A1A1A] hover:border-gray-400 hover:bg-gray-50 transition-all duration-150"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
            <div className="flex gap-3">
              {step === 4 && (
                <button
                  onClick={handleSkipMaturity}
                  className="px-5 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-100 transition-all"
                >
                  Skip (auto-infer)
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-150 shadow-sm hover:shadow-md"
              >
                {step === 4 ? 'Build My Architecture' : 'Continue'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

function StepShell({
  stepNum, totalSteps, title, subtitle, children,
}: {
  stepNum: number
  totalSteps: number
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-xs font-bold tracking-[0.18em] uppercase text-[#E40000] mb-3">
        Step {stepNum} of {totalSteps}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-2 tracking-tight">{title}</h2>
      <p className="text-sm md:text-base text-gray-500 mb-6">{subtitle}</p>
      {children}
    </div>
  )
}

function OptionCard({
  icon, title, subtitle, selected, disabled = false, onClick,
}: {
  icon: string
  title: string
  subtitle: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative p-4 rounded-2xl border-2 text-left transition-all duration-150 ${
        selected
          ? 'border-[#E40000] bg-[#FFF0F0]'
          : disabled
          ? 'border-transparent bg-[#F3F4F6] opacity-40 cursor-not-allowed'
          : 'border-transparent bg-[#F3F4F6] hover:bg-[#EEEFF1] hover:-translate-y-0.5 hover:shadow-sm'
      }`}
    >
      <div className="text-xl mb-2">{icon}</div>
      <div className="font-bold text-sm md:text-base text-[#1A1A1A] leading-tight">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1 leading-snug">{subtitle}</div>
      )}
      {selected && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#E40000] flex items-center justify-center">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  )
}
