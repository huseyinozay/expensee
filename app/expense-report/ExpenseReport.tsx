"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable";
import {
  getExpensesReport,
  getUserSubCompanies,
  getWaitingApprovalReports,
} from "../api/expenseReport";
import { fetchUserOhpCodeData, getTagData } from "../api/expense";
import {
  MaAccordion,
  MaButton,
  MaContainer,
  MaDateRangeInput,
  MaField,
  MaInput,
  MaSeparator,
  MaSpacer,
  MaTabContainer,
  MaTabContent,
  MaTabItem,
  MaTabStrip,
} from "@fabrikant-masraff/masraff-react";
import {
  MasraffColorType,
  MasraffSpacerSize,
} from "@fabrikant-masraff/masraff-core";
import { Loading } from "@/components/Loading/Loading";
import NoData from "@/components/NoData";
import ExpenseReportDrawer from "@/components/Drawers/ExpenseReportDrawer";
import ExpenseReportDetailDrawer from "@/components/Drawers/ExpenseReportDetailDrawer";
import Dropdown from "@/components/Dropdown";
import {
  filterObjectsByIdAndName,
  formatDateToGMT,
  getFormattedExpenseReportData,
} from "@/utils/helpers";
import {
  expenseReportColumns,
  waitingApprovalReportColumns,
} from "@/utils/data";
import {
  deliveryStatusList,
  expenseReportSearchTypes,
  paymentMethodList,
  reportStatusList,
} from "@/utils/utils";
import { useUserState } from "@/context/user";
import {
  ExpenseReport,
  GenericObject,
  MasraffResponse,
  OhpCodeData,
  SubCompany,
  TagData,
  filterStateType,
} from "@/utils/types";
import { FilterWrapper } from "@/components/MasraffLayout/FilterWrapper";
import { Filters } from "@/components/MasraffLayout/Filters";
import { ExpenseReportTable } from "./ExpenseReportTable";

type InputData = {
  name: string;
  value: number | undefined;
};

