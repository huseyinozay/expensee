import ApiService from "./route";

const api = new ApiService();

export async function getCustomReportsView(filter: object): Promise<CustomExpenseFormData> {
  const response = await api.get("v1/reports/getCustomReportsView", filter);

  if (!response) {
    throw new Error("Error fetching custom expense report");
  }
  return response as CustomExpenseFormData;
}

export async function getCustomReportTypes(): Promise<CustomFormType[]> {
  const response = await api.get("v1/customFields/getCustomForms");

  if (!response) {
    throw new Error("Error fetching custom form types");
  }
  return response as CustomFormType[];
}
