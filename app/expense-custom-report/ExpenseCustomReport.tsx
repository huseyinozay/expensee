"use client";

import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  getCustomReportTypes,
  getCustomReportsView,
} from "../api/expenseCustomReport";
import { MasraffSpacerSize } from "@fabrikant-masraff/masraff-core";
import { MaButton, MaSpacer } from "@fabrikant-masraff/masraff-react";
import CustomReportDrawer from "@/components/Drawers/CustomReportDrawer";
import DataTable from "@/components/DataTable";
import { Loading } from "@/components/Loading/Loading";
import {
  filterObjectsByIdAndName,
  getFormattedExpenseData,
} from "@/utils/helpers";
import { customFormColumns } from "@/utils/data";
import { expenseCustomFormsStatusList, statusList } from "@/utils/utils";
import {
  CustomFormType,
  CustomReportFormsData,
  GenericObject,
  filterStateType,
} from "@/utils/types";
import { FilterWrapper } from "@/components/MasraffLayout/FilterWrapper";
import { Filters } from "@/components/MasraffLayout/Filters";
import { ExpenseCustomReportTable } from "./ExpenseCustomReportTable";

const ExpenseCustomReport = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(0);
  const defaultFilter = {
    includes: "user,approver,subCompany",
    clientId: "adminApp",
    page: currentPage,
    pageSize: 10,
    ascending: "false",
  };
  const [filter, setFilter] = useState<{ [key: string]: any }>(defaultFilter);
  const [isDrawerOpened, setDrawerOpened] = useState(false);
  const [selectedForm, setSelectedForm] = useState({});
  const [filterData, setFilterData] = useState<{
    [key: string]: number | string;
  }>({});
  const [reset, setReset] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const inputRef = useRef<any>();
  const dateInputRef = useRef<any>();
  let customFormTypes: GenericObject[] = [];

  const { data: customFormTypesData } = useQuery<CustomFormType[]>({
    queryKey: ["reportTypes"],
    queryFn: async () => getCustomReportTypes(),
  });
  if (customFormTypesData)
    customFormTypes = filterObjectsByIdAndName(customFormTypesData);

  const onClickExpenseCustomReportDetail = (id: any) => {
    if (customForms) {
      const currentRow = customForms.results.filter(
        (item: any) => item.id === id
      );
      setSelectedForm(currentRow[0]);
    }
    changeStatus(true);
  };

  const initialExpenseCustomFormFilterState = [
    {
      id: "createDateStart,createDateEnd",
      type: "dateRange",
      placeholder: "Tarih Aralığı",
      value: undefined,
    },
    {
      id: "searchValue",
      type: "string",
      placeholder: "Ara",
      value: undefined,
    },
    {
      id: "searchTypeId",
      type: "single-select",
      placeholder: "Türü",
      value: undefined,
      selectionData: customFormTypes,
    },
    {
      id: "statuses",
      type: "multi-select",
      placeholder: "Durumu",
      value: undefined,
      selectionData: expenseCustomFormsStatusList,
    },
  ];

  const [expenseFilterState, setExpenseFilterState] = useState<
    filterStateType[]
  >(initialExpenseCustomFormFilterState);

  const onClickFilter = () => {
    setFilter({ ...filter, ...filterData });
  };

  const { data: customForms, isLoading: isLoadingCustomForms } =
    useQuery<CustomReportFormsData>({
      queryKey: ["customReports", filter],
      queryFn: async () => getCustomReportsView(filter),
    });

  const changeStatus: any = (isOpen: boolean) => {
    setDrawerOpened(isOpen);
    setSelectedForm({});
  };

  const onClickFormDetail: any = (id: any) => {
    if (customForms) {
      const currentRow = customForms.results.filter(
        (item: any) => item.id === id
      );
      setSelectedForm(currentRow[0]);
    }
  };
  return (
    <>
      <FilterWrapper
        pageName={t("labels.requestForms")}
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
              setExpenseFilterState(initialExpenseCustomFormFilterState);
            }}
            onClickFilter={onClickFilter}
          />
        }
      />

      {isLoadingCustomForms ? (
        <Loading />
      ) : (
        <>
          {customForms && (
            <ExpenseCustomReportTable
              data={customForms?.results}
              onOpenRow={(id) => onClickExpenseCustomReportDetail(id)}
            />
          )}
          <div style={{ padding: "10px" }}>
            <p>
              {t("labels.page")} {currentPage + 1}/{customForms?.totalPages}
            </p>
            <p style={{ paddingTop: "5px" }}>
              {t("labels.totalResult")}: {customForms?.totalCount}
            </p>
            <MaButton
              style={{ paddingRight: "5px", paddingTop: "5px" }}
              onMaClick={() => {
                if (currentPage === 0) return;
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  page: currentPage - 1,
                }));

                setCurrentPage(currentPage - 1);
              }}
            >
              {t("labels.previous")}
            </MaButton>
            <MaButton
              onMaClick={() => {
                setFilter((prevFilter) => ({
                  ...prevFilter,
                  page: currentPage + 1,
                }));

                setCurrentPage(currentPage + 1);
              }}
            >
              {t("labels.next")}
            </MaButton>
          </div>
        </>
      )}

      {isDrawerOpened && (
        <CustomReportDrawer
          isOpen={isDrawerOpened}
          data={selectedForm}
          changeStatus={changeStatus}
        />
      )}
    </>
  );
};

export default ExpenseCustomReport;
