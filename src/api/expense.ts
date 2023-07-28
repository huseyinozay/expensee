import ApiService from "@/services/apiService";

const api = new ApiService();

export function getExpenses(filter: object) {
  return api.get("v1/adminExpense", filter);
}

export function getTagData() {
  return api.get("v1/tags");
}
export function getExpenseCategoryData() {
  return api.get("v1/expenseTypes/all");
}

export function getExchangeRate(exchanceRateData: object) {
  return api.post("v1/expenses/exchangeRate", exchanceRateData);
}

export function updateExpense(expense: object) {
  //@ts-ignore
  return api.update(`v1/expenses/${expense.id}`, expense);
}
