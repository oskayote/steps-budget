// Storage adapter — the ONLY place that touches persistence.
//
// Today it reads/writes localStorage. To move to a backend later
// (e.g. Supabase), reimplement these async functions to call your API
// and the rest of the app keeps working unchanged. Every method is
// already async so swapping in network calls requires no UI changes.

const PREFIX = 'steps-budget:'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // storage full / unavailable — fail quietly
  }
}

export const storage = {
  async getCollection(name, fallback = []) {
    return read(name, fallback)
  },
  async setCollection(name, value) {
    write(name, value)
    return value
  },
  async getSetting(name, fallback = null) {
    return read('setting:' + name, fallback)
  },
  async setSetting(name, value) {
    write('setting:' + name, value)
    return value
  },
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
