const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

let refreshHandler = null;

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const resolveUrl = (path) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const appendQueryParams = (path, query) => {
  const url = new URL(resolveUrl(path), window.location.origin);

  Object.entries(query || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    url.searchParams.set(key, String(value));
  });

  return url.toString();
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  const text = await response.text();
  return text || null;
};

const extractErrorMessage = (status, data) => {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  return `Request failed with status ${status}`;
};

const shouldRetryWithRefresh = ({ status, skipAuth, hasRetried }) => {
  return status === 401 && !skipAuth && !hasRetried && typeof refreshHandler === "function";
};

const createHeaders = ({ headers, body, skipAuth }) => {
  const requestHeaders = new Headers({
    Accept: "application/json",
    ...(headers || {}),
  });

  const isFormData = body instanceof FormData;
  const hasBody = body !== undefined && body !== null;

  if (hasBody && !isFormData && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const accessToken = tokenStorage.getAccessToken();
    if (accessToken) {
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  return requestHeaders;
};

const createBody = ({ body, headers, method }) => {
  if (method === "GET" || method === "HEAD") {
    return undefined;
  }

  if (body === undefined || body === null) {
    return undefined;
  }

  if (body instanceof FormData || typeof body === "string") {
    return body;
  }

  const contentType = headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(body);
  }

  return body;
};

const executeRequest = async (path, options, hasRetried = false) => {
  const {
    method = "GET",
    headers,
    body,
    query,
    signal,
    credentials = "include",
    skipAuth = false,
  } = options || {};

  const requestHeaders = createHeaders({ headers, body, skipAuth });
  const requestBody = createBody({
    body,
    headers: requestHeaders,
    method: method.toUpperCase(),
  });
  const requestUrl = appendQueryParams(path, query);

  const response = await fetch(requestUrl, {
    method,
    headers: requestHeaders,
    body: requestBody,
    signal,
    credentials,
  });

  const responseData = await parseResponseBody(response);

  if (!response.ok) {
    if (shouldRetryWithRefresh({ status: response.status, skipAuth, hasRetried })) {
      const refreshed = await refreshHandler();
      if (refreshed) {
        return executeRequest(path, options, true);
      }
    }

    throw new ApiError(
      extractErrorMessage(response.status, responseData),
      response.status,
      responseData
    );
  }

  return responseData;
};

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => {
    if (!token) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clearAccessToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => {
    if (!token) return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clearRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
  clearAllTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export const setRefreshHandler = (handler) => {
  refreshHandler = handler;
};

export const apiClient = {
  request: (path, options) => executeRequest(path, options),
  get: (path, options = {}) => executeRequest(path, { ...options, method: "GET" }),
  post: (path, options = {}) => executeRequest(path, { ...options, method: "POST" }),
  put: (path, options = {}) => executeRequest(path, { ...options, method: "PUT" }),
  patch: (path, options = {}) => executeRequest(path, { ...options, method: "PATCH" }),
  delete: (path, options = {}) => executeRequest(path, { ...options, method: "DELETE" }),
};

