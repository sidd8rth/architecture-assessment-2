import { useState } from 'react'
import type { UserInputs, Tier } from '../../lib/types'

interface Props {
  inputs: UserInputs
  tier: Tier
  moduleCount: number
}

const ENV_LABELS: Record<string, string> = {
  on_prem: 'On-Premises',
  hybrid: 'Hybrid Cloud',
  multi_cloud: 'Multi-Cloud',
  saas_heavy: 'SaaS-Heavy',
}

const SIZE_LABELS: Record<string, string> = {
  small: '< 500 users',
  mid: '500–2,000 users',
  large: '2,000–10,000 users',
  xlarge: '10,000+ users',
}

const INDUSTRY_LABELS: Record<string, string> = {
  bfsi: 'Banking, Financial Services & Insurance',
  manufacturing_ot: 'Manufacturing & OT/Industrial',
  healthcare: 'Healthcare & Pharma',
  it_ites: 'IT / ITES / SaaS',
  retail_ecomm: 'Retail & eCommerce',
  govt_psu: 'Government & PSU',
}

const CONCERN_LABELS: Record<string, string> = {
  ransomware: 'Ransomware',
  data_exfiltration: 'Data Exfiltration',
  ddos: 'DDoS',
  compliance_pressure: 'Compliance Pressure',
  insider_threat: 'Insider Threats',
  cloud_misconfig: 'Cloud Misconfiguration',
  phishing_email: 'Phishing / Email',
  ot_iot_exposure: 'OT/IoT Exposure',
  third_party_risk: 'Third-Party Risk',
}

export default function CTA({ inputs, tier, moduleCount }: Props) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setOpen(false)
      setSubmitted(false)
    }, 3000)
  }

  const prefilled = [
    `Environment: ${ENV_LABELS[inputs.environment]}`,
    `Size: ${SIZE_LABELS[inputs.size]}`,
    `Industry: ${INDUSTRY_LABELS[inputs.industry]}`,
    `Tier: ${tier.charAt(0).toUpperCase() + tier.slice(1)} (${moduleCount} modules)`,
    `Concerns: ${inputs.concerns.map(c => CONCERN_LABELS[c] ?? c).join(', ')}`,
  ]

  return (
    <>
      <div className="mt-8 bg-gradient-to-r from-[#E40000] to-[#B30000] rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">Ready to build this stack with Airtel?</h3>
        <p className="text-red-200 text-sm mb-6">
          Our security consultants will review your architecture, validate the fit, and provide a detailed implementation roadmap.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="px-8 py-3 bg-white text-[#E40000] font-bold rounded-lg hover:bg-red-50 transition-all duration-150 shadow-lg hover:shadow-xl"
        >
          Book a Consult →
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8" onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Thank you!</h3>
                <p className="text-gray-500 text-sm">We'll be in touch within 24 hours to schedule your architecture review.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A]">Book a Security Consult</h3>
                    <p className="text-xs text-gray-500 mt-1">Pre-filled with your architecture context</p>
                  </div>
                  <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                </div>

                {/* Pre-filled context */}
                <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-3 mb-5">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Your Architecture Context</div>
                  {prefilled.map(line => (
                    <div key={line} className="text-xs text-gray-600 py-0.5">{line}</div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E40000] transition-colors"
                        placeholder="Rajesh Kumar"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Company *</label>
                      <input
                        required
                        value={form.company}
                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                        className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E40000] transition-colors"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Work Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E40000] transition-colors"
                      placeholder="rajesh@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                    <input
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E40000] transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#E40000] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-all duration-150 mt-2"
                  >
                    Request Architecture Review
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
