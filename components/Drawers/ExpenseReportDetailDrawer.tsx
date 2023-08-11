"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getIndividualExpenseReport,
  updateExpenseReportStatus,
} from "@/app/api/expenseReport";
import {
  MasraffColorType,
  MasraffFillStyle,
  MasraffIconNames,
  MasraffSpacerSize,
} from "@fabrikant-masraff/masraff-core";
import DataTable from "@/components/DataTable";
import { Loading } from "@/components/Loading/Loading";
import {
  MaButton,
  MaDialog,
  MaDialogContent,
  MaDialogFooter,
  MaDrawer,
  MaDrawerContent,
  MaDrawerHeader,
  MaGrid,
  MaGridRow,
  MaIcon,
  MaSpacer,
  MaText,
  MaTextArea,
} from "@fabrikant-masraff/masraff-react";
import { expenseColumns } from "@/utils/data";
import { useUserState } from "@/context/user";
import { deleteExpense } from "@/app/api/expense";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ExpenseReportDetailDrawerProps {
  isOpen: boolean;
  changeStatus(arg: boolean): void;
  data?: any;
}
export default function ExpenseReportDetailDrawer({
  isOpen,
  changeStatus,
  data,
}: ExpenseReportDetailDrawerProps) {
  const { t } = useTranslation();
  const { user } = useUserState();
  const { userId, currency: userTargetCurrency, delegatedUserId } = user;
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveOrDecline, setApproveOrDecline] = useState(false);

  const selectedExpenseReport: ExpenseReport = data;

  const { data: expenseReportQuery, isLoading: isLoadingExpenseReport } =
    useQuery<MasraffResponse>({
      queryKey: ["report", data?.id],
      queryFn: () => getIndividualExpenseReport(data?.id),
    });
  let expenseReportData: Expense[] = [];
  if (expenseReportQuery) {
    expenseReportData = expenseReportQuery.results;
  }

  const approveReport = (report: ExpenseReport) => {
    report.status = 3;
    updateReport.mutate(report);
  };

  const declineReport = (report: ExpenseReport) => {
    report.status = 4;
    updateReport.mutate(report);
  };

  const sendToApproval = (report: ExpenseReport) => {
    report.status = 2;
    updateReport.mutate(report);
  };

  const updateReport = useMutation(updateExpenseReportStatus, {
    onSuccess: () => {
      changeStatus(false);
      setIsApproveModalOpen(false);
    },
  });

  return (
    <>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatus(false)}>
        <MaDrawerHeader>{selectedExpenseReport.name}</MaDrawerHeader>
        <MaDrawerContent>
          <MaGrid rows={4}>
            <MaGridRow>
              {parseInt(userId) === selectedExpenseReport.approverUserId &&
                selectedExpenseReport.status === 2 && (
                  <MaButton
                    colorType={MasraffColorType.Constructive}
                    onMaClick={() => {
                      setIsApproveModalOpen(!isApproveModalOpen);
                      setApproveOrDecline(true);
                    }}
                  >
                    {t("labels.approve")}
                  </MaButton>
                )}
              {parseInt(userId) === selectedExpenseReport.approverUserId &&
                selectedExpenseReport.status === 2 && (
                  <MaButton
                    colorType={MasraffColorType.Destructive}
                    onMaClick={() => setIsApproveModalOpen(!isApproveModalOpen)}
                  >
                    {t("labels.reject")}
                  </MaButton>
                )}
              {parseInt(userId) === selectedExpenseReport.userId &&
                (selectedExpenseReport.status == 1 ||
                  selectedExpenseReport.status == 4) && (
                  <MaButton
                    colorType={MasraffColorType.Constructive}
                    onMaClick={() => sendToApproval(selectedExpenseReport)}
                  >
                    {t("labels.sendToApproval")}
                  </MaButton>
                )}
              {isLoadingExpenseReport ? (
                <Loading />
              ) : (
                <div style={{ marginTop: "25px" }}>
                  <DataTable data={expenseReportData} column={expenseColumns} />
                </div>
              )}
            </MaGridRow>
          </MaGrid>
        </MaDrawerContent>
        {isApproveModalOpen && (
          <MaDialog isOpen={isApproveModalOpen}>
            <MaDialogContent>
              {approveOrDecline ? (
                <div>
                  {t("validation.approve", {
                    reportName: selectedExpenseReport.name,
                  })}
                </div>
              ) : (
                <div>
                  {t("validation.decline", {
                    reportName: selectedExpenseReport.name,
                  })}

                  <MaSpacer size={MasraffSpacerSize.M} />

                  <MaText> {t("labels.declineReason")} </MaText>
                  <MaTextArea
                    onMaChange={(e) => {
                      selectedExpenseReport.note = e.target.value;
                    }}
                  ></MaTextArea>
                </div>
              )}
            </MaDialogContent>
            <MaDialogFooter>
              <div></div>
              <div>
                <MaButton
                  fillStyle={MasraffFillStyle.Ghost}
                  colorType={MasraffColorType.Neutral}
                  onMaClick={() => setIsApproveModalOpen(false)}
                >
                  {t("labels.cancel")}
                </MaButton>
                {approveOrDecline ? (
                  <MaButton
                    fillStyle={MasraffFillStyle.Ghost}
                    colorType={MasraffColorType.Constructive}
                    onMaClick={() => {
                      approveReport(selectedExpenseReport);
                    }}
                  >
                    {t("labels.approve")}
                  </MaButton>
                ) : (
                  <MaButton
                    fillStyle={MasraffFillStyle.Ghost}
                    colorType={MasraffColorType.Constructive}
                    onMaClick={() => {
                      declineReport(selectedExpenseReport);
                    }}
                  >
                    {t("labels.reject")}
                  </MaButton>
                )}
              </div>
            </MaDialogFooter>
          </MaDialog>
        )}
      </MaDrawer>
    </>
  );
}
