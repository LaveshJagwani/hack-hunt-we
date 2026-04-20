const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1").replace(/\/$/, "");

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

export async function apiRequest(path, options = {}) {
  const { params, headers, ...rest } = options;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {})
    }
  });

  if (!response.ok) {
    const payload = await safeJson(response);
    const message = payload?.message ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return safeJson(response);
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
