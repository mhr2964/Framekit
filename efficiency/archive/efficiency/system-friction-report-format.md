# System Bugs & Operational Friction — Recurring Report Section
Use this section in future efficiency reports whenever system-level friction, orchestration anomalies, or repeated workflow failures appear on the board, in boss-log, or in runs.

## Section format

### System Bugs & Operational Friction
For each recurring issue, report one grouped pattern entry using the format below.

#### Pattern <n>: <short incident label>
- **Pattern type:** <e.g. file-read failure / idle-watchdog false positive / parser miss / repeated escalation loop / trigger gap / workspace write anomaly>
- **Observed recurrence count:** <number of distinct occurrences seen in the reporting window>
- **Affected lanes / agents:** <departments, execs, worker/system components involved>
- **Likely classification:** <structural | prompting-related | daemon/orchestrator-related>
- **Severity:** <low | medium | high>
- **Symptoms / evidence:**  
  - <timestamp or board/boss-log evidence point 1>  
  - <timestamp or board/boss-log evidence point 2>
- **Why this classification fits:** <1-2 sentence explanation>
- **Operational impact:** <what it delayed, confused, or degraded>
- **Recommended handling:** <monitor | prompt fix | policy fix | orchestrator fix | user-visible summary>
- **CEO-ready summary:** <one sentence the CEO can relay cleanly to the user>

## Classification rules

### Structural
Use when the issue stems from company workflow design, lane ownership, missing pre-staging, serial handoff behavior, or escalation policy gaps rather than a single malformed prompt or tooling malfunction.

### Prompting-related
Use when the issue appears caused by unclear instructions, ambiguous acceptance criteria, contradictory directives, over-broad tasking, or prompt wording that predictably led to failure/rework.

### Daemon/orchestrator-related
Use when the issue appears tied to triggers not firing cleanly, parser/worker mismatches, read/write injection anomalies, run-state inconsistencies, watchdog false positives, or other system-execution behavior outside normal department judgment.

## Counting rules
- Count **recurrences by distinct incident instance**, not by every mention.
- Group similar symptoms into one pattern if they appear to share the same root cause.
- Start a new pattern only when the cause or failure mode is materially different.
- If cause is uncertain, choose the best-fit classification and note uncertainty in the explanation.

## Minimum inclusion threshold
Include a pattern in the report when at least one of the following is true:
- it recurred 2+ times,
- it affected more than one lane,
- it created user-visible confusion,
- it consumed executive/CEO attention that should have gone to delivery.

## Recommended report close
End the section with a short rollup:
- **Total recurring patterns this period:** <n>
- **Most likely structural issues:** <count>
- **Most likely prompting-related issues:** <count>
- **Most likely daemon/orchestrator-related issues:** <count>
- **Needs CEO user summary?:** <yes/no, with reason>