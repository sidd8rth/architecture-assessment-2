import type { UserInputs, Tier, ScoredCapability } from './types'
import type { AdvisoryItem } from './advisory'

// ── Constants ──────────────────────────────────────────────────────────────
const COLOR = {
  AIRTEL_RED: '#E40000',
  CHARCOAL:   '#1A1A1A',
  GREY_DARK:  '#4A5568',
  GREY_MID:   '#718096',
  GREY_LIGHT: '#CBD5E0',
  OFFWHITE:   '#FAFAFA',
  RED_TINT:   '#FFF0F0',
  RED_PILL:   '#FFE5E5',
  WHITE:      '#FFFFFF',
}

const ENV_LABELS: Record<string, string> = {
  on_prem: 'On-Premises',
  hybrid: 'Hybrid',
  multi_cloud: 'Cloud-First',
}

const SIZE_LABELS: Record<string, string> = {
  small: 'Under 500 users',
  mid: '500 – 2,000 users',
  large: '2,000 – 10,000 users',
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
  ddos: 'DDoS Attacks',
  compliance_pressure: 'Compliance Pressure',
  insider_threat: 'Insider Threats',
  cloud_misconfig: 'Cloud Misconfiguration',
  phishing_email: 'Phishing / Email Attacks',
  ot_iot_exposure: 'OT / IoT Exposure',
  third_party_risk: 'Third-Party / Supply Chain Risk',
}

const BUCKET_LABELS: Record<string, string> = {
  network_security: 'Network Security',
  secure_workforce: 'Secure Workforce',
  secure_workload: 'Secure Workload',
  managed_services: 'Managed Services (Always-On)',
}

const TIER_LABELS: Record<Tier, string> = {
  starter: 'Starter',
  standard: 'Standard',
  advanced: 'Advanced',
}

// ── Public API ─────────────────────────────────────────────────────────────
interface GenerateOptions {
  inputs: UserInputs
  tier: Tier
  modules: ScoredCapability[]
  advisoryItems: AdvisoryItem[]
  narrative: {
    intro: string
    moduleReasons: { name: string; reason: string }[]
    regulationsCovered: string[]
    growthPath: string | null
  }
  totalCounts: { modules: number; advisory: number; regs: number }
}

