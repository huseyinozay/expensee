import { MasraffSelectionType } from "@fabrikant-masraff/masraff-core";

export interface MasraffResponse {
  lastIndex: number;
  pageSize: Number;
  results: any;
  totalCount: number;
  totalPages: number;
}

export type GenericObject = {
  id: number | string | boolean;
  name: string;
};

export interface ExpenseData extends MasraffResponse {
  allExpenseIds: Array<number>;
}

export interface TripReport {
  id: number;
  reportId: number;
  firstName: string;
  lastName: string;
  tckn: string;
  dateOfBirth: string;
  gsm: string;
  email: string;
  departman: string;
  position: string;
  tripApprover: number;
  invoiceApprover: number;
  invoiceCompany: number;
  tripReason: string;
  tripLocation: string;
  departureDate: string;
  returnDate: string;
  firstHotelName: string;
  secondHotelName: string;
  hotelEntryDate: string;
  hotelExitDate: string;
  secondHotelEntryDate: string;
  secondHotelExitDate: string;
  departureAirport: string;
  returnAirport: string;
  flightDepartureDate: string;
  flightReturnDate: string;
  vehicle: string;
  origin: string;
  destination: string;
  originDate: string;
  destinationDate: string;
  rentalCarOrigin: string;
  rentalCarOriginDate: string;
  rentalCarDestination: string;
  rentalCarDestinationDate: string;
  driverLicenseNo: string;
  driverLicensePlace: string;
  driverLicenseClass: string;
  driverLicenseDate: string;
  passportNo: string;
  passportValidityDate: string;
  visaStartingDate: string;
  visaCountry: string;
  tripApproverMail: string;
  invoiceApproverEmail: string;
  invoiceCompanyText: string;
  cityId: number;
  isItAbroad: boolean;
}

export interface CustomReportFormsData extends MasraffResponse {
  enableReportIdsForExport: number[];
}

export interface CustomFormType {
  id: number;
  companyId: number;
  name: string;
  createDate: Date;
  status: number;
}

export interface FormCustomFields {
  id: number;
  companyId: number;
  subCompanyId: number;
  fieldName: string;
  valueType: number;
  fieldType: number;
  customReportId: number;
  isRequired: boolean;
  createDate: string;
  status: number;
  customValue: string | null;
  customFieldValues: any[];
}

export interface CustomReport {
  id: number;
  userId: number;
  approverUserId: number;
  name: string;
  logoExported: boolean;
  totalAmount: number;
  comment: string;
  currency: number;
  currencyText: string;
  status: number;
  statusText: string;
  sendDate: string;
  createDate: string;
  user: Object;
  approver: Object;
  expenses: Object;
  workflows: any[];
  hasRecurring: boolean;
  totalConfirmation: number;
  subCompanyId: number;
  updateDate: string;
  approvedDate: string;
  subCompanyName: string;
  reportType: number;
  formType: {
    id: number;
    companyId: number;
    name: string;
    createDate: string;
    status: number;
  };
  customFields: FormCustomFields[];
  customReportType: null; // Modify when needed.
  hasBudget: boolean;
  integratedWorkflowResult: null; // Modify when needed.
  integratedWorkflowStatusCode: number;
  vehicle: null; // Modify when needed.
  origin: null; // Modify when needed.
  destination: null; // Modify when needed.
  startDate: null; // Modify when needed.
  endDate: null; // Modify when needed.
  tripReportId: null; // Modify when needed.
  description: string; // Modify when needed.
  ohpCodeId: number;
  isItAbroad: boolean;
  tripReport: TripReport;
  advanceReport: {
    id: number;
    reportId: number;
    conversionAmount: number;
    currencyRate: number;
    cityId: number;
    country: string;
    day: string;
  };
  denialNote: null; // Modify when needed.
  advanceReportId: null; // Modify when needed.
  tag_LookupId: null; // Modify when needed.
  tag_Lookup: Object;
  isDelivered: boolean;
  isExcludeFromBatchExports: boolean;
}

export interface CustomReportForm {
  userBySubCompyList: any[];
  report: CustomReport;
}

export interface TagData extends MasraffResponse {
  results: GenericObject[];
}

export type DropdownSelection = {
  value: any;
  name: string;
};
export interface SubCompany {
  id: number;
  name: string;
  code: string;
  parentCompany: number;
  company: any;
  createDate: string;
  updateDate: string;
}

