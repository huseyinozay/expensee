"use client";

import {
  MasraffColorType,
  MasraffFillStyle,
} from "@fabrikant-masraff/masraff-core";
import {
  MaButton,
  MaDrawer,
  MaDrawerContent,
  MaDrawerHeader,
  MaGrid,
  MaGridRow,
} from "@fabrikant-masraff/masraff-react";
import { useEffect, useState } from "react";
import ApiService from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import DropDown from "@/components/DropDown";
import { currencyList } from "@/data/selectData";
import { updateExpense } from "@/api/expense";
import i18n from "@/plugins/i18n";
import DataTable from "@/components/DataTable";
import { expenseColumns } from "@/data/columns";
import { getUserSubCompanies, getExpenseReport } from "@/api/expenseReport";

const api = new ApiService();

interface DrawerExpenseProps {
  isOpen: boolean;
  changeStatu(arg: boolean): void;
  data?: any;
}

type SelectData = {
  value: any;
  name: string;
};

type data = {
  [key: string]: any;
};
export default function DrawerReportDetail({
  isOpen,
  changeStatu,
  data,
}: DrawerExpenseProps) {
  const [amount, setAmount] = useState("");
  const [expenseCategoryData, setExpenseCategoryData] = useState<Array<Object>>(
    []
  );
  const [exchangeRateData, setExchangeRateData] = useState<ExchangeRate>({
    SourceCurrency: 1,
    TargetCurrency: 1,
    RateDate: new Date(),
  });
  // @ts-ignore
  const [expense, setExpense] = useState<Expense>({});
  const [expenseData, setExpenseData] = useState<Array<Object>>([]);
  const [subCompanies, setSubCompanies] = useState<Array<Object>>([]);
  const [report, setReport] = useState<Object>({});
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (userId) {
      setUserId(userId);
    }
  }, []);

  if (data && data !== expense) {
    setExpense(data);
  }

  const reportQuery = useQuery({
    queryKey: ["report", data?.id],
    queryFn: () => getExpenseReport(data?.id),
    onSuccess: (data: data) => {
      setReport(data);
      setExpenseData(data.results);
    },
  });
  function fetchUserOhpCodeData() {
    return api.get("v1/mobile/getUserOhpCodes");
  }
  function fetchCustomFieldData() {
    return api.get("v1/customFields");
  }
  const ohpTypesQuery = useQuery({
    queryKey: ["ohpTypes"],
    queryFn: fetchUserOhpCodeData,
  });
  const customFieldsQuery = useQuery({
    queryKey: ["customFields"],
    queryFn: fetchCustomFieldData,
  });

  const getSubCompanies = useQuery({
    queryKey: ["subCompanies"],
    queryFn: getUserSubCompanies,
    onSuccess: (data: data[]) => {
      setSubCompanies(data);
    },
  });

  return (
    <>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatu(false)}>
        <MaDrawerHeader>{expense.name}</MaDrawerHeader>
        <MaDrawerContent>
          <MaGrid rows={4}>
            <MaGridRow>
              {parseInt(userId) === expense.approverUserId && (
                <MaButton colorType={MasraffColorType.Constructive}>
                  Onayla
                </MaButton>
              )}
              {parseInt(userId) === expense.approverUserId && (
                <MaButton colorType={MasraffColorType.Destructive}>
                  Reddet
                </MaButton>
              )}
              {parseInt(userId) === expense.userId && (
                <MaButton colorType={MasraffColorType.Constructive}>
                  Onaya Gönder
                </MaButton>
              )}
              {/* @ts-ignore */}
              <DataTable column={expenseColumns} data={expenseData} />
            </MaGridRow>
          </MaGrid>
        </MaDrawerContent>
      </MaDrawer>
    </>
  );
}
