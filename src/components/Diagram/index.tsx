import { useState, useRef } from 'react'
import type { ScoredCapability, UserInputs, Tier } from '../../lib/types'
import type { AdvisoryItem } from '../../lib/advisory'

const REG_COLORS: Record<string, string> = {
  DPDP: '#7C3AED',
  RBI: '#1D4ED8',
  SEBI: '#0369A1',
  IRDAI: '#065F46',
  'CERT-In': '#B45309',
}

const BUCKET_ORDER = ['network_security', 'secure_workforce', 'secure_workload', 'managed_services']
const BUCKET_LABELS: Record<string, string> = {
  network_security: 'Network Security',
  secure_workforce: 'Secure Workforce',
  secure_workload: 'Secure Workload',
  managed_services: 'Managed Services',
}

import Icon, { type IconName } from '../Icon'

const ENV_ICONS: Record<string, IconName> = {
  on_prem: 'building',
  hybrid: 'shuffle',
  multi_cloud: 'cloud',
}

const ENV_DISPLAY: Record<string, string> = {
  on_prem: 'On-Premises',
  hybrid: 'Hybrid',
  multi_cloud: 'Cloud-First',
}

const SIZE_LABELS: Record<string, string> = {
  small: '< 500 users',
  mid: '500–2,000 users',
  large: '2,000–10,000 users',
  xlarge: '10,000+ users',
}

const INDUSTRY_LABELS: Record<string, string> = {
  bfsi: 'Banking & Financial Services',
  manufacturing_ot: 'Manufacturing & OT',
  healthcare: 'Healthcare & Pharma',
  it_ites: 'IT / ITES / SaaS',
  retail_ecomm: 'Retail & eCommerce',
  govt_psu: 'Government & PSU',
}

const CONCERN_LABELS: Record<string, string> = {
  ransomware: 'Ransomware',
  data_exfiltration: 'Data Exfiltration',
  ddos: 'DDoS',
  compliance_pressure: 'Compliance',
  insider_threat: 'Insider Threats',
  cloud_misconfig: 'Cloud Misconfig',
  phishing_email: 'Phishing',
  ot_iot_exposure: 'OT/IoT',
  third_party_risk: '3rd Party Risk',
}

interface TooltipState {
  cap: ScoredCapability
  x: number
  y: number
}

interface Props {
  activeModules: ScoredCapability[]
  futureState: ScoredCapability[]
  advisoryItems: AdvisoryItem[]
  tier: Tier
  inputs: UserInputs
  showCompliance: boolean
}

