"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useUserState } from "@/context/user";
import {
  changeExchangeRate,
  deleteExpense,
  divideExpense,
  getExpenseCategoryData,
  getUserOhpCodeDataList,
  saveExpense,
  updateExpense,
} from "@/app/api/expense";
import DataTable from "../DataTable";
import ExpenseDividerDrawer from "./ExpenseDividerDrawer";
import Dropdown from "@/components/Dropdown";
import {
  MaInputCustomEvent,
  MasraffColorType,
  MasraffFillStyle,
} from "@fabrikant-masraff/masraff-core";
import {
  MaButton,
  MaCheckbox,
  MaDateInput,
  MaDialog,
  MaDialogContent,
  MaDialogFooter,
  MaDialogHeader,
  MaDrawer,
  MaDrawerContent,
  MaDrawerFooter,
  MaDrawerHeader,
  MaGrid,
  MaGridRow,
  MaInput,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import {
  filterObjectsByIdAndName,
  filterObjectsByIdAndValue,
  getFormattedExpenseData,
} from "@/utils/helpers";
import {
  availablePaymentMethods,
  currencyList,
  emptyExpense,
  taxPertangeList,
} from "@/utils/utils";
import { expenseColumnsSimplified } from "@/utils/data";

interface DrawerExpenseProps {
  isOpen: boolean;
  changeStatus(arg: boolean): void;
  data?: any;
}

export default function ExpenseDrawer({
  isOpen,
  changeStatus,
  data,
}: DrawerExpenseProps) {
  const { user } = useUserState();
  const { t } = useTranslation();
  const { userId, currency: userTargetCurrency, delegatedUserId } = user;
  const targetCurrency =
    userTargetCurrency &&
    currencyList.find(
      (currencyType) => currencyType.name === userTargetCurrency
    );
  const delegateUser =
    delegatedUserId && delegatedUserId !== "None"
      ? parseInt(delegatedUserId)
      : null;
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [openDivideModal, setOpenDivideModal] = useState(false);
  const [isDividerDrawerOpen, setDividerDrawerOpen] = useState(false);
  const isAddExpenseView = Object.keys(data).length === 0;
  const [selectedExpense, setSelectedExpense] = useState<Expense>(
    isAddExpenseView ? emptyExpense : JSON.parse(JSON.stringify(data))
  );
  const [dividedExpenseState, setDividedExpenseState] = useState<Expense[]>([
    JSON.parse(JSON.stringify(data)),
  ]);
  const [exchangeRateData, setExchangeRateData] = useState({
    SourceCurrency: selectedExpense.currency,
    TargetCurrency: targetCurrency?.id,
    RateDate: !selectedExpense.expenseDate
      ? new Date()
      : selectedExpense.expenseDate,
  });
  const {
    currencyRate,
    conversionAmount,
    currency: expenseCurrency,
    expenseDate,
  } = selectedExpense;

  const { data: ohpCodeQuery } = useQuery<OhpCodeData[]>({
    queryKey: ["ohpCode"],
    queryFn: async () => getUserOhpCodeDataList(false, userId),
  });

  let ohpCodeData: GenericObject[] = [];
  if (ohpCodeQuery) {
    let ohpCodeQueryTransformed = ohpCodeQuery.map((obj) => ({
      id: obj.id,
      name: obj.companyOhpCodeValue,
    }));
    ohpCodeData = filterObjectsByIdAndName(ohpCodeQueryTransformed);
  }
  const { data: expenseCategoryData } = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: async () => getExpenseCategoryData(),
  });
  let expenseCategories: GenericObject[] = [];
  if (expenseCategoryData)
    expenseCategories = filterObjectsByIdAndName(expenseCategoryData);

  /* const { data: customFieldsData } = useQuery<MasraffResponse>({
    queryKey: ["customFields"],
    queryFn: async () => fetchCustomFieldData(),
  }); */

  const handleCustomFieldsChange = (
    event: any,
    index: number,
    type: string = "not date"
  ) => {
    const tempExpense = { ...selectedExpense };
    if (type === "date") {
      if (
        JSON.stringify(event.target.value) ===
        JSON.stringify(
          new Date(selectedExpense.customFields[index].customValue)
        )
      )
        return;
      if (typeof event.target.value === "object") {
        let rawDate = event.target.value.toString();
        rawDate = new Date(event.target.value);
        const date = rawDate.toISOString();
        tempExpense.customFields[index].customValue = date;
      }
    } else {
      tempExpense.customFields[index].customValue = event.target.value;
    }
    setSelectedExpense(tempExpense);
  };

  const renderCustomFields = (field: any, index: number) => {
    const textOfCustomField = (
      <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
        {field.fieldName}
      </MaText>
    );
    let inputElement;
    switch (field.valueType) {
      case 0:
        inputElement = (
          <MaInput
            fullWidth
            onMaInput={(e) => handleCustomFieldsChange(e, index)}
            value={field.customValue ? String(field.customValue) : ""}
          />
        );
        break;
      case 1:
        inputElement = (
          <MaInput
            fullWidth
            value={field.customValue ? String(field.customValue) : ""}
            type="number"
            showInputError={false}
            onMaInput={(e) => handleCustomFieldsChange(e, index)}
          ></MaInput>
        );
        break;
      case 3:
        inputElement = (
          <div style={{ color: "Red" }}>
            {/* <MaDateInput
              fullWidth
              max={new Date()}
              value={
                !field.customValue ? undefined : new Date(field.customValue)
              }
              onMaDateChange={(e) => handleCustomFieldsChange(e, index, "date")}
              shouldCloseOnSelect
            /> */}
            After solving blocksfabrikk bug, date input will come here
          </div>
        );
        break;
      case 4:
        inputElement = (
          <Dropdown
            input={handleChange}
            placeholder={
              field.customValue ? String(field.customValue) : t("labels.select")
            }
            selectData={filterObjectsByIdAndValue(field.customFieldValues)}
            valueName="customField"
          />
        );
        break;
    }

    return (
      <div>
        {textOfCustomField}
        {inputElement}
      </div>
    );
  };

  const mutateExchangeRate = useMutation(changeExchangeRate, {
    onSuccess: (data: number) => {
      const tempExpense = { ...selectedExpense };
      const tempCurrencyRate = data;
      tempExpense.currencyRate = tempCurrencyRate;
      const tempconversionAmount = data * selectedExpense.amount;
      tempExpense.conversionAmount = tempconversionAmount;
      setSelectedExpense(tempExpense);
    },
  });

  const updateExpenseRecord = useMutation(updateExpense, {
    onSuccess: () => {
      changeStatus(false);
    },
  });

  const addExpense = () => {
    const tempExpense = { ...selectedExpense };
    //@ts-ignore
    tempExpense.user = user;
    tempExpense.userId = user.userId;
    saveExpense(tempExpense)
      .then(() => changeStatus(false))
      .catch(() => console.log("Saving expense error"));
  };

  const handleChange = (data: DropdownSelection) => {
    const tempExpense = { ...selectedExpense };
    if (data.name === "expenseTypeId") {
      const changedCategory = expenseCategoryData?.find(
        (category) => category.id === data.value
      );
      tempExpense.expenseType = changedCategory;
      tempExpense.expenseTypeId = changedCategory.id;
    }
    if (data.name === "taxPercentage") {
      tempExpense.taxAmount = (tempExpense.amount * data.value) / 100;
    }

    //@ts-ignore
    tempExpense[data.name] = data.value;
    setSelectedExpense(tempExpense);
  };

  const handleInputChange = (e: MaInputCustomEvent<any>, fields: string[]) => {
    const tempExpense = { ...selectedExpense };
    if (fields.includes("conversionAmount")) {
      const newConversion =
        parseFloat(e.target.value) * tempExpense.currencyRate;
      tempExpense["conversionAmount"] = newConversion;
      tempExpense["amount"] = parseFloat(e.target.value);
    } else {
      //@ts-ignore
      const isFieldNumber = typeof tempExpense[fields[0]] === "number";
      //@ts-ignore
      tempExpense[fields[0]] = isFieldNumber
        ? parseFloat(e.target.value)
        : e.target.value;
    }
    setSelectedExpense(tempExpense);
  };

  const handleDateChange = (event: any) => {
    const tempExpense = { ...selectedExpense };
    if (
      JSON.stringify(event.target.value) ===
      JSON.stringify(new Date(selectedExpense.expenseDate))
    )
      return;
    if (typeof event.target.value === "object") {
      let rawDate = event.target.value.toString();
      rawDate = new Date(event.target.value);
      const date = rawDate.toISOString();
      tempExpense.expenseDate = date;
      setSelectedExpense(tempExpense);
    }
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
    setExchangeRateData({
      SourceCurrency: expenseCurrency,
      TargetCurrency: targetCurrency?.id,
      RateDate: !expenseDate ? new Date() : expenseDate,
    });
  }, [expenseCurrency, targetCurrency, expenseDate]);

  useEffect(() => {
    if (exchangeRateData.SourceCurrency === exchangeRateData.TargetCurrency) {
      const tempExpense = { ...selectedExpense };
      tempExpense.currencyRate = 1;
      tempExpense.conversionAmount = selectedExpense.amount;
      setSelectedExpense(tempExpense);
    }
  }, []);

  return (
    <>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatus(false)}>
        <MaDrawerHeader>
          {isAddExpenseView ? t("labels.addExpense") : t("labels.editExpense")}
        </MaDrawerHeader>
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
                    !selectedExpense?.expenseType?.name
                      ? t("labels.select")
                      : selectedExpense?.expenseType?.name
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
                    selectedExpense.ohpCodeId
                      ? String(selectedExpense.ohpCodeId)
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
                  value={String(selectedExpense.amount)}
                  type="number"
                  showInputError={false}
                  onMaChange={(el) => {
                    handleInputChange(el, ["amount", "conversionAmount"]);
                  }}
                ></MaInput>
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.currency")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  placeholder={
                    selectedExpense.currencyText
                      ? String(selectedExpense.currencyText)
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
                    value={conversionAmount ? String(conversionAmount) : ""}
                  />
                </div>
                <MaText className="ma-display-flex ma-size-margin-top-8 ma-size-margin-bottom-8">
                  {t("labels.merchant")}
                </MaText>
                <MaInput
                  fullWidth
                  value={selectedExpense.merchant}
                  onMaChange={(el) => handleInputChange(el, ["merchant"])}
                ></MaInput>
                <MaText className="ma-display-flex ma-size-margin-top-8 ma-size-margin-bottom-8">
                  {t("labels.taxPercentage")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  placeholder={
                    selectedExpense.taxPercentage
                      ? String(selectedExpense.taxPercentage)
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
                    selectedExpense.taxAmount
                      ? String(selectedExpense.taxAmount)
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
                    selectedExpense.paymentMethod
                      ? String(selectedExpense.paymentMethod)
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
                    !selectedExpense.expenseDate
                      ? undefined
                      : new Date(selectedExpense.expenseDate)
                  }
                  onMaDateChange={handleDateChange}
                  required
                  shouldCloseOnSelect
                ></MaDateInput>
                <MaText className="ma-display-flex ma-size-margin-top-8 ma-size-margin-bottom-8">
                  {t("labels.description")}
                </MaText>
                <MaInput
                  className="ma-display-flex ma-size-margin-bottom-8"
                  fullWidth
                  value={selectedExpense.note}
                  onMaChange={(el) => handleInputChange(el, ["note"])}
                ></MaInput>
                <div className="ma-display-flex ma-display-flex-column">
                  <MaCheckbox
                    value={selectedExpense.reimbursable}
                    onMaChange={() =>
                      handleChange({
                        name: "reimbursable",
                        value: !selectedExpense.reimbursable,
                      })
                    }
                  >
                    <span>{t("labels.payable")}</span>
                  </MaCheckbox>
                  <MaCheckbox
                    value={selectedExpense.billable}
                    onMaChange={() =>
                      handleChange({
                        name: "billable",
                        value: !selectedExpense.billable,
                      })
                    }
                  >
                    <span>{t("labels.toBeBilled")}</span>
                  </MaCheckbox>
                  {selectedExpense.customFields?.length > 0 && (
                    <div>
                      {selectedExpense.customFields.map((field, index) => (
                        <div key={field.id}>
                          {renderCustomFields(field, index)}
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
          <div>
            <MaButton
              fillStyle={MasraffFillStyle.Ghost}
              colorType={MasraffColorType.Neutral}
              onMaClick={() => changeStatus(false)}
            >
              {t("labels.cancel")}
            </MaButton>
            {!isAddExpenseView && (
              <MaButton
                fillStyle={MasraffFillStyle.Ghost}
                colorType={MasraffColorType.Destructive}
                onMaClick={() => setDeleteModalOpen(true)}
              >
                {t("labels.delete")}
              </MaButton>
            )}
          </div>
          {selectedExpense.id ? (
            <div className="ma-display-flex">
              <MaButton
                className="ma-display-flex ma-size-margin-right-8"
                fillStyle={MasraffFillStyle.Solid}
                colorType={MasraffColorType.Constructive}
                onMaClick={() => setOpenDivideModal(true)}
              >
                {t("labels.divideExpense")}
              </MaButton>
              <MaButton
                fillStyle={MasraffFillStyle.Solid}
                colorType={MasraffColorType.Primary}
                onMaClick={() => {
                  updateExpenseRecord.mutate(selectedExpense);
                }}
              >
                {t("labels.update")}
              </MaButton>
            </div>
          ) : (
            <MaButton
              fillStyle={MasraffFillStyle.Solid}
              colorType={MasraffColorType.Primary}
              onMaClick={addExpense}
            >
              {t("labels.save")}
            </MaButton>
          )}
        </MaDrawerFooter>
        {isDeleteModalOpen && (
          <MaDialog isOpen={isDeleteModalOpen}>
            <MaDialogContent>
              <div>{`${selectedExpense.id} id'li masrafı silmek istediğinize emin misiniz?`}</div>
            </MaDialogContent>
            <MaDialogFooter>
              <div></div>
              <div>
                <MaButton
                  fillStyle={MasraffFillStyle.Ghost}
                  colorType={MasraffColorType.Neutral}
                  onMaClick={() => setDeleteModalOpen(false)}
                >
                  {t("labels.cancel")}
                </MaButton>
                <MaButton
                  fillStyle={MasraffFillStyle.Ghost}
                  colorType={MasraffColorType.Destructive}
                  onMaClick={() => {
                    deleteExpense(selectedExpense.id, delegateUser);
                    setDeleteModalOpen(false);
                    changeStatus(false);
                  }}
                >
                  {t("labels.delete")}
                </MaButton>
              </div>
            </MaDialogFooter>
          </MaDialog>
        )}
        {openDivideModal && (
          <MaDialog isOpen={openDivideModal}>
            <MaDialogHeader>{t("labels.divideExpense")}</MaDialogHeader>
            <MaDialogContent>
              <div style={{ marginTop: "25px", maxWidth: "600px" }}>
                <DataTable
                  data={getFormattedExpenseData(dividedExpenseState)}
                  column={expenseColumnsSimplified}
                  isInteractive={false}
                />
              </div>
            </MaDialogContent>
            <MaDialogFooter>
              <MaButton
                fillStyle={MasraffFillStyle.Ghost}
                colorType={MasraffColorType.Neutral}
                onMaClick={() => setDividerDrawerOpen(true)}
              >
                {t("labels.add")}
              </MaButton>
              <MaButton
                fillStyle={MasraffFillStyle.Ghost}
                colorType={MasraffColorType.Primary}
                disabled={dividedExpenseState.length === 1}
                onMaClick={() => {
                  divideExpense(dividedExpenseState, delegatedUserId);
                  changeStatus(false);
                }}
              >
                {t("labels.save")}
              </MaButton>
            </MaDialogFooter>
          </MaDialog>
        )}
        {isDividerDrawerOpen && (
          <ExpenseDividerDrawer
            isOpen={isDividerDrawerOpen}
            changeStatus={(status) => setDividerDrawerOpen(status)}
            dividedExpenseState={dividedExpenseState}
            setDividedExpenseState={setDividedExpenseState}
          />
        )}
      </MaDrawer>
    </>
  );
}
