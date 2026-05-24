from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.platypus.flowables import Flowable
from reportlab.pdfgen import canvas
import sys

OUTPUT = "/Users/siporwal/Documents/Code/Architecture/Airtel-Secure-Architecture-Builder-Logic.pdf"

# ── Colors ─────────────────────────────────────────────────────────────────
AIRTEL_RED   = colors.HexColor("#E40000")
CHARCOAL     = colors.HexColor("#1A1A1A")
OFFWHITE     = colors.HexColor("#FAFAFA")
SOFT_GREY    = colors.HexColor("#E5E5E5")
RED_TINT     = colors.HexColor("#FFF0F0")
MID_GREY     = colors.HexColor("#6B6B6B")
SECTION_BG   = colors.HexColor("#F5F5F5")
CODE_BG      = colors.HexColor("#F0F0F0")
DARK_BLUE    = colors.HexColor("#1D3557")
LIGHT_BLUE   = colors.HexColor("#EBF4FF")
AMBER_LIGHT  = colors.HexColor("#FFFBEB")
AMBER_BORDER = colors.HexColor("#D97706")
GREEN        = colors.HexColor("#16A34A")
GREEN_LIGHT  = colors.HexColor("#F0FDF4")

W, H = A4

# ── Page template with header/footer ───────────────────────────────────────
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved_page_states)
        for i, state in enumerate(self._saved_page_states):
            self.__dict__.update(state)
            self._draw_page(i + 1, total)
            super().showPage()
        super().save()

    def _draw_page(self, page_num, total):
        if page_num == 1:
            return  # No header/footer on cover
        self.saveState()
        # Header line
        self.setStrokeColor(SOFT_GREY)
        self.setLineWidth(0.5)
        self.line(18*mm, H - 14*mm, W - 18*mm, H - 14*mm)
        # Header text
        self.setFont("Helvetica", 7)
        self.setFillColor(MID_GREY)
        self.drawString(18*mm, H - 11*mm, "AIRTEL SECURE — ARCHITECTURE BUILDER")
        self.drawRightString(W - 18*mm, H - 11*mm, "Logic & Design Documentation")
        # Footer
        self.line(18*mm, 13*mm, W - 18*mm, 13*mm)
        self.setFont("Helvetica", 7)
        self.drawString(18*mm, 9*mm, "Confidential — Airtel Business")
        self.drawRightString(W - 18*mm, 9*mm, f"Page {page_num} of {total}")
        self.restoreState()


# ── Styles ──────────────────────────────────────────────────────────────────
base = getSampleStyleSheet()

def style(name, **kw):
    return ParagraphStyle(name, **kw)

COVER_TITLE = style("CoverTitle",
    fontName="Helvetica-Bold", fontSize=28, textColor=colors.white,
    leading=34, spaceAfter=8, alignment=TA_LEFT)

COVER_SUB = style("CoverSub",
    fontName="Helvetica", fontSize=13, textColor=colors.HexColor("#FFCCCC"),
    leading=18, spaceAfter=4, alignment=TA_LEFT)

COVER_META = style("CoverMeta",
    fontName="Helvetica", fontSize=9, textColor=colors.HexColor("#FF9999"),
    leading=13, alignment=TA_LEFT)

H1 = style("H1",
    fontName="Helvetica-Bold", fontSize=17, textColor=AIRTEL_RED,
    leading=22, spaceBefore=14, spaceAfter=6)

H2 = style("H2",
    fontName="Helvetica-Bold", fontSize=13, textColor=CHARCOAL,
    leading=17, spaceBefore=10, spaceAfter=4)

H3 = style("H3",
    fontName="Helvetica-Bold", fontSize=10.5, textColor=DARK_BLUE,
    leading=14, spaceBefore=7, spaceAfter=3)

BODY = style("Body",
    fontName="Helvetica", fontSize=9.5, textColor=CHARCOAL,
    leading=15, spaceAfter=5, alignment=TA_JUSTIFY)

BODY_LEFT = style("BodyLeft",
    fontName="Helvetica", fontSize=9.5, textColor=CHARCOAL,
    leading=15, spaceAfter=5, alignment=TA_LEFT)

BULLET = style("Bullet",
    fontName="Helvetica", fontSize=9.5, textColor=CHARCOAL,
    leading=15, spaceAfter=3, leftIndent=14, firstLineIndent=-8)

CODE = style("Code",
    fontName="Courier", fontSize=8.5, textColor=CHARCOAL,
    leading=13, spaceAfter=2, leftIndent=6)

CAPTION = style("Caption",
    fontName="Helvetica-Oblique", fontSize=8, textColor=MID_GREY,
    leading=11, spaceAfter=8, alignment=TA_CENTER)

LABEL = style("Label",
    fontName="Helvetica-Bold", fontSize=8, textColor=colors.white,
    leading=11, alignment=TA_CENTER)

TABLE_HDR = style("TableHdr",
    fontName="Helvetica-Bold", fontSize=8.5, textColor=colors.white,
    leading=12, alignment=TA_CENTER)

TABLE_CELL = style("TableCell",
    fontName="Helvetica", fontSize=8.5, textColor=CHARCOAL,
    leading=12, alignment=TA_LEFT)

TABLE_CELL_C = style("TableCellC",
    fontName="Helvetica", fontSize=8.5, textColor=CHARCOAL,
    leading=12, alignment=TA_CENTER)

NOTE = style("Note",
    fontName="Helvetica-Oblique", fontSize=8.5, textColor=MID_GREY,
    leading=13, spaceAfter=4, leftIndent=10)

# ── Helpers ──────────────────────────────────────────────────────────────────
def hr(color=SOFT_GREY, thickness=0.5, space=4):
    return HRFlowable(width="100%", thickness=thickness, color=color,
                      spaceAfter=space, spaceBefore=space)

def sp(h=6):
    return Spacer(1, h)

def p(text, sty=BODY):
    return Paragraph(text, sty)

def h1(text):
    return Paragraph(text, H1)

def h2(text):
    return Paragraph(text, H2)

def h3(text):
    return Paragraph(text, H3)

def bullet(text):
    return Paragraph(f"&#8226;  {text}", BULLET)

def code_block(lines):
    items = []
    for ln in lines:
        items.append(Paragraph(ln.replace(" ", "&nbsp;"), CODE))
    data = [[item] for item in items]
    t = Table(data, colWidths=[W - 54*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
        ("BOX",        (0, 0), (-1, -1), 0.5, SOFT_GREY),
        ("LEFTPADDING",  (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING",   (0, 0), (0, 0),   8),
        ("BOTTOMPADDING",(0, -1),(-1, -1), 8),
    ]))
    return t

def callout_box(text, bg=LIGHT_BLUE, border=DARK_BLUE, label=None):
    sty = style("CB", fontName="Helvetica", fontSize=9, textColor=CHARCOAL,
                leading=14, alignment=TA_LEFT)
    content = []
    if label:
        content.append(Paragraph(f"<b>{label}</b>", style("CBlbl",
            fontName="Helvetica-Bold", fontSize=8, textColor=border,
            leading=12, spaceAfter=3)))
    content.append(Paragraph(text, sty))
    data = [[content]]
    t = Table(data, colWidths=[W - 54*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, -1), bg),
        ("BOX",          (0, 0), (-1, -1), 1, border),
        ("LEFTPADDING",  (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING",   (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 10),
    ]))
    return t


# ══════════════════════════════════════════════════════════════════════════════
#  DOCUMENT BUILD
# ══════════════════════════════════════════════════════════════════════════════
doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    leftMargin=18*mm, rightMargin=18*mm,
    topMargin=22*mm, bottomMargin=20*mm,
    title="Airtel Secure — Architecture Builder: Logic & Design Documentation",
    author="Airtel Business Security Practice",
)

story = []

