// Thin client for the Express backend. The base URL defaults to the Vite
// proxy path (/api) and can be overridden per environment via VITE_API_URL.
const BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || 'Request failed.');
    error.status = res.status;
    error.fields = data.errors ?? null;
    throw error;
  }

  return data;
}

export const api = {
  /** POST /api/contact — submit a project inquiry. */
  submitContact: (payload) => request('/contact', { method: 'POST', body: payload }),
};

export default api;
