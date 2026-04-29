# Framekit Launch-Surface Coordination Layer
_Date: 2026-04-29_

Purpose: keep landing-page, waitlist, and screenshot/social work moving in parallel with product and engineering so growth does not stall while upstream artifacts evolve.

---

## 1) Dependency tracker

Use this tracker to separate **work that can proceed now** from **work waiting on final source material**.

| Launch-surface item | Current status | Can progress now? | Upstream dependency | Current placeholder assumption | Final source owner | Replace when available | Notes |
|---|---|---|---|---|---|---|---|
| Landing headline/subhead | In progress | Yes | Product positioning stability | “Calm website feedback rooms” clarity-first lane | Head of Growth / Brand | When landing promise is locked against accepted prototype | Keep wording broad enough to survive UI tweaks |
| Waitlist CTA copy | In progress | Yes | None required for draft | Early access to polished review flow | Growth | When launch offer / signup logic is finalized | Safe to refine before product lock |
| Benefit bullets | Partial | Yes | Product/brand coherence review | Faster client feedback, less chaos, cleaner review flow | Brand / Head of Product | When approved prototype wording is confirmed | Avoid unsupported feature claims |
| Hero screenshot | Blocked for final | Yes, with placeholder | Accepted prototype / frontend state | Use prototype-derived frame or labeled placeholder | Prototype / Frontend | When stable visual state is accepted | Do not imply flows not yet present |
| Social screenshot callouts | Partial | Yes | Real UI labels and visible moments | Annotate likely moments: room setup, comment thread, timestamped feedback | Prototype / Frontend | When final UI copy/screens are available | Keep captions modular |
| Product proof section | Partial | Yes | Frontend + prototype convergence | Describe current create-room and review flow only | CTO / Head of Product | When exact product behavior is confirmed | Recheck against shipped three-field baseline |
| FAQ / objection handling | In progress | Yes | Product scope confirmation | Focus on workflow, client-friendliness, and feedback clarity | Growth / Head of Product | When scope changes materially | Avoid promises about collaboration depth |
| Launch teaser/social post | In progress | Yes | Screenshot selection + final hook | Use pain/benefit framing without over-describing UI | Growth | When hero screenshot and headline are locked | Can ship text-first earlier |

### Working rule
- **Green:** copy can advance now with bounded placeholders
- **Yellow:** draft now, but requires future source replacement
- **Red:** do not finalize until upstream artifact lands

---

## 2) Placeholder-to-final handoff template

Use this whenever product, prototype, frontend, or brand replaces an assumption with final source material.

### Handoff: Launch-Surface Source Update
- **Asset/item being updated:**  
- **Previous placeholder/assumption:**  
- **New source of truth:** <file path, board decision, or accepted artifact>
- **Owner providing update:**  
- **What changed:**  
- **What must be updated downstream:**  
  - landing copy
  - CTA copy
  - screenshot annotation
  - social caption
  - FAQ / proof section
- **Safe to publish now?** <yes / no / after one review pass>
- **Known constraints / claims to avoid:**  
- **Required reviewer(s):** <growth / product / brand / efficiency if selection support needed>

---

## 3) Review cadence proposal

### Default cadence
Use a lightweight **change-triggered review cadence**, not a calendar-heavy process.

#### Trigger a launch-surface review when any of the following happens:
1. **prototype accepted or materially updated**
2. **frontend ships a visible UI/state change**
3. **product locks or narrows scope**
4. **brand identifies message-product mismatch**
5. **growth selects a finalist headline/CTA/asset direction**

### Review levels
- **Fast pass (5–10 min):** verify whether current landing/CTA/asset drafts are still accurate
- **Focused update pass (10–20 min):** replace placeholders and revise only affected lines/assets
- **Selection pass:** use the review rubric/matrix to choose between updated options if positioning changed

### Ownership
- **Growth:** owns live launch-surface draft set
- **Head of Product:** confirms behavioral accuracy when product flow changes
- **Brand:** flags tone/positioning drift
- **Efficiency:** supports comparison, readiness checks, and dependency visibility

---

## 4) Likely drift risks

1. **Landing promise gets ahead of actual product behavior**  
   Risk: headline implies broader collaboration or review depth than current create-room/review flow supports.

2. **CTA promise and onboarding reality diverge**  
   Risk: waitlist copy offers a polished experience that current prototype/frontend flow does not yet demonstrate clearly.

3. **Screenshot captions describe placeholder states as final product**  
   Risk: social or landing assets lock onto UI text, labels, or steps that later change.

4. **Brand language reintroduces “toolkit/platform” ambiguity**  
   Risk: messaging drifts away from “website feedback rooms” into generic product language.

5. **Three-field create-room baseline gets overstated**  
   Risk: launch copy suggests richer setup, automation, or workflow complexity than the approved room-name / URL / optional note baseline.

6. **Proof elements lag behind upstream revisions**  
   Risk: screenshots, bullets, and FAQ remain tied to an older prototype after product/engineering changes.

---

## 5) Recommended operating rule
Keep every launch-surface asset in one of three states:
- **Drafting on placeholders**
- **Awaiting source replacement**
- **Ready with current source of truth**

This prevents stalls: growth can keep drafting while clearly marking what must be swapped once product or engineering lands the next accepted artifact.