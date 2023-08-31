"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  changeExchangeRate,
  getExpenseCategoryData,
  getUserOhpCodeDataList,
} from "@/app/api/expense";
import Dropdown from "@/components/Dropdown";
import {
  MaInputCustomEvent,
  MasraffColorType,
  MasraffFillStyle,
  MasraffInputErrorTypes,
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
  MaInputErrorDisplay,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import { filterObjectsByIdAndName, getSelectedItemName } from "@/utils/helpers";
import {
  availablePaymentMethods,
  currencyList,
  globalUserObject,
  taxPertangeList,
} from "@/utils/utils";
import { CustomFields } from "../CustomFields";

interface DrawerExpenseProps {
  isOpen: boolean;
  changeStatus(arg: boolean): void;
  dividedExpenseState: Expense[];
  setDividedExpenseState: React.Dispatch<React.SetStateAction<Expense[]>>;
  ohpCodeData: GenericObject[];
}

export default function ExpenseDividerDrawer({
  isOpen,
  changeStatus,
  dividedExpenseState,
  setDividedExpenseState,
  ohpCodeData,
}: DrawerExpenseProps) {
  const { t } = useTranslation();
  const { userId, currency: userTargetCurrency } = globalUserObject;
  const targetCurrency =
    userTargetCurrency &&
    currencyList.find(
      (currencyType) => currencyType.name === userTargetCurrency
    );
  const [dividedPartOne, setDividedPartOne] = useState<Expense>(
    JSON.parse(JSON.stringify(dividedExpenseState[0]))
  );
  const [selectedExpense, setSelectedExpense] = useState<Expense>(
    JSON.parse(JSON.stringify(dividedExpenseState[0]))
  );
  const [exchangeRateData, setExchangeRateData] = useState({
    SourceCurrency: dividedPartOne.currency,
    TargetCurrency: targetCurrency?.id,
    RateDate: !dividedPartOne.expenseDate
      ? new Date()
      : dividedPartOne.expenseDate,
  });

  const [amountError, setAmountError] = useState(false);
  const {
    currencyRate,
    conversionAmount,
    currency: expenseCurrency,
    expenseDate,
    customFields: initialCustomFields,
  } = dividedPartOne;

  const [customFields, setCustomFields] = useState<any[]>(initialCustomFields);
  useEffect(() => {
    setExchangeRateData({
      SourceCurrency: expenseCurrency,
      TargetCurrency: targetCurrency?.id,
      RateDate: !expenseDate ? new Date() : expenseDate,
    });
  }, [expenseCurrency, targetCurrency, expenseDate]);

  const { data: ohpCodeQuery } = useQuery<OhpCodeData[]>({
    queryKey: ["ohpCode"],
    queryFn: async () => getUserOhpCodeDataList(false, userId),
  });

  const { data: expenseCategoryData } = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: async () => getExpenseCategoryData(),
  });
  let expenseCategories: GenericObject[] = [];
  if (expenseCategoryData)
    expenseCategories = filterObjectsByIdAndName(expenseCategoryData);

  const mutateExchangeRate = useMutation(changeExchangeRate, {
    onSuccess: (data: number) => {
      const tempExpense = { ...dividedPartOne };
      tempExpense.currencyRate = data;
      tempExpense.conversionAmount = data * dividedPartOne.amount;
      setDividedPartOne(tempExpense);
    },
  });

  const handleChange = (data: DropdownSelection) => {
    const tempExpense = { ...dividedPartOne };
    if (data.name === "expenseTypeId") {
      const changedCategory = expenseCategoryData?.find(
        (category) => category.id === data.value
      );
      tempExpense.expenseType = changedCategory;
      tempExpense.expenseTypeId = changedCategory.id;
    }
    if (data.name === "taxPercentage") {
      tempExpense.taxAmount =
        (tempExpense.amount * data.value) / (100 + data.value);
    }

    //@ts-ignore
    tempExpense[data.name] = data.value;
    setDividedPartOne(tempExpense);
  };

  const handleInputChange = (e: MaInputCustomEvent<any>, fields: string[]) => {
    const tempExpense = { ...dividedPartOne };
    if (fields.includes("conversionAmount")) {
      const newConversion =
        parseFloat(e.target.value) * tempExpense.currencyRate;
      tempExpense["conversionAmount"] = newConversion;
      tempExpense["amount"] = parseFloat(e.target.value);
      if (tempExpense["taxPercentage"] !== 0) {
        tempExpense["taxAmount"] =
          (tempExpense.amount * tempExpense.taxPercentage) /
          (100 + tempExpense.taxPercentage);
      }
    } else {
      //@ts-ignore
      const isFieldNumber = typeof tempExpense[fields[0]] === "number";
      //@ts-ignore
      tempExpense[fields[0]] = isFieldNumber
        ? parseFloat(e.target.value)
        : e.target.value;
    }
    setDividedPartOne(tempExpense);
  };

  const handleDateChange = (event: any) => {
    const tempExpense = { ...dividedPartOne };
    if (
      JSON.stringify(event.target.value) ===
      JSON.stringify(new Date(dividedPartOne.expenseDate))
    )
      return;
    if (typeof event.target.value === "object") {
      let rawDate = event.target.value.toString();
      rawDate = new Date(event.target.value);
      const date = rawDate.toISOString();
      tempExpense.expenseDate = date;
      setDividedPartOne(tempExpense);
    }
  };

  const divideCurrentExpense = () => {
    const tempDividedState: Expense[] = [];
    const dividedPartTwo = { ...selectedExpense };
    dividedPartTwo.amount = selectedExpense.amount - dividedPartOne.amount;
    dividedPartTwo.conversionAmount =
      (selectedExpense.amount - dividedPartOne.amount) *
      dividedPartTwo.currencyRate;
    if (dividedExpenseState.length > 1) {
      tempDividedState.push(dividedPartTwo);
      tempDividedState.push(dividedPartOne);

      for (let i = 1; i < dividedExpenseState.length; i++) {
        tempDividedState.push(dividedExpenseState[i]);
      }
    } else {
      tempDividedState.push(dividedPartTwo);
      tempDividedState.push(dividedPartOne);
    }

    setDividedExpenseState(tempDividedState);
    changeStatus(false);
  };

  useEffect(() => {
    if (exchangeRateData.SourceCurrency !== exchangeRateData.TargetCurrency) {
      mutateExchangeRate.mutate(exchangeRateData);
    }
  }, [
    exchangeRateData.SourceCurrency,
    exchangeRateData.TargetCurrency,
    exchangeRateData.RateDate,
  ]);

  useEffect(() => {
    setDividedPartOne((prevState) => ({
      ...prevState,
      customFields: customFields,
    }));
  }, [customFields]);

  useEffect(() => {
    if (exchangeRateData.SourceCurrency === exchangeRateData.TargetCurrency) {
      const tempExpense = { ...dividedPartOne };
      tempExpense.currencyRate = 1;
      tempExpense.conversionAmount = dividedPartOne.amount;
      setDividedPartOne(tempExpense);
    }
    const tempDivided1 = { ...dividedPartOne };
    tempDivided1.amount = 0;
    tempDivided1.conversionAmount = selectedExpense.currencyRate;
    tempDivided1.taxAmount = 0;
    tempDivided1.taxPercentage = 0;
    setDividedPartOne(tempDivided1);
  }, []);

  return (
    <>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatus(false)}>
        <MaDrawerHeader>{t("labels.divideExpense")}</MaDrawerHeader>
        <MaDrawerContent>
          <MaGrid>
            <MaGridRow>
              <form>
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.category")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  placeholder={
                    !dividedPartOne?.expenseType?.name
                      ? t("labels.select")
                      : dividedPartOne?.expenseType?.name
                  }
                  selectData={expenseCategories}
                  valueName="expenseTypeId"
                />
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.expenseCenter")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  placeholder={
                    dividedPartOne.ohpCodeId
                      ? getSelectedItemName(
                          dividedPartOne.ohpCodeId,
                          ohpCodeData
                        )
                      : t("labels.select")
                  }
                  selectData={ohpCodeData}
                  valueName="ohpCodeId"
                />
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.amount")}
                </MaText>
                <MaInput
                  fullWidth
                  value={String(dividedPartOne.amount)}
                  type="number"
                  showInputError={false}
                  onMaChange={(el) => {
                    if (Number(el.target.value) > selectedExpense.amount) {
                      setAmountError(true);
                    } else {
                      setAmountError(false);
                      handleInputChange(el, ["amount", "conversionAmount"]);
                    }
                  }}
                ></MaInput>
                {amountError && (
                  <MaInputErrorDisplay
                    type={MasraffInputErrorTypes.Inline}
                    message={t("labels.dividedExpenseAmountError")}
                  />
                )}
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.currency")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  placeholder={
                    dividedPartOne.currencyText
                      ? String(dividedPartOne.currencyText)
                      : ""
                  }
                  selectData={currencyList}
                  valueName="currency"
                />
                <div className="ma-display-flex ma-display-flex-row ma-size-margin-top-16 ma-size-margin-bottom-16">
                  <MaText className="ma-display-flex ma-display-flex-align-items-center ma-size-margin-right-8">
                    {t("labels.currencyRate")}
                  </MaText>
                  <MaInput value={String(currencyRate)} />
                  <MaText className="ma-display-flex ma-display-flex-row ma-display-flex-align-items-center ma-size-margin-right-8 ma-size-margin-left-8">
                    To {targetCurrency?.name}
                  </MaText>
                  <MaInput
                    readonly
                    value={
                      dividedPartOne.amount > 0
                        ? conversionAmount
                          ? String(conversionAmount)
                          : ""
                        : ""
                    }
                  />
                </div>
                <MaText className="ma-display-flex ma-size-margin-top-8 ma-size-margin-bottom-8">
                  {t("labels.merchant")}
                </MaText>
                <MaInput
                  fullWidth
                  value={dividedPartOne.merchant}
                  onMaChange={(el) => handleInputChange(el, ["merchant"])}
                ></MaInput>
                <MaText className="ma-display-flex ma-size-margin-top-8 ma-size-margin-bottom-8">
                  {t("labels.taxPercentage")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  placeholder={
                    dividedPartOne.taxPercentage
                      ? String(dividedPartOne.taxPercentage)
                      : t("labels.select")
                  }
                  selectData={taxPertangeList}
                  valueName="taxPercentage"
                />
                <MaText className="ma-display-flex ma-size-margin-top-8 ma-size-margin-bottom-8">
                  {t("labels.taxAmount")}
                </MaText>
                <MaInput
                  fullWidth
                  value={
                    dividedPartOne.taxAmount
                      ? String(dividedPartOne.taxAmount)
                      : ""
                  }
                  onMaChange={(el) => handleInputChange(el, ["taxAmount"])}
                ></MaInput>
                <MaText className="ma-display-flex ma-size-margin-top-8 ma-size-margin-bottom-8">
                  {t("labels.paymentMethod")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  placeholder={
                    dividedPartOne.paymentMethod
                      ? String(dividedPartOne.paymentMethod)
                      : t("labels.select")
                  }
                  selectData={availablePaymentMethods}
                  valueName="paymentMethod"
                />
                <MaText className="ma-display-flex ma-size-margin-top-8 ma-size-margin-bottom-8">
                  {t("labels.date")}
                </MaText>
                <MaDateInput
                  fullWidth
                  max={new Date()}
                  value={
                    !dividedPartOne.expenseDate
                      ? undefined
                      : new Date(dividedPartOne.expenseDate)
                  }
                  onMaDateChange={handleDateChange}
                  required
                ></MaDateInput>
                <MaText className="ma-display-flex ma-size-margin-top-8 ma-size-margin-bottom-8">
                  {t("labels.description")}
                </MaText>
                <MaInput
                  className="ma-display-flex ma-size-margin-bottom-8"
                  fullWidth
                  value={dividedPartOne.note}
                  onMaChange={(el) => handleInputChange(el, ["note"])}
                ></MaInput>
                <div className="ma-display-flex ma-display-flex-column">
                  <MaCheckbox
                    value={dividedPartOne.reimbursable}
                    onMaChange={() =>
                      handleChange({
                        name: "reimbursable",
                        value: !dividedPartOne.reimbursable,
                      })
                    }
                  >
                    <span>{t("labels.payable")}</span>
                  </MaCheckbox>
                  <MaCheckbox
                    value={dividedPartOne.billable}
                    onMaChange={() =>
                      handleChange({
                        name: "billable",
                        value: !dividedPartOne.billable,
                      })
                    }
                  >
                    <span>{t("labels.toBeBilled")}</span>
                  </MaCheckbox>
                  {customFields && customFields.length > 0 && (
                    <div>
                      {customFields.map((field, index) => (
                        <div
                          style={{ paddingTop: "8px", paddingBottom: "8px" }}
                          key={field.id}
                        >
                          <CustomFields
                            field={field}
                            index={index}
                            data={customFields}
                            setData={(value) => setCustomFields(value)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </MaGridRow>
          </MaGrid>
        </MaDrawerContent>
        <MaDrawerFooter>
          <MaButton
            fillStyle={MasraffFillStyle.Ghost}
            colorType={MasraffColorType.Neutral}
            onMaClick={() => changeStatus(false)}
          >
            {t("labels.cancel")}
          </MaButton>
          <MaButton
            fillStyle={MasraffFillStyle.Solid}
            colorType={MasraffColorType.Primary}
            onMaClick={divideCurrentExpense}
          >
            {t("labels.divide")}
          </MaButton>
        </MaDrawerFooter>
      </MaDrawer>
    </>
  );
}