export interface OhpCodeData {
  companyOhpCodeDescription: string;
  companyOhpCodeId: number;
  companyOhpCodeValue: string;
  id: number;
  isDefault: boolean;
  status: number;
  userId: number;
}
type User = {
  companyId: number;
  approverUserId: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  thumbnailUrl: string;
  emailConfirmed: boolean;
  language: number;
  currency: number;
  scheduledFrequency: number;
  scheduledFrequencyText: string | null;
  emailEnabled: boolean;
  pushEnabled: boolean;
  status: number;
  createDate: string; // could also be Date if parsed
  updateDate: string; // could also be Date if parsed
  lastLoginDate: string; // could also be Date if parsed
  company: any | null; // Use a more specific type if known
  roles: any[]; // Use a more specific type for the array items if known
  ohpCode: string | null;
  showExpensePreEdit: boolean;
  defaultPaymentMethod: any | null; // Use a more specific type if known
  isDeliveryNotificationsEnabled: boolean;
};

export type Expense = {
  id: number;
  name: string;
  approverUserId: number;
  userId: string;
  amount: number;
  note: string;
  billable: boolean;
  tag_LookupId: number;
  status: number;
  taxPercentage: number;
  taxAmount: number;
  currencyRate: number;
  reimbursable: boolean;
  customFields: any[];
  currency: number;
  expenseTypeId: number;
  currencyText: string | undefined;
  isLimitExceeded: boolean;
  paymentMethod: number;
  tag_Lookup: Object;
  conversionAmount: number;
  sourceType: number;
  expenseDate: string;
  receiptNumber: string;
  merchant: string;
  reportId: number;
  ohpCodeId: number;
  attendeesList: Array<string>;
  attendeesNumber: number;
  expenseType: { name: string };
  guid: string;
  user: User;
};

export interface ExpenseReport {
  advanceReport: any;
  advanceReportId: number;
  approvedDate: string;
  approver: Object;
  approverUserId: number;
  comment: string;
  createDate: string;
  currency: number;
  currencyText: string;
  customFields: any;
  customReportType: any;
  denialNote: string;
  description: string;
  destination: string;
  endDate: string;
  expenses: any;
  formType: any;
  hasBudget: boolean;
  hasRecurring: boolean;
  id: number;
  integratedWorkflowResult: any;
  integratedWorkflowStatusCode: number;
  isDelivered: boolean;
  isExcludeFromBatchExports: boolean;
  isItAbroad: boolean;
  logoExported: boolean;
  name: string;
  ohpCodeId: number;
  origin: any;
  reportType: number;
  sendDate: string;
  startDate: string;
  status: number;
  statusText: string;
  subCompanyId: number;
  subCompanyName: string;
  tag_Lookup: string;
  tag_LookupId: number;
  totalAmount: number;
  totalConfirmation: any;
  tripReport: any;
  tripReportId: number;
  updateDate: string;
  user: Object;
  userId: number;
  vehicle: any;
  workflows: any[];
  note: string;
  delegatedUserId: string | null;
}

export interface AdvanceReport {
  id: number;
  userId: number;
  userByComapnyId: number;
  subCompanyName: string;
  name: string;
  customReportType: string;
  approverUserId: number;
  status: number;
  statusText: string;
  userEmail: string;
  sendDate: string;
  approverFullName: string;
  approvedDate: string;
  reportType: number;
  tripReportId: number;
  advanceReportId: number;
  denialNote: string;
  isExcludeFromBatchExports: boolean;
}

export type CreateReport = {
  name: string;
  delegatedUserId: string | null;
  subCompanyId: number | null;
  user: Object;
};

export type ExchangeRate = {
  SourceCurrency: number;
  TargetCurrency: number;
  RateDate: Date;
};

export interface SelectionData {
  name: string;
  value: number | undefined;
}

export interface UserEmailData {
  id: number;
  userName: string;
  fullName: string;
}

export interface filterStateType {
  id: string;
  type: string;
  value: any;
  placeholder: string;
  selectionData?: GenericObject[];
}

export interface ExpenseTableData {
  combinedAmount: string;
  createDate: string;
  expenseDate: string;
  expenseTypeId: string;
  guid: any;
  id: number;
  merchant: string;
  paymentMethod: string;
  status: string;
  user: string;
}

export interface ExpenseReportTableData {
  totalAmount: string;
  name: string;
  subCompanyName: string;
  approver: string;
  isDelivered: boolean;
  id: number;
  sendDate: string;
  approvedDate: string;
  statusText: string;
  user: string;
}

export interface AdvanceReportTableData {
  id: number;
  name: string;
  userEmail: string;
  organizationName: string;
  statusText: string;
  approver: string;
  sendDate: string;
  approvedDate: string;
}

export interface CustomReportTableData {
  name: string;
  subCompanyName: string;
  approverFullName: string;
  customReportType: string;
  id: number;
  sendDate: string;
  approvedDate: string;
  status: string;
  userEmail: string;
}
