import { CustomFormType, CustomReport, CustomReportForm, CustomReportFormsData } from "@/utils/types";
import ApiService from "./route";

const api = new ApiService();

export async function getCustomReportsView(
  filter: object
): Promise<CustomReportFormsData> {
  const response = await api.get("v1/reports/getCustomReportsView", filter);

  if (!response) {
    throw new Error("Error fetching custom expense report");
  }
  return response as CustomReportFormsData;
}

export async function getCustomReportTypes(): Promise<CustomFormType[]> {
  const response = await api.get("v1/customFields/getCustomForms");

  if (!response) {
    throw new Error("Error fetching custom form types");
  }
  return response as CustomFormType[];
}

export async function getCustomReportForm(
  formId: number
): Promise<CustomReportForm> {
  const response = await api.get(`v1/reports/getCustomReportForm/${formId}`);

  if (!response) {
    throw new Error("Error fetching single custom report form");
  }
  return response as CustomReportForm;
}

export async function updateCustomReport(customReport: CustomReport) {
  return api.update(`v1/reports/updateReport/${customReport.id}`, customReport);
}

export async function uploadCustomFieldFile(
  uploadFile: File,
  _containerName: string,
  setPostedFilename: (filename: string) => void
): Promise<string | null> {
  const _customFieldFileFuncUrl =
    "https://masraff-image.azurewebsites.net/api/upload-file-dev?code=fQXcZKSawZnxq1ySUUQwyFWjClH3j5bpPJLGtizFbhatmruQ0Dsq2w==";
  const _basicAuthCredential = "bWFzcmFmZjpTVCNuRTZodXhhY2E=";
  const fileExtension = uploadFile.name.split(".").pop();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(uploadFile);
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const fileBase64 = base64Data.replace(/^data:\w+\/\w+;base64,/, "");

      const body = {
        fileBase64: `data:image/jpeg;base64,${fileBase64}`, // corrected line
        location: _containerName,
        extensionName: `.${fileExtension}`,
      };

      try {
        const response = await fetch(_customFieldFileFuncUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${_basicAuthCredential}`,
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          resolve(data.fileName);
          setPostedFilename(data.fileName);
        } else {
          console.error("Failed to upload file:", await response.text());
          resolve(null);
        }
      } catch (error) {
        console.error("Failed to upload file:", error);
        resolve(null);
      }
    };
    reader.onerror = reject;
  });
}