# ─────────────────────────────────────────────────────────────────────────────
# COVER PAGE
# ─────────────────────────────────────────────────────────────────────────────
class CoverPage(Flowable):
    def draw(self):
        c = self.canv
        # Dark red background
        c.setFillColor(colors.HexColor("#1A0000"))
        c.rect(0, 0, W, H, fill=1, stroke=0)
        # Red accent bar left
        c.setFillColor(AIRTEL_RED)
        c.rect(0, 0, 6*mm, H, fill=1, stroke=0)
        # Airtel wordmark box
        c.setFillColor(AIRTEL_RED)
        c.roundRect(18*mm, H - 30*mm, 28*mm, 12*mm, 2*mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(21*mm, H - 22.5*mm, "airtel")
        # Title
        c.setFont("Helvetica-Bold", 30)
        c.setFillColor(colors.white)
        c.drawString(18*mm, H - 68*mm, "Architecture Builder")
        c.setFont("Helvetica-Bold", 22)
        c.setFillColor(AIRTEL_RED)
        c.drawString(18*mm, H - 83*mm, "Logic & Design Documentation")
        # Divider
        c.setStrokeColor(AIRTEL_RED)
        c.setLineWidth(1)
        c.line(18*mm, H - 90*mm, W - 18*mm, H - 90*mm)
        # Subtitle
        c.setFont("Helvetica", 11)
        c.setFillColor(colors.HexColor("#FFCCCC"))
        c.drawString(18*mm, H - 100*mm,
            "A complete reference for the scoring engine, tier logic,")
        c.drawString(18*mm, H - 113*mm,
            "advisory rules, narrative generator, and diagram renderer")
        # Bottom meta
        c.setFont("Helvetica", 9)
        c.setFillColor(colors.HexColor("#AA6666"))
        c.drawString(18*mm, 32*mm, "Airtel Business — Security Practice")
        c.drawString(18*mm, 22*mm, "Version 1.0  ·  May 2026")
        c.drawString(18*mm, 12*mm, "CONFIDENTIAL")

    def wrap(self, aw, ah):
        return (aw, ah)

story.append(CoverPage())
story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# TABLE OF CONTENTS (manual)
# ─────────────────────────────────────────────────────────────────────────────
story.append(sp(8))
story.append(p("<b>Table of Contents</b>", style("TOCTitle",
    fontName="Helvetica-Bold", fontSize=16, textColor=CHARCOAL, leading=20, spaceAfter=10)))
story.append(hr(AIRTEL_RED, 1.5, 8))

toc_entries = [
    ("1", "App Overview & Purpose", "3"),
    ("2", "Input Model — The Five Questions", "4"),
    ("3", "Capability Dataset", "6"),
    ("4", "Industry → Regulation Mapping", "8"),
    ("5", "Scoring Engine", "9"),
    ("6", "Tier Logic", "12"),
    ("7", "Advisory Overlay Logic", "14"),
    ("8", "Narrative Generator", "16"),
    ("9", "Diagram Rendering Logic", "18"),
    ("10", "Design System", "20"),
    ("11", "Technical Architecture", "21"),
]

toc_sty = style("TOC", fontName="Helvetica", fontSize=10, textColor=CHARCOAL,
                leading=20, spaceAfter=0)
toc_pg_sty = style("TOCPg", fontName="Helvetica", fontSize=10, textColor=MID_GREY,
                   leading=20, alignment=TA_LEFT)

for num, title, pg in toc_entries:
    row = [[
        Paragraph(f"<b>{num}</b>", style("TN", fontName="Helvetica-Bold", fontSize=10,
                                          textColor=AIRTEL_RED, leading=20)),
        Paragraph(title, toc_sty),
        Paragraph(pg, toc_pg_sty),
    ]]
    t = Table(row, colWidths=[10*mm, W - 60*mm, 12*mm])
    t.setStyle(TableStyle([
        ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",   (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 2),
        ("LINEBELOW",    (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ]))
    story.append(t)

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 1 — APP OVERVIEW
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("1.  App Overview & Purpose"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p(
    "The <b>Airtel Secure Architecture Builder</b> is an interactive, client-side web application "
    "designed for CISOs, security architects, and enterprise buyers. In under 60 seconds, a user "
    "answers five questions about their organisation — environment, size, industry, security concerns, "
    "and maturity level — and receives a fully personalised, defensible security stack recommendation "
    "grounded in Airtel's 29-module portfolio."
))
story.append(sp(4))

story.append(p("The application produces five outputs simultaneously:"))
story.append(sp(2))

outputs = [
    ("Visual Architecture Diagram",
     "A layered diagram showing exactly which Airtel Secure modules are needed, "
     "colour-coded by classification (Core, Required, or Recommended), with greyed-out "
     "future-state modules visible in the Advanced tier."),
    ("Narrative Summary",
     "An auto-generated, rule-based text explanation of why each module was "
     "recommended — no hardcoded text, every sentence is assembled from the rules that fired."),
    ("Compliance Overlay",
     "A toggleable overlay that maps each recommended module to the Indian regulations "
     "it satisfies: DPDP, RBI, SEBI, IRDAI, and CERT-In."),
    ("Tiered Growth Path",
     "Three tiers — Starter, Standard, and Advanced — letting buyers see a clear "
     "progression from minimum viable controls to a full enterprise posture."),
    ("CTA with Pre-filled Context",
     "A 'Book a Consult' button that opens a contact form pre-populated with the user's "
     "selections, giving the sales team instant context before the first call."),
]

for title, desc in outputs:
    row = [[
        Paragraph(f"<b>{title}</b>", style("OT", fontName="Helvetica-Bold", fontSize=9.5,
                                            textColor=DARK_BLUE, leading=14)),
        Paragraph(desc, style("OD", fontName="Helvetica", fontSize=9.5, textColor=CHARCOAL,
                               leading=14)),
    ]]
    t = Table(row, colWidths=[52*mm, W - 90*mm])
    t.setStyle(TableStyle([
        ("VALIGN",       (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",   (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 6),
        ("LINEBELOW",    (0, 0), (-1, -1), 0.3, SOFT_GREY),
        ("BACKGROUND",   (0, 0), (0, -1), SECTION_BG),
        ("LEFTPADDING",  (0, 0), (0, -1), 8),
        ("RIGHTPADDING", (0, 0), (0, -1), 8),
    ]))
    story.append(t)

story.append(sp(10))
story.append(callout_box(
    "All recommendation logic runs entirely in the browser — there is no backend, no API calls, "
    "and no user data is transmitted anywhere. Every rule, score, and narrative sentence is "
    "computed client-side from JSON configuration files that non-developers can edit.",
    bg=AMBER_LIGHT, border=AMBER_BORDER, label="IMPORTANT — Privacy & Architecture Note"
))

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 2 — INPUT MODEL
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("2.  Input Model — The Five Questions"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p(
    "The wizard collects five inputs. The first four are mandatory; the fifth (Security Maturity) "
    "is optional and is inferred automatically if skipped. The UI presents one question per screen "
    "as a stepped wizard, keeping the time-to-recommendation under 60 seconds."
))
story.append(sp(8))

# Q1
story.append(h2("Question 1 — Infrastructure Environment  (single-select)"))
story.append(p("Determines which capabilities are technically applicable to the user's deployment model. "
               "Each capability in the dataset declares which environments it supports."))
story.append(sp(4))

env_data = [
    [Paragraph("Option", TABLE_HDR), Paragraph("ID", TABLE_HDR), Paragraph("Description", TABLE_HDR)],
    [Paragraph("On-Premises", TABLE_CELL), Paragraph("on_prem", CODE), Paragraph("Mostly on-premises infrastructure", TABLE_CELL)],
    [Paragraph("Hybrid", TABLE_CELL), Paragraph("hybrid", CODE), Paragraph("Mix of on-prem and cloud", TABLE_CELL)],
    [Paragraph("Multi-Cloud", TABLE_CELL), Paragraph("multi_cloud", CODE), Paragraph("AWS + Azure + GCP", TABLE_CELL)],
    [Paragraph("SaaS-Heavy", TABLE_CELL), Paragraph("saas_heavy", CODE), Paragraph("Primarily SaaS-based workloads", TABLE_CELL)],
]
env_t = Table(env_data, colWidths=[35*mm, 32*mm, W - 105*mm])
env_t.setStyle(TableStyle([
    ("BACKGROUND",   (0, 0), (-1, 0), CHARCOAL),
    ("BACKGROUND",   (0, 1), (-1, -1), colors.white),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",          (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",    (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",   (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING",(0, 0), (-1, -1), 5),
    ("LEFTPADDING",  (0, 0), (-1, -1), 8),
]))
story.append(env_t)
story.append(sp(10))

# Q2
story.append(h2("Question 2 — Organisation Size  (single-select)"))
story.append(p("Size controls two things: (1) whether a capability's minimum-size requirement is met "
               "(capabilities with min_size=mid cannot be recommended to a small org), and (2) the "
               "maximum number of modules shown in the Standard tier (the size cap)."))
story.append(sp(4))

size_data = [
    [Paragraph("Option", TABLE_HDR), Paragraph("ID", TABLE_HDR), Paragraph("Ordinal", TABLE_HDR), Paragraph("Tier Cap", TABLE_HDR)],
    [Paragraph("Under 500 users", TABLE_CELL), Paragraph("small", CODE), Paragraph("1", TABLE_CELL_C), Paragraph("6 modules", TABLE_CELL_C)],
    [Paragraph("500–2,000 users", TABLE_CELL), Paragraph("mid", CODE), Paragraph("2", TABLE_CELL_C), Paragraph("10 modules", TABLE_CELL_C)],
    [Paragraph("2,000–10,000 users", TABLE_CELL), Paragraph("large", CODE), Paragraph("3", TABLE_CELL_C), Paragraph("15 modules", TABLE_CELL_C)],
    [Paragraph("10,000+ users", TABLE_CELL), Paragraph("xlarge", CODE), Paragraph("4", TABLE_CELL_C), Paragraph("No cap", TABLE_CELL_C)],
]
size_t = Table(size_data, colWidths=[40*mm, 28*mm, 20*mm, W - 126*mm])
size_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(size_t)
story.append(sp(10))

# Q3
story.append(h2("Question 3 — Industry  (single-select)"))
story.append(p("Industry drives two scoring signals: (1) whether the capability is tagged as critical "
               "for that industry (+2 pts), and (2) which regulations apply — each industry is mapped "
               "to a set of applicable Indian regulations, and capabilities that satisfy those regulations "
               "receive a +3 bonus and are force-included as 'Mandated'."))
story.append(sp(4))

ind_data = [
    [Paragraph("Industry", TABLE_HDR), Paragraph("ID", TABLE_HDR), Paragraph("Applicable Regulations", TABLE_HDR)],
    [Paragraph("Banking, Financial Services & Insurance", TABLE_CELL), Paragraph("bfsi", CODE), Paragraph("DPDP · RBI · SEBI · IRDAI · CERT-In", TABLE_CELL)],
    [Paragraph("Manufacturing & OT/Industrial", TABLE_CELL), Paragraph("manufacturing_ot", CODE), Paragraph("DPDP · CERT-In", TABLE_CELL)],
    [Paragraph("Healthcare & Pharma", TABLE_CELL), Paragraph("healthcare", CODE), Paragraph("DPDP · CERT-In", TABLE_CELL)],
    [Paragraph("IT / ITES / SaaS", TABLE_CELL), Paragraph("it_ites", CODE), Paragraph("DPDP · CERT-In", TABLE_CELL)],
    [Paragraph("Retail & eCommerce", TABLE_CELL), Paragraph("retail_ecomm", CODE), Paragraph("DPDP · CERT-In", TABLE_CELL)],
    [Paragraph("Government & PSU", TABLE_CELL), Paragraph("govt_psu", CODE), Paragraph("DPDP · CERT-In", TABLE_CELL)],
]
ind_t = Table(ind_data, colWidths=[55*mm, 37*mm, W - 130*mm])
ind_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(ind_t)
story.append(sp(10))

# Q4
story.append(h2("Question 4 — Security Concerns  (multi-select, max 4)"))
story.append(p("Each selected concern is worth +3 points for every capability that addresses it. "
               "Selecting more concerns that a capability addresses means a higher score and a stronger "
               "recommendation reason. Users can select up to 4 concerns."))
story.append(sp(4))

concerns = [
    ("ransomware",         "Ransomware"),
    ("data_exfiltration",  "Data Exfiltration"),
    ("ddos",               "DDoS Attacks"),
    ("compliance_pressure","Compliance Pressure"),
    ("insider_threat",     "Insider Threats"),
    ("cloud_misconfig",    "Cloud Misconfiguration"),
    ("phishing_email",     "Phishing / Email Attacks"),
    ("ot_iot_exposure",    "OT / IoT Exposure"),
    ("third_party_risk",   "Third-Party / Supply Chain Risk"),
]
c_data = [[Paragraph("ID", TABLE_HDR), Paragraph("Display Label", TABLE_HDR), Paragraph("Scoring Effect", TABLE_HDR)]]
for cid, clabel in concerns:
    c_data.append([
        Paragraph(cid, CODE),
        Paragraph(clabel, TABLE_CELL),
        Paragraph("+3 pts per capability that lists this concern", TABLE_CELL),
    ])
c_t = Table(c_data, colWidths=[42*mm, 48*mm, W - 128*mm])
c_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(c_t)
story.append(sp(10))

# Q5
story.append(h2("Question 5 — Security Maturity  (optional, single-select)"))
story.append(p(
    "Maturity does not affect the main scoring engine — it exclusively drives the "
    "<b>Advisory Overlay</b> (see Section 7). If the user skips this question, maturity is "
    "automatically inferred from the combination of size and industry."
))
story.append(sp(6))

story.append(h3("Maturity Inference Rules (when Q5 is skipped):"))
mat_rules = [
    ("xlarge + bfsi, govt_psu, or it_ites", "→ mature", "Large regulated enterprises assumed to have advanced programmes"),
    ("large + any industry",                "→ developing", "Scale implies structured controls exist"),
    ("mid + any industry",                  "→ developing", "Growing complexity, gaps likely"),
    ("small + any industry",                "→ nascent",   "Basic controls, significant gaps expected"),
]
mat_data = [[Paragraph("Condition", TABLE_HDR), Paragraph("Result", TABLE_HDR), Paragraph("Rationale", TABLE_HDR)]]
for cond, result, rat in mat_rules:
    mat_data.append([Paragraph(cond, CODE), Paragraph(result, TABLE_CELL_C), Paragraph(rat, TABLE_CELL)])
mat_t = Table(mat_data, colWidths=[55*mm, 25*mm, W - 118*mm])
mat_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(mat_t)

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 3 — CAPABILITY DATASET
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("3.  Capability Dataset"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p(
    "The dataset contains <b>29 security capabilities</b> drawn from Airtel's Secure portfolio. "
    "All data lives in <b>/src/data/capabilities.json</b> — a human-editable file that non-developers "
    "can update without touching any code. Adding a new module, adjusting which concerns it addresses, "
    "or changing its minimum-size requirement is a one-line JSON edit."
))
story.append(sp(6))

story.append(h2("3.1  Capability Properties"))
story.append(p("Each of the 29 capabilities is described by the following fields:"))
story.append(sp(4))

prop_data = [
    [Paragraph("Field", TABLE_HDR), Paragraph("Type", TABLE_HDR), Paragraph("Purpose", TABLE_HDR)],
    [Paragraph("id", CODE), Paragraph("string", TABLE_CELL), Paragraph("Unique snake_case identifier used throughout the engine", TABLE_CELL)],
    [Paragraph("name", CODE), Paragraph("string", TABLE_CELL), Paragraph("Human-readable display name shown in the diagram", TABLE_CELL)],
    [Paragraph("bucket", CODE), Paragraph("string", TABLE_CELL), Paragraph("One of 6 portfolio buckets — controls diagram layer placement", TABLE_CELL)],
    [Paragraph("layer", CODE), Paragraph("string", TABLE_CELL), Paragraph("perimeter / workforce / workload / operations / advisory", TABLE_CELL)],
    [Paragraph("concerns_addressed", CODE), Paragraph("string[]", TABLE_CELL), Paragraph("Which of the 9 security concerns this capability mitigates", TABLE_CELL)],
    [Paragraph("environments", CODE), Paragraph("string[]", TABLE_CELL), Paragraph("Which environments are supported (on_prem, hybrid, etc.)", TABLE_CELL)],
    [Paragraph("min_size", CODE), Paragraph("string", TABLE_CELL), Paragraph("Minimum org size for relevance; smaller orgs see it as future_state", TABLE_CELL)],
    [Paragraph("critical_for_industries", CODE), Paragraph("string[]", TABLE_CELL), Paragraph("Industries where this capability is especially important (+2 pts)", TABLE_CELL)],
    [Paragraph("regulations", CODE), Paragraph("string[]", TABLE_CELL), Paragraph("Indian regulations this capability helps satisfy (triggers mandated status)", TABLE_CELL)],
    [Paragraph("is_foundational", CODE), Paragraph("boolean", TABLE_CELL), Paragraph("If true and industry matches, force-include regardless of score", TABLE_CELL)],
    [Paragraph("description", CODE), Paragraph("string", TABLE_CELL), Paragraph("Plain-English one-liner shown in hover tooltips", TABLE_CELL)],
]
prop_t = Table(prop_data, colWidths=[42*mm, 20*mm, W - 100*mm])
prop_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(prop_t)
story.append(sp(10))

story.append(h2("3.2  Capabilities by Bucket"))
story.append(p("The 29 capabilities are grouped into 6 portfolio buckets. Buckets control "
               "which layer of the diagram a capability appears in."))
story.append(sp(4))

buckets = [
    ("Secure Access", "Perimeter controls", 5,
     "Firewall · Anti-DDoS · NDR · Secure Service Edge · NAC"),
    ("Secure Workforce", "User & endpoint controls", 7,
     "Endpoint Management & Protection · Identity & Access Management · "
     "Data Discovery & Classification · DLP · VDI · Email Security · Browser Security"),
    ("Secure Workload", "Application & cloud controls", 7,
     "Web App & API Protection (WAAP) · DAM · Cloud Security (CNAPP) · "
     "AppSec · DSPM · Workload IAM · Cloud AI Security"),
    ("Managed Services", "Always-on operational layer", 4,
     "AI SOC / MDR · Threat Intel · Deep & Dark Web Monitoring · Policy & Patch Management"),
    ("Professional Services", "Advisory engagements", 4,
     "VAPT · Complex Implementations · Gap & Risk Assessment · Red Team-Blue Team"),
    ("Incident Response", "Reactive services", 2,
     "Incident Response Planning · Forensics & RCA"),
]

bkt_data = [[Paragraph("Bucket", TABLE_HDR), Paragraph("Layer", TABLE_HDR),
             Paragraph("Count", TABLE_HDR), Paragraph("Capabilities", TABLE_HDR)]]
for bname, layer, cnt, caps in buckets:
    bkt_data.append([
        Paragraph(f"<b>{bname}</b>", TABLE_CELL),
        Paragraph(layer, TABLE_CELL),
        Paragraph(str(cnt), TABLE_CELL_C),
        Paragraph(caps, TABLE_CELL),
    ])
bkt_t = Table(bkt_data, colWidths=[40*mm, 28*mm, 14*mm, W - 120*mm])
bkt_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING",    (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(bkt_t)
story.append(sp(8))

story.append(callout_box(
    "Professional Services and Incident Response buckets are handled by the <b>Advisory Overlay</b> "
    "(Section 7), not the main scoring engine. They do not appear in the scored module layers of "
    "the diagram — instead they appear in a separate 'Advisory Wraparound' band at the top.",
    bg=LIGHT_BLUE, border=DARK_BLUE, label="NOTE — Advisory Buckets"
))

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 4 — REGULATION MAP
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("4.  Industry → Regulation Mapping"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p(
    "Each industry is pre-mapped to a set of Indian cybersecurity and data protection regulations. "
    "This mapping is stored in <b>/src/data/regulations.json</b>. The engine uses it to determine "
    "which regulations apply to a user's industry and to trigger the 'Mandated' status for "
    "capabilities that help satisfy those regulations."
))
story.append(sp(8))

reg_data = [
    [Paragraph("Industry", TABLE_HDR),
     Paragraph("DPDP", TABLE_HDR), Paragraph("RBI", TABLE_HDR),
     Paragraph("SEBI", TABLE_HDR), Paragraph("IRDAI", TABLE_HDR),
     Paragraph("CERT-In", TABLE_HDR)],
    [Paragraph("BFSI", TABLE_CELL), Paragraph("✓", TABLE_CELL_C), Paragraph("✓", TABLE_CELL_C),
     Paragraph("✓", TABLE_CELL_C), Paragraph("✓", TABLE_CELL_C), Paragraph("✓", TABLE_CELL_C)],
    [Paragraph("Manufacturing & OT", TABLE_CELL), Paragraph("✓", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C),
     Paragraph("—", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C), Paragraph("✓", TABLE_CELL_C)],
    [Paragraph("Healthcare & Pharma", TABLE_CELL), Paragraph("✓", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C),
     Paragraph("—", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C), Paragraph("✓", TABLE_CELL_C)],
    [Paragraph("IT / ITES / SaaS", TABLE_CELL), Paragraph("✓", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C),
     Paragraph("—", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C), Paragraph("✓", TABLE_CELL_C)],
    [Paragraph("Retail & eCommerce", TABLE_CELL), Paragraph("✓", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C),
     Paragraph("—", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C), Paragraph("✓", TABLE_CELL_C)],
    [Paragraph("Government & PSU", TABLE_CELL), Paragraph("✓", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C),
     Paragraph("—", TABLE_CELL_C), Paragraph("—", TABLE_CELL_C), Paragraph("✓", TABLE_CELL_C)],
]
reg_t = Table(reg_data, colWidths=[48*mm, 18*mm, 18*mm, 18*mm, 18*mm, 18*mm])
reg_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
    # Highlight check marks in green
    ("TEXTCOLOR",     (1, 1), (-1, -1), GREEN),
    ("FONTNAME",      (1, 1), (-1, -1), "Helvetica-Bold"),
]))
story.append(reg_t)
story.append(sp(8))

story.append(h2("4.1  Regulation Descriptions"))
regs_desc = [
    ("DPDP",    "Digital Personal Data Protection Act (2023) — India's primary data privacy law, applicable to all industries handling personal data."),
    ("RBI",     "Reserve Bank of India — Cybersecurity framework and IT guidelines mandatory for banking and NBFC entities."),
    ("SEBI",    "Securities and Exchange Board of India — Cybersecurity and cyber resilience framework for capital market participants."),
    ("IRDAI",   "Insurance Regulatory and Development Authority of India — Information and cybersecurity guidelines for insurers."),
    ("CERT-In", "Indian Computer Emergency Response Team — Mandatory incident reporting and security control requirements for all organisations."),
]
for reg, desc in regs_desc:
    row = [[Paragraph(f"<b>{reg}</b>", style("RT", fontName="Helvetica-Bold", fontSize=9.5,
                                              textColor=DARK_BLUE, leading=13)),
            Paragraph(desc, BODY_LEFT)]]
    t = Table(row, colWidths=[18*mm, W - 54*mm])
    t.setStyle(TableStyle([
        ("VALIGN",       (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",   (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 5),
        ("LINEBELOW",    (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ]))
    story.append(t)

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 5 — SCORING ENGINE
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("5.  Scoring Engine"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p(
    "The scoring engine is the heart of the application. It runs against all 29 capabilities "
    "simultaneously every time the user's inputs change. For each capability, it computes a "
    "relevance score and then classifies the capability into one of five statuses. "
    "The engine is implemented as a pure function in <b>src/lib/scoring.ts</b> with no side effects."
))
story.append(sp(8))

story.append(h2("5.1  The Scoring Formula"))
story.append(p("For each capability, the score is computed as follows:"))
story.append(sp(4))

story.append(code_block([
    "score = 0",
    "",
    "+ 3  ×  (number of user's selected concerns that appear in",
    "         capability.concerns_addressed)",
    "",
    "+ 2  if  capability.environments includes user.environment",
    "",
    "+ 2  if  user.industry is listed in capability.critical_for_industries",
    "",
    "+ 3  if  any regulation in regulations[user.industry] appears in",
    "         capability.regulations",
    "",
    "── Hard exclusion filters ────────────────────────────────",
    "- 999  if  SIZE_ORDINAL[user.size] < SIZE_ORDINAL[capability.min_size]",
    "- 999  if  user.environment not in capability.environments",
]))
story.append(sp(6))

story.append(p(
    "The -999 penalty effectively removes a capability from consideration. "
    "A positive score alone does not guarantee inclusion — the capability must also pass "
    "both hard filters (size and environment)."
))
story.append(sp(8))

story.append(h2("5.2  Score Component Breakdown"))
story.append(sp(4))

score_data = [
    [Paragraph("Component", TABLE_HDR), Paragraph("Max Points", TABLE_HDR),
     Paragraph("Explanation", TABLE_HDR)],
    [Paragraph("Concern matches\n(+3 each)", TABLE_CELL),
     Paragraph("Up to +12\n(4 concerns × 3)", TABLE_CELL_C),
     Paragraph("Each concern the user selected that the capability addresses adds 3 points. "
               "With max 4 concerns selected, the maximum contribution is +12.", TABLE_CELL)],
    [Paragraph("Environment match\n(+2)", TABLE_CELL),
     Paragraph("+2", TABLE_CELL_C),
     Paragraph("If the capability supports the user's deployment environment. "
               "Capabilities with broader environment support are rewarded.", TABLE_CELL)],
    [Paragraph("Industry criticality\n(+2)", TABLE_CELL),
     Paragraph("+2", TABLE_CELL_C),
     Paragraph("If the capability is tagged as critical for the user's industry. "
               "Reflects known best practices per vertical.", TABLE_CELL)],
    [Paragraph("Regulation match\n(+3)", TABLE_CELL),
     Paragraph("+3", TABLE_CELL_C),
     Paragraph("If any regulation applicable to the user's industry also appears in the "
               "capability's regulation list. Binary — awarded once regardless of how many "
               "regulations match.", TABLE_CELL)],
    [Paragraph("MAXIMUM POSSIBLE SCORE", style("MPS", fontName="Helvetica-Bold", fontSize=9.5,
                                                textColor=AIRTEL_RED, leading=13)),
     Paragraph("+19", style("MPS2", fontName="Helvetica-Bold", fontSize=9.5,
                             textColor=AIRTEL_RED, leading=13, alignment=TA_CENTER)),
     Paragraph("12 (concerns) + 2 (env) + 2 (industry) + 3 (regulations)", TABLE_CELL)],
]
score_t = Table(score_data, colWidths=[38*mm, 24*mm, W - 100*mm])
score_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -2), [colors.white, SECTION_BG]),
    ("BACKGROUND",    (0, -1),(-1, -1), RED_TINT),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING",    (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(score_t)
story.append(PageBreak())

story.append(h2("5.3  Capability Status Classification"))
story.append(p(
    "After computing the score, each capability is assigned exactly one status. "
    "The classification follows a strict priority order: foundational is checked first, "
    "then mandated, then recommended. A capability can only hold one status — the highest "
    "applicable one."
))
story.append(sp(8))

statuses = [
    ("1", "FOUNDATIONAL", AIRTEL_RED,
     "Force-include — Core Control",
     [
       "is_foundational = true  (set in capabilities.json)",
       "Passes environment filter  (env in capability.environments)",
       "Passes size filter  (user.size ordinal >= min_size ordinal)",
       "user.industry in capability.critical_for_industries",
     ],
     "Displayed with a red 'CORE' badge. Always included regardless of score. "
     "Represents non-negotiable baseline controls — e.g., Firewall, Email Security, AI SOC/MDR."),
    ("2", "MANDATED", colors.HexColor("#D97706"),
     "Force-include — Regulatory Requirement",
     [
       "Passes environment and size filters",
       "At least one regulation from regulations[user.industry]",
       "  appears in capability.regulations",
       "Not already classified as foundational",
     ],
     "Displayed with an orange 'REQ' badge. Included because applicable regulations "
     "require or strongly imply this control — e.g., CERT-In mandates patch management."),
    ("3", "RECOMMENDED", colors.HexColor("#0369A1"),
     "Score-based Inclusion",
     [
       "Passes environment and size filters",
       "score >= 5  (threshold for inclusion)",
       "Not foundational or mandated",
     ],
     "Displayed with a red border and soft red background. Score >= 5 means at least "
     "two positive signals fired — the capability is genuinely relevant, not noise."),
    ("4", "FUTURE STATE", MID_GREY,
     "Blocked by Size — Shown Greyed Out",
     [
       "Passes environment filter",
       "Fails size filter  (user.size ordinal < min_size ordinal)",
       "score >= 5  (would qualify if size were larger)",
     ],
     "Shown only in the Advanced tier view, with 30% opacity and a dashed border. "
     "A tooltip explains: 'Becomes relevant at [size threshold]'. This gives buyers "
     "a forward-looking roadmap."),
    ("5", "EXCLUDED", colors.HexColor("#9E9E9E"),
     "Not Shown",
     [
       "Fails environment filter  (env not in capability.environments), OR",
       "score < 5 and not foundational/mandated",
     ],
     "Not rendered in the diagram at all. The user does not see these."),
]

for num, name, color, subtitle, conditions, explanation in statuses:
    # Status header
    header_data = [[
        Paragraph(num, style("SN", fontName="Helvetica-Bold", fontSize=11,
                              textColor=colors.white, leading=14, alignment=TA_CENTER)),
        Paragraph(f"<b>{name}</b>  —  {subtitle}",
                  style("SH", fontName="Helvetica-Bold", fontSize=10,
                         textColor=colors.white, leading=14)),
    ]]
    ht = Table(header_data, colWidths=[10*mm, W - 54*mm])
    ht.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, -1), color),
        ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",   (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 7),
        ("LEFTPADDING",  (0, 0), (-1, -1), 8),
    ]))
    story.append(ht)

    # Conditions
    cond_items = []
    for c in conditions:
        cond_items.append(Paragraph(f"&#8226;  {c}", style("Cond",
            fontName="Courier", fontSize=8.5, textColor=CHARCOAL, leading=13, leftIndent=12,
            firstLineIndent=-8, spaceAfter=2)))
    cond_items.append(sp(2))
    cond_items.append(Paragraph(explanation, style("Exp",
        fontName="Helvetica", fontSize=9, textColor=MID_GREY, leading=13, spaceAfter=0)))

    body_data = [[cond_items]]
    bt = Table(body_data, colWidths=[W - 44*mm])
    bt.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, -1), SECTION_BG),
        ("BOX",          (0, 0), (-1, -1), 0.5, SOFT_GREY),
        ("TOPPADDING",   (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 8),
        ("LEFTPADDING",  (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(bt)
    story.append(sp(6))

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 6 — TIER LOGIC
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("6.  Tier Logic"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p(
    "Once every capability has been scored and classified, the engine groups them into three "
    "tiers. Each tier represents a different level of security investment. Users can toggle "
    "between tiers using the pill buttons above the diagram. The <b>Standard tier is the default</b>."
))
story.append(sp(8))

tiers_info = [
    ("Starter", CHARCOAL, colors.white,
     "The absolute minimum — regulatory and foundational controls only.",
     "Contains all Foundational and Mandated capabilities that pass the user's size and environment filters. "
     "No score-based selection. Represents the non-negotiable baseline: the controls no organisation in "
     "this industry and environment should be without.",
     "Applicable size cap enforced."),
    ("Standard", AIRTEL_RED, colors.white,
     "The recommended target — balanced between cost and coverage.",
     "Starts with everything in Starter, then adds the highest-scoring Recommended capabilities "
     "(sorted by score descending) until the size cap is reached. This is the tier that represents "
     "Airtel's primary recommendation — the 'build this first' stack.",
     "Size cap strictly enforced: small=6, mid=10, large=15, xlarge=no cap."),
    ("Advanced", DARK_BLUE, colors.white,
     "The full picture — everything plus a growth roadmap.",
     "Starts with everything in Standard, then adds all remaining Recommended capabilities "
     "that didn't fit in Standard. Additionally, Future-state modules are shown greyed out, "
     "giving buyers a visual roadmap of what becomes relevant as they grow.",
     "No additional size cap. Future-state modules shown at 30% opacity with dashed borders."),
]

for tier_name, bg, fg, tagline, detail, note in tiers_info:
    # Header
    hd = [[Paragraph(f"<b>{tier_name.upper()} TIER</b>", style("TH",
                fontName="Helvetica-Bold", fontSize=12, textColor=fg, leading=16)),
           Paragraph(tagline, style("TT", fontName="Helvetica-Oblique", fontSize=9.5,
                                    textColor=colors.HexColor("#CCCCCC"), leading=14,
                                    alignment=TA_LEFT))]]
    ht = Table(hd, colWidths=[36*mm, W - 80*mm])
    ht.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), bg),
        ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING",    (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
    ]))
    story.append(ht)
    detail_data = [[Paragraph(detail, BODY_LEFT)]]
    dt = Table(detail_data, colWidths=[W - 44*mm])
    dt.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), SECTION_BG),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 12),
    ]))
    story.append(dt)
    note_data = [[Paragraph(f"<i>{note}</i>", NOTE)]]
    nt = Table(note_data, colWidths=[W - 44*mm])
    nt.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), SECTION_BG),
        ("TOPPADDING",    (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING",   (0, 0), (-1, -1), 12),
        ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ]))
    story.append(nt)
    story.append(sp(8))

