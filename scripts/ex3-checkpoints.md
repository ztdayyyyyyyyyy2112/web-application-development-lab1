# Exercise 3 verification (slide checkpoint at 155 minutes)

- Confirm 220px pulsing skeleton while request is LOADING.
- Quickly switch CES -> TE -> GE while loading; previous AbortController signal is aborted on effect cleanup.
- Wait for ERROR (35% simulated failure); error must be inline `role="alert"`, never window.alert.
- Click "Reconnect Satellite (Retry)"; state returns to LOADING and may SUCCESS or ERROR depending on simulation.
- Verify a successful response lists chosen squad, map, alive, kills, Blue Zone status, and WWCD probability.
