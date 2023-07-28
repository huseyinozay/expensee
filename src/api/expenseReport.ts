import ApiService from "@/services/apiService";

const api = new ApiService();

// export function getExpensesReport(filter: object) {
//   return api.get("v1/adminExpense", filter);
// }

// export function getTagData() {
//   return api.get("v1/tags");
// }
// export function getExpenseCategoryData() {
//   return api.get("v1/expenseTypes/all");
// }

export function getExpensesReport(filter: object) {
  return api.get("v1/reports/getDefaultReports", filter);
}

export function getOhpCodes() {
  return api.get("v1/mobile/getUserOhpCodes?isComeFromReportFilter=true");
}

export function getSubCompanies() {
  return api.get("v1/subcompanies/all");
}

export function getExpenses() {
  return api.get("v1/expenses/allreadyexpenses?searchValue=");
}

export function getWaitingApprovalReports() {
  return api.get("v1/reports?pageSize=100&page=0&approverUserId=37207");
}

export function getUserSubCompanies() {
  return api.get("v1/subcompanies/userSubCompanyList/37207");
}

export function getExpenseReport(reportId: number) {
  return api.get(
    `v1/expenses?clientId=adminApp&reportId=${reportId}&includes=user%2C+expenseType%2Cuser.Company&sortField=&ascending=false`
  );
}