story.append(h2("6.1  Size Caps Explained"))
story.append(p(
    "The size cap limits how many modules appear in the Standard tier. The intent is to prevent "
    "overwhelming a small organisation with recommendations they cannot action. For example, a "
    "5-person startup should not see 18 module recommendations — 6 carefully chosen controls are "
    "far more useful."
))
story.append(sp(6))

cap_data = [
    [Paragraph("Size", TABLE_HDR), Paragraph("ID", TABLE_HDR),
     Paragraph("Max Modules (Standard)", TABLE_HDR), Paragraph("Rationale", TABLE_HDR)],
    [Paragraph("Under 500 users", TABLE_CELL), Paragraph("small", CODE),
     Paragraph("6", TABLE_CELL_C), Paragraph("Small teams: focus on the absolute essentials only", TABLE_CELL)],
    [Paragraph("500–2,000 users", TABLE_CELL), Paragraph("mid", CODE),
     Paragraph("10", TABLE_CELL_C), Paragraph("Growing teams: add layered controls progressively", TABLE_CELL)],
    [Paragraph("2,000–10,000 users", TABLE_CELL), Paragraph("large", CODE),
     Paragraph("15", TABLE_CELL_C), Paragraph("Enterprise teams: broader coverage expected", TABLE_CELL)],
    [Paragraph("10,000+ users", TABLE_CELL), Paragraph("xlarge", CODE),
     Paragraph("No cap", TABLE_CELL_C), Paragraph("Large enterprises: show all relevant modules", TABLE_CELL)],
]
cap_t = Table(cap_data, colWidths=[40*mm, 22*mm, 26*mm, W - 126*mm])
cap_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(cap_t)

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 7 — ADVISORY OVERLAY
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("7.  Advisory Overlay Logic"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p(
    "Professional Services and Incident Response capabilities are not scored by the main engine. "
    "They represent consultancy engagements and reactive services rather than persistent deployed "
    "controls. They have their own set of explicit conditional rules, implemented in <b>src/lib/advisory.ts</b>."
))
story.append(sp(4))
story.append(p(
    "Advisory items are rendered in a visually distinct 'Advisory Wraparound' band at the top of "
    "the architecture diagram — framed as: <i>Advisory Layer — How we get you there and keep you there.</i> "
    "Each item that meets its condition is shown. Items are deduplicated (each appears at most once)."
))
story.append(sp(8))

