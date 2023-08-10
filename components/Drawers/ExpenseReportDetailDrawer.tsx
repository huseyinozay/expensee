"use client";

import { useQuery } from "@tanstack/react-query";
import { getIndividualExpenseReport } from "@/app/api/expenseReport";
import { MasraffColorType } from "@fabrikant-masraff/masraff-core";
import DataTable from "@/components/DataTable";
import { Loading } from "@/components/Loading/Loading";
import {
  MaButton,
  MaDrawer,
  MaDrawerContent,
  MaDrawerHeader,
  MaGrid,
  MaGridRow,
} from "@fabrikant-masraff/masraff-react";
import { expenseColumns } from "@/utils/data";
import { useEffect, useState } from "react";

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
  const [userId, setUserId] = useState("");

  const selectedExpenseReport: ExpenseReport = JSON.parse(JSON.stringify(data));

  const { data: expenseReportQuery, isLoading: isLoadingExpenseReport } =
    useQuery<MasraffResponse>({
      queryKey: ["report", data?.id],
      queryFn: () => getIndividualExpenseReport(data?.id),
    });
  let expenseReportData: Expense[] = [];
  if (expenseReportQuery) {
    expenseReportData = expenseReportQuery.results;
  }

  useEffect(() => {
    // @ts-ignore
    setUserId(JSON.parse(window.localStorage.getItem("user")).userId);
  }, []);

  return (
    <>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatus(false)}>
        <MaDrawerHeader>{selectedExpenseReport.name}</MaDrawerHeader>
        <MaDrawerContent>
          <MaGrid rows={4}>
            <MaGridRow>
              {parseInt(userId) === selectedExpenseReport.approverUserId && (
                <MaButton colorType={MasraffColorType.Constructive}>
                  Onayla
                </MaButton>
              )}
              {parseInt(userId) === selectedExpenseReport.approverUserId && (
                <MaButton colorType={MasraffColorType.Destructive}>
                  Reddet
                </MaButton>
              )}
              {parseInt(userId) === selectedExpenseReport.userId && (
                <MaButton colorType={MasraffColorType.Constructive}>
                  Onaya Gönder
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
      </MaDrawer>
    </>
  );
}
