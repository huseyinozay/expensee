import ApiService from "./route";

const api = new ApiService();

export async function getExpenses(filter: object): Promise<ExpenseData> {
  const response = await api.get("v1/adminExpense", filter);

  if (!response) {
    throw new Error("Error fetching expenses");
  }
  return response as ExpenseData;
}

export async function getTagData(): Promise<TagData> {
  const response = await api.get("v1/tags");

  if (!response) {
    throw new Error("Error fetching tags");
  }
  return response as TagData;
}

export async function getExpenseCategoryData(): Promise<any[]> {
  const response = await api.get("v1/expenseTypes/all");

  if (!response) {
    throw new Error("Error fetching expense types");
  }
  return response as any[];
}

export async function fetchCustomFieldData(): Promise<MasraffResponse> {
  const response = await api.get("v1/customFields");
  if (!response) {
    throw new Error("Error fetching custom field data");
  }
  return response as MasraffResponse;
}

export async function fetchUserOhpCodeData(
  isComeFromReportFilter: boolean
): Promise<OhpCodeData[]> {
  const response = await api.get(
    `v1/mobile/getUserOhpCodes?isComeFromReportFilter=${
      isComeFromReportFilter ? true : 0
    }`
  );

  if (!response) {
    throw new Error("Error fetching ohp code data");
  }
  return response as OhpCodeData[];
}

export async function getUserOhpCodeDataList(
  isComeFromReportFilter: boolean,
  userId: string
): Promise<OhpCodeData[]> {
  const response = await api.get(
    `v1/users/getUserOhpCodeList/${userId}?isComeFromReport=${
      isComeFromReportFilter ? true : 0
    }`
  );

  if (!response) {
    throw new Error("Error fetching ohp code data");
  }
  return response as OhpCodeData[];
}

export const changeExchangeRate = async (
  exchanceRateData: object
): Promise<number> => {
  {
    return api.post("v1/expenses/exchangeRate", exchanceRateData);
  }
};

export const saveExpense = async (expense: Expense) => {
  return await api.post("v1/adminExpense", expense);
};

export function updateExpense(expense: object) {
  //@ts-ignore
  return api.update(`v1/expenses/${expense.id}`, expense);
}

export function deleteExpense(
  expenseId: number,
  delegatedUserId: number | null
) {
  return api.delete(
    `v1/expenses/${expenseId}?delegatedUserId=${delegatedUserId}`
  );
}

export function divideExpense(dividedExpenses: Expense[],delegatedUserId: number | null){
  return api.post(`v1/mobile/divideExpense/${dividedExpenses[0].id}?delegatedUserId=${delegatedUserId}`,dividedExpenses)
}

export function getUserEmails() : Promise<UserEmailData[]> {
  return api.get('v1/users/userEmails')

}
