"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useUserState } from "@/context/user";
import {
  changeExchangeRate,
  deleteExpense,
  divideExpense,
  fetchCustomFieldData,
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
  MasraffColorName,
  MasraffColorShadeName,
  MasraffColorType,
  MasraffFillStyle,
  MasraffIconNames,
  MasraffInputErrorTypes,
  MasraffSize,
} from "@fabrikant-masraff/masraff-core";
import {
  MaAvatar,
  MaButton,
  MaCheckbox,
  MaContainer,
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
  MaIcon,
  MaInput,
  MaLink,
  MaSeparator,
  MaTag,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import {
  filterObjectsByIdAndName,
  filterObjectsByIdAndValue,
  getFormattedExpenseData,
  getIconForExpense,
  getSelectedItemName,
  statusTagPicker,
} from "@/utils/helpers";
import {
  availablePaymentMethods,
  currencyList,
  emptyExpense,
  expenseStatus,
  taxPertangeList,
} from "@/utils/utils";
import { expenseColumnsSimplified } from "@/utils/data";
import { CustomFields } from "../CustomFields";
import { BlobImage } from "../BlobImage";
import i18n from "@/i18/i18";
import {
  DropdownSelection,
  Expense,
  GenericObject,
  MasraffResponse,
  OhpCodeData,
} from "@/utils/types";

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

  const processedDefaultRef = useRef(false);
  const hasSetCustomFields = useRef(false);

  const {
    currencyRate,
    conversionAmount,
    currency: expenseCurrency,
    expenseDate,
    customFields: initialCustomFields,
    guid,
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

  const { data: customFieldsData, status } = useQuery<MasraffResponse>({
    queryKey: ["customFields"],
    queryFn: async () => fetchCustomFieldData(),
  });

  const [customFields, setCustomFields] = useState<any[]>([]);

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
      tempExpense.taxAmount =
        (tempExpense.amount * data.value) / (100 + data.value);
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
    if (status === "success" && !hasSetCustomFields.current) {
      if (
        isAddExpenseView &&
        customFieldsData &&
        customFieldsData.results.length > 0
      ) {
        setCustomFields(customFieldsData.results);
        hasSetCustomFields.current = true;
      } else {
        setCustomFields(JSON.parse(JSON.stringify(initialCustomFields)));
        hasSetCustomFields.current = true;
      }
    }
  }, [customFieldsData]);

  useEffect(() => {
    if (hasSetCustomFields.current) {
      setSelectedExpense((prevState) => ({
        ...prevState,
        customFields: customFields,
      }));
    }
  }, [customFields]);

  useEffect(() => {
    if (ohpCodeQuery && !processedDefaultRef.current) {
      const defaultOhpCode = ohpCodeQuery.find((item) => item.isDefault);
      if (defaultOhpCode) {
        setSelectedExpense((prevState) => ({
          ...prevState,
          ohpCodeId: defaultOhpCode.id,
        }));
        const tempDividedExpenseState = [...dividedExpenseState];
        tempDividedExpenseState[0].ohpCodeId = defaultOhpCode.id;
        setDividedExpenseState(tempDividedExpenseState);
        processedDefaultRef.current = true;
      }
    }
  }, [ohpCodeQuery]);

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
          <MaContainer
            horizontalAlignment="left"
            verticalAlignment="center"
            horizontalGap={8}
          >
            <MaContainer
              padding={4}
              borderRadius={6}
              backgroundColor={{
                color: MasraffColorName.Mustard,
                shadeName: MasraffColorShadeName.Lightest,
              }}
            >
              <MaIcon
                size={16}
                color={MasraffColorName.Mustard}
                shadeName={MasraffColorShadeName.Darkest}
                iconName={getIconForExpense(selectedExpense.expenseType.name)}
              />
            </MaContainer>
            <span>{selectedExpense.id}</span>
            <MaTag
              colorType={statusTagPicker(expenseStatus[selectedExpense.status])}
            >
              {expenseStatus[selectedExpense.status]}
            </MaTag>
          </MaContainer>
        </MaDrawerHeader>

        <MaDrawerContent>
          <MaContainer
            fullWidth={true}
            elevation="one"
            borderRadius={6}
            padding={4}
          >
            <MaContainer direction="column" verticalGap={8} width={"20%"}>
              <h6>{t("labels.expenseNo")}</h6>
              <MaContainer horizontalGap={8}>
                <MaContainer
                  padding={4}
                  borderRadius={6}
                  backgroundColor={{
                    color: MasraffColorName.Verdigris,
                    shadeName: MasraffColorShadeName.Lightest,
                  }}
                >
                  <MaIcon
                    size={16}
                    color={MasraffColorName.Verdigris}
                    shadeName={MasraffColorShadeName.Darkest}
                    iconName={MasraffIconNames.Document}
                  />
                </MaContainer>
                <MaLink>{selectedExpense.id}</MaLink>
              </MaContainer>
            </MaContainer>
            <MaContainer direction="column" verticalGap={8} width={"20%"}>
              <h6>{t("labels.user")}</h6>
              {selectedExpense.user && (
                <MaContainer horizontalGap={8}>
                  <MaAvatar
                    size={MasraffSize.Small}
                    firstName={selectedExpense.user.firstName.split(" ")[0]}
                    lastName={selectedExpense.user.lastName.split(" ")[1]}
                    userId="1234567asdasd"
                  />
                  <MaLink>
                    {selectedExpense.user.firstName +
                      " " +
                      selectedExpense.user.lastName}
                  </MaLink>
                </MaContainer>
              )}
            </MaContainer>
            <MaContainer direction="column" verticalGap={8} width={"20%"}>
              <h6>{t("labels.expenseDate")}</h6>
              <span>
                {new Date(selectedExpense.expenseDate).toLocaleDateString(
                  "tr-TR"
                )}
              </span>
            </MaContainer>
            <MaContainer direction="column" verticalGap={8} width={"20%"}>
              <h6>{t("labels.amount")}</h6>
              <span>
                {selectedExpense.amount} {selectedExpense.currencyText}
              </span>
            </MaContainer>
            <MaContainer
              direction="column"
              verticalGap={8}
              width={"20%"}
              className="ma-display-flex-justify-content-center ma-size-padding-bottom-16"
            >
              {guid && <BlobImage file={`${guid}.jpg`} />}
            </MaContainer>
          </MaContainer>

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
                      ? getSelectedItemName(
                          selectedExpense.ohpCodeId,
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
                  value={String(selectedExpense.amount)}
                  type="number"
                  showInputError={MasraffInputErrorTypes.Tooltip}
                  onMaChange={(el) => {
                    handleInputChange(el, ["amount", "conversionAmount"]);
                  }}
                  required
                  validations={{
                    ValueMissing: {
                      checkValidity: (value) => value,
                      errorMessage: "Custom message",
                    },
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
                      ? getSelectedItemName(
                          selectedExpense.paymentMethod,
                          availablePaymentMethods
                        )
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
                  validations={{
                    ValueMissing: {
                      checkValidity: (value) => value,
                      errorMessage: "Custom message",
                    },
                  }}
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
          <MaDialog
            isOpen={isDeleteModalOpen}
            onMaClose={() => setDeleteModalOpen(false)}
          >
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
            ohpCodeData={ohpCodeData}
          />
        )}
      </MaDrawer>
    </>
  );
}