export async function generatePdf(opts: GenerateOptions): Promise<void> {
  // Lazy-load jsPDF so it isn't in the initial bundle
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()   // 595.28
  const H = doc.internal.pageSize.getHeight()  // 841.89
  const M = 48                                  // page margin
  const contentW = W - M * 2

  let y = M

  // ── Cursor helpers ─────────────────────────────────────────────────────
  const ensureSpace = (needed: number) => {
    if (y + needed > H - M) {
      addPageFooter()
      doc.addPage()
      y = M
    }
  }

  const addPageFooter = () => {
    doc.setDrawColor(COLOR.GREY_LIGHT)
    doc.setLineWidth(0.5)
    doc.line(M, H - M + 6, W - M, H - M + 6)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(COLOR.GREY_MID)
    doc.text('Airtel Secure  ·  Architecture Builder', M, H - M + 22)
    const pageStr = `Page ${doc.getCurrentPageInfo().pageNumber}`
    doc.text(pageStr, W - M, H - M + 22, { align: 'right' })
  }

  const setHeading = (size: number, color = COLOR.CHARCOAL) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(size)
    doc.setTextColor(color)
  }

  const setBody = (size = 10, color = COLOR.GREY_DARK) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(size)
    doc.setTextColor(color)
  }

  const wrap = (text: string, width: number): string[] => {
    return doc.splitTextToSize(text, width)
  }

  const drawPill = (label: string, x: number, atY: number, accent = false) => {
    const padX = 6
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    const w = doc.getTextWidth(label) + padX * 2
    const h = 14
    doc.setFillColor(accent ? COLOR.RED_PILL : '#F0F0F0')
    doc.roundedRect(x, atY - 10, w, h, 3, 3, 'F')
    doc.setTextColor(accent ? COLOR.AIRTEL_RED : COLOR.GREY_DARK)
    doc.text(label, x + padX, atY)
    return w
  }

  // ── Cover Section ──────────────────────────────────────────────────────
  // Red accent bar at the top
  doc.setFillColor(COLOR.AIRTEL_RED)
  doc.rect(0, 0, W, 4, 'F')

  y = M + 8

  // Brand line
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(COLOR.GREY_MID)
  doc.text('AIRTEL SECURE  ·  Architecture Builder', M, y)
  y += 32

  // Big title
  setHeading(28)
  doc.text('Your Recommended', M, y); y += 30
  doc.setTextColor(COLOR.AIRTEL_RED)
  doc.text('Security Architecture', M, y); y += 36

  // Summary line
  setBody(11, COLOR.GREY_DARK)
  const summaryLine = `${opts.totalCounts.modules} modules  ·  ${opts.totalCounts.advisory} advisory engagements  ·  ${opts.totalCounts.regs} regulations covered`
  doc.text(summaryLine, M, y); y += 26

  // Context pills
  const pills: { label: string; accent?: boolean }[] = [
    { label: INDUSTRY_LABELS[opts.inputs.industry] ?? opts.inputs.industry, accent: true },
    { label: SIZE_LABELS[opts.inputs.size] ?? opts.inputs.size },
    { label: ENV_LABELS[opts.inputs.environment] ?? opts.inputs.environment },
    { label: `${TIER_LABELS[opts.tier]} tier` },
  ]
  let pillX = M
  for (const p of pills) {
    const w = drawPill(p.label, pillX, y, p.accent)
    pillX += w + 6
    if (pillX > W - M - 100) { pillX = M; y += 22 }
  }
  y += 28

  // Top concerns
  setBody(9, COLOR.GREY_MID)
  doc.text('TOP CONCERNS', M, y); y += 14
  const concernText = opts.inputs.concerns.map(c => CONCERN_LABELS[c] ?? c).join('   ·   ')
  setBody(11, COLOR.CHARCOAL)
  const concernLines = wrap(concernText, contentW)
  for (const line of concernLines) { doc.text(line, M, y); y += 16 }
  y += 18

  // Divider
  doc.setDrawColor(COLOR.GREY_LIGHT)
  doc.setLineWidth(0.5)
  doc.line(M, y, W - M, y); y += 24

  // ── Narrative Intro ────────────────────────────────────────────────────
  setHeading(14)
  doc.text('Why this architecture', M, y); y += 20
  setBody(10, COLOR.GREY_DARK)
  const introLines = wrap(opts.narrative.intro, contentW)
  for (const line of introLines) {
    ensureSpace(14)
    doc.text(line, M, y); y += 14
  }
  y += 20

  // ── Recommended modules grouped by bucket ──────────────────────────────
  ensureSpace(28)
  setHeading(14)
  doc.text('Recommended Modules', M, y); y += 22

  const buckets = ['network_security', 'secure_workforce', 'secure_workload', 'managed_services']
  for (const bucket of buckets) {
    const bucketMods = opts.modules.filter(m => m.bucket === bucket)
    if (bucketMods.length === 0) continue

    ensureSpace(40)
    // Bucket header
    doc.setFillColor(COLOR.RED_TINT)
    doc.rect(M, y - 12, contentW, 18, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(COLOR.AIRTEL_RED)
    doc.text((BUCKET_LABELS[bucket] ?? bucket).toUpperCase(), M + 8, y)
    y += 18

    for (const m of bucketMods) {
      const badge = m.status === 'foundational' ? 'CORE' : m.status === 'mandated' ? 'REQ' : ''
      ensureSpace(36)

      // Module name + badge
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(COLOR.CHARCOAL)
      doc.text(m.name, M, y)

      if (badge) {
        const bx = M + doc.getTextWidth(m.name) + 8
        doc.setFillColor(COLOR.AIRTEL_RED)
        doc.roundedRect(bx, y - 9, 30, 12, 2, 2, 'F')
        doc.setTextColor(COLOR.WHITE)
        doc.setFontSize(7)
        doc.text(badge, bx + 4, y - 1)
      }
      y += 14

      // Reasons / description
      const reasonText = opts.narrative.moduleReasons.find(r => r.name === m.name)?.reason ?? m.description
      setBody(9, COLOR.GREY_DARK)
      const reasonLines = wrap(reasonText, contentW - 12)
      for (const line of reasonLines) {
        ensureSpace(12)
        doc.text(line, M + 6, y); y += 12
      }
      y += 8
    }
    y += 8
  }

  // ── Advisory section ───────────────────────────────────────────────────
  if (opts.advisoryItems.length > 0) {
    ensureSpace(60)
    setHeading(14)
    doc.text('Advisory Engagements', M, y); y += 8
    setBody(9, COLOR.GREY_MID)
    doc.text('How we get you there and keep you there', M, y); y += 18

    for (const item of opts.advisoryItems) {
      ensureSpace(40)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(COLOR.CHARCOAL)
      doc.text(item.name, M, y); y += 14

      setBody(9, COLOR.GREY_DARK)
      const lines = wrap(item.reason, contentW - 12)
      for (const line of lines) {
        ensureSpace(12)
        doc.text(line, M + 6, y); y += 12
      }
      y += 10
    }
  }

  // ── Regulations covered ────────────────────────────────────────────────
  if (opts.narrative.regulationsCovered.length > 0) {
    ensureSpace(50)
    setHeading(14)
    doc.text('Regulations Covered', M, y); y += 18

    let rx = M
    for (const reg of opts.narrative.regulationsCovered) {
      const w = drawPill(`✓ ${reg}`, rx, y, true)
      rx += w + 6
      if (rx > W - M - 80) { rx = M; y += 22 }
    }
    y += 24
  }

  // ── Growth path ────────────────────────────────────────────────────────
  if (opts.narrative.growthPath) {
    ensureSpace(50)
    setHeading(14)
    doc.text('Growth Path', M, y); y += 18
    setBody(10, COLOR.GREY_DARK)
    const gpLines = wrap(opts.narrative.growthPath, contentW)
    for (const line of gpLines) {
      ensureSpace(14)
      doc.text(line, M, y); y += 14
    }
    y += 16
  }

  // ── Talk to an Expert footer block ─────────────────────────────────────
  ensureSpace(80)
  doc.setFillColor('#2D3748')
  doc.roundedRect(M, y, contentW, 60, 8, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(COLOR.WHITE)
  doc.text('Ready to build this stack with Airtel?', M + 16, y + 22)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor('#CBD5E0')
  doc.text('Talk to an Airtel security expert  ·  airtel.in/b2b/contact-us', M + 16, y + 42)
  y += 80

  addPageFooter()

  // ── Download ───────────────────────────────────────────────────────────
  const industrySlug = (opts.inputs.industry ?? 'org').replace(/_/g, '-')
  const sizeSlug = (opts.inputs.size ?? '').replace(/_/g, '-')
  const filename = `airtel-secure-architecture-${industrySlug}-${sizeSlug}.pdf`
  doc.save(filename)
}
