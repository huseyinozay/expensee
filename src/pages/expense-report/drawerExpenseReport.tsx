"use client";

import {
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
import ApiService from "@/services/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import DropDown from "@/components/DropDown";
import { currencyList } from "@/data/selectData";
import { updateExpense } from "@/api/expense";
import i18n from "@/plugins/i18n";
import DataTable from "@/components/DataTable";
import { allReadyExpenseColumns } from "@/data/columns";
import { getExpenses, getUserSubCompanies } from "@/api/expenseReport";
import { use } from "i18next";

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
type data = {
  [key: string]: any;
};
export default function DrawerExpense({
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
  const [expenseData, setExpenseData] = useState<any>([]);
  const [subCompanies, setSubCompanies] = useState<Array<Object>>([]);

  useEffect(() => {
    expense.taxAmount = expense.amount * (Number(expense.taxPercentage) / 100);

    expense.currencyText = currencyList.find(
      (x) => x.id === expense.currency
    )?.name;
    exchangeRateData.SourceCurrency = expense.currency;
  }, [expense.amount, expense.taxPercentage, expense.currency]);

  if (data && data !== expense) {
    // @ts-ignore
    setExpense(data);
  }

  const setRowId: any = (id: any) => {
    console.log(id);
  };
  function fetchExpenseCategoryData() {
    return api.get("v1/expenseTypes/all");
  }
  function fetchUserOhpCodeData() {
    return api.get("v1/mobile/getUserOhpCodes");
  }
  function fetchCustomFieldData() {
    return api.get("v1/customFields");
  }
  const expenseQuery = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
    onSuccess: (data: Object[]) => {
      setExpenseData(data);
    },
  });
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

  const updateExpenseRecord = useMutation(updateExpense);

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
    // @ts-ignore
    if (data.value?.length === 1) {
      // @ts-ignore
      expense[data.name] = data.value[0];
    } else {
      // @ts-ignore
      expense[data.name] = data.value;
    }
  };
  return (
    <>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatu(false)}>
        <MaDrawerHeader>Form Oluştur</MaDrawerHeader>
        <MaDrawerContent>
          <MaGrid rows={4}>
            <MaGridRow>
              <form onSubmit={saveExpense} className="ma-size-margin-bottom-32">
                <MaText> {i18n.t("labels.reportName")} </MaText>
                <MaInput
                  className="ma-size-margin-bottom-16 ma-size-margin-top-8"
                  fullWidth
                  value={expense.note}
                  onMaChange={(el) => (expense.note = el.target.value)}
                ></MaInput>
                <MaText className="ma-size-margin-bottom-16 ma-size-margin-top-8">
                  {i18n.t("labels.organizationPlace")}
                </MaText>
                <DropDown
                  input={input}
                  placeholder={expense?.expenseType?.name}
                  // @ts-ignore
                  selectData={subCompanies}
                  valueName="expenseTypeId"
                />
                <MaText> {i18n.t("labels.tripReport")} </MaText>
                <DropDown
                  input={input}
                  placeholder={expense?.expenseType?.name}
                  // @ts-ignore
                  selectData={expenseCategoryData}
                  valueName="expenseTypeId"
                />
              </form>

              {/* @ts-ignore */}
              <DataTable
                column={allReadyExpenseColumns}
                data={expenseData}
                setRowId={setRowId}
                multiSelect={true}
              />
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
