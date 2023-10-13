"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUserState } from "@/context/user";
import {
  getCustomReportForm,
  updateCustomReport,
} from "@/app/api/expenseCustomReport";
import { changeExchangeRate, getUserOhpCodeDataList } from "@/app/api/expense";
import Dropdown from "../Dropdown";
import {
  MasraffColorName,
  MasraffColorShadeName,
  MasraffColorType,
  MasraffFillStyle,
  MasraffIconNames,
} from "@fabrikant-masraff/masraff-core";
import {
  MaButton,
  MaContainer,
  MaDrawer,
  MaDrawerContent,
  MaDrawerFooter,
  MaDrawerHeader,
  MaGrid,
  MaGridRow,
  MaIcon,
  MaInput,
  MaNumericInput,
  MaTag,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import {
  filterObjectsByIdAndName,
  getSelectedItemName,
  statusTagPicker,
} from "@/utils/helpers";
import {
  CustomReportForm,
  DropdownSelection,
  GenericObject,
  OhpCodeData,
} from "@/utils/types";
import { currencyList, emptyCustomReportForm } from "@/utils/utils";

interface DrawerAdvanceReportProps {
  isOpen: boolean;
  changeStatus(arg: boolean): void;
  data?: any;
}

export default function AdvanceReportDrawer({
  isOpen,
  changeStatus,
  data,
}: DrawerAdvanceReportProps) {
  const { user } = useUserState();
  const { userId, currency: userTargetCurrency } = user;
  const { t } = useTranslation();

  const isAddReportView = Object.keys(data).length === 0;
  const { id: formId } = data;
  const targetCurrency =
    userTargetCurrency &&
    currencyList.find(
      (currencyType) => currencyType.name === userTargetCurrency
    );

  const [editing, setIsEditing] = useState<any | undefined>(undefined);

  const inputRef = useRef<
    HTMLMaInputElement | HTMLMaNumericInputElement | HTMLMaSelectElement | null
  >(null);

  const { data: customReportForm, status } = useQuery<CustomReportForm>({
    queryKey: ["customForm"],
    queryFn: async () => getCustomReportForm(formId),
  });

  const [selectedAdvanceReport, setSelectedAdvanceReport] =
    useState<CustomReportForm>(emptyCustomReportForm);

  const [exchangeRateData, setExchangeRateData] = useState({
    SourceCurrency: selectedAdvanceReport.report.currency,
    TargetCurrency: targetCurrency?.id,
    RateDate: new Date(),
  });

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

  const mutateExchangeRate = useMutation(changeExchangeRate, {
    onSuccess: (data: number) => {
      const tempAdvanceReport = { ...selectedAdvanceReport };
      const tempCurrencyRate = data;
      tempAdvanceReport.report.advanceReport.currencyRate = tempCurrencyRate;
      const tempConversionAmount =
        data * selectedAdvanceReport.report.totalAmount;
      tempAdvanceReport.report.advanceReport.conversionAmount =
        tempConversionAmount;
      setSelectedAdvanceReport(tempAdvanceReport);
    },
  });

  const updateAdvanceReportRecord = useMutation(updateCustomReport, {
    onSuccess: () => {
      changeStatus(false);
    },
  });

  const handleInputChange = (e: any, fields: string[], isNumeric = false) => {
    const newValue = isNumeric ? parseFloat(e.target.value) : e.target.value;

    const tempAdvanceReport = { ...selectedAdvanceReport };
    if (fields.includes("conversionAmount")) {
      const newConversion =
        newValue * tempAdvanceReport.report.advanceReport.currencyRate;
      tempAdvanceReport.report.advanceReport.conversionAmount = newConversion;
      tempAdvanceReport.report.totalAmount = newValue;
    } else {
      //@ts-ignore
      tempAdvanceReport.report[fields[0]] = newValue;
    }

    setSelectedAdvanceReport(tempAdvanceReport);
  };

  const handleChange = (data: DropdownSelection) => {
    setSelectedAdvanceReport((prevState) => ({
      ...prevState,
      report: {
        ...prevState.report,
        [data.name]: data.value,
      },
    }));
  };

  useEffect(() => {
    if (selectedAdvanceReport.report.name === "" && status === "success") {
      setSelectedAdvanceReport(JSON.parse(JSON.stringify(customReportForm)));
    }
  }, [customReportForm]);

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
    if (exchangeRateData.SourceCurrency === exchangeRateData.TargetCurrency) {
      const tempAdvanceReport = { ...selectedAdvanceReport };
      tempAdvanceReport.report.advanceReport.currencyRate = 1;
      tempAdvanceReport.report.advanceReport.conversionAmount =
        selectedAdvanceReport.report.totalAmount;
      setSelectedAdvanceReport(tempAdvanceReport);
    }
  }, []);

  useEffect(() => {
    setExchangeRateData({
      SourceCurrency: selectedAdvanceReport.report.currency,
      TargetCurrency: targetCurrency?.id,
      RateDate: new Date(),
    });
  }, [selectedAdvanceReport.report.currency, targetCurrency]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focusElement();
    }
  }, [editing]);

  return (
    <MaDrawer isOpen={isOpen} onMaClose={() => changeStatus(false)}>
      <MaDrawerHeader>
        {isAddReportView
          ? t("labels.newAdvanceReport")
          : t("labels.editAdvanceReport")}
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
              iconName={MasraffIconNames.Card}
            />
          </MaContainer>
          <span>{selectedAdvanceReport.report.id}</span>
          <MaTag
            colorType={statusTagPicker(selectedAdvanceReport.report.statusText)}
          >
            {selectedAdvanceReport.report.statusText}
          </MaTag>
        </MaContainer>
      </MaDrawerHeader>
      <MaDrawerContent>
        <MaGrid>
          <MaGridRow>
            <form>
              <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                {t("labels.reportName")}
              </MaText>
              <MaInput
                fullWidth
                resizeWithText
                fillStyle={MasraffFillStyle.Solid}
                ref={inputRef as any}
                value={selectedAdvanceReport.report.name}
                placeholder={
                  selectedAdvanceReport.report.name
                    ? ""
                    : t("labels.reportName")
                }
                showInputError={false}
                onMaChange={(el) => {
                  handleInputChange(el, ["name"]);
                }}
                onMaKeyDown={(e) => {
                  const key = e.detail.key;
                  if (key === "Enter" || key === "Escape") {
                    e.target.blurElement();
                  }
                }}
                onMaBlur={() => {
                  if (editing) {
                    setIsEditing(!editing);
                  }
                }}
              />
              <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                {t("labels.organizationPlace")}
              </MaText>
              <Dropdown
                input={handleChange}
                placeholder={
                  selectedAdvanceReport.report.ohpCodeId
                    ? getSelectedItemName(
                        selectedAdvanceReport.report.ohpCodeId,
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
              <MaNumericInput
                fullWidth
                fillStyle={MasraffFillStyle.Solid}
                onMaBlur={() => {
                  if (editing) {
                    setIsEditing(!editing);
                  }
                }}
                placeholder={
                  selectedAdvanceReport.report.totalAmount
                    ? String(selectedAdvanceReport.report.totalAmount)
                    : ""
                }
                ref={inputRef as any}
                value={selectedAdvanceReport.report.totalAmount}
                resizeWithText
                onMaChange={(el) => {
                  handleInputChange(
                    el,
                    ["totalAmount", "conversionAmount"],
                    true
                  );
                }}
                onMaKeyDown={(e) => {
                  const key = e.detail.key;
                  if (key === "Enter" || key === "Escape") {
                    e.target.blurElement();
                  }
                }}
              />
              <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                {t("labels.currency")}
              </MaText>
              <Dropdown
                input={handleChange}
                placeholder={
                  selectedAdvanceReport.report.currencyText
                    ? String(selectedAdvanceReport.report.currencyText)
                    : ""
                }
                selectData={currencyList}
                valueName="currency"
              />
              <div className="ma-display-flex ma-display-flex-row ma-size-margin-top-16 ma-size-margin-bottom-16">
                <MaText className="ma-display-flex ma-display-flex-align-items-center ma-size-margin-right-8">
                  {t("labels.currencyRate")}
                </MaText>
                <MaInput
                  value={String(
                    selectedAdvanceReport.report.advanceReport.currencyRate
                  )}
                />
                <MaText className="ma-display-flex ma-display-flex-row ma-display-flex-align-items-center ma-size-margin-right-8 ma-size-margin-left-8">
                  To {targetCurrency?.name}
                </MaText>
                <MaInput
                  readonly
                  value={
                    selectedAdvanceReport.report.advanceReport.conversionAmount
                      ? String(
                          selectedAdvanceReport.report.advanceReport
                            .conversionAmount
                        )
                      : ""
                  }
                />
              </div>
              <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                {t("labels.description")}
              </MaText>
              <MaInput
                fullWidth
                resizeWithText
                fillStyle={MasraffFillStyle.Solid}
                ref={inputRef as any}
                value={selectedAdvanceReport.report.description}
                placeholder={
                  selectedAdvanceReport.report.description
                    ? ""
                    : t("labels.description")
                }
                showInputError={false}
                onMaChange={(el) => {
                  handleInputChange(el, ["description"]);
                }}
                onMaKeyDown={(e) => {
                  const key = e.detail.key;
                  if (key === "Enter" || key === "Escape") {
                    e.target.blurElement();
                  }
                }}
                onMaBlur={() => {
                  if (editing) {
                    setIsEditing(!editing);
                  }
                }}
              />
            </form>
          </MaGridRow>
        </MaGrid>
      </MaDrawerContent>
      <MaDrawerFooter>
        <MaButton
          fillStyle={MasraffFillStyle.Solid}
          colorType={MasraffColorType.Neutral}
          onMaClick={() => changeStatus(false)}
        >
          {t("labels.cancel")}
        </MaButton>
        {isAddReportView ? (
          <MaButton
            fillStyle={MasraffFillStyle.Solid}
            colorType={MasraffColorType.Primary}
            onMaClick={() => {}}
          >
            {t("labels.save")}
          </MaButton>
        ) : (
          <MaButton
            fillStyle={MasraffFillStyle.Solid}
            colorType={MasraffColorType.Primary}
            onMaClick={() =>
              updateAdvanceReportRecord.mutate(selectedAdvanceReport.report)
            }
          >
            {t("labels.update")}
          </MaButton>
        )}
      </MaDrawerFooter>
    </MaDrawer>
  );
}
