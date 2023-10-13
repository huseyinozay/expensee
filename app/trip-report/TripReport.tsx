"use client";

import { MasraffResponse, filterStateType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getCustomReportsView } from "../api/expenseCustomReport";
import { expenseReportSearchTypes, reportStatusList } from "@/utils/utils";
import { formatDateToGMT } from "@/utils/helpers";
import { FilterWrapper } from "@/components/MasraffLayout/FilterWrapper";
import { Filters } from "@/components/MasraffLayout/Filters";
import { Loading } from "@/components/Loading/Loading";
import AdvanceReportTable from "../advance-report/AdvanceReportTable";
import { MaButton } from "@fabrikant-masraff/masraff-react";
import TripReportDrawer from "@/components/Drawers/TripReportDrawer";

export default function TripReport() {
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
  const [selectedTrip, setSelectedTrip] = useState({});

  const {
    data: tripReportData,
    isLoading: isLoadingTripReport,
    refetch,
  } = useQuery<MasraffResponse>({
    queryKey: ["tripReports", filter],
    staleTime: 60000,
    queryFn: async () => getCustomReportsView(filter),
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

  const [tripReportFilterState, setTripReportFilterState] = useState<
    filterStateType[]
  >(initialAdvanceReportFilterState);

  const onClickFilter = () => {
    setFilter({ ...filter, ...filterData });
  };

  const changeStatus = (isOpen: boolean) => {
    setDrawerOpened(isOpen);
    if (!isOpen) setSelectedTrip({});
  };

  const onClickTripReportDetail = (id: any) => {
    if (tripReportData) {
      const currentRow = tripReportData.results.filter(
        (item: any) => item.id === id
      );
      setSelectedTrip(currentRow[0]);
    }
    changeStatus(true);
  };

  useEffect(() => {
    setFilter(defaultFilter);
    const differences: Record<string, any> = {};

    tripReportFilterState.forEach((item) => {
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
  }, [tripReportFilterState]);

  useEffect(() => {
    refetch();
  }, [isDrawerOpened]);
  return (
    <>
      {isDrawerOpened && (
        <TripReportDrawer
          isOpen={isDrawerOpened}
          changeStatus={changeStatus}
          data={selectedTrip}
        />
      )}
      <FilterWrapper
        pageName={t("labels.tripReport")}
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        onAddClick={() => {
          setSelectedTrip({});
          changeStatus(true);
        }}
        activeFilters={
          tripReportFilterState.filter((f) => f.value !== undefined).length
        }
        filters={
          <Filters
            filters={tripReportFilterState.map((f: any) => {
              return {
                ...f,
                onValueChange: (value: any) => {
                  let newValue = [...tripReportFilterState];
                  const index = newValue.findIndex(
                    (filter) => filter.id === f.id
                  );

                  if (index !== -1) {
                    newValue[index] = {
                      ...newValue[index],
                      value,
                    };
                  }
                  setTripReportFilterState(newValue);
                },
              };
            })}
            onClearValues={() => {
              setFilter(defaultFilter);
              setFilterData({});
              setTripReportFilterState(initialAdvanceReportFilterState);
            }}
            onClickFilter={onClickFilter}
          />
        }
      />
      {isLoadingTripReport ? (
        <Loading />
      ) : (
        <>
          {tripReportData && (
            <AdvanceReportTable
              data={tripReportData?.results}
              onOpenRow={(id) => onClickTripReportDetail(id)}
            />
          )}
          <div style={{ padding: "10px" }}>
            <p>
              {t("labels.page")} {currentPage + 1}/{tripReportData?.totalPages}
            </p>
            <p style={{ paddingTop: "5px" }}>
              {t("labels.totalResult")}: {tripReportData?.totalCount}
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
