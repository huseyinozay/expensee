"use client";

import Dropdown from "@/components/Dropdown";
import { statusList } from "@/utils/utils";
import {
  MasraffColorType,
  MasraffSpacerSize,
} from "@fabrikant-masraff/masraff-core";
import {
  MaAccordion,
  MaButton,
  MaDateRangeInput,
  MaField,
  MaInput,
  MaSeparator,
  MaSpacer,
} from "@fabrikant-masraff/masraff-react";
import React, { use, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getCustomReportTypes,
  getCustomReportsView,
} from "../api/expenseCustomReport";
import { filterObjectsByIdAndName } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/Loading/Loading";
import { customFormColumns, expenseColumns } from "@/utils/data";
import DataTable from "@/components/DataTable";

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
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isDrawerOpened, setDrawerOpened] = useState(false);
  const [selectedForm, setSelectedForm] = useState({});
  const [filterData, setFilterData] = useState<{
    [key: string]: number | string;
  }>({});
  const [reset, setReset] = useState(false);

  const inputRef = useRef<any>();
  const dateInputRef = useRef<any>();

  const rowBlock =
    "ma-display-flex ma-display-flex-row ma-display-flex-align-items-center ma-size-padding-bottom-16";
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 5,
    today.getMonth(),
    today.getDate()
  );
  const maxDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const {
    data: customForms,
    isLoading: isLoadingCustomForms,
    refetch,
  } = useQuery<CustomExpenseFormData>({
    queryKey: ["customReports", filter],
    queryFn: async () => getCustomReportsView(filter),
  });

  const { data: customFormTypesData } = useQuery<CustomFormType[]>({
    queryKey: ["reportTypes"],
    queryFn: async () => getCustomReportTypes(),
  });
  let customFormTypes: GenericObject[] = [];
  if (customFormTypesData)
    customFormTypes = filterObjectsByIdAndName(customFormTypesData);

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

  const input = (data: SelectionData) => {
    setFilterData((prevFilter) => {
      if (data.value === undefined) {
        const { [data.name]: _, ...rest } = prevFilter;
        return rest;
      }

      return {
        ...prevFilter,
        [data.name]: data.value,
      };
    });
  };

  const setDateRange = (data: Array<Date | undefined>) => {
    const tempFilterData = { ...filterData };
    if (data[0] !== undefined) {
      tempFilterData["createDateStart"] = data[0]?.toISOString();
    }
    if (data[1] !== undefined) {
      tempFilterData["createDateEnd"] = data[1]?.toISOString();
    }
    setFilterData(tempFilterData);
  };

  const resetFilterData = () => {
    setFilter(defaultFilter);
    setFilterData({});
    setReset(!reset);
    inputRef.current?.clearValue();
    dateInputRef.current?.clearValue();
  };
  return (
    <div>
      <h4 style={{ borderBottom: "2px solid #6a60a9 ", height: "50px" }}>
        {t("labels.requestForms")}
      </h4>
      <MaSpacer size={MasraffSpacerSize.M} />

      <MaButton
        onMaClick={() => setIsAccordionOpen(!isAccordionOpen)}
        colorType={MasraffColorType.Primary}
      >
        {t("labels.filter")}
      </MaButton>

      <MaAccordion isOpen={isAccordionOpen}>
        <div
          style={{ boxSizing: "border-box" }}
          className="ma-size-padding-top-16 ma-size-padding-right-16 ma-size-padding-left-16 ma-display-fullwidth"
        >
          <MaSeparator
            marginObject={{ left: 0, top: 0, bottom: 0, right: 0 }}
            orientation="horizontal"
          />
          <MaSpacer size={MasraffSpacerSize.M} orientation="vertical" />
          <MaField>
            <div
              style={{ flexFlow: "wrap" }}
              className="ma-display-flex ma-display-flex-row"
            >
              <div className={`${rowBlock}`}>
                <MaDateRangeInput
                  locale="tr"
                  min={minDate}
                  max={maxDate}
                  className="ma-custom-filter-date-input-class"
                  fullWidth={true}
                  popoverPlacement="bottom"
                  onMaDateChange={(e) => {
                    Array.isArray(e.target.value) &&
                      setDateRange(e.target.value);
                  }}
                  ref={dateInputRef}
                />
                <MaSpacer size={MasraffSpacerSize.M} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <MaInput
                  placeholder="Form Adı,E-posta veya Form No"
                  className="Ma-custom-select-class"
                  slot="select-target"
                  onMaChange={(e) => {
                    const tempFilterData = { ...filterData };
                    tempFilterData["searchValue"] = e.target.value;
                    setFilterData(tempFilterData);
                  }}
                  ref={inputRef}
                ></MaInput>
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <Dropdown
                  input={input}
                  placeholder={t("labels.status")}
                  selectData={statusList}
                  valueName="statuses"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <Dropdown
                  input={input}
                  placeholder={t("labels.type")}
                  selectData={customFormTypes}
                  valueName="type"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>

              <div className={`${rowBlock}`}>
                <MaButton
                  colorType={MasraffColorType.Primary}
                  onMaClick={() => {
                    setFilter({ ...filter, ...filterData });
                  }}
                  className="ma-size-padding-right-8"
                >
                  {t("labels.search")}
                </MaButton>
                <MaButton onMaClick={resetFilterData}>
                  {t("labels.clear")}
                </MaButton>

                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
            </div>
          </MaField>
        </div>
      </MaAccordion>

      <MaSpacer size={MasraffSpacerSize.M} />

      {isLoadingCustomForms ? (
        <Loading />
      ) : (
        <>
          {customForms && (
            <DataTable
              column={customFormColumns}
              data={customForms.results}
              changeStatus={changeStatus}
              setRowId={onClickFormDetail}
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
    </div>
  );
};

export default ExpenseCustomReport;
