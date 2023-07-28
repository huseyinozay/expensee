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

type Data = {
  id: number | Boolean;
  name: string;
};

type ObjectType = {
  [key: string]: any;
  id: number;
  name: string;
};
type selectDataType = {
  id: number;
  name: string;
};

type ExchangeRate = {
  SourceCurrency: number;
  TargetCurrency: number;
  RateDate: Date;
};
