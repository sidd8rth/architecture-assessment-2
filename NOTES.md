# Architecture Builder — Build Notes (v1)

## Decisions made where spec left room for interpretation

### 1. Wizard layout: Stepped (one question per screen)
Chose stepped wizard over single-page form. Reasoning: faster time-to-answer perception, mobile-friendlier, and the 60-second goal is easier when each screen is scannable in under 10 seconds.

### 2. Diagram: React components, not inline SVG
The spec says "inline SVG" but clarifies the goal is hover/click interactivity. Used styled div/flexbox components instead of raw SVG primitives — they are rendered inline, respond to hover, and avoid SVG text-layout complexity with no behavioral trade-off.

### 3. Future-state modules in Advanced tier
Spec says Advanced = Standard + remaining Recommended + relevant Future-state items. Future-state modules are shown greyed-out (30% opacity, dashed border) in the Advanced tier per spec visual rules.

### 4. Email Security foundational rule
`email_sec` has `is_foundational: true` but `critical_for_industries` covers all 6 industries. It correctly shows as CORE for all industries — intentional per spec data.

### 5. Advisory deduplication
IR Planning can qualify via multiple rules (industry + regulation). Added deduplication so each advisory item appears at most once.

### 6. Size cap interpretation
Spec says caps apply "across all tiers". Interpreted this as: the Starter tier is naturally bounded by foundational+mandated count; Standard and Advanced are capped. xlarge = no cap (Infinity).

### 7. Compliance overlay: dots on module chips
Rather than overlaying the diagram with a separate SVG layer, colored dots appear inside each module chip when the overlay toggle is active. Cleaner for the component-based layout.

### 8. Tooltip positioning
Tooltips render above the hovered module card. Used container-relative positioning. Fixed left/top clamp prevents tooltips from overflowing the left edge.

### 9. Stretch features
Not implemented in v1 (PNG export, PDF, URL share, animation). Base quality was prioritized per spec instructions.

### 10. Regulations JSON key: "CERT-In"
Used hyphen as in spec. JSON keys with hyphens are valid; accessed via bracket notation where needed.
