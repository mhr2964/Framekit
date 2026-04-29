# Idle-Watchdog Bug Note — 2026-04-29

## Pattern
**Idle-watchdog false positive during active execution**

## Recurrence count
**2 confirmed recurrences** in the current reporting window, with repeated CEO intervention explicitly stating the company was under-dispatched or falsely marked idle rather than truly paused.

## Likely classification
**Daemon/orchestrator-related**

## Why this classification fits
The board and boss-log show active executive lanes, fresh department triggers, and ongoing artifact production while the system still surfaced idle-state behavior requiring CEO restart directives. This suggests a state-detection or lane-visibility problem in orchestration rather than a real company stop.

## Operational impact
- Unnecessary CEO attention spent clearing false idle state
- Risk of interrupting momentum by treating active work as paused
- Confusing system signal: active lanes existed, but that state was not reliably visible to the watchdog

## Recommended fix
**Reduce false idle detection by making executive-lane activity explicit to the watchdog.**

Minimum recommended rule:
- treat the company as **active** if at least **2 executive lanes** (CTO, Head of Product, Head of Growth) have any of the following within the recent window:
  - a live run in progress
  - a department trigger issued but not yet resolved
  - a department completion/escalation followed by a queued follow-on dispatch
  - artifact writes or milestone/status activity from delegated departments

Additional recommendation:
- add a lightweight **active-lane state summary** visible to system, such as:
  - `cto: active`
  - `head-of-product: active`
  - `head-of-growth: active`
  - `idle-safe-until: <timestamp>`
  
If this state is present, idle-watchdog should suppress idle escalation unless all active lanes have gone quiet past the threshold.

## CEO-ready summary
The idle-watchdog has now recurred as a false-positive operational bug: the company still had active executive lanes and artifact production, but system state did not reflect that clearly enough. Recommended fix is to base idle detection on explicit executive-lane activity or a visible active-lane summary rather than silence between CEO turns alone.