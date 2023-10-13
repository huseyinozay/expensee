import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUserState } from "@/context/user";
import { useQuery } from "@tanstack/react-query";
import {
  CustomReportForm,
  DropdownSelection,
  GenericObject,
  OhpCodeData,
  TripReport,
} from "@/utils/types";
import { getCustomReportForm } from "@/app/api/expenseCustomReport";
import { getUserOhpCodeDataList } from "@/app/api/expense";
import { filterObjectsByIdAndName, statusTagPicker } from "@/utils/helpers";
import {
  MaButton,
  MaContainer,
  MaDateInput,
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
  MaDateInputCustomEvent,
  MasraffColorName,
  MasraffColorShadeName,
  MasraffColorType,
  MasraffFillStyle,
  MasraffIconNames,
  MasraffSize,
} from "@fabrikant-masraff/masraff-core";
import {
  currencyList,
  emptyCustomReportForm,
  maxDate,
  minDate,
  tripReportCategories,
} from "@/utils/utils";
import Dropdown from "../Dropdown";

interface DrawerTripReportProps {
  isOpen: boolean;
  changeStatus(arg: boolean): void;
  data?: any;
}

export default function TripReportDrawer({
  isOpen,
  changeStatus,
  data,
}: DrawerTripReportProps) {
  const { user } = useUserState();
  const { userId } = user;
  const { t } = useTranslation();
  const { id: formId } = data;
  const inputRef = useRef<
    | HTMLMaInputElement
    | HTMLMaNumericInputElement
    | HTMLMaSelectElement
    | HTMLMaDateInputElement
    | null
  >(null);
  const hasSetInitialData = useRef(false);

  const [editing, setIsEditing] = useState<any | undefined>(undefined);

  const isAddReportView = Object.keys(data).length === 0;
  const textBlockClassname =
    "ma-display-flex ma-body-text-weight-semibold ma-size-margin-bottom-8 ma-size-margin-top-8";

  const { data: customReportForm, status } = useQuery<CustomReportForm>({
    queryKey: ["customForm"],
    staleTime: Infinity,
    queryFn: async () => getCustomReportForm(formId),
  });

  const [selectedTripReport, setSelectedTripReport] =
    useState<CustomReportForm>(emptyCustomReportForm);
  const [isTripReportFetched, setTripReportFetched] = useState(false);

  const { data: ohpCodeQuery } = useQuery<OhpCodeData[]>({
    queryKey: ["ohpCode"],
    staleTime: Infinity,
    queryFn: async () => getUserOhpCodeDataList(false, userId),
  });
  let ohpCodeData: GenericObject[] = [];
  if (ohpCodeQuery) {
    ohpCodeData = ohpCodeQuery.map((obj) => ({
      id: obj.companyOhpCodeId,
      name: obj.companyOhpCodeValue,
    }));
  }

  const expenseCenterFinder = () => {
    if (!selectedTripReport.report.ohpCodeId) {
      return t("labels.select");
    }

    const companyOhpCode = ohpCodeData.find(
      (ohpCode) => ohpCode.id === selectedTripReport.report.ohpCodeId
    );

    return companyOhpCode ? companyOhpCode.name : t("labels.select");
  };

  const organizationCenterFinder = () => {
    if (!selectedTripReport.report.subCompanyId) {
      return t("labels.select");
    }

    const companyOrgPlace = selectedTripReport.userBySubCompyList.find(
      (company) => company.id === selectedTripReport.report.subCompanyId
    );

    return companyOrgPlace ? companyOrgPlace.name : t("labels.select");
  };

  function renderField(key: string, value: any, isFullWidth = true) {
    if (key.includes("date") || key.includes("Date")) {
      return (
        <React.Fragment key={key}>
          <MaText className={textBlockClassname}>{t(`labels.${key}`)}</MaText>
          <MaDateInput
            id={key}
            fillStyle={MasraffFillStyle.Solid}
            fullWidth
            size={MasraffSize.Normal}
            max={maxDate}
            min={minDate}
            onMaBlur={() => {
              if (editing) {
                setIsEditing(!editing);
              }
            }}
            value={(value as any) ? new Date(value as any) : undefined}
            resizeWithText
            placeholder={value ? "" : "DD/MM/YYYY"}
            ref={inputRef as any}
            onMaDateChange={(el) => {
              handleDateChange(el, key);
            }}
            onMaKeyDown={(e) => {
              const keyPress = e.detail.key;
              if (keyPress === "Enter" || keyPress === "Escape") {
                e.target.blurElement();
              }
            }}
            shouldCloseOnSelect
          />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment key={key}>
        <MaText className={textBlockClassname}>{t(`labels.${key}`)}</MaText>
        <MaInput
          fullWidth
          resizeWithText
          fillStyle={MasraffFillStyle.Solid}
          ref={inputRef as any}
          value={value || ""}
          placeholder={value ? "" : ". . ."}
          showInputError={false}
          onMaChange={(el) => {
            handleInputChange(el, [key]);
          }}
          onMaKeyDown={(e) => {
            const keyPress = e.detail.key;
            if (keyPress === "Enter" || keyPress === "Escape") {
              e.target.blurElement();
            }
          }}
          onMaBlur={() => {
            if (editing) {
              setIsEditing(!editing);
            }
          }}
        />
      </React.Fragment>
    );
  }

  const handleInputChange = (
    e: any,
    fieldsOrKey: string | string[],
    isNumeric = false
  ) => {
    const newValue = isNumeric
      ? parseFloat(e.target.value)
      : fieldsOrKey.includes("date") || fieldsOrKey.includes("Date")
      ? e.detail
      : e.target.value;

    const tempAdvanceReport = { ...selectedTripReport };
    const actualFields = Array.isArray(fieldsOrKey)
      ? fieldsOrKey
      : [fieldsOrKey];

    if (actualFields.includes("conversionAmount")) {
      const newConversion =
        newValue * tempAdvanceReport.report.advanceReport.currencyRate;
      tempAdvanceReport.report.advanceReport.conversionAmount = newConversion;
      tempAdvanceReport.report.totalAmount = newValue;
    } else {
      //@ts-ignore
      tempAdvanceReport.report.tripReport[actualFields[0]] = newValue;
    }

    setSelectedTripReport(tempAdvanceReport);
  };

  const handleDateChange = (
    el: MaDateInputCustomEvent<Date | undefined>,
    field: string
  ) => {
    const tempTripReport = { ...selectedTripReport };
    //@ts-ignore
    tempTripReport.report.tripReport[field] = el.target.value;
    setSelectedTripReport(tempTripReport);
  };

  const handleChange = (data: DropdownSelection) => {
    setSelectedTripReport((prevState) => ({
      ...prevState,
      report: {
        ...prevState.report,
        [data.name]: data.value,
      },
    }));
  };

  useEffect(() => {
    if (status === "success" && !hasSetInitialData.current) {
      setSelectedTripReport(JSON.parse(JSON.stringify(customReportForm)));
      setTripReportFetched(true);
      hasSetInitialData.current = true;
    }
  }, [customReportForm, status]);

  /*  useEffect(() => {
    console.log("selected trip report change::", selectedTripReport);
  }, [selectedTripReport]); */

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
          <span>{selectedTripReport.report.id}</span>
          <MaTag
            colorType={statusTagPicker(selectedTripReport.report.statusText)}
          >
            {selectedTripReport.report.statusText}
          </MaTag>
        </MaContainer>
      </MaDrawerHeader>
      <MaDrawerContent>
        <MaGrid>
          <MaGridRow>
            <form>
              <MaText className={textBlockClassname}>
                {t("labels.reportName")}
              </MaText>
              <MaInput
                fullWidth
                resizeWithText
                fillStyle={MasraffFillStyle.Solid}
                ref={inputRef as any}
                value={selectedTripReport.report.name}
                placeholder={
                  selectedTripReport.report.name ? "" : t("labels.reportName")
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
              <MaText className={textBlockClassname}>
                {t("labels.organizationPlace")}
              </MaText>
              <Dropdown
                input={handleChange}
                placeholder={organizationCenterFinder()}
                selectData={filterObjectsByIdAndName(
                  selectedTripReport.userBySubCompyList
                )}
                valueName="subCompanyId"
              />
              <MaText className={textBlockClassname}>
                {t("labels.expenseCenter")}
              </MaText>
              <Dropdown
                input={handleChange}
                placeholder={expenseCenterFinder()}
                selectData={ohpCodeData}
                valueName="ohpCodeId"
              />
              <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                {t("labels.advanceAmount")}
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
                  selectedTripReport.report.totalAmount
                    ? String(selectedTripReport.report.totalAmount)
                    : ""
                }
                ref={inputRef as any}
                value={selectedTripReport.report.totalAmount}
                resizeWithText
                onMaChange={(el) => {
                  handleInputChange(el, ["totalAmount"], true);
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
                  selectedTripReport.report.currencyText
                    ? String(selectedTripReport.report.currencyText)
                    : ""
                }
                selectData={currencyList}
                valueName="currency"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  marginTop: "8px",
                }}
              >
                {tripReportCategories.map((category) => {
                  const numOfFields = category.fields.length;
                  return (
                    <MaContainer
                      fullWidth
                      elevation="one"
                      direction="column"
                      borderRadius={6}
                      padding={8}
                      key={category.title}
                    >
                      <MaContainer
                        style={{ marginBottom: "16px" }}
                        width={"20%"}
                      >
                        <MaTag colorType={MasraffColorType.Primary}>
                          {t(`labels.${category.title}`)}
                        </MaTag>
                      </MaContainer>
                      <MaContainer fullWidth>
                        {numOfFields > 3 ? (
                          <MaContainer fullWidth direction="column">
                            <MaContainer verticalGap={8} fullWidth>
                              {category.fields.slice(0, 3).map((field) => {
                                const value =
                                  selectedTripReport.report.tripReport[
                                    field as keyof typeof selectedTripReport.report.tripReport
                                  ];
                                return (
                                  <MaContainer
                                    className="ma-display-flex-justify-content-spacebetween"
                                    style={{ height: "90px" }}
                                    direction="column"
                                    width={"32%"}
                                    key={field}
                                  >
                                    {renderField(field, value, false)}
                                  </MaContainer>
                                );
                              })}
                            </MaContainer>
                            <MaContainer verticalGap={8} fullWidth>
                              {category.fields
                                .slice(-(numOfFields - 3))
                                .map((field) => {
                                  const value =
                                    selectedTripReport.report.tripReport[
                                      field as keyof typeof selectedTripReport.report.tripReport
                                    ];
                                  return (
                                    <MaContainer
                                      className="ma-display-flex-justify-content-spacebetween"
                                      style={{ height: "90px" }}
                                      direction="column"
                                      width={"32%"}
                                      key={field}
                                    >
                                      {renderField(field, value, false)}
                                    </MaContainer>
                                  );
                                })}
                            </MaContainer>
                          </MaContainer>
                        ) : (
                          <MaContainer verticalGap={8} fullWidth>
                            {category.fields.map((field) => {
                              const value =
                                selectedTripReport.report.tripReport[
                                  field as keyof typeof selectedTripReport.report.tripReport
                                ];
                              return (
                                <MaContainer
                                  direction="column"
                                  width={`${98 / numOfFields}%`}
                                  key={field}
                                >
                                  {renderField(field, value, false)}
                                </MaContainer>
                              );
                            })}
                          </MaContainer>
                        )}
                      </MaContainer>
                    </MaContainer>
                  );
                })}

                {isTripReportFetched && (
                  <>
                    {Object.entries(selectedTripReport.report.tripReport)
                      .filter(
                        ([key, value]) =>
                          !tripReportCategories
                            .flatMap((category) => category.fields)
                            .includes(key) &&
                          typeof value !== "number" &&
                          typeof value !== "boolean"
                      )
                      .map(([key, value]) => renderField(key, value))}
                  </>
                )}
              </div>
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
            onMaClick={() => console.log("mutate update trip report")}
          >
            {t("labels.update")}
          </MaButton>
        )}
      </MaDrawerFooter>
    </MaDrawer>
  );
}
