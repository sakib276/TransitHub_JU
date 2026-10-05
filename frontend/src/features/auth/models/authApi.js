const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/** Call an authentication endpoint and surface safe API error messages. */
export async function authRequest(path, body) {
  const token = sessionStorage.getItem('th_auth_token');
  const response = await fetch(`${API_BASE}/auth${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) throw new Error(payload.message || 'Authentication request failed.');
  return payload.data;
}

/** Persist an API-issued bearer token and its safe user profile. */
export function saveAuthSession(session) {
  sessionStorage.setItem('th_auth_token', session.token);
  sessionStorage.setItem('th_session_user', JSON.stringify(session.user));
}

/** Remove the current client-side session. */
export function clearAuthSession() {
  sessionStorage.removeItem('th_auth_token');
  sessionStorage.removeItem('th_session_user');
  localStorage.removeItem('th_session_user');
}
