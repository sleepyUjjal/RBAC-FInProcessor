import { apiClient } from "./client";

const DASHBOARD_SUMMARY_ENDPOINT = "/api/dashboard/summary/";

export const getDashboardSummary = (ranges = {}, options = {}) =>
  apiClient.get(DASHBOARD_SUMMARY_ENDPOINT, {
    query: {
      income_range: ranges.incomeRange ?? "all",
      expense_range: ranges.expenseRange ?? "all",
      investment_range: ranges.investmentRange ?? "all",
    },
    signal: options.signal,
  });
