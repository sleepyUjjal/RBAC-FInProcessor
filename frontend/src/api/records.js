import { apiClient } from "./client";

const RECORDS_BASE = "/api/records/data/";
const LOGS_BASE = "/api/records/logs/";

export const listRecords = (params = {}, options = {}) =>
  apiClient.get(RECORDS_BASE, {
    query: {
      page: params.page,
      search: params.search,
      type: params.type,
      category: params.category,
      date: params.date,
      ordering: params.ordering,
    },
    signal: options.signal,
  });

export const getRecordById = (id, options = {}) =>
  apiClient.get(`${RECORDS_BASE}${id}/`, {
    signal: options.signal,
  });

export const createRecord = (payload) =>
  apiClient.post(RECORDS_BASE, {
    body: payload,
  });

export const updateRecord = (id, payload) =>
  apiClient.put(`${RECORDS_BASE}${id}/`, {
    body: payload,
  });

export const patchRecord = (id, payload) =>
  apiClient.patch(`${RECORDS_BASE}${id}/`, {
    body: payload,
  });

export const deleteRecord = (id) => apiClient.delete(`${RECORDS_BASE}${id}/`);

export const listAuditLogs = (params = {}, options = {}) =>
  apiClient.get(LOGS_BASE, {
    query: {
      page: params.page,
      search: params.search,
      action: params.action,
      user: params.user,
    },
    signal: options.signal,
  });
