import {
  expenseStatus,
  formStatus,
  imageRawBaseUrl,
  paymentMethods,
} from "./utils";

type Column = {
  field: string;
  title: string;
  formatter?: (val: any) => string;
};

export const expenseColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.expenseNo",
  },
  {
    field: "guid",
    title: "labels.receipt",
    formatter: (val) => val ? `BLOBIMAGE_${val}` : null,
  },
  {
    field: "user",
    title: "labels.user",
    formatter: (val) => `${val.firstName} ${val.lastName}`,
  },
  {
    field: "merchant",
    title: "labels.merchant",
  },
  {
    field: "combinedAmount",
    title: "labels.amount",
  },
  {
    field: "status",
    title: "labels.status",
    //@ts-ignore
    formatter: (val) => expenseStatus[val],
  },
  {
    field: "paymentMethod",
    title: "labels.paymentType",
    //@ts-ignore
    formatter: (val) => paymentMethods[val],
  },
  {
    field: "expenseTypeId",
    title: "labels.category",
  },
  {
    field: "expenseDate",
    title: "labels.expenseDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "createDate",
    title: "labels.uploadDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
];

export const expenseColumnsSimplified: Array<Column> = [
  {
    field: "expenseTypeId",
    title: "labels.category",
  },
  {
    field: "taxPercentage",
    title: "labels.taxPercentage",
    formatter: (val) => `%${val}`,
  },
  {
    field: "combinedAmount",
    title: "labels.amount",
  },
];

export const expenseReportColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.reportNo",
  },
  {
    field: "subCompanyName",
    title: "labels.organization",
  },
  {
    field: "name",
    title: "labels.name",
  },
  {
    field: "totalAmount",
    title: "labels.amount",
  },
  {
    field: "statusText",
    title: "labels.status",
  },
  {
    field: "user",
    title: "labels.expenseOwner",
    formatter: (val) => `${val.firstName} ${val.lastName}`,
  },
  {
    field: "sendDate",
    title: "labels.sendingDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "approver",
    title: "labels.approvingExpenseBy",
    formatter: (val) => `${val.firstName} ${val.lastName}`,
  },
  // {
  //   field: "id",
  //   title: "İşlem Geçmişi",
  // },
  {
    field: "approvedDate",
    title: "labels.approvedDate",
    //@ts-ignore
    formatter: (val) =>
      !!val ? new Date(val).toLocaleDateString("tr-TR") : "",
  },
  {
    field: "isDelivered",
    title: "labels.deliveryStatus",
  },
];

export const allReadyExpenseColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.reportNo",
  },
  {
    field: "merchant",
    title: "labels.merchant",
  },
  {
    field: "amount",
    title: "labels.amount",
  },
  {
    field: "status",
    title: "labels.status",
    //@ts-ignore
    formatter: (val) => expenseStatus[val],
  },
  {
    field: "paymentMethod",
    title: "labels.paymentType",
    //@ts-ignore
    formatter: (val) => paymentMethods[val],
  },
  {
    field: "expenseTypeId",
    title: "labels.category",
  },
  {
    field: "expenseDate",
    title: "labels.expenseDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "createDate",
    title: "labels.uploadDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
];

export const waitingApprovalReportColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.reportNo",
  },
  {
    field: "subCompanyName",
    title: "labels.organization",
  },
  {
    field: "name",
    title: "labels.name",
  },
  {
    field: "totalAmount",
    title: "labels.amount",
  },
  {
    field: "statusText",
    title: "labels.status",
  },
  {
    field: "sendDate",
    title: "labels.sendingDate",
    //@ts-ignore
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  // {
  //   field: "id",
  //   title: "İşlem Geçmişi",
  // },
  {
    field: "approvedDate",
    title: "labels.approvedDate",
    //@ts-ignore
    formatter: (val) =>
      !!val ? new Date(val).toLocaleDateString("tr-TR") : "",
  },
  {
    field: "isDelivered",
    title: "labels.deliveryStatus",
  },
];

export const customFormColumns: Array<Column> = [
  {
    field: "id",
    title: "labels.reportNo",
  },
  {
    field: "subCompanyName",
    title: "labels.organization",
  },
  {
    field: "name",
    title: "labels.name",
  },
  {
    field: "customReportType",
    title: "labels.reportType",
  },
  {
    field: "status",
    title: "labels.status",
    //@ts-ignore
    formatter: (val) => formStatus[val],
  },
  {
    field: "userEmail",
    title: "labels.expenseOwner",
  },
  {
    field: "sendDate",
    title: "labels.sendingDate",
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
  {
    field: "approverFullName",
    title: "labels.approvingFormBy",
  },
  {
    field: "approvedDate",
    title: "labels.approvedDate",
    formatter: (val) => new Date(val).toLocaleDateString("tr-TR"),
  },
];
