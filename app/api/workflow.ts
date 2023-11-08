import {GenericObject, WorkflowRuleSteps} from "@/utils/types";
import ApiService from "./route";

const api = new ApiService();

const companyId = 3406;
export async function getWorkflowUsers(): Promise<GenericObject[]> {
  const response = await api.get(`v1/workflow/${companyId}/users`);
  if (!response) {
    throw new Error("Error fetching workflow data");
  }
  return response as GenericObject[];
}

export async function getWorkflowData(): Promise<WorkflowRuleSteps[]> {
  const response = await api.get(`v1/workflow/${companyId}`);

  if (!response) {
    throw new Error("Error fetching workflow data");
  }
  return response as WorkflowRuleSteps[];
}

export async function getSubCompanies(): Promise<GenericObject[]> {
  const response = await api.get(`v1/workflow/${companyId}/sub-companies`);
  if (!response) {
    throw new Error("Error fetching workflow data");
  }
  return response as GenericObject[];
}

export async function getUserGroups(): Promise<GenericObject[]> {
  const response = await api.get(`v1/workflow/${companyId}/user-groups`);
  if (!response) {
    throw new Error("Error fetching workflow data");
  }
  return response as GenericObject[];
}

export async function getExpenseTypes(): Promise<GenericObject[]> {
  const response = await api.get(`v1/workflow/${companyId}/expense-types`);
  if (!response) {
    throw new Error("Error fetching workflow data");
  }
  return response as GenericObject[];
}

export async function getTags(): Promise<GenericObject[]> {
  const response = await api.get(`v1/workflow/${companyId}/tags`);
  if (!response) {
    throw new Error("Error fetching workflow data");
  }
  return response as GenericObject[];
}

export async function getDepartments(): Promise<GenericObject[]> {
  const response = await api.get(`v1/workflow/${companyId}/departments`);
  if (!response) {
    throw new Error("Error fetching workflow data");
  }
  return response as GenericObject[];
}

export async function getGrades(): Promise<GenericObject[]> {
  const response = await api.get(`v1/workflow/${companyId}/grades`);
  if (!response) {
    throw new Error("Error fetching workflow data");
  }
  return response as GenericObject[];
}