import { useState } from 'react'
import type { UserInputs, Tier, ScoredCapability } from './lib/types'
import { scoreCapability, buildTiers } from './lib/scoring'
import { computeAdvisory, inferMaturity } from './lib/advisory'
import { generateNarrative } from './lib/narrative'
import capabilitiesData from './data/capabilities.json'
import regulationsData from './data/regulations.json'
import type { Capability } from './lib/types'

import Wizard from './components/Wizard'
import Diagram from './components/Diagram'
import TierToggle from './components/TierToggle'
import ComplianceOverlayToggle from './components/ComplianceOverlay'
import NarrativeSummary from './components/NarrativeSummary'
import CTA from './components/CTA'
import Logo from './components/Logo'

const capabilities = capabilitiesData as Capability[]
const regulations = regulationsData as Record<string, string[]>

function ResultPage({ inputs, onReset }: { inputs: UserInputs; onReset: () => void }) {
  const [tier, setTier] = useState<Tier>('standard')
  const [showCompliance, setShowCompliance] = useState(false)

  const industryRegs = regulations[inputs.industry] ?? []
  const maturity = inferMaturity(inputs)

  // Score all capabilities
  const scored: ScoredCapability[] = capabilities.map(cap =>
    scoreCapability(cap, inputs, industryRegs)
  )

  // Build tiers
  const { starter, standard, advanced, futureState } = buildTiers(scored, inputs.size)

  const tierModules: Record<Tier, ScoredCapability[]> = { starter, standard, advanced }
  const activeModules = tierModules[tier]

  // Advisory (based on standard tier count)
  const advisoryItems = computeAdvisory(inputs, maturity, industryRegs, standard.length)

  // Narrative
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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E5E5] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo height={52} />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden md:block">
              {inputs.industry.replace('_', ' ')} · {inputs.size} org · {inputs.environment.replace('_', ' ')}
            </span>
            <button
              onClick={onReset}
              className="px-4 py-2 border border-[#E5E5E5] rounded-lg text-sm font-medium text-gray-600 hover:border-gray-300 transition-all"
            >
              ← Start Over
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Title + tier toggle row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">Your Recommended Security Architecture</h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeModules.length} modules · {advisoryItems.length} advisory engagements · {regulationsCovered.length} regulations covered
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ComplianceOverlayToggle show={showCompliance} onToggle={() => setShowCompliance(s => !s)} />
            <TierToggle active={tier} onChange={setTier} counts={counts} />
          </div>
        </div>

        {/* Diagram */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-5">
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
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] mt-12 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-gray-400">
          Airtel Secure — Architecture recommendations are advisory in nature and based on inputs provided. Consult an Airtel security expert for a formal assessment.
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  const [inputs, setInputs] = useState<UserInputs | null>(null)

  if (!inputs) {
    return <Wizard onComplete={setInputs} />
  }

  return <ResultPage inputs={inputs} onReset={() => setInputs(null)} />
}
