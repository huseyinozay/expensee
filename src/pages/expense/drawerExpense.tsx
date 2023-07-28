"use client";

import {
  MasraffColorType,
  MasraffFillStyle,
} from "@fabrikant-masraff/masraff-core";
import {
  MaButton,
  MaCheckbox,
  MaDateInput,
  MaDrawer,
  MaDrawerContent,
  MaDrawerFooter,
  MaDrawerHeader,
  MaGrid,
  MaGridRow,
  MaInput,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import { use, useEffect, useState } from "react";
import ApiService from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import DropDown from "@/components/DropDown";
import {
  availablePaymentMethods,
  taxPertangeList,
  currencyList,
} from "@/data/selectData";
import { getExchangeRate, updateExpense } from "@/api/expense";
import i18n from "@/plugins/i18n";

const api = new ApiService();

interface DrawerExpenseProps {
  isOpen: boolean;
  changeStatu(arg: boolean): void;
  data?: any;
}

type ExchangeRate = {
  SourceCurrency: number | null;
  TargetCurrency: number | null;
  RateDate: Date | null;
};

type SelectData = {
  value: any;
  name: string;
};

export default function DrawerExpense({
  isOpen,
  changeStatu,
  data,
}: DrawerExpenseProps) {
  const [expenseCategoryData, setExpenseCategoryData] = useState<Data[]>([]);
  const [ohpCodeData, setOhpCodeData] = useState<Data[]>([]);
  const [customFieldsData, setCustomFieldsData] = useState<Array<Object>>([]);
  const [exchangeRateData, setExchangeRateData] = useState<ExchangeRate>({
    SourceCurrency: 1,
    TargetCurrency: 1,
    RateDate: new Date(),
  });
  // @ts-ignore
  const [expense, setExpense] = useState<Expense>({});

  useEffect(() => {
    expense.taxAmount = expense.amount * (Number(expense.taxPercentage) / 100);

    expense.currencyText = currencyList.find(
      (x) => x.id === expense.currency
    )?.name;
    exchangeRateData.SourceCurrency = expense.currency;
    getExchanceRate.mutate(exchangeRateData);
  }, [expense.amount, expense.taxPercentage, expense.currency]);

  if (data && data !== expense) {
    setExpense(data);
  }

  function fetchExpenseCategoryData() {
    return api.get("v1/expenseTypes/all");
  }
  function fetchUserOhpCodeData() {
    return api.get("v1/mobile/getUserOhpCodes");
  }
  function fetchCustomFieldData() {
    return api.get("v1/customFields");
  }
  const expenseTypesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchExpenseCategoryData,
  });
  const ohpTypesQuery = useQuery({
    queryKey: ["ohpTypes"],
    queryFn: fetchUserOhpCodeData,
  });
  const customFieldsQuery = useQuery({
    queryKey: ["customFields"],
    queryFn: fetchCustomFieldData,
  });

  const getExchanceRate = useMutation({
    // @ts-ignore
    mutationFn: getExchangeRate,
    onSuccess: (data: number) => {
      expense.currencyRate = data;
      expense.conversionAmount = parseFloat(
        (expense.amount * expense.currencyRate).toFixed(2)
      );
      console.log(expense);
    },
  });

  const updateExpenseRecord = useMutation(updateExpense);

  useEffect(() => {
    if (expenseTypesQuery.data) {
      // @ts-ignore
      setExpenseCategoryData(expenseTypesQuery.data);
    }
    if (ohpTypesQuery.data) {
      // @ts-ignore
      setOhpCodeData(ohpTypesQuery.data);
    }
    if (customFieldsQuery.data) {
      // @ts-ignore
      setCustomFieldsData(customFieldsQuery.data);
    }
  }, [expenseTypesQuery, ohpTypesQuery, customFieldsQuery]);
  const saveExpense = async () => {
    try {
      await api.post("v1/adminExpense", expense);
    } catch (error) {
      console.log(error);
    }
  };
  const input = (data: SelectData) => {
    // @ts-ignore
    if (!data.value) expense[data.name] = null;
    if (data.value?.length === 1) {
      // @ts-ignore
      expense[data.name] = data.value[0];
    } else {
      // @ts-ignore
      expense[data.name] = data.value;
    }
    // console.log(expense);
  };
  const handleDateChange = (event: any) => {
    if (
      JSON.stringify(event.target.value) ===
      JSON.stringify(new Date(expense.expenseDate))
    )
      return;
    if (typeof event.target.value === "object") {
      let rawDate = event.target.value.toString();
      rawDate = new Date(event.target.value);
      const date = rawDate.toISOString();
      expense.expenseDate = date;
    }
  };
  return (
    <>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatu(false)}>
        <MaDrawerHeader>Masraff Ekle</MaDrawerHeader>
        <MaDrawerContent>
          <MaGrid rows={4}>
            <MaGridRow>
              <form onSubmit={saveExpense}>
                <MaText className="ma-size-margin-bottom-16 ma-size-margin-top-8">
                  {i18n.t("labels.category")}
                </MaText>
                <DropDown
                  input={input}
                  placeholder={expense?.expenseType?.name}
                  selectData={expenseCategoryData}
                  valueName="expenseTypeId"
                />
                <MaText className="ma-size-margin-bottom-16 ma-size-margin-top-8">
                  {i18n.t("labels.expenseCenter")}
                </MaText>
                <DropDown
                  input={input}
                  placeholder={String(expense.ohpCodeId)}
                  selectData={ohpCodeData}
                  valueName="ohpCodeId"
                />
                <MaText> {i18n.t("labels.amount")} </MaText>
                <MaInput
                  className="ma-size-margin-bottom-16 ma-size-margin-top-8"
                  fullWidth
                  value={String(expense.amount)}
                  type="number"
                  onMaChange={(el) =>
                    (expense.amount = parseFloat(el.target.value))
                  }
                ></MaInput>
                <MaText className="ma-size-margin-bottom-16 ma-size-margin-top-8">
                  {i18n.t("labels.currency")}
                </MaText>
                <DropDown
                  input={input}
                  placeholder={String(expense.currency)}
                  selectData={currencyList}
                  valueName="currency"
                />
                <div className="ma-display-flex ma-display-flex-row ma-size-margin-top-16">
                  <MaText className="ma-size-margin-bottom-16 ma-size-margin-top-2">
                    {i18n.t("labels.currencyRate")}
                  </MaText>
                  <MaInput value={String(expense.currencyRate)} />
                  <MaText className="ma-size-margin-bottom-16 ma-size-margin-top-2 ma-size-margin-left-8">
                    To {expense.currencyText}
                  </MaText>
                  <MaInput value={String(expense.conversionAmount)} />
                </div>
                <MaText> {i18n.t("labels.merchant")} </MaText>
                <MaInput
                  className="ma-size-margin-bottom-16 ma-size-margin-top-8"
                  fullWidth
                  value={expense.merchant}
                  onMaChange={(el) => (expense.merchant = el.target.value)}
                ></MaInput>
                <MaText> {i18n.t("labels.taxPercentage")} </MaText>
                <DropDown
                  input={input}
                  placeholder={String(expense.taxPercentage)}
                  selectData={taxPertangeList}
                  valueName="taxPercentage"
                />
                <MaText> {i18n.t("labels.taxAmount")} </MaText>
                <MaInput
                  className="ma-size-margin-bottom-16 ma-size-margin-top-8"
                  fullWidth
                  value={String(expense.taxAmount)}
                  onMaChange={(el) =>
                    (expense.amount = parseFloat(el.target.value))
                  }
                ></MaInput>
                <MaText> {i18n.t("labels.paymentMethod")} </MaText>
                <DropDown
                  input={input}
                  placeholder={String(expense.paymentMethod)}
                  selectData={availablePaymentMethods}
                  valueName="paymentMethod"
                />
                <MaText> {i18n.t("labels.date")} </MaText>
                <MaDateInput
                  className="ma-size-margin-bottom-16 ma-size-margin-top-8"
                  fullWidth
                  max={new Date()}
                  value={new Date(expense.expenseDate)}
                  onMaDateChange={handleDateChange}
                  required
                ></MaDateInput>
                <MaText> {i18n.t("labels.description")} </MaText>
                <MaInput
                  className="ma-size-margin-bottom-16 ma-size-margin-top-8"
                  fullWidth
                  value={expense.note}
                  onMaChange={(el) => (expense.note = el.target.value)}
                ></MaInput>
                <div className="ma-display-flex ma-display-flex-column">
                  <MaCheckbox
                    value={expense.reimbursable}
                    onMaChange={() =>
                      (expense.reimbursable = !expense.reimbursable)
                    }
                  >
                    <span>{i18n.t("labels.payable")}</span>
                  </MaCheckbox>
                  <MaCheckbox
                    value={expense.billable}
                    onMaChange={() => (expense.billable = !expense.billable)}
                  >
                    <span>{i18n.t("labels.toBeBilled")}</span>
                  </MaCheckbox>
                </div>
              </form>
            </MaGridRow>
          </MaGrid>
        </MaDrawerContent>
        <MaDrawerFooter>
          <MaButton
            fillStyle={MasraffFillStyle.Ghost}
            colorType={MasraffColorType.Neutral}
            onMaClick={() => changeStatu(false)}
          >
            {i18n.t("labels.cancel")}
          </MaButton>
          {expense.id ? (
            <MaButton
              fillStyle={MasraffFillStyle.Solid}
              colorType={MasraffColorType.Primary}
              onMaClick={() => updateExpenseRecord.mutate(expense)}
            >
              {i18n.t("labels.update")}
            </MaButton>
          ) : (
            <MaButton
              fillStyle={MasraffFillStyle.Solid}
              colorType={MasraffColorType.Primary}
              onMaClick={saveExpense}
            >
              {i18n.t("labels.save")}
            </MaButton>
          )}
        </MaDrawerFooter>
      </MaDrawer>
    </>
  );
}