export default function ExpenseReport() {
  const { userId } = useUserState();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReportDetail, setOpenReportDetail] = useState(false);
  const [reset, setReset] = useState(false);
  const [row, setRow] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const inputRef = useRef<any>();
  const dateInputRef = useRef<any>();

  const defaultFilter = {
    includes: "user,approver,subCompany,user.company",
    clientId: "adminApp",
    page: currentPage,
    pageSize: 10,
    ascending: "false",
    searchTypeId: 0,
  };

  const [filter, setFilter] = useState<{ [key: string]: any }>(defaultFilter);
  const [filterData, setFilterData] = useState<{
    [key: string]: number | string;
  }>({});
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    data: expenseReportQuery,
    isLoading: isLoadingReports,
    refetch,
  } = useQuery<MasraffResponse>({
    queryKey: ["reports", filter],
    queryFn: async () => getExpensesReport(filter),
  });
  let totalCount;
  let totalPages;
  let expenseReportData: ExpenseReport[] = [];
  if (expenseReportQuery) {
    ({
      totalCount,
      totalPages,
      results: expenseReportData,
    } = expenseReportQuery);
  }

  const { data: waitingApprovalQuery } = useQuery<MasraffResponse>({
    queryKey: ["waitingApprovalReports"],
    queryFn: async () => getWaitingApprovalReports(userId ? userId : ""),
    enabled: !!userId,
  });
  let waitingApprovalReportsData: Object[] = []; // waiting report type is not defined
  if (waitingApprovalQuery)
    waitingApprovalReportsData = waitingApprovalQuery.results;

  const { data: ohpCodeQuery } = useQuery<OhpCodeData[]>({
    queryKey: ["ohpCode"],
    queryFn: async () => fetchUserOhpCodeData(true),
  });

  let ohpCodeData: GenericObject[] = [];
  if (ohpCodeQuery) {
    let ohpCodeQueryTransformed = ohpCodeQuery.map((obj) => ({
      id: obj.id,
      name: obj.companyOhpCodeValue,
    }));
    ohpCodeData = filterObjectsByIdAndName(ohpCodeQueryTransformed);
  }

  const { data: tagDataQuery } = useQuery<TagData>({
    queryKey: ["tags"],
    queryFn: async () => getTagData(),
  });
  let tagData: GenericObject[] = [];
  if (tagDataQuery) tagData = filterObjectsByIdAndName(tagDataQuery.results);

  const { data: subCompaniesQuery } = useQuery<SubCompany[]>({
    queryKey: ["subCompanies"],
    queryFn: async () => getUserSubCompanies(userId),
    enabled: !!userId,
  });

  let subCompanies: GenericObject[] = [];
  if (subCompaniesQuery)
    subCompanies = filterObjectsByIdAndName(subCompaniesQuery);

  const initialExpenseReportFilterState = [
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
      selectionData: expenseReportSearchTypes,
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
      selectionData: reportStatusList,
    },
    {
      id: "paymentMethodTypes",
      type: "multi-select",
      placeholder: "Ödeme Tipi",
      value: undefined,
      selectionData: paymentMethodList,
    },
    {
      id: "tagIds",
      type: "multi-select",
      placeholder: "Etiket",
      value: undefined,
      selectionData: tagData,
    },
    {
      id: "subCompanyIds",
      type: "multi-select",
      placeholder: "Organizasyon",
      value: undefined,
      selectionData: subCompanies,
    },
    {
      id: "ohpCodeIds",
      type: "multi-select",
      placeholder: "Masraf Merkezi",
      value: undefined,
      selectionData: ohpCodeData,
    },
    {
      id: "isDelivered",
      type: "multi-select",
      placeholder: "Teslim Durumu",
      value: undefined,
      selectionData: deliveryStatusList,
    },
    {
      id: "paymentMethodTypes",
      type: "multi-select",
      placeholder: "Ödeme Tipi",
      value: undefined,
      selectionData: paymentMethodList,
    },
  ];

  const [expenseReportFilterState, setExpenseReportFilterState] = useState<
    filterStateType[]
  >(initialExpenseReportFilterState);

  const changeStatus: any = (isOpen: boolean) => {
    setIsOpen(isOpen);
    refetch();
  };
  const changeDetailStatus: any = (isOpen: boolean) => {
    setOpenReportDetail(isOpen);
  };

  const onClickFilter = () => {
    setFilter({ ...filter, ...filterData });
  };

  const onClickExpenseReportRow: any = (
    id: any,
    isDetailOpener: boolean = false
  ) => {
    if (expenseReportData) {
      const currentRow = expenseReportData.filter(
        (item: any) => item.id === id
      );
      setRow(currentRow[0]);
      if (isDetailOpener) changeDetailStatus(true);
      else changeStatus(true);
    }
  };

  const onClickWaitingExpenseReportDetail: any = (id: any) => {
    if (waitingApprovalReportsData) {
      const currentRow = waitingApprovalReportsData.filter(
        (item: any) => item.id === id
      );
      setRow(currentRow[0]);
    }
  };

  useEffect(() => {
    if (ohpCodeQuery && tagDataQuery && subCompaniesQuery) {
      const ohpCodeQueryTransformed = ohpCodeQuery.map((obj) => ({
        id: obj.id,
        name: obj.companyOhpCodeValue,
      }));
      const ohpCodeData = filterObjectsByIdAndName(ohpCodeQueryTransformed);

      const tagData = filterObjectsByIdAndName(tagDataQuery.results);
      const subCompanies = filterObjectsByIdAndName(subCompaniesQuery);

      const updatedExpenseReportFilterState = expenseReportFilterState.map(
        (filter) => {
          if (filter.id === "tagIds") {
            return {
              ...filter,
              selectionData: tagData,
            };
          } else if (filter.id === "ohpCodeIds") {
            return {
              ...filter,
              selectionData: ohpCodeData,
            };
          } else if (filter.id === "subCompanyIds") {
            return {
              ...filter,
              selectionData: subCompanies,
            };
          } else {
            return filter;
          }
        }
      );

      setExpenseReportFilterState(updatedExpenseReportFilterState);
    }
  }, [ohpCodeQuery, tagDataQuery, subCompaniesQuery, userId]);

  useEffect(() => {
    setFilter(defaultFilter);
    const differences: Record<string, any> = {};

    expenseReportFilterState.forEach((item) => {
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
            differences[item.id] = value; // If it's already an array, keep it as is
          } else {
            differences[item.id] = [value]; // Wrap single value in an array
          }
        }
      }
    });

    setFilterData(differences);
  }, [expenseReportFilterState]);

  return (
    <>
      {isOpen && (
        <ExpenseReportDrawer
          isOpen={isOpen}
          data={row}
          changeStatus={changeStatus}
        />
      )}
      {isOpenReportDetail && (
        <ExpenseReportDetailDrawer
          isOpen={isOpenReportDetail}
          changeStatus={changeDetailStatus}
          data={row}
        />
      )}
      <FilterWrapper
        pageName={t("labels.expenseReports")}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        onAddClick={() => {
          setRow({});
          changeStatus(true);
        }}
        activeFilters={
          expenseReportFilterState.filter((f) => f.value !== undefined).length
        }
        filters={
          <Filters
            filters={expenseReportFilterState.map((f: any) => {
              return {
                ...f,
                onValueChange: (value: any) => {
                  let newValue = [...expenseReportFilterState];
                  const index = newValue.findIndex(
                    (filter) => filter.id === f.id
                  );

                  if (index !== -1) {
                    newValue[index] = {
                      ...newValue[index],
                      value,
                    };
                  }
                  setExpenseReportFilterState(newValue);
                },
              };
            })}
            onClearValues={() => {
              setFilter(defaultFilter);
              setFilterData({});
              setExpenseReportFilterState(initialExpenseReportFilterState);
            }}
            onClickFilter={onClickFilter}
          />
        }
      />
      {isLoadingReports ? (
        <Loading />
      ) : (
        <>
          {expenseReportData && expenseReportData.length > 0 ? (
            <>
              <ExpenseReportTable
                data={getFormattedExpenseReportData(expenseReportData)}
                onOpenRow={(id) => onClickExpenseReportRow(id)}
                onOpenDetailRow={(id) => onClickExpenseReportRow(id, true)}
              />

              <div style={{ padding: "10px" }}>
                {t("labels.page")} {currentPage + 1}/{totalPages}
                <p style={{ paddingTop: "5px" }}>
                  {t("labels.totalResult")}: {totalCount}
                </p>
                <MaButton
                  style={{ paddingRight: "5px", paddingTop: "5px" }}
                  onMaClick={() => {
                    if (currentPage === 0) return;
                    filter.page = currentPage - 1;
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  {t("labels.previous")}
                </MaButton>
                <MaButton
                  onMaClick={() => {
                    filter.page = currentPage + 1;
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  {t("labels.next")}
                </MaButton>
              </div>
            </>
          ) : (
            <NoData />
          )}
        </>
      )}

      {/* <MaTabContainer
        activeTabContentId="report"
        tabContainerId="report-container"
      >
        <MaTabContent tabContentId="report">
          {isLoadingReports ? (
            <Loading />
          ) : (
            <>
              {expenseReportData && expenseReportData.length > 0 ? (
                <>
                  <ExpenseReportTable
                    data={getFormattedExpenseReportData(expenseReportData)}
                    onOpenRow={(id) => onClickExpenseReportRow(id)}
                  />

                  <div style={{ padding: "10px" }}>
                    {t("labels.page")} {currentPage + 1}/{totalPages}
                    <p style={{ paddingTop: "5px" }}>
                      {t("labels.totalResult")}: {totalCount}
                    </p>
                    <MaButton
                      style={{ paddingRight: "5px", paddingTop: "5px" }}
                      onMaClick={() => {
                        if (currentPage === 0) return;
                        filter.page = currentPage - 1;
                        setCurrentPage(currentPage - 1);
                      }}
                    >
                      {t("labels.previous")}
                    </MaButton>
                    <MaButton
                      onMaClick={() => {
                        filter.page = currentPage + 1;
                        setCurrentPage(currentPage + 1);
                      }}
                    >
                      {t("labels.next")}
                    </MaButton>
                  </div>
                </>
              ) : (
                <NoData />
              )}
            </>
          )}
        </MaTabContent>

        <MaTabContent tabContentId="awaiting-approval">
          {waitingApprovalReportsData.length > 0 ? (
            <DataTable
              column={waitingApprovalReportColumns}
              data={waitingApprovalReportsData}
              changeStatus={changeStatus}
              changeStatus2={changeDetailStatus}
              hasSecondaryInteraction
              setRowId={onClickWaitingExpenseReportDetail}
            />
          ) : (
            <NoData />
          )}
        </MaTabContent>
      </MaTabContainer> */}
    </>
  );
}
