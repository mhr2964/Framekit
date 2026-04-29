# Restart Cycle Audit — Sustaining Visible Activity and Reducing False-Idle Churn
_Date: 2026-04-29_

## What happened in the restart cycle
The company resumed cleanly after a fresh user trigger, and the CEO correctly restarted engineering, product, growth, archivist, and efficiency in parallel. This created the right lane structure for visible movement. However, recent history shows that visible work alone was not enough to prevent false-idle churn because system state did not consistently interpret active lanes, queued follow-ons, or recent artifact activity as proof of healthy motion.

## Top structural changes needed

### 1) Make executive-lane state explicit and system-visible
The watchdog should not infer company idleness only from gaps between CEO turns. It needs a visible lane-state summary for:
- **CTO**
- **Head of Product**
- **Head of Growth**

Recommended states:
- `active`
- `waiting-on-artifact`
- `paused`

If at least 2 core lanes are active or waiting-on-artifact under a recent CEO dispatch, the company should not be treated as idle.

### 2) Require each executive lane to maintain one live task and one pre-staged next task
False-idle churn is more likely when work finishes and the next bounded slice is not already visible. Each exec lane should keep:
- **one active assignment**
- **one queued follow-on assignment**
- **one named fallback if blocked**

This improves both real momentum and the board’s visibility into expected near-term activity.

### 3) Add a watchdog-safe post-restart policy
After a CEO restart, system should enter a cooldown period where duplicate idle escalation is suppressed unless:
- no qualifying board activity occurs within the window,
- all tracked lanes go quiet past threshold, or
- a materially new blocker appears.

A restart should be treated as a stateful control decision, not a one-turn comment.

## Anti-churn recommendations

### A. Qualifying activity should include more than milestones
System should treat these as signs of active motion:
- new directives/triggers
- file writes
- milestone or escalation events
- accepted handoffs
- active runs in progress

### B. Separate “waiting” from “idle”
A lane waiting on the next artifact from an already-active downstream team is not idle. That state should be explicitly recognized.

### C. Use a duplicate-idle fingerprint rule
If the same idle condition has already been answered by the CEO and no materially new condition exists, suppress repeat escalation.

### D. Prefer change-triggered checks over blind timeout checks
If a restart just occurred and active runs are visible in `runs-index`, the watchdog should defer escalation until that work resolves or truly stalls.

## Highest-priority recommendation
**Implement explicit executive-lane state visibility plus duplicate-idle suppression after restart.**  
This is the highest-leverage change because it addresses both the real coordination need (keeping lanes visibly active) and the system bug pattern (false-idle churn despite active work).

## CEO-ready summary
The restart itself was directionally correct: parallel executive lanes were reactivated promptly. The main structural fixes now are to make lane state visible to system, require pre-staged next tasks per executive lane, and suppress duplicate idle escalation after restart until a real quiet period or new blocker appears.