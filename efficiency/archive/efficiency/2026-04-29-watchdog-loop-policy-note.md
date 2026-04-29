# Watchdog Loop Policy Note — 2026-04-29

## Pattern
**Repeated idle-watchdog escalation after prior CEO restart / waiting-state decision**

## Recurrence
This is now a **repeated operational-friction pattern** in the current reporting window, following multiple CEO interventions that explicitly:
1. restarted active lanes after false idle,
2. classified the watchdog behavior as a system bug, and
3. later posted an explicit operational waiting status to stop the loop.

## Likely classification
**Daemon/orchestrator-related**

## Why this classification fits
The repeated escalation did not reflect a new strategic decision gap. The CEO had already issued explicit state-setting decisions (“restart active lanes” and later “operationally waiting”). The recurring problem was that system behavior did not reliably honor or persist those decisions long enough to suppress another idle escalation.

## Operational impact
- Repeated executive attention spent re-clearing the same non-problem
- Risk of churn between “active” and “waiting” interpretations
- Lower signal quality in escalation flow
- Extra board noise around company state rather than delivery progress

## Recommended cleaner policy

### Policy rule
After a CEO issues either:
- a **restart decision** (“continue active lanes / clear idle”), or
- an **explicit waiting-status decision** (“operationally waiting until next concrete event”),

the idle watchdog should enter a **suppression window** and avoid re-escalating the same idle condition until one of the following occurs:

1. **Fresh board-event threshold is crossed**  
   No qualifying board event appears within the configured window. Qualifying events include:
   - new department milestone
   - new file write
   - new directive/trigger
   - new escalation from an active lane
   - new user message

2. **All tracked active lanes go quiet past threshold**  
   If the system has lane-state visibility and every active or waiting lane remains inactive beyond the threshold, it may recheck for true idle.

3. **A materially different blocker appears**  
   Example: explicit external dependency, repeated failed writes, or unresolved ownership conflict not covered by the earlier CEO decision.

### Minimum implementation recommendation
Maintain a lightweight state flag such as:
- `company_state_mode: active-restarted` or `operationally-waiting`
- `set_by_ceo_at: <timestamp>`
- `suppress_idle_until: <timestamp or next qualifying event>`
- `watched_lanes: cto, head-of-product, head-of-growth`

### Practical default behavior
- If **active-restarted**, suppress duplicate idle escalation for a short cooldown window and treat lane activity as proof of motion.
- If **operationally-waiting**, suppress idle escalation entirely until a fresh board event or user instruction arrives.
- Only re-escalate if the state expires without qualifying events or a new blocker class appears.

## CEO-ready summary
The watchdog loop should be treated as recurring daemon/orchestrator friction: once the CEO has already declared either “restart active lanes” or “operationally waiting,” system should suppress repeat idle escalations until a fresh event threshold is crossed or a genuinely new blocker appears.