advisory_rules = [
    ("1", "Gap & Risk Assessment",
     "Always include if maturity = nascent OR maturity = developing",
     "nascent or developing",
     "Any",
     "Any",
     "Nascent and developing organisations have unknown gaps. A baseline assessment is the logical "
     "first step before deploying controls — you cannot protect what you haven't mapped."),
    ("2", "VAPT",
     "Industry is bfsi, it_ites, retail_ecomm, govt_psu, or healthcare  OR  user selected data_exfiltration or compliance_pressure",
     "Any",
     "bfsi, it_ites, retail_ecomm, govt_psu, healthcare",
     "Any",
     "Regulated industries and organisations concerned about data exfiltration or compliance need "
     "regular penetration testing. Widely mandated by RBI, SEBI, and CERT-In guidelines."),
    ("3", "Red Team-Blue Team",
     "maturity = mature  AND  size in {large, xlarge}  AND  industry in {bfsi, govt_psu, it_ites}",
     "mature",
     "bfsi, govt_psu, it_ites",
     "large or xlarge",
     "Adversary simulation is appropriate only for mature, large-scale programmes. Applying it to "
     "nascent organisations wastes budget — basic hygiene must come first. Most restrictive rule."),
    ("4", "Complex Implementations",
     "Standard tier module count >= 5",
     "Any",
     "Any",
     "Any (conditional on module count)",
     "Deploying 5+ security modules creates integration complexity. Expert-led deployment "
     "coordination prevents gaps and misconfigurations between modules."),
    ("5", "Incident Response Planning",
     "Industry is bfsi, healthcare, or govt_psu  OR  industry regulations include RBI, IRDAI, or CERT-In",
     "Any",
     "bfsi, healthcare, govt_psu (others via regulation check)",
     "Any",
     "RBI, IRDAI, and CERT-In all require documented incident response procedures. Any organisation "
     "in a regulated sector needs runbooks before an incident occurs, not during."),
    ("6", "Forensics & RCA",
     "size in {mid, large, xlarge}  AND  industry in {bfsi, healthcare, govt_psu}",
     "Any",
     "bfsi, healthcare, govt_psu",
     "mid, large, or xlarge",
     "Post-breach forensics and root cause analysis requires organisational capacity. Small orgs "
     "typically lack the team bandwidth; regulated industries face mandatory reporting requirements."),
]

