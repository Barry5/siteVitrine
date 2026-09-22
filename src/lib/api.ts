/**
 * Client HTTP minimal vers le backend Express (server/).
 * En développement, VITE_API_URL peut pointer vers http://localhost:4000/api ;
 * en production, l'API est généralement servie sous le même domaine, via /api.
 */
const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function parseJsonSafe(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export interface ContactFormPayload {
  fullName: string;
  phone: string;
  email?: string;
  agency: string;
  destination: string;
  message: string;
}

export async function submitContactRequest(payload: ContactFormPayload): Promise<void> {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await parseJsonSafe(res);
    throw new Error(data?.error || 'La demande a échoué.');
  }
}

export async function adminLogin(password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const data = await parseJsonSafe(res);
    throw new Error(data?.error || 'Authentification refusée.');
  }
}

export async function adminLogout(): Promise<void> {
  await fetch(`${API_BASE}/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/session`, {
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
}
