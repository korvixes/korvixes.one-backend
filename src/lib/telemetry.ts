export type TelemetryEvent = {
  name: string
  payload?: Record<string, unknown>
}

// Lightweight placeholder-free implementation.
// In production this should be replaced with real analytics/event streaming.
// For now it records events into sessionStorage so UI flows can still validate.
export function trackEvent(evt: TelemetryEvent) {
  try {
    const key = 'korvixes_telemetry'
    const raw = sessionStorage.getItem(key)
    const prev = raw ? (JSON.parse(raw) as TelemetryEvent[]) : []
    prev.unshift({ name: evt.name, payload: evt.payload })
    sessionStorage.setItem(key, JSON.stringify(prev.slice(0, 50)))
  } catch {
    // ignore
  }
}

