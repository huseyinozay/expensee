"use client";


import { useRef, useState } from "react";
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
import { filterObjectsByIdAndName } from "@/utils/helpers";
import {
  expenseReportColumns,
  waitingApprovalReportColumns,
} from "@/utils/data";
import {
  deliveryStatusList,
  expenseSearchTypes,
  globalUserObject,
  paymentMethodList,
  statusList,
} from "@/utils/utils";


type InputData = {
  name: string;
  value: number | undefined;
};

export default function ExpenseReport() {
  const { t } = useTranslation();
  const { userId } = globalUserObject;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReportDetail, setOpenReportDetail] = useState(false);
  const [reset, setReset] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
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
  const rowBlock =
    "ma-display-flex ma-display-flex-row ma-display-flex-align-items-center ma-size-margin-bottom-8";

  const [filter, setFilter] = useState<{ [key: string]: any }>(defaultFilter);
  const [filterData, setFilterData] = useState<{
    [key: string]: number | string;
  }>({});

  

  const today = new Date();
  const min = new Date(
    today.getFullYear() - 5,
    today.getMonth(),
    today.getDate()
  );
  const max = new Date(today.getFullYear(), today.getMonth(), today.getDate());

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
  });

  let subCompanies: GenericObject[] = [];
  if (subCompaniesQuery)
    subCompanies = filterObjectsByIdAndName(subCompaniesQuery);

  const changeStatus: any = (isOpen: boolean) => {
    setIsOpen(isOpen);
    refetch();
  };
  const changeDetailStatus: any = (isOpen: boolean) => {
    setOpenReportDetail(isOpen);
  };
  const setDateRange = (data: Array<Date | undefined>) => {
    if (data[0] !== undefined) {
      filterData["createDateStart"] = data[0]?.toISOString();
    }
    if (data[1] !== undefined) {
      filterData["createDateEnd"] = data[1]?.toISOString();
    }
  };
  const input = (data: InputData) => {
    if (data.value !== undefined) {
      filterData[data.name] = data.value;
    } else if (data.value === undefined) {
      delete filterData[data.name];
    }
  };
  const resetFilterData = () => {
    setFilter(defaultFilter);
    setFilterData({});
    setReset(!reset);
    inputRef.current?.clearValue();
    dateInputRef.current?.clearValue();
  };

  const onClickExpenseReportDetail: any = (id: any) => {
    if (expenseReportData) {
      const currentRow = expenseReportData.filter(
        (item: any) => item.id === id
      );
      setRow(currentRow[0]);
    }
  };

  return (
    <>
      <h4 style={{ borderBottom: "2px solid #fbd14b ", height: "50px" }}>
        {t("labels.expenseReports")}
      </h4>
      <MaSpacer size={MasraffSpacerSize.M} />

      <div className="ma-display-flex ma-display-flex-column">
        <MaTabStrip
          tabContainerId="report-container"
          className="ma-size-margin-bottom-16"
        >
          <MaTabItem tabContentId="report">{t("labels.form")}</MaTabItem>
          <MaTabItem tabContentId="awaiting-approval">
            {t("labels.awaitingApproval")}
          </MaTabItem>
        </MaTabStrip>
        <div>
          <MaTabContainer
            activeTabContentId="report"
            tabContainerId="report-container"
          >
            {
              <MaTabContent tabContentId="report">
                <div
                  className="ma-display-flex ma-display-flex-column"
                  style={{ width: "2000px" }}
                >
                  <div>
                    <MaButton
                      onMaClick={() => {
                        setRow({})
                        changeStatus(true);
                      }}
                      className="ma-size-padding-right-16"
                    >
                      {t("labels.add")}
                    </MaButton>
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
                          marginObject={{
                            left: 0,
                            top: 0,
                            bottom: 0,
                            right: 0,
                          }}
                          orientation="horizontal"
                        />
                        <MaSpacer
                          size={MasraffSpacerSize.M}
                          orientation="vertical"
                        />
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
                                shouldCloseOnSelect
                                onMaDateChange={(e) => {
                                  Array.isArray(e.target.value) &&
                                    setDateRange(e.target.value);
                                }}
                                ref={dateInputRef}
                              />
                              <MaSpacer
                                size={MasraffSpacerSize.M}
                                orientation="horizontal"
                              />
                            </div>
                            <div className={`${rowBlock}`}>
                              <Dropdown
                                input={input}
                                placeholder="Türü"
                                selectData={expenseSearchTypes}
                                valueName="type"
                                reset={reset}
                              />
                              <MaSpacer
                                size={MasraffSpacerSize.S}
                                orientation="horizontal"
                              />
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
                              <MaSpacer
                                size={MasraffSpacerSize.S}
                                orientation="horizontal"
                              />
                            </div>
                            <div className={`${rowBlock}`}>
                              <Dropdown
                                input={input}
                                placeholder="Durumu"
                                selectData={statusList}
                                valueName="statuses"
                                reset={reset}
                              />
                              <MaSpacer
                                size={MasraffSpacerSize.S}
                                orientation="horizontal"
                              />
                            </div>
                            <div className={`${rowBlock}`}>
                              <Dropdown
                                input={input}
                                placeholder="Etiket"
                                selectData={tagData}
                                valueName="tagIds"
                                reset={reset}
                              />
                              <MaSpacer
                                size={MasraffSpacerSize.S}
                                orientation="horizontal"
                              />
                            </div>
                            <div className={`${rowBlock}`}>
                              <Dropdown
                                input={input}
                                placeholder="Organizasyon"
                                selectData={subCompanies}
                                valueName="tagIds"
                                reset={reset}
                              />
                              <MaSpacer
                                size={MasraffSpacerSize.S}
                                orientation="horizontal"
                              />
                            </div>

                            <div className={`${rowBlock}`}>
                              <Dropdown
                                input={input}
                                placeholder="Masraf Merkezi"
                                selectData={ohpCodeData}
                                valueName="ohpCodeIds"
                                reset={reset}
                              />
                              <MaSpacer
                                size={MasraffSpacerSize.S}
                                orientation="horizontal"
                              />
                            </div>
                            <div className={`${rowBlock}`}>
                              <Dropdown
                                input={input}
                                placeholder="Teslim Durumu"
                                selectData={deliveryStatusList}
                                valueName="isDelivered"
                                reset={reset}
                              />
                              <MaSpacer
                                size={MasraffSpacerSize.S}
                                orientation="horizontal"
                              />
                            </div>
                            <div className={`${rowBlock}`}>
                              <Dropdown
                                input={input}
                                placeholder="Ödeme Tipi"
                                selectData={paymentMethodList}
                                valueName="paymentMethodTypes"
                                reset={reset}
                              />
                              <MaSpacer
                                size={MasraffSpacerSize.S}
                                orientation="horizontal"
                              />
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

                              <MaSpacer
                                size={MasraffSpacerSize.S}
                                orientation="horizontal"
                              />
                            </div>
                          </div>
                        </MaField>
                      </div>
                    </MaAccordion>
                  </div>
                  <MaSpacer size={MasraffSpacerSize.M} />

                  {/* page begins here */}
                  {isLoadingReports ? (
                    <Loading />
                  ) : (
                    <>
                      {expenseReportData && expenseReportData.length > 0 ? (
                        <>
                          <div>
                            <DataTable
                              column={expenseReportColumns}
                              data={expenseReportData}
                              changeStatus={changeStatus}
                              changeStatus2={changeDetailStatus}
                              hasSecondaryInteraction
                              setRowId={onClickExpenseReportDetail}
                            />
                          </div>
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
                </div>
              </MaTabContent>
            }
            <MaTabContent tabContentId="awaiting-approval">
              {waitingApprovalReportsData.length > 0 ? (
                <DataTable
                  column={waitingApprovalReportColumns}
                  data={waitingApprovalReportsData}
                  changeStatus={changeStatus}
                  setRowId={onClickExpenseReportDetail}
                />
              ) : (
                <NoData />
              )}
            </MaTabContent>
          </MaTabContainer>
        </div>
      </div>
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
    </>
  );
}
