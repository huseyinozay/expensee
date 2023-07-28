"use client";

import DataTable from "@/components/DataTable";
import DropDown from "@/components/DropDown";
import { expenseColumns } from "@/data/columns";
import { useEffect, useRef, useState } from "react";
import i18n from "@/plugins/i18n";
import { getExpenses, getTagData, getExpenseCategoryData } from "@/api/expense";

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
import DrawerExpense from "./drawerExpense";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  expenseSearchTypes,
  paymentMethodList,
  statusList,
} from "@/data/selectData";

type InputData = {
  name: string;
  value: number | undefined;
};

type data = {
  [key: string]: any;
};

export default function Expense() {
  const [expenseData, setExpenseData] = useState<Array<Object>>([]);
  const [tagData, setTagData] = useState<Array<selectDataType>>([]);
  const [expenseCategoryData, setexpenseCategoryData] = useState<
    Array<selectDataType>
  >([]);
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
  const [isOpen, setIsOpen] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [row, setRow] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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

  const expenseQuery = useQuery({
    queryKey: ["expenses", filter],
    queryFn: () => getExpenses(filter),
    onSuccess: (data: data) => {
      setExpenseData(data.results);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
    },
  });

  const tagQuery = useQuery({
    queryKey: ["tags"],
    queryFn: getTagData,
    onSuccess: (data: data) => {
      setTagData(filterObjects(data.results));
    },
  });
  const expenseTypesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getExpenseCategoryData,
    onSuccess: (data: ObjectType[]) => {
      setexpenseCategoryData(filterObjects(data));
    },
  });

  const changeStatu: any = (isOpen: boolean) => {
    setIsOpen(isOpen);
    setRow({});
  };

  const setRowId: any = (id: any) => {
    const currentRow = expenseData.filter((item: any) => item.id === id);
    setRow(currentRow[0]);
  };

  const input = (data: InputData) => {
    if (data.value !== undefined) {
      filterData[data.name] = data.value;
    } else if (data.value === undefined) {
      delete filterData[data.name];
    }
    console.log(data);
    console.log(filterData);
  };

  const setDateRange = (data: Array<Date | undefined>) => {
    if (data[0] !== undefined) {
      filterData["createDateStart"] = data[0]?.toISOString();
    }
    if (data[1] !== undefined) {
      filterData["createDateEnd"] = data[1]?.toISOString();
    }
    console.log(filterData);
  };

  const resetFilterData = () => {
    setFilter(defaultFilter);
    setFilterData({});
    setReset(!reset);
    inputRef.current?.clearValue();
    dateInputRef.current?.clearValue();
  };

  function filterObjects(arr: ObjectType[]) {
    return arr.map((obj) => {
      const { id, name } = obj;
      return { id, name };
    });
  }

  return (
    <>
      <h4 style={{ borderBottom: "2px solid #fbd14b ", height: "50px" }}>
        {i18n.t("labels.expenses")}
      </h4>
      <MaSpacer size={MasraffSpacerSize.M} />

      <MaButton
        onMaClick={() => {
          changeStatu(true);
          setRow({});
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
                <DropDown
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
                <DropDown
                  input={input}
                  placeholder="Durumu"
                  selectData={statusList}
                  valueName="statuses"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <DropDown
                  input={input}
                  placeholder="Ödeme Tipi"
                  selectData={paymentMethodList}
                  valueName="paymentMethodTypes"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <DropDown
                  input={input}
                  placeholder="Etiket"
                  selectData={tagData}
                  valueName="tagIds"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <DropDown
                  input={input}
                  placeholder="Kategori"
                  selectData={expenseCategoryData}
                  valueName="expenseTypeId"
                  reset={reset}
                />
                <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
              </div>
              <div className={`${rowBlock}`}>
                <MaButton
                  colorType={MasraffColorType.Primary}
                  onMaClick={() => {
                    console.log(filterData);
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
      <DataTable
        column={expenseColumns}
        data={expenseData}
        changeStatu={changeStatu}
        setRowId={setRowId}
      />
      <p>
        {i18n.t("labels.page")} {currentPage + 1}/{totalPages}
      </p>
      <p>
        {i18n.t("labels.totalResult")}: {totalCount}
      </p>
      <MaButton
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
      <DrawerExpense isOpen={isOpen} changeStatu={changeStatu} data={row} />
    </>
  );
}
