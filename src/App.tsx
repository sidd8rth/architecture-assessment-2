import { useState } from 'react'
import type { UserInputs, Tier, ScoredCapability } from './lib/types'
import { scoreCapability, buildTiers } from './lib/scoring'
import { computeAdvisory, inferMaturity } from './lib/advisory'
import { generateNarrative } from './lib/narrative'
import capabilitiesData from './data/capabilities.json'
import regulationsData from './data/regulations.json'
import type { Capability } from './lib/types'

import Landing from './components/Landing'
import Wizard from './components/Wizard'
import Diagram from './components/Diagram'
import TierToggle from './components/TierToggle'
import ComplianceOverlayToggle from './components/ComplianceOverlay'
import NarrativeSummary from './components/NarrativeSummary'
import CTA from './components/CTA'
import Header from './components/Header'
import Footer from './components/Footer'

type Stage = 'landing' | 'wizard' | 'result'

const capabilities = capabilitiesData as Capability[]
const regulations = regulationsData as Record<string, string[]>

const INDUSTRY_LABEL: Record<string, string> = {
  bfsi: 'BFSI',
  manufacturing_ot: 'Manufacturing & OT',
  healthcare: 'Healthcare & Pharma',
  it_ites: 'IT / ITES / SaaS',
  retail_ecomm: 'Retail & eCommerce',
  govt_psu: 'Government & PSU',
}
const SIZE_LABEL: Record<string, string> = {
  small: 'Under 500 users',
  mid: '500–2,000 users',
  large: '2,000–10,000 users',
  xlarge: '10,000+ users',
}
const ENV_LABEL: Record<string, string> = {
  on_prem: 'On-Premises',
  hybrid: 'Hybrid',
  multi_cloud: 'Cloud-First',
}

function ContextPill({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
      accent
        ? 'bg-[#FFE5E5] text-[#E40000]'
        : 'bg-[#F0F0F0] text-gray-700'
    }`}>
      {label}
    </span>
  )
}

function ResultPage({ inputs, onReset }: { inputs: UserInputs; onReset: () => void }) {
  const [tier, setTier] = useState<Tier>('standard')
  const [showCompliance, setShowCompliance] = useState(false)

  const industryRegs = regulations[inputs.industry] ?? []
  const maturity = inferMaturity(inputs)

  const scored: ScoredCapability[] = capabilities.map(cap =>
    scoreCapability(cap, inputs, industryRegs)
  )

  const { starter, standard, advanced, futureState } = buildTiers(scored, inputs.size)
  const tierModules: Record<Tier, ScoredCapability[]> = { starter, standard, advanced }
  const activeModules = tierModules[tier]

  const advisoryItems = computeAdvisory(inputs, maturity, industryRegs, standard.length)

  const { intro, moduleReasons, regulationsCovered, growthPath } = generateNarrative(
    inputs,
    activeModules,
    advisoryItems,
    tier,
    futureState,
    industryRegs
  )

  const counts = { starter: starter.length, standard: standard.length, advanced: advanced.length + futureState.length }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header
        caption="ARCHITECTURE BUILDER"
        breadcrumb={[
          { label: 'Home', href: 'https://www.airtel.in/business' },
          { label: 'Security', href: 'https://www.airtel.in/b2b/secure-workforce' },
          { label: 'Architecture Builder', onClick: onReset },
          { label: 'Your Stack' },
        ]}
        sticky
        rightSlot={
          <button
            onClick={onReset}
            className="hidden sm:inline-flex items-center px-4 py-2.5 border border-[#E5E5E5] rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
          >
            ← Start Over
          </button>
        }
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Title + tier toggle */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 animate-fadeUp">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">
              Your Recommended Security Architecture
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              {activeModules.length} modules · {advisoryItems.length} advisory engagements · {regulationsCovered.length} regulations covered
            </p>
            {/* Context pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <ContextPill label={INDUSTRY_LABEL[inputs.industry] ?? inputs.industry} accent />
              <ContextPill label={SIZE_LABEL[inputs.size] ?? inputs.size} />
              <ContextPill label={ENV_LABEL[inputs.environment] ?? inputs.environment} />
              <ContextPill label={`${maturity.charAt(0).toUpperCase()}${maturity.slice(1)} maturity`} />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ComplianceOverlayToggle show={showCompliance} onToggle={() => setShowCompliance(s => !s)} />
            <TierToggle active={tier} onChange={setTier} counts={counts} />
          </div>
        </div>

        {/* Diagram */}
        <div className="bg-white rounded-2xl border border-[#EAEAEA] shadow-sm p-5 md:p-6">
          <Diagram
            activeModules={activeModules}
            futureState={tier === 'advanced' ? futureState : []}
            advisoryItems={advisoryItems}
            tier={tier}
            inputs={inputs}
            showCompliance={showCompliance}
          />
        </div>

        {/* Narrative */}
        <NarrativeSummary
          tier={tier}
          intro={intro}
          moduleReasons={moduleReasons}
          regulationsCovered={regulationsCovered}
          growthPath={growthPath}
          advisoryCount={advisoryItems.length}
        />

        {/* CTA */}
        <CTA inputs={inputs} tier={tier} moduleCount={activeModules.length} />
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  const [stage, setStage] = useState<Stage>('landing')
  const [inputs, setInputs] = useState<UserInputs | null>(null)

  if (stage === 'landing') {
    return <Landing onStart={() => setStage('wizard')} />
  }

  if (stage === 'wizard' || !inputs) {
    return (
      <Wizard
        onComplete={(answers) => {
          setInputs(answers)
          setStage('result')
        }}
        onBack={() => setStage('landing')}
      />
    )
  }

  return (
    <ResultPage
      inputs={inputs}
      onReset={() => {
        setInputs(null)
        setStage('landing')
      }}
    />
  )
}
