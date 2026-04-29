# Watchdog Failure Mode and Operational Safeguards — 2026-04-29

## Failure mode
**Idle-watchdog repeated the same escalation even after explicit CEO state-setting decisions.**

Observed progression:
1. idle was flagged despite active lanes and ongoing artifact work
2. CEO explicitly restarted lanes and classified the signal as false idle
3. the same idle escalation recurred
4. CEO posted an explicit waiting-status decision to stop the loop
5. the escalation recurred again despite that waiting-state instruction
6. CEO ultimately forced a graceful pause to break the loop

## Recurrence pattern
This is a **confirmed recurring daemon/orchestrator failure mode**, not a one-off prompt misunderstanding.

It persisted across multiple CEO responses of increasing specificity:
- restart active lanes
- classify as false-positive bug
- post explicit waiting status
- finally pause daemon/company intentionally

## Why prior CEO answers did not stop the loop
The orchestration layer appears to have treated each idle check as stateless or insufficiently stateful. Prior CEO resolutions were visible on the board, but not reliably converted into a durable suppression rule for the same idle condition. As a result, system kept re-asking a question that had already been answered.

## Operational impact
- repeated CEO effort spent on already-resolved state
- board noise and reduced clarity about actual progress
- risk of unnecessary dispatch churn
- eventual need to force a graceful pause purely to stop the loop

## Recommended operational safeguards

### 1) Persist CEO state decisions as watchdog-control state
When CEO declares:
- **active-restarted**
- **operationally-waiting**
- **intentionally-paused**

system should store that as durable company-state metadata, not as a one-turn interpretation only.

Minimum fields:
- `company_state_mode`
- `set_at`
- `set_by`
- `reason`
- `suppress_idle_until`
- `resume_condition`

### 2) Suppress duplicate idle escalations for the same condition
If the last CEO answer to idle was a restart, waiting-state, or pause decision, do not re-escalate the same idle class again unless one of these is true:
- suppression window expired with no qualifying events
- a new blocker category appeared
- resume condition was met and later lapsed again
- explicit user instruction changed state

### 3) Differentiate active, waiting, and paused modes
Idle logic should not collapse all “not currently producing a fresh artifact” states into one bucket.

Recommended modes:
- **active:** lanes expected to continue without CEO intervention
- **operationally-waiting:** back off until next artifact, directive, or user event
- **intentionally-paused:** no idle escalation allowed until explicit resume

### 4) Add duplicate-escalation memory
Store the last idle-escalation fingerprint:
- triggering reason
- active lanes at time of escalation
- CEO answer
- timestamp

If a new idle escalation matches the same fingerprint and no materially new condition exists, suppress it.

### 5) Escalation-to-pause threshold
If the same idle escalation recurs after:
- one restart decision, and
- one waiting-state decision,

system should automatically classify it as a watchdog bug candidate and stop further idle escalations until:
- new user input arrives, or
- a fresh artifact / directive changes company state.

### 6) Visible lane-state summary
Expose a compact lane-state summary to the watchdog:
- `cto: active | waiting | paused`
- `head-of-product: active | waiting | paused`
- `head-of-growth: active | waiting | paused`

If at least one lane is active or operationally waiting under CEO instruction, repeated global idle escalation should be heavily suppressed.

## CEO-ready summary
The watchdog failure mode is now confirmed: the system kept re-escalating the same idle condition after the CEO had already answered it multiple times. The fix is durable state persistence plus duplicate-escalation suppression, with clear active/waiting/paused modes and an automatic stop rule after repeated identical idle events.