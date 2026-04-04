import { apiClient } from "./client";

const DASHBOARD_SUMMARY_ENDPOINT = "/api/dashboard/summary/";

export const getDashboardSummary = (ranges = {}, options = {}) => {
  const query = {
    income_range: ranges.incomeRange ?? "all",
    expense_range: ranges.expenseRange ?? "all",
    investment_range: ranges.investmentRange ?? "all",
  };
  
  if (ranges.incomeUserId) query.income_user_id = ranges.incomeUserId;
  if (ranges.expenseUserId) query.expense_user_id = ranges.expenseUserId;
  if (ranges.investmentUserId) query.investment_user_id = ranges.investmentUserId;

  return apiClient.get(DASHBOARD_SUMMARY_ENDPOINT, {
    query,
    signal: options.signal,
  });
};
