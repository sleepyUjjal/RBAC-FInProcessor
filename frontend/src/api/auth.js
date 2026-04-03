import { apiClient, setRefreshHandler, tokenStorage } from "./client";

const AUTH_BASE = "/api/auth";

export const login = async (payload) => {
  const data = await apiClient.post(`${AUTH_BASE}/login/`, {
    body: payload,
    skipAuth: true,
  });

  if (data?.access) {
    tokenStorage.setAccessToken(data.access);
  }

  if (data?.refresh) {
    tokenStorage.setRefreshToken(data.refresh);
  }

  return data;
};

export const register = (payload) =>
  apiClient.post(`${AUTH_BASE}/register/`, {
    body: payload,
    skipAuth: true,
  });

export const fetchCurrentUser = () => apiClient.get(`${AUTH_BASE}/me/`);

export const logout = async () => {
  try {
    await apiClient.post(`${AUTH_BASE}/logout/`, { skipAuth: true });
  } finally {
    tokenStorage.clearAllTokens();
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    const requestOptions = { skipAuth: true };

    if (refreshToken) {
      requestOptions.body = { refresh: refreshToken };
    }

    const data = await apiClient.post(`${AUTH_BASE}/token/refresh/`, requestOptions);

    if (!data?.access) {
      tokenStorage.clearAllTokens();
      return false;
    }

    tokenStorage.setAccessToken(data.access);

    if (data.refresh) {
      tokenStorage.setRefreshToken(data.refresh);
    }

    return true;
  } catch {
    tokenStorage.clearAllTokens();
    return false;
  }
};

export const setupAuthRefresh = () => {
  setRefreshHandler(refreshAccessToken);
};

