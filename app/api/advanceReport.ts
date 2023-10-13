import { MasraffResponse } from "@/utils/types";
import ApiService from "./route";

const api = new ApiService();

export async function getAdvanceReports(
  filter: object
): Promise<MasraffResponse> {
  const response = await api.get("v1/reports/getAdvanceReportsView", filter);

  if (!response) {
    throw new Error("Error fetching advance reports");
  }
  return response as MasraffResponse;
}
