import ApiService from "./route";

const api = new ApiService();

export async function getExpensesReport(
  filter: object
): Promise<MasraffResponse> {
  const response = await api.get("v1/reports/getDefaultReports", filter);

  if (!response) {
    throw new Error("Error fetching expense report");
  }
  return response as MasraffResponse;
}

export async function getAlreadyExpenses(): Promise<Expense[]> {
  const response = await api.get("v1/expenses/allreadyexpenses");

  if (!response) {
    throw new Error("Error fetching already expenses");
  }
  return response as Expense[];
}

export async function getWaitingApprovalReports(
  userId: string
): Promise<MasraffResponse> {
  const response = await api.get(
    `v1/reports?pageSize=100&page=0&approverUserId=${userId}`
  );

  if (!response) {
    throw new Error("Error fetching approval reports");
  }
  return response as MasraffResponse;
}

export async function getSubCompanies(): Promise<Object[]> {
  const response = await api.get("v1/subcompanies/all");

  if (!response) {
    throw new Error("Error fetching subcompanies");
  }
  return response as any[];
}

export async function getUserSubCompanies(
  userId: string
): Promise<SubCompany[]> {
  const response = await api.get(
    `v1/subcompanies/userSubCompanyList/${userId}`
  );

  if (!response) {
    throw new Error("Error fetching subcompanies");
  }
  return response as SubCompany[];
}

export async function getUserTripReport(userId: string): Promise<TripReport> {
  const response = await api.get(`v1/reports/getUserTripReports/${userId}`);

  if (!response) {
    throw new Error("Error fetching trip reports");
  }
  return response as TripReport;
}

export async function getUserAdvanceReport(
  userId: string
): Promise<AdvanceReport[]> {
  const response = await api.get(`v1/reports/getUserAdvanceReports/${userId}`);

  if (!response) {
    throw new Error("Error fetching advance reports");
  }
  return response as AdvanceReport[];
}

export async function updateExpenseReport(expenseReport: ExpenseReport) {
  return api.update(
    `v1/reports/updateReport/${expenseReport.id}`,
    expenseReport
  );
}

export async function saveExpenseReport(expenseReport: ExpenseReport) {
  return api.post('v1/reports',expenseReport)
}

export async function getIndividualExpenseReport(
  reportId: number
): Promise<MasraffResponse> {
  const response = await api.get(
    `v1/expenses?clientId=adminApp&reportId=${reportId}&includes=user%2C+expenseType%2Cuser.Company&sortField=&ascending=false`
  );

  if (!response) {
    throw new Error("Error fetching expenses");
  }
  return response as MasraffResponse;
}
