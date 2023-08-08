interface MasraffResponse {
  lastIndex: number;
  pageSize: Number;
  results: any;
  totalCount: number;
  totalPages: number;
}

type GenericObject = {
  id: number | string | boolean;
  name: string;
};

interface ExpenseData extends MasraffResponse {
  allExpenseIds: Array<number>;
}

interface TagData extends MasraffResponse {
  results: GenericObject[];
}

type DropdownSelection = {
  value: any;
  name: string;
};
interface SubCompany {
  id: number;
  name: string;
  code:string;
  parentCompany: number;
  company: any;
  createDate: string;
  updateDate: string;
}

interface TripReport {
  userTripReportList: any[];
  isEnableForExpenseReport: boolean
}

interface AdvanceReport{
  id: number;
  name:string;
}

interface OhpCodeData {
  companyOhpCodeDescription: string;
  companyOhpCodeId: number;
  companyOhpCodeValue: string;
  id: number;
  isDefault: boolean;
  status: number;
  userId: number;
}

type Expense = {
  id: number;
  name: string;
  approverUserId: number;
  userId: number;
  amount: number;
  note: string;
  billable: boolean;
  tag_LookupId: number;
  status: number;
  taxPercentage: number;
  taxAmount: number;
  currencyRate: number;
  reimbursable: boolean;
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
};


interface ExpenseReport {
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
}


type ExchangeRate = {
  SourceCurrency: number;
  TargetCurrency: number;
  RateDate: Date;
};
