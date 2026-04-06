export type AuthPayload = {
  email: string;
  password: string;
  name?: string;
};

export type SessionSummary = {
  id: string;
  sessionDate: string;
  hardestGrade: string;
  sessionRpe: number | null;
  attemptCount: number | null;
  notes: string | null;
};

export type WeeklyGuidance = {
  status: 'ready' | 'needs-more-data';
  title: string;
  summary: string;
  evidence: string[];
  nextStep: string;
};

export type AuthResult = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    isDemo: boolean;
  };
};

export function normalizeApiBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, '');
}

export function createSessionPayload(payload: {
  sessionDate: string;
  hardestGrade: string;
  sessionRpe?: string;
  notes?: string;
  sleepHours?: string;
  proteinGrams?: string;
  painScore?: string;
}) {
  return {
    sessionDate: payload.sessionDate,
    hardestGrade: payload.hardestGrade.trim(),
    gradeScale: 'BOULDER_V' as const,
    discipline: 'Bouldering',
    sessionRpe: payload.sessionRpe ? Number(payload.sessionRpe) : undefined,
    notes: payload.notes?.trim() || undefined,
    sleepHours: payload.sleepHours ? Number(payload.sleepHours) : undefined,
    proteinGrams: payload.proteinGrams ? Number(payload.proteinGrams) : undefined,
    painScore: payload.painScore ? Number(payload.painScore) : undefined,
  };
}

function withJsonHeaders(token?: string) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function requestJson<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? 'Request failed.');
  }

  return data as T;
}

export function register(baseUrl: string, payload: AuthPayload) {
  return requestJson<AuthResult>(`${normalizeApiBaseUrl(baseUrl)}/api/auth/register`, {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify(payload),
  });
}

export function login(baseUrl: string, payload: AuthPayload) {
  return requestJson<AuthResult>(`${normalizeApiBaseUrl(baseUrl)}/api/auth/login`, {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ email: payload.email, password: payload.password }),
  });
}

export function getSessions(baseUrl: string, token: string) {
  return requestJson<{ sessions: SessionSummary[] }>(`${normalizeApiBaseUrl(baseUrl)}/api/climbing-sessions`, {
    headers: withJsonHeaders(token),
  });
}

export function getWeeklySummary(baseUrl: string, token: string) {
  return requestJson<{ guidance: WeeklyGuidance }>(`${normalizeApiBaseUrl(baseUrl)}/api/weekly-guidance`, {
    headers: withJsonHeaders(token),
  });
}

export function getOverview(baseUrl: string, token: string) {
  return requestJson<{ user: AuthResult['user']; recentSessions: SessionSummary[]; weeklyGuidance: WeeklyGuidance }>(
    `${normalizeApiBaseUrl(baseUrl)}/api/mobile/overview`,
    { headers: withJsonHeaders(token) },
  );
}

export function createClimbingSession(
  baseUrl: string,
  token: string,
  payload: {
    sessionDate: string;
    hardestGrade: string;
    gradeScale?: 'BOULDER_V' | 'YDS' | 'FRENCH';
    discipline?: string;
    sessionRpe?: number;
    notes?: string;
    sleepHours?: number;
    proteinGrams?: number;
    painScore?: number;
  },
) {
  return requestJson<{ session: SessionSummary }>(`${normalizeApiBaseUrl(baseUrl)}/api/climbing-sessions`, {
    method: 'POST',
    headers: withJsonHeaders(token),
    body: JSON.stringify(payload),
  });
}
