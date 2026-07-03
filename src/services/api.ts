export const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const buildUrl = (path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalizedPath}`;
};

export const getToken = () => localStorage.getItem('token');

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  Object.entries(authHeaders()).forEach(([key, value]) => headers.set(key, value));

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text().catch(() => '');

  if (!response.ok) {
    const message = typeof body === 'object' && body && 'error' in body
      ? String((body as { error?: string }).error)
      : 'No se pudo completar la solicitud';

    throw new ApiError(message, response.status, body);
  }

  return body as T;
}

export const getJson = <T>(path: string, options: RequestInit = {}) =>
  requestJson<T>(path, { ...options, method: options.method || 'GET' });

export const postJson = <T>(path: string, data: unknown, options: RequestInit = {}) =>
  requestJson<T>(path, {
    ...options,
    method: options.method || 'POST',
    body: JSON.stringify(data),
  });

export const patchJson = <T>(path: string, data: unknown, options: RequestInit = {}) =>
  requestJson<T>(path, {
    ...options,
    method: options.method || 'PATCH',
    body: JSON.stringify(data),
  });
