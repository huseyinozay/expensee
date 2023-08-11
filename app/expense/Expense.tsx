"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import i18n from "@/i18/i18";
import Dropdown from "@/components/Dropdown";
import DataTable from "@/components/DataTable";
import {
  getExpenseCategoryData,
  getExpenses,
  getTagData,
} from "../api/expense";
import { Loading } from "@/components/Loading/Loading";
import ExpenseDrawer from "@/components/Drawers/ExpenseDrawer";
import {
  MaAccordion,
  MaButton,
  MaDateRangeInput,
  MaField,
  MaInput,
  MaSeparator,
  MaSpacer,
} from "@fabrikant-masraff/masraff-react";
import {
  MasraffColorType,
  MasraffSpacerSize,
} from "@fabrikant-masraff/masraff-core";
import { filterObjectsByIdAndName } from "@/utils/helpers";
import { expenseColumns } from "@/utils/data";
import {
  expenseSearchTypes,
  paymentMethodList,
  statusList,
} from "@/utils/utils";

type InputData = {
  name: string;
  value: number | undefined;
};

export default function Expense() {
  const [currentPage, setCurrentPage] = useState(0);
  const defaultFilter = {
    includes: "user, expenseType",
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
  const [isDrawerOpened, setDrawerOpened] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState({});
  const [reset, setReset] = useState(false);

  const inputRef = useRef<any>();
  const dateInputRef = useRef<any>();
  const rowBlock =
    "ma-display-flex ma-display-flex-row ma-display-flex-align-items-center ma-size-padding-bottom-16";
  const today = new Date();
  const min = new Date(
    today.getFullYear() - 5,
    today.getMonth(),
    today.getDate()
  );
  const max = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const {
    data: expenseData,
    isLoading: isLoadingExpenses,
    isFetching: isFetchingExpenses,
    error: expenseError,
    refetch,
  } = useQuery<ExpenseData>({
    queryKey: ["expenses", filter],
    queryFn: async () => getExpenses(filter),
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

  const changeStatus: any = (isOpen: boolean) => {
    setDrawerOpened(isOpen);
    setSelectedExpense({});
  };

  const onClickExpenseDetail: any = (id: any) => {
    if (expenseData) {
      const currentRow = expenseData.results.filter(
        (item: any) => item.id === id
      );
      setSelectedExpense(currentRow[0]);
    }
  };

  const input = (data: InputData) => {
    if (data.value !== undefined) {
      filterData[data.name] = data.value;
    } else if (data.value === undefined) {
      delete filterData[data.name];
    }
  };

  const setDateRange = (data: Array<Date | undefined>) => {
    if (data[0] !== undefined) {
      filterData["createDateStart"] = data[0]?.toISOString();
    }
    if (data[1] !== undefined) {
      filterData["createDateEnd"] = data[1]?.toISOString();
    }
  };

  const resetFilterData = () => {
    setFilter(defaultFilter);
    setFilterData({});
    setReset(!reset);
    inputRef.current?.clearValue();
    dateInputRef.current?.clearValue();
  };

  useEffect(() => {
    refetch();
  }, [isDrawerOpened]);

  return (
    <>
      <h4 style={{ borderBottom: "2px solid #fbd14b ", height: "50px" }}>
        {i18n.t("labels.expenses")}
      </h4>
      <MaSpacer size={MasraffSpacerSize.M} />

      <MaButton
        onMaClick={() => {
          changeStatus(true);
          setSelectedExpense({});
        }}
        className="ma-size-padding-right-16"
      >
        {i18n.t("labels.add")}
      </MaButton>
      <MaButton
        onMaClick={() => setIsAccordionOpen(!isAccordionOpen)}
        colorType={MasraffColorType.Primary}
      >
        {i18n.t("labels.filter")}
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
                  min={min}
                  max={max}
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
                <Dropdown
                  input={input}
                  placeholder="Türü"
                  selectData={expenseSearchTypes}
                  valueName="type"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <MaInput
                  placeholder="Aranacak Değer"
                  className="Ma-custom-select-class"
                  slot="select-target"
                  onMaChange={(e) => {
                    filterData["searchValue"] = e.target.value;
                  }}
                  ref={inputRef}
                ></MaInput>
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <Dropdown
                  input={input}
                  placeholder="Durumu"
                  selectData={statusList}
                  valueName="statuses"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <Dropdown
                  input={input}
                  placeholder="Ödeme Tipi"
                  selectData={paymentMethodList}
                  valueName="paymentMethodTypes"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <Dropdown
                  input={input}
                  placeholder="Etiket"
                  selectData={tags}
                  valueName="tagIds"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <Dropdown
                  input={input}
                  placeholder="Kategori"
                  selectData={expenseCategories}
                  valueName="expenseTypeId"
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
                  {i18n.t("labels.search")}
                </MaButton>
                <MaButton onMaClick={resetFilterData}>
                  {i18n.t("labels.clear")}
                </MaButton>

                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
            </div>
          </MaField>
        </div>
      </MaAccordion>

      <MaSpacer size={MasraffSpacerSize.M} />

      {isLoadingExpenses ? (
        <Loading />
      ) : (
        <>
          {expenseData && (
            <DataTable
              column={expenseColumns}
              data={expenseData?.results}
              changeStatus={changeStatus}
              setRowId={onClickExpenseDetail}
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
      {isDrawerOpened && (
        <ExpenseDrawer
          isOpen={isDrawerOpened}
          changeStatus={changeStatus}
          data={selectedExpense}
        />
      )}
    </>
  );
}
