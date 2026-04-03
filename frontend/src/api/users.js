import { apiClient } from "./client";

const USERS_BASE = "/api/auth/users/";

export const listUsers = (params = {}, options = {}) =>
  apiClient.get(USERS_BASE, {
    query: {
      page: params.page,
      search: params.search,
      role: params.role,
      is_active: params.isActive,
    },
    signal: options.signal,
  });

export const getUserById = (id) => apiClient.get(`${USERS_BASE}${id}/`);

export const createUser = (payload) =>
  apiClient.post(USERS_BASE, {
    body: payload,
  });

export const updateUser = (id, payload) =>
  apiClient.put(`${USERS_BASE}${id}/`, {
    body: payload,
  });

export const patchUser = (id, payload) =>
  apiClient.patch(`${USERS_BASE}${id}/`, {
    body: payload,
  });

export const deleteUser = (id) => apiClient.delete(`${USERS_BASE}${id}/`);
