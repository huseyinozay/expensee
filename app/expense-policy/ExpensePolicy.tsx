"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import i18n from "@/i18/i18";
import {
  getExpenseCategoryData,
  getPolicyExpenses,
  getTagData,
} from "../api/expensePolicy";
import { ExpensePolicyTable } from "./ExpensePolicyTable";
import { FilterWrapper } from "@/components/MasraffLayout/FilterWrapper";
import { Filters } from "@/components/MasraffLayout/Filters";
import { Loading } from "@/components/Loading/Loading";
import ExpenseDrawer from "@/components/Drawers/ExpenseDrawer";
import { MaButton } from "@fabrikant-masraff/masraff-react";
import {
  filterObjectsByIdAndName,
  formatDateToGMT,
  getFormattedExpensePolicyData,
} from "@/utils/helpers";
import {
  expenseSearchTypes,
  paymentMethodList,
  statusList,
} from "@/utils/utils";
import {
  ExpenseData,
  GenericObject,
  TagData,
  filterStateType,
} from "@/utils/types";
import "../globals.css";

export default function Expense() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const defaultFilter = {
    includes: "user, expenseType",
    clientId: "adminApp",
    page: currentPage,
    pageSize: 10,
    ascending: "false",
    searchTypeId: 0,
    isActiveExpenseTypeLimit: true,
  };

  const [filter, setFilter] = useState<{ [key: string]: any }>(defaultFilter);
  const [filterData, setFilterData] = useState<{
    [key: string]: number | string;
  }>({});
  const [isDrawerOpened, setDrawerOpened] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState({});

  const {
    data: expenseData,
    isLoading: isLoadingExpenses,
    refetch,
  } = useQuery<ExpenseData>({
    queryKey: ["expenses", filter],
    queryFn: async () => getPolicyExpenses(filter),
  });

  const { data: tagData } = useQuery<TagData>({
    queryKey: ["tags"],
    queryFn: async () => getTagData(),
  });
  let tags: GenericObject[] = [];
  if (tagData) tags = filterObjectsByIdAndName(tagData.results);

  const { data: expenseCategoryData } = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: async () => getExpenseCategoryData(),
  });
  let expenseCategories: GenericObject[] = [];
  if (expenseCategoryData)
    expenseCategories = filterObjectsByIdAndName(expenseCategoryData);
  const initialExpenseFilterState = [
    {
      id: "createDateStart,createDateEnd",
      type: "dateRange",
      placeholder: "Tarih Aralığı",
      value: undefined,
    },
    {
      id: "searchTypeId",
      type: "single-select",
      placeholder: "Türü",
      value: undefined,
      selectionData: expenseSearchTypes,
    },
    {
      id: "searchValue",
      type: "string",
      placeholder: "Ara",
      value: undefined,
    },
    {
      id: "statuses",
      type: "multi-select",
      placeholder: "Durumu",
      value: undefined,
      selectionData: statusList,
    },
    {
      id: "paymentMethodTypes",
      type: "multi-select",
      placeholder: "Ödeme Tipi",
      value: undefined,
      selectionData: paymentMethodList,
    },
    {
      id: "expenseTypeId",
      type: "multi-select",
      placeholder: "Kategori",
      value: undefined,
      selectionData: expenseCategories,
    },
  ];

  const [expenseFilterState, setExpenseFilterState] = useState<
    filterStateType[]
  >(initialExpenseFilterState);

  const changeStatus = (isOpen: boolean) => {
    setDrawerOpened(isOpen);
    if (!isOpen) setSelectedExpense({});
  };

  const onClickExpenseDetail = (id: any) => {
    if (expenseData) {
      const currentRow = expenseData.results.filter(
        (item: any) => item.id === id
      );
      setSelectedExpense(currentRow[0]);
    }
    changeStatus(true);
  };

  const onClickFilter = () => {
    setFilter({ ...filter, ...filterData });
  };

  useEffect(() => {
    if (tagData || expenseCategoryData) {
      let tags = tagData ? filterObjectsByIdAndName(tagData.results) : [];
      let expenseCategories = expenseCategoryData
        ? filterObjectsByIdAndName(expenseCategoryData)
        : [];

      const updatedExpenseFilterState = expenseFilterState.map((filter) => {
        if (filter.id === "tagIds") {
          return {
            ...filter,
            selectionData: tags,
          };
        } else if (filter.id === "expenseTypeId") {
          return {
            ...filter,
            selectionData: expenseCategories,
          };
        } else {
          return filter;
        }
      });

      setExpenseFilterState(updatedExpenseFilterState);
    }
  }, [tagData, expenseCategoryData]);

  useEffect(() => {
    setFilter(defaultFilter);
    const differences: Record<string, any> = {};

    expenseFilterState.forEach((item) => {
      if (item.id.includes(",")) {
        const ids = item.id.split(",");
        if (Array.isArray(item.value)) {
          ids.forEach((id, idx) => {
            const currentValue = item.value[idx];
            if (currentValue !== null && currentValue !== undefined) {
              if (item.type === "dateRange")
                differences[id] = formatDateToGMT(currentValue);
              else differences[id] = currentValue;
            }
          });
        }
      } else {
        const value = item.value;
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            differences[item.id] = value.join(",");
          } else {
            differences[item.id] = value;
          }
        }
      }
    });
    setFilterData(differences);
  }, [expenseFilterState]);

  useEffect(() => {
    refetch();
  }, [isDrawerOpened]);

  return (
    <>
      {isDrawerOpened && (
        <ExpenseDrawer
          isOpen={isDrawerOpened}
          changeStatus={changeStatus}
          data={selectedExpense}
        />
      )}
      <FilterWrapper
        pageName={t("labels.expenses")}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        activeFilters={
          expenseFilterState.filter((f) => f.value !== undefined).length
        }
        filters={
          <Filters
            filters={expenseFilterState.map((f: any) => {
              return {
                ...f,
                onValueChange: (value: any) => {
                  let newValue = [...expenseFilterState];
                  const index = newValue.findIndex(
                    (filter) => filter.id === f.id
                  );

                  if (index !== -1) {
                    newValue[index] = {
                      ...newValue[index],
                      value,
                    };
                  }
                  setExpenseFilterState(newValue);
                },
              };
            })}
            onClearValues={() => {
              setFilter(defaultFilter);
              setFilterData({});
              setExpenseFilterState(initialExpenseFilterState);
            }}
            onClickFilter={onClickFilter}
          />
        }
      />

      {isLoadingExpenses ? (
        <Loading />
      ) : (
        <>
          {expenseData && (
            <ExpensePolicyTable
              data={getFormattedExpensePolicyData(
                expenseData?.results,
                expenseCategories
              )}
              onOpenRow={(id) => onClickExpenseDetail(id)}
            />
          )}
          <div style={{ padding: "10px" }}>
            <p>
              {i18n.t("labels.page")} {currentPage + 1}/
              {expenseData?.totalPages}
            </p>
            <p style={{ paddingTop: "5px" }}>
              {i18n.t("labels.totalResult")}: {expenseData?.totalCount}
            </p>
            <MaButton
              style={{ paddingRight: "5px", paddingTop: "5px" }}
              onMaClick={() => {
                if (currentPage === 0) return;
                filter.page = currentPage - 1;
                setCurrentPage(currentPage - 1);
              }}
            >
              {i18n.t("labels.previous")}
            </MaButton>
            <MaButton
              onMaClick={() => {
                filter.page = currentPage + 1;
                setCurrentPage(currentPage + 1);
              }}
            >
              {i18n.t("labels.next")}
            </MaButton>
          </div>
        </>
      )}
    </>
  );
}
