"use client";

import {
  MaInputCustomEvent,
  MasraffColorType,
  MasraffFillStyle,
} from "@fabrikant-masraff/masraff-core";
import {
  MaButton,
  MaDrawer,
  MaDrawerContent,
  MaDrawerFooter,
  MaDrawerHeader,
  MaGrid,
  MaGridRow,
  MaInput,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Dropdown from "@/components/Dropdown";
import { allReadyExpenseColumns } from "@/utils/data";
import DataTable from "@/components/DataTable";
import { emptyExpenseReport } from "@/utils/utils";
import { filterObjectsByIdAndName } from "@/utils/helpers";
import {
  getAlreadyExpenses,
  getUserAdvanceReport,
  getUserSubCompanies,
  getUserTripReport,
  saveExpenseReport,
  updateExpenseReport,
} from "@/app/api/expenseReport";
import { useUserState } from "@/context/user";

interface ExpenseReportDrawerProps {
  isOpen: boolean;
  changeStatus(arg: boolean): void;
  data?: any;
}

export default function ExpenseReportDrawer({
  isOpen,
  changeStatus,
  data,
}: ExpenseReportDrawerProps) {
  const { user } = useUserState();
  const { t } = useTranslation();
  const { userId } = data;
  const { delegatedUserId } = user;
  const delegateUser =
    delegatedUserId && delegatedUserId !== "None"
      ? parseInt(delegatedUserId)
      : null;
  const isAddExpenseReportView = Object.keys(data).length === 0;
  const [selectedExpenseReport, setSelectedExpenseReport] =
    useState<ExpenseReport>(
      isAddExpenseReportView
        ? emptyExpenseReport
        : JSON.parse(JSON.stringify(data))
    );
  const [userAdvanceReport, setUserAdvanceReport] = useState<AdvanceReport[]>(
    []
  );
  const [userTripReport, setUserTripReport] = useState<TripReport>({
    userTripReportList: [],
    isEnableForExpenseReport: false,
  });

  const { data: alreadyExpenseQuery } = useQuery({
    queryKey: ["expenses"],
    queryFn: getAlreadyExpenses,
  });

  /* const { data: expenseCategoryData } = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: async () => getExpenseCategoryData(),
  });
  let expenseCategories: GenericObject[] = [];
  if (expenseCategoryData)
    expenseCategories = filterObjectsByIdAndName(expenseCategoryData); */

  const { data: subCompaniesQuery } = useQuery<SubCompany[]>({
    queryKey: ["subCompanies"],
    queryFn: async () => getUserSubCompanies(userId),
  });

  let subCompanies: GenericObject[] = [];
  if (subCompaniesQuery)
    subCompanies = filterObjectsByIdAndName(subCompaniesQuery);
  const updateExpenseReportRecord = useMutation(updateExpenseReport, {
    onSuccess: () => {
      changeStatus(false);
    },
  });

  const addExpenseReport = () => {
    const tempExpenseReport = { ...selectedExpenseReport };
    tempExpenseReport.user = user;
    //@ts-ignore
    tempExpenseReport.user = user;
    saveExpenseReport(tempExpenseReport)
      .then(() => changeStatus(false))
      .catch(() => console.log("Saving expense report error"));
  };

  const handleChange = (data: DropdownSelection) => {
    const tempExpenseReport = { ...selectedExpenseReport };

    if (data.name === "subCompanyName") {
      const changedSubCompany = subCompaniesQuery?.find(
        (company) => company.id === data.value
      );
      if (changedSubCompany) {
        tempExpenseReport.subCompanyName = changedSubCompany.name;
        tempExpenseReport.subCompanyId = changedSubCompany.id;
      }
    } else {
      //@ts-ignore
      tempExpenseReport[data.name] = data.value;
    }

    setSelectedExpenseReport(tempExpenseReport);
  };

  const handleInputChange = (e: MaInputCustomEvent<any>, fields: string[]) => {
    const tempExpenseReport = { ...selectedExpenseReport };
    fields.forEach((field) => {
      //@ts-ignore
      const isFieldNumber = typeof tempExpenseReport[field] === "number";
      //@ts-ignore
      tempExpenseReport[field] = isFieldNumber
        ? parseFloat(e.target.value)
        : e.target.value;
    });
    setSelectedExpenseReport(tempExpenseReport);
  };

  useEffect(() => {
    if (!isAddExpenseReportView) {
      const fetchTripReport = async () => await getUserTripReport(userId);
      const fetchAdvanceReport = async () => await getUserAdvanceReport(userId);

      fetchAdvanceReport().then((resp) => setUserAdvanceReport(resp));
      fetchTripReport().then((resp) => setUserTripReport(resp));
    }
  }, []);

  return (
    <>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatus(false)}>
        <MaDrawerHeader>
          {isAddExpenseReportView
            ? t("labels.addExpenseReport")
            : t("labels.editExpenseReport")}
        </MaDrawerHeader>
        <MaDrawerContent>
          <MaGrid>
            <MaGridRow>
              <form className="ma-size-margin-bottom-32">
                <MaText> {t("labels.reportName")} </MaText>
                <MaInput
                  className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8"
                  fullWidth
                  value={selectedExpenseReport.name}
                  onMaChange={(el) => handleInputChange(el, ["name"])}
                ></MaInput>
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.organizationPlace")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  placeholder={
                    selectedExpenseReport.subCompanyName
                      ? String(selectedExpenseReport.subCompanyName)
                      : t("labels.select")
                  }
                  selectData={subCompanies}
                  valueName="subCompanyName"
                />
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.tripReport")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  disabled={!selectedExpenseReport.tripReport}
                  placeholder={selectedExpenseReport.tripReport?.name}
                  selectData={userTripReport.userTripReportList}
                  valueName="tripReport"
                />
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.advanceReport")}
                </MaText>
                <Dropdown
                  input={handleChange}
                  disabled={!selectedExpenseReport.tripReport}
                  placeholder={selectedExpenseReport.tripReport?.name}
                  selectData={userAdvanceReport}
                  valueName="advanceReport"
                />
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.totalAmount")}
                </MaText>
                <MaInput
                  fullWidth
                  value={String(selectedExpenseReport.totalAmount)}
                  onMaChange={(el) => handleInputChange(el, ["name"])}
                ></MaInput>
              </form>

              {alreadyExpenseQuery && isAddExpenseReportView && (
                <DataTable
                  column={allReadyExpenseColumns}
                  data={alreadyExpenseQuery}
                  multiSelect={true}
                />
              )}
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
          {!isAddExpenseReportView ? (
            <MaButton
              fillStyle={MasraffFillStyle.Solid}
              colorType={MasraffColorType.Primary}
              onMaClick={() =>
                updateExpenseReportRecord.mutate(selectedExpenseReport)
              }
            >
              {t("labels.update")}
            </MaButton>
          ) : (
            <MaButton
              fillStyle={MasraffFillStyle.Solid}
              colorType={MasraffColorType.Primary}
              onMaClick={addExpenseReport}
            >
              {t("labels.save")}
            </MaButton>
          )}
        </MaDrawerFooter>
      </MaDrawer>
    </>
  );
}