export default function Diagram({ activeModules, futureState, advisoryItems, inputs, showCompliance }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [advisoryTooltip, setAdvisoryTooltip] = useState<{ item: AdvisoryItem; x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Deduplicate: activeModules take priority; futureState items only added if not already present
  const activeIds = new Set(activeModules.map(m => m.id))
  const allVisible = [
    ...activeModules,
    ...futureState.filter(m => !activeIds.has(m.id)),
  ]

  function getModulesForBucket(bucket: string) {
    return allVisible.filter(m => m.bucket === bucket)
  }

  function handleMouseEnter(cap: ScoredCapability, e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const container = containerRef.current?.getBoundingClientRect()
    setTooltip({
      cap,
      x: rect.left - (container?.left ?? 0) + rect.width / 2,
      y: rect.top - (container?.top ?? 0),
    })
  }

  function handleAdvisoryEnter(item: AdvisoryItem, e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const container = containerRef.current?.getBoundingClientRect()
    setAdvisoryTooltip({
      item,
      x: rect.left - (container?.left ?? 0) + rect.width / 2,
      y: rect.top - (container?.top ?? 0) + rect.height,
    })
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Advisory Wraparound */}
      {advisoryItems.length > 0 && (
        <div className="mb-3 border-2 border-dashed border-amber-400 rounded-xl bg-amber-50 p-4">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-3">
            Advisory Layer  ·  How we get you there and keep you there
          </div>
          <div className="flex flex-wrap gap-2">
            {advisoryItems.map(item => (
              <button
                key={item.id}
                onMouseEnter={e => handleAdvisoryEnter(item, e)}
                onMouseLeave={() => setAdvisoryTooltip(null)}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-medium text-amber-800 hover:border-amber-500 hover:shadow-sm transition-all duration-150 cursor-default"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main diagram layers */}
      <div className="space-y-3">
        {BUCKET_ORDER.map(bucket => {
          const mods = getModulesForBucket(bucket)
          if (mods.length === 0) return null
          return (
            <DiagramLayer
              key={bucket}
              label={BUCKET_LABELS[bucket]}
              bucket={bucket}
              modules={mods}
              onHover={handleMouseEnter}
              onLeave={() => setTooltip(null)}
              showCompliance={showCompliance}
            />
          )
        })}
      </div>

      {/* Environment card */}
      <div className="mt-3 flex justify-center">
        <div className="border-2 border-[#E40000] rounded-xl bg-[#FFF0F0] px-6 py-3 text-center max-w-md w-full">
          <div className="mb-1.5 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white text-[#E40000]">
            <Icon name={ENV_ICONS[inputs.environment]} size={20} />
          </div>
          <div className="text-sm font-semibold text-[#1A1A1A]">{INDUSTRY_LABELS[inputs.industry]}</div>
          <div className="text-xs text-gray-500 mt-1">{SIZE_LABELS[inputs.size]} · {ENV_DISPLAY[inputs.environment]}</div>
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {inputs.concerns.slice(0, 3).map(c => (
              <span key={c} className="px-2 py-0.5 rounded-full bg-red-100 text-[#E40000] text-xs font-medium">
                {CONCERN_LABELS[c]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Legend */}
      {showCompliance && (
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          {Object.entries(REG_COLORS).map(([reg, color]) => (
            <div key={reg} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-600 font-medium">{reg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tooltips */}
      {tooltip && (
        <ModuleTooltip tooltip={tooltip} onClose={() => setTooltip(null)} />
      )}
      {advisoryTooltip && (
        <AdvisoryTooltip tooltip={advisoryTooltip} onClose={() => setAdvisoryTooltip(null)} />
      )}
    </div>
  )
}

function DiagramLayer({
  label, bucket, modules, onHover, onLeave, showCompliance
}: {
  label: string
  bucket: string
  modules: ScoredCapability[]
  onHover: (cap: ScoredCapability, e: React.MouseEvent) => void
  onLeave: () => void
  showCompliance: boolean
}) {
  const isOperations = bucket === 'managed_services'

  return (
    <div className={`rounded-xl border p-3 ${
      isOperations
        ? 'border-blue-200 bg-blue-50'
        : 'border-[#E5E5E5] bg-white'
    }`}>
      <div className={`text-xs font-semibold uppercase tracking-widest mb-2.5 ${
        isOperations ? 'text-blue-700' : 'text-gray-500'
      }`}>
        {label}{isOperations ? '  ·  Always-On' : ''}
      </div>
      <div className="flex flex-wrap gap-2">
        {modules.map((mod, idx) => (
          <ModuleChip
            key={`${mod.id}-${idx}`}
            cap={mod}
            onHover={onHover}
            onLeave={onLeave}
            showCompliance={showCompliance}
          />
        ))}
      </div>
    </div>
  )
}

function ModuleChip({
  cap, onHover, onLeave, showCompliance
}: {
  cap: ScoredCapability
  onHover: (cap: ScoredCapability, e: React.MouseEvent) => void
  onLeave: () => void
  showCompliance: boolean
}) {
  const isFuture = cap.status === 'future_state'
  const isRequired = cap.status === 'foundational' || cap.status === 'mandated'

  return (
    <div
      onMouseEnter={e => onHover(cap, e)}
      onMouseLeave={onLeave}
      className={`relative px-3 py-2 rounded-lg border-2 cursor-default select-none transition-all duration-150 group ${
        isFuture
          ? 'border-dashed border-[#E5E5E5] bg-gray-50 opacity-40'
          : isRequired
          ? 'border-[#E40000] bg-[#FFF0F0] shadow-sm hover:shadow-md'
          : 'border-[#E40000] bg-[#FFF8F8] hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-1.5">
        {isRequired && (
          <span className="text-[#E40000] text-xs">★</span>
        )}
        <span className={`text-xs font-semibold ${isFuture ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>
          {cap.name}
        </span>
      </div>
      {isRequired && !isFuture && (
        <span className="absolute -top-1.5 -right-1 bg-[#E40000] text-white text-[9px] font-bold px-1 py-0.5 rounded">
          {cap.status === 'foundational' ? 'CORE' : 'REQ'}
        </span>
      )}
      {showCompliance && !isFuture && cap.matchedRegulations.length > 0 && (
        <div className="flex gap-0.5 mt-1.5">
          {cap.matchedRegulations.map(r => (
            <div
              key={r}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: REG_COLORS[r] ?? '#888' }}
              title={r}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ModuleTooltip({ tooltip, onClose }: { tooltip: TooltipState; onClose: () => void }) {
  const { cap, x, y } = tooltip
  const isFuture = cap.status === 'future_state'

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: Math.max(0, x - 140), top: Math.max(0, y - 220) }}
    >
      <div className="w-72 bg-white border border-[#E5E5E5] rounded-xl shadow-xl p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="font-semibold text-sm text-[#1A1A1A]">{cap.name}</div>
          {cap.status === 'foundational' && (
            <span className="text-[9px] bg-[#E40000] text-white px-1.5 py-0.5 rounded font-bold ml-2 shrink-0">CORE</span>
          )}
          {cap.status === 'mandated' && (
            <span className="text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold ml-2 shrink-0">REQUIRED</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-3">{cap.description}</p>
        {isFuture ? (
          <div className="text-xs text-gray-400 italic">{cap.futureUnlockReason}</div>
        ) : (
          <>
            <div className="mb-2">
              <div className="text-xs font-semibold text-[#1A1A1A] mb-1">Why recommended:</div>
              <ul className="space-y-1">
                {cap.reasons.map((r, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                    <span className="text-[#E40000] shrink-0">·</span>{r}
                  </li>
                ))}
              </ul>
            </div>
            {cap.matchedRegulations.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-[#1A1A1A] mb-1">Regulations addressed:</div>
                <div className="flex gap-1.5 flex-wrap">
                  {cap.matchedRegulations.map(r => (
                    <span
                      key={r}
                      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                      style={{ backgroundColor: REG_COLORS[r] ?? '#888' }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function AdvisoryTooltip({ tooltip, onClose }: { tooltip: { item: AdvisoryItem; x: number; y: number }; onClose: () => void }) {
  const { item, x, y } = tooltip
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{ left: Math.max(0, x - 140), top: y + 8 }}
    >
      <div className="w-72 bg-white border border-amber-200 rounded-xl shadow-xl p-4">
        <div className="font-semibold text-sm text-[#1A1A1A] mb-1">{item.name}</div>
        <p className="text-xs text-gray-500 mb-2">{item.description}</p>
        <div className="text-xs text-amber-700">{item.reason}</div>
      </div>
    </div>
  )
}
