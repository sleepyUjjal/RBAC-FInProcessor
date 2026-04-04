import { apiClient } from "./client";

const DASHBOARD_SUMMARY_ENDPOINT = "/api/dashboard/summary/";

export const getDashboardSummary = (ranges = {}, options = {}) => {
  const query = {
    income_range: ranges.incomeRange ?? "all",
    expense_range: ranges.expenseRange ?? "all",
    investment_range: ranges.investmentRange ?? "all",
  };
  
  if (ranges.userId) {
    query.user_id = ranges.userId;
  }

  return apiClient.get(DASHBOARD_SUMMARY_ENDPOINT, {
    query,
    signal: options.signal,
  });
};