for num, name, rule_summary, maturity_req, industry_req, size_req, rationale in advisory_rules:
    story.append(KeepTogether([
        h3(f"7.{num}  {name}"),
        code_block([f"RULE: {rule_summary}"]),
        sp(4),
        Table([[
            Paragraph("<b>Maturity</b>", style("RL", fontName="Helvetica-Bold", fontSize=8.5,
                                                textColor=MID_GREY, leading=12)),
            Paragraph(maturity_req, TABLE_CELL),
            Paragraph("<b>Industry</b>", style("RL", fontName="Helvetica-Bold", fontSize=8.5,
                                                textColor=MID_GREY, leading=12)),
            Paragraph(industry_req, TABLE_CELL),
            Paragraph("<b>Size</b>", style("RL", fontName="Helvetica-Bold", fontSize=8.5,
                                            textColor=MID_GREY, leading=12)),
            Paragraph(size_req, TABLE_CELL),
        ]], colWidths=[16*mm, 32*mm, 16*mm, 42*mm, 12*mm, W - 154*mm],
        style=[
            ("BOX",          (0, 0), (-1, -1), 0.5, SOFT_GREY),
            ("INNERGRID",    (0, 0), (-1, -1), 0.3, SOFT_GREY),
            ("BACKGROUND",   (0, 0), (0, -1), SECTION_BG),
            ("BACKGROUND",   (2, 0), (2, -1), SECTION_BG),
            ("BACKGROUND",   (4, 0), (4, -1), SECTION_BG),
            ("VALIGN",       (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING",   (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING",(0, 0), (-1, -1), 5),
            ("LEFTPADDING",  (0, 0), (-1, -1), 6),
        ]),
        sp(4),
        p(f"<i>{rationale}</i>", NOTE),
        sp(8),
    ]))

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 8 — NARRATIVE GENERATOR
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("8.  Narrative Generator"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p(
    "The narrative summary is auto-generated in <b>src/lib/narrative.ts</b>. No text is "
    "hardcoded — every sentence is assembled at runtime from the rules that fired during "
    "scoring. This ensures the recommendation explanation is always accurate, consistent, "
    "and traceable back to a specific rule."
))
story.append(sp(8))

story.append(h2("8.1  Narrative Structure"))
story.append(sp(4))

narrative_parts = [
    ("Intro Paragraph", "Always generated",
     'Based on your inputs — a [size] [industry] organization in a [environment] '
     'environment, concerned about [top 3 concerns] — we\'ve recommended [N] core '
     'modules and [M] advisory engagements in the [Tier] tier.',
     "All placeholders are filled from the user's actual selections. 'Top 3 concerns' "
     "takes the first three from the user's selected concerns list."),
    ("Why These Modules", "One bullet per active module",
     "[Module Name]: [reason sentence 1]; [reason sentence 2]; ...",
     "Each reason sentence corresponds to a rule that fired for that module. "
     "The reasons are assembled in this priority order: (1) concerns addressed, "
     "(2) regulations satisfied, (3) foundational status, (4) industry criticality."),
    ("Regulations Covered", "If any regulations matched",
     "Regulations covered: DPDP · RBI · CERT-In  (etc.)",
     "Aggregates all unique regulations matched across all active-tier modules. "
     "Displayed as coloured pills in the UI."),
    ("Growth Path", "Only if future-state modules exist",
     "As you scale past [size threshold], consider adding [module names].",
     "Names up to 3 future-state modules. If there are more than 3, appends 'and N more'. "
     "Only shown if there is at least one future-state module and a next size tier exists."),
]

for part, when, template, explanation in narrative_parts:
    story.append(KeepTogether([
        h3(part),
        p(f"<b>When shown:</b> {when}"),
        sp(3),
        code_block([template]),
        sp(4),
        p(explanation, BODY_LEFT),
        sp(8),
    ]))

story.append(h2("8.2  Module Reason Assembly Logic"))
story.append(p("For each module in the active tier, reasons are assembled in this order:"))
story.append(sp(4))

reason_logic = [
    ("Step 1", "Concern hits",
     "Filter user's selected concerns against capability.concerns_addressed. "
     "If any match, generate: 'Directly addresses [concern A] and [concern B]'."),
    ("Step 2", "Regulation matches",
     "If the capability's matchedRegulations list is non-empty, generate: "
     "'Required for [reg A] and [reg B] compliance'."),
    ("Step 3", "Foundational flag",
     "If status === 'foundational', append: 'foundational control for your industry'."),
    ("Step 4", "Mandated flag",
     "If status === 'mandated' and not already mentioned in step 2, append: "
     "'mandated by applicable regulations'."),
    ("Step 5", "Industry criticality",
     "If the capability is critical for the user's industry AND status is not foundational "
     "(already covered), append: 'high-priority for [industry name]'."),
    ("Final", "Sentence assembly",
     "All reasons are joined with '; ' and the first character is capitalised. "
     "A full stop is appended. If no reasons fired, the capability's description is used as fallback."),
]

for step, title, desc in reason_logic:
    row = [[
        Paragraph(f"<b>{step}</b>", style("RS", fontName="Helvetica-Bold", fontSize=8.5,
                                           textColor=AIRTEL_RED, leading=13, alignment=TA_CENTER)),
        Paragraph(f"<b>{title}:</b> {desc}", BODY_LEFT),
    ]]
    t = Table(row, colWidths=[16*mm, W - 52*mm])
    t.setStyle(TableStyle([
        ("VALIGN",       (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",   (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 6),
        ("LINEBELOW",    (0, 0), (-1, -1), 0.3, SOFT_GREY),
        ("BACKGROUND",   (0, 0), (0, -1), SECTION_BG),
        ("LEFTPADDING",  (0, 0), (0, -1), 6),
    ]))
    story.append(t)

story.append(sp(10))
story.append(callout_box(
    "Example output for Firewall (BFSI, on-prem, ransomware + data_exfiltration concerns):\n\n"
    "\"Firewall: Directly addresses Data Exfiltration and Ransomware; required for DPDP, RBI, "
    "and CERT-In compliance; foundational control for your industry.\"",
    bg=GREEN_LIGHT, border=GREEN, label="EXAMPLE OUTPUT"
))

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 9 — DIAGRAM RENDERING
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("9.  Diagram Rendering Logic"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p(
    "The architecture diagram is rendered using React components with Tailwind CSS — not SVG "
    "or canvas. This makes hover interactions, dynamic updates, and conditional styling "
    "straightforward. The diagram re-renders instantly when the user switches tiers or toggles "
    "the compliance overlay."
))
story.append(sp(8))

story.append(h2("9.1  Layout — Top to Bottom"))
story.append(sp(4))

layers_data = [
    [Paragraph("Position", TABLE_HDR), Paragraph("Layer", TABLE_HDR), Paragraph("Visual Treatment", TABLE_HDR)],
    [Paragraph("1 — Top", TABLE_CELL), Paragraph("Advisory Wraparound", TABLE_CELL),
     Paragraph("Amber dashed border. Only shown if at least one advisory item applies.", TABLE_CELL)],
    [Paragraph("2", TABLE_CELL), Paragraph("Secure Access  (Perimeter)", TABLE_CELL),
     Paragraph("White background, light grey border. Firewall, NDR, SSE, etc.", TABLE_CELL)],
    [Paragraph("3", TABLE_CELL), Paragraph("Secure Workforce  (User & Endpoint)", TABLE_CELL),
     Paragraph("White background, light grey border. EPP, IAM, DLP, Email, etc.", TABLE_CELL)],
    [Paragraph("4", TABLE_CELL), Paragraph("Secure Workload  (App & Cloud)", TABLE_CELL),
     Paragraph("White background, light grey border. WAAP, CNAPP, DSPM, etc.", TABLE_CELL)],
    [Paragraph("5", TABLE_CELL), Paragraph("Managed Services  (Always-On)", TABLE_CELL),
     Paragraph("Distinct blue-tinted background, labelled 'Always-On'. AI SOC/MDR, etc.", TABLE_CELL)],
    [Paragraph("6 — Bottom", TABLE_CELL), Paragraph("Environment Card", TABLE_CELL),
     Paragraph("Centred card with red border showing the user's environment, size, "
               "industry, and top 3 concerns as pills.", TABLE_CELL)],
]
layers_t = Table(layers_data, colWidths=[24*mm, 44*mm, W - 106*mm])
layers_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING",    (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(layers_t)
story.append(sp(10))

story.append(h2("9.2  Module Visual Encoding"))
story.append(p("Each module chip is styled based on its status:"))
story.append(sp(4))

visual_data = [
    [Paragraph("Status", TABLE_HDR), Paragraph("Badge", TABLE_HDR), Paragraph("Border", TABLE_HDR),
     Paragraph("Background", TABLE_HDR), Paragraph("Opacity", TABLE_HDR)],
    [Paragraph("foundational", TABLE_CELL), Paragraph("CORE (red)", TABLE_CELL_C),
     Paragraph("Solid red #E40000", TABLE_CELL), Paragraph("Soft red #FFF0F0", TABLE_CELL),
     Paragraph("100%", TABLE_CELL_C)],
    [Paragraph("mandated", TABLE_CELL), Paragraph("REQ (orange)", TABLE_CELL_C),
     Paragraph("Solid red #E40000", TABLE_CELL), Paragraph("Soft red #FFF8F8", TABLE_CELL),
     Paragraph("100%", TABLE_CELL_C)],
    [Paragraph("recommended", TABLE_CELL), Paragraph("None", TABLE_CELL_C),
     Paragraph("Solid red #E40000", TABLE_CELL), Paragraph("Soft red #FFF8F8", TABLE_CELL),
     Paragraph("100%", TABLE_CELL_C)],
    [Paragraph("future_state", TABLE_CELL), Paragraph("None", TABLE_CELL_C),
     Paragraph("Dashed grey #E5E5E5", TABLE_CELL), Paragraph("None (transparent)", TABLE_CELL),
     Paragraph("30%", TABLE_CELL_C)],
    [Paragraph("excluded", TABLE_CELL), Paragraph("—", TABLE_CELL_C),
     Paragraph("Not rendered", TABLE_CELL), Paragraph("Not rendered", TABLE_CELL),
     Paragraph("0%", TABLE_CELL_C)],
]
vis_t = Table(visual_data, colWidths=[26*mm, 22*mm, 36*mm, 34*mm, W - 156*mm])
vis_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(vis_t)
story.append(sp(10))

story.append(h2("9.3  Compliance Overlay"))
story.append(p(
    "A toggle button ('Show Regulatory Coverage') activates the compliance overlay. When active, "
    "each module chip displays a row of coloured dots — one per regulation it satisfies. "
    "A legend below the diagram maps colours to regulation names."
))
story.append(sp(4))

reg_colors_data = [
    [Paragraph("Regulation", TABLE_HDR), Paragraph("Dot Colour", TABLE_HDR), Paragraph("Hex Code", TABLE_HDR)],
    [Paragraph("DPDP",    TABLE_CELL), Paragraph("Purple",   TABLE_CELL_C), Paragraph("#7C3AED", CODE)],
    [Paragraph("RBI",     TABLE_CELL), Paragraph("Blue",     TABLE_CELL_C), Paragraph("#1D4ED8", CODE)],
    [Paragraph("SEBI",    TABLE_CELL), Paragraph("Sky Blue", TABLE_CELL_C), Paragraph("#0369A1", CODE)],
    [Paragraph("IRDAI",   TABLE_CELL), Paragraph("Green",    TABLE_CELL_C), Paragraph("#065F46", CODE)],
    [Paragraph("CERT-In", TABLE_CELL), Paragraph("Amber",    TABLE_CELL_C), Paragraph("#B45309", CODE)],
]
rc_t = Table(reg_colors_data, colWidths=[28*mm, 28*mm, W - 94*mm])
rc_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(rc_t)
story.append(sp(10))

story.append(h2("9.4  Hover Tooltips"))
story.append(p("Every module chip is hoverable. Tooltips appear above the hovered chip and contain:"))
story.append(sp(4))
for item in [
    "<b>Active module:</b> Module name, status badge, description, 'Why recommended' bullet list (from the scoring rules), and 'Regulations addressed' coloured pills.",
    "<b>Future-state module:</b> Module name, description, and the unlock reason (e.g., 'Becomes relevant at 500–2,000 users').",
    "<b>Advisory item:</b> Advisory name, description, and the specific rule that triggered inclusion (e.g., 'Recommended because your maturity level is nascent').",
]:
    story.append(bullet(item))

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 10 — DESIGN SYSTEM
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("10.  Design System"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(p("The visual design follows Airtel's brand system adapted for an enterprise B2B "
               "security context. The tone is confident and advisory — not consumer-facing."))
story.append(sp(8))

story.append(h2("10.1  Colour Palette"))
story.append(sp(4))

colour_data = [
    [Paragraph("Role", TABLE_HDR), Paragraph("Name", TABLE_HDR), Paragraph("Hex", TABLE_HDR), Paragraph("Usage", TABLE_HDR)],
    [Paragraph("Primary", TABLE_CELL), Paragraph("Airtel Red", TABLE_CELL), Paragraph("#E40000", CODE),
     Paragraph("Primary CTAs, module borders, CORE/REQ badges, brand header", TABLE_CELL)],
    [Paragraph("Text", TABLE_CELL), Paragraph("Charcoal", TABLE_CELL), Paragraph("#1A1A1A", CODE),
     Paragraph("All body text, module labels, headings", TABLE_CELL)],
    [Paragraph("Background", TABLE_CELL), Paragraph("Off-White", TABLE_CELL), Paragraph("#FAFAFA", CODE),
     Paragraph("Page background — softer than pure white", TABLE_CELL)],
    [Paragraph("Inactive", TABLE_CELL), Paragraph("Soft Grey", TABLE_CELL), Paragraph("#E5E5E5", CODE),
     Paragraph("Borders, future-state module dashed borders, dividers", TABLE_CELL)],
    [Paragraph("Module Fill", TABLE_CELL), Paragraph("Red Tint", TABLE_CELL), Paragraph("#FFF0F0", CODE),
     Paragraph("Background of active recommended/foundational modules", TABLE_CELL)],
    [Paragraph("Compliance", TABLE_CELL), Paragraph("Success Green", TABLE_CELL), Paragraph("#16A34A", CODE),
     Paragraph("Compliance overlay toggle active state", TABLE_CELL)],
    [Paragraph("Advisory", TABLE_CELL), Paragraph("Amber", TABLE_CELL), Paragraph("#D97706", CODE),
     Paragraph("Advisory wraparound border and text", TABLE_CELL)],
    [Paragraph("Operations", TABLE_CELL), Paragraph("Dark Blue", TABLE_CELL), Paragraph("#1D3557", CODE),
     Paragraph("Managed Services layer tint, section headings", TABLE_CELL)],
]
col_t = Table(colour_data, colWidths=[22*mm, 24*mm, 22*mm, W - 106*mm])
col_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(col_t)
story.append(sp(10))

story.append(h2("10.2  Typography"))
story.append(p(
    "The application uses <b>Inter</b> (Google Fonts) exclusively. Inter is a highly legible "
    "sans-serif designed for dense UI text — ideal for a data-heavy enterprise configurator."
))
story.append(sp(4))

typo_data = [
    [Paragraph("Element", TABLE_HDR), Paragraph("Weight", TABLE_HDR), Paragraph("Size", TABLE_HDR), Paragraph("Usage", TABLE_HDR)],
    [Paragraph("Page headings", TABLE_CELL), Paragraph("700 (Bold)", TABLE_CELL), Paragraph("24px+", TABLE_CELL), Paragraph("Section titles, result page headline", TABLE_CELL)],
    [Paragraph("Section headings", TABLE_CELL), Paragraph("600 (Semibold)", TABLE_CELL), Paragraph("14–18px", TABLE_CELL), Paragraph("Layer labels, card headings", TABLE_CELL)],
    [Paragraph("Module labels", TABLE_CELL), Paragraph("500 (Medium)", TABLE_CELL), Paragraph("12–13px", TABLE_CELL), Paragraph("Module chip text inside the diagram", TABLE_CELL)],
    [Paragraph("Body text", TABLE_CELL), Paragraph("400 (Regular)", TABLE_CELL), Paragraph("14px", TABLE_CELL), Paragraph("Narrative summary, tooltip descriptions", TABLE_CELL)],
    [Paragraph("Badges", TABLE_CELL), Paragraph("700 (Bold)", TABLE_CELL), Paragraph("9px", TABLE_CELL), Paragraph("CORE / REQ badges on module chips", TABLE_CELL)],
]
typo_t = Table(typo_data, colWidths=[34*mm, 28*mm, 20*mm, W - 120*mm])
typo_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(typo_t)

story.append(PageBreak())


# ─────────────────────────────────────────────────────────────────────────────
# SECTION 11 — TECHNICAL ARCHITECTURE
# ─────────────────────────────────────────────────────────────────────────────
story.append(h1("11.  Technical Architecture"))
story.append(hr(AIRTEL_RED, 1, 4))
story.append(sp(4))

story.append(h2("11.1  Technology Stack"))
story.append(sp(4))

tech_data = [
    [Paragraph("Layer", TABLE_HDR), Paragraph("Technology", TABLE_HDR), Paragraph("Version", TABLE_HDR), Paragraph("Role", TABLE_HDR)],
    [Paragraph("UI Framework", TABLE_CELL), Paragraph("React", TABLE_CELL), Paragraph("19.x", TABLE_CELL), Paragraph("Component tree, state management, reactive rendering", TABLE_CELL)],
    [Paragraph("Build Tool", TABLE_CELL), Paragraph("Vite", TABLE_CELL), Paragraph("8.x", TABLE_CELL), Paragraph("Dev server, HMR, production bundling", TABLE_CELL)],
    [Paragraph("Language", TABLE_CELL), Paragraph("TypeScript", TABLE_CELL), Paragraph("5.x", TABLE_CELL), Paragraph("Type safety for scoring logic, capability interfaces", TABLE_CELL)],
    [Paragraph("Styling", TABLE_CELL), Paragraph("Tailwind CSS", TABLE_CELL), Paragraph("4.x", TABLE_CELL), Paragraph("Utility-first CSS, responsive design, design system tokens", TABLE_CELL)],
    [Paragraph("State", TABLE_CELL), Paragraph("React Hooks", TABLE_CELL), Paragraph("Built-in", TABLE_CELL), Paragraph("useState / useRef only — no external state library", TABLE_CELL)],
    [Paragraph("Fonts", TABLE_CELL), Paragraph("Google Fonts (Inter)", TABLE_CELL), Paragraph("—", TABLE_CELL), Paragraph("Loaded via link tag in index.html", TABLE_CELL)],
    [Paragraph("Backend", TABLE_CELL), Paragraph("None", TABLE_CELL), Paragraph("—", TABLE_CELL), Paragraph("Fully client-side. No API calls, no auth, no persistence", TABLE_CELL)],
]
tech_t = Table(tech_data, colWidths=[30*mm, 32*mm, 18*mm, W - 118*mm])
tech_t.setStyle(TableStyle([
    ("BACKGROUND",    (0, 0), (-1, 0), CHARCOAL),
    ("ROWBACKGROUNDS",(0, 1),(-1, -1), [colors.white, SECTION_BG]),
    ("BOX",           (0, 0), (-1, -1), 0.5, SOFT_GREY),
    ("INNERGRID",     (0, 0), (-1, -1), 0.3, SOFT_GREY),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
]))
story.append(tech_t)
story.append(sp(10))

story.append(h2("11.2  File Structure"))
story.append(sp(4))

story.append(code_block([
    "src/",
    "  data/",
    "    capabilities.json   ← 29 capabilities with all properties",
    "    regulations.json    ← Industry → regulation mapping",
    "    industries.json     ← Industry IDs and display labels",
    "    concerns.json       ← Concern IDs and display labels",
    "  lib/",
    "    types.ts            ← TypeScript interfaces (UserInputs, Capability, etc.)",
    "    scoring.ts          ← scoreCapability(), buildTiers() — pure functions",
    "    advisory.ts         ← inferMaturity(), computeAdvisory() — advisory rules",
    "    narrative.ts        ← generateNarrative() — text assembly",
    "  components/",
    "    Wizard/             ← 5-step input wizard",
    "    Diagram/            ← Architecture diagram with tooltips",
    "    TierToggle/         ← Starter / Standard / Advanced pill toggle",
    "    ComplianceOverlay/  ← Regulatory coverage toggle button",
    "    NarrativeSummary/   ← Auto-generated recommendation text",
    "    CTA/                ← Book a Consult modal + form",
    "  App.tsx               ← Root — wires wizard → scoring → result page",
    "  main.tsx              ← React DOM entry point",
    "  index.css             ← Tailwind import + base styles",
]))
story.append(sp(10))

story.append(h2("11.3  Data Flow"))
story.append(p("The application follows a unidirectional data flow:"))
story.append(sp(4))

flow_steps = [
    ("User completes wizard", "Wizard component collects 5 inputs and calls onComplete(UserInputs)."),
    ("App.tsx receives inputs", "Triggers a synchronous computation of all scores. No async, no loading state."),
    ("scoreCapability() runs 29 times", "One call per capability. Pure function — same inputs always produce same output."),
    ("buildTiers() groups results", "Separates foundational/mandated/recommended/future_state into three tier arrays."),
    ("computeAdvisory() evaluates 6 rules", "Produces the advisory items array based on maturity, size, industry."),
    ("generateNarrative() assembles text", "Takes active tier modules + advisory items and produces the narrative object."),
    ("React renders result page", "All computed data flows down as props. Tier toggle updates activeModules; "
                                   "compliance toggle re-renders diagram chips. No re-computation needed."),
]

for i, (step, desc) in enumerate(flow_steps, 1):
    row = [[
        Paragraph(str(i), style("FN", fontName="Helvetica-Bold", fontSize=11,
                                 textColor=AIRTEL_RED, leading=14, alignment=TA_CENTER)),
        Paragraph(f"<b>{step}</b><br/>{desc}",
                  style("FD", fontName="Helvetica", fontSize=9, textColor=CHARCOAL, leading=13)),
    ]]
    t = Table(row, colWidths=[10*mm, W - 46*mm])
    t.setStyle(TableStyle([
        ("VALIGN",       (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING",   (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 7),
        ("LINEBELOW",    (0, 0), (-1, -1), 0.3, SOFT_GREY),
        ("BACKGROUND",   (0, 0), (0, -1), SECTION_BG),
        ("LEFTPADDING",  (0, 0), (0, -1), 5),
    ]))
    story.append(t)

story.append(sp(10))

story.append(callout_box(
    "Because the scoring engine is implemented as pure functions with no side effects, "
    "it can be unit-tested independently of the UI. Passing the same UserInputs object "
    "always produces the same TieredResult — the logic is fully deterministic and auditable.",
    bg=GREEN_LIGHT, border=GREEN, label="ENGINEERING PRINCIPLE — Pure Functions"
))

story.append(sp(12))
story.append(hr(SOFT_GREY, 0.5, 10))
story.append(p(
    "This document covers the complete logic of the Airtel Secure Architecture Builder v1.0. "
    "All rules are implemented in the source files referenced throughout. To modify any scoring "
    "weight, add a capability, or adjust an advisory rule — edit the relevant JSON file or "
    "TypeScript function and the entire system updates automatically.",
    NOTE
))


# ─────────────────────────────────────────────────────────────────────────────
# BUILD
# ─────────────────────────────────────────────────────────────────────────────
doc.build(story, canvasmaker=NumberedCanvas)
print(f"PDF created: {OUTPUT}")
