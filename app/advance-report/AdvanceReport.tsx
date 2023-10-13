"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import AdvanceReportDrawer from "@/components/Drawers/AdvanceReportDrawer";
import { getAdvanceReports } from "../api/advanceReport";
import { FilterWrapper } from "@/components/MasraffLayout/FilterWrapper";
import { Filters } from "@/components/MasraffLayout/Filters";
import { Loading } from "@/components/Loading/Loading";
import AdvanceReportTable from "./AdvanceReportTable";
import { MaButton } from "@fabrikant-masraff/masraff-react";
import { expenseReportSearchTypes, reportStatusList } from "@/utils/utils";
import { MasraffResponse, filterStateType } from "@/utils/types";
import { formatDateToGMT } from "@/utils/helpers";


export default function AdvanceReport() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const defaultFilter = {
    includes: "user,approver,subCompany",
    clientId: "adminApp",
    page: 0,
    pageSize: 10,
    ascending: "false",
    isCoreReport: true,
  };

  const [filter, setFilter] = useState<{ [key: string]: any }>(defaultFilter);
  const [filterData, setFilterData] = useState<{
    [key: string]: number | string;
  }>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isDrawerOpened, setDrawerOpened] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState({});

  const {
    data: advanceReportData,
    isLoading: isLoadingAdvanceReport,
    refetch,
  } = useQuery<MasraffResponse>({
    queryKey: ["advanceReports", filter],
    queryFn: async () => getAdvanceReports(filter),
  });

  const initialAdvanceReportFilterState = [
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
      selectionData: expenseReportSearchTypes,
    },
    {
      id: "statuses",
      type: "multi-select",
      placeholder: "Durumu",
      value: undefined,
      selectionData: reportStatusList,
    },
  ];

  const [advanceReportFilterState, setAdvanceReportFilterState] = useState<
    filterStateType[]
  >(initialAdvanceReportFilterState);

  const onClickFilter = () => {
    setFilter({ ...filter, ...filterData });
  };

  const changeStatus = (isOpen: boolean) => {
    setDrawerOpened(isOpen);
    if (!isOpen) setSelectedAdvance({});
  };

  const onClickAdvanceReportDetail = (id: any) => {
    if (advanceReportData) {
      const currentRow = advanceReportData.results.filter(
        (item: any) => item.id === id
      );
      setSelectedAdvance(currentRow[0]);
    }
    changeStatus(true);
  };

  useEffect(() => {
    setFilter(defaultFilter);
    const differences: Record<string, any> = {};

    advanceReportFilterState.forEach((item) => {
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
  }, [advanceReportFilterState]);

  useEffect(() => {
    refetch();
  }, [isDrawerOpened]);
  return (
    <>
      {isDrawerOpened && (
        <AdvanceReportDrawer
          isOpen={isDrawerOpened}
          changeStatus={changeStatus}
          data={selectedAdvance}
        />
      )}
      <FilterWrapper
        pageName={t("labels.advanceReport")}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        onAddClick={() => {
          setSelectedAdvance({});
          changeStatus(true);
        }}
        activeFilters={
          advanceReportFilterState.filter((f) => f.value !== undefined).length
        }
        filters={
          <Filters
            filters={advanceReportFilterState.map((f: any) => {
              return {
                ...f,
                onValueChange: (value: any) => {
                  let newValue = [...advanceReportFilterState];
                  const index = newValue.findIndex(
                    (filter) => filter.id === f.id
                  );

                  if (index !== -1) {
                    newValue[index] = {
                      ...newValue[index],
                      value,
                    };
                  }
                  setAdvanceReportFilterState(newValue);
                },
              };
            })}
            onClearValues={() => {
              setFilter(defaultFilter);
              setFilterData({});
              setAdvanceReportFilterState(initialAdvanceReportFilterState);
            }}
            onClickFilter={onClickFilter}
          />
        }
      />
      {isLoadingAdvanceReport ? (
        <Loading />
      ) : (
        <>
          {advanceReportData && (
            <AdvanceReportTable
              data={advanceReportData?.results}
              onOpenRow={(id) => onClickAdvanceReportDetail(id)}
            />
          )}
          <div style={{ padding: "10px" }}>
            <p>
              {t("labels.page")} {currentPage + 1}/
              {advanceReportData?.totalPages}
            </p>
            <p style={{ paddingTop: "5px" }}>
              {t("labels.totalResult")}: {advanceReportData?.totalCount}
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
      )}
    </>
  );
}
