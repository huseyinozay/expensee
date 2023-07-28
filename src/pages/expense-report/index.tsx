import DataTable from "@/components/DataTable";
import {
  expenseReportColumns,
  waitingApprovalReportColumns,
} from "@/data/columns";
import { useEffect, useRef, useState } from "react";
import ApiService from "@/services/apiService";

const api = new ApiService();
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
import { useQuery } from "@tanstack/react-query";
import {
  getExpensesReport,
  getOhpCodes,
  getSubCompanies,
  getWaitingApprovalReports,
} from "@/api/expenseReport";
import i18n from "@/plugins/i18n";
import DropDown from "@/components/DropDown";
import {
  expenseSearchTypes,
  statusList,
  paymentMethodList,
  deliveryStatusList,
} from "@/data/selectData";
import { getTagData } from "@/api/expense";
import DrawerExpenseReport from "./drawerExpenseReport";
import DrawerReportDetail from "./drawerReportDetail";

type InputData = {
  name: string;
  value: number | undefined;
};
type data = {
  [key: string]: any;
};
type OhpObjectType = {
  [key: string]: any;
  id: string | number;
  name: string;
};
interface OldObject {
  id: number;
  companyOhpCodeValue: string;
}

interface NewObject {
  id: number;
  name: string;
}

export default function Expense() {
  const [expenseData, setExpenseData] = useState<Array<Object>>([]);
  const [waitingApprovalReportsData, setWaitingApprovalReportsData] = useState<
    Array<Object>
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [reset, setReset] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const [tagData, setTagData] = useState<Array<selectDataType>>([]);
  const [subCompanies, setSubCompanies] = useState<Array<selectDataType>>([]);
  const [ohpCodes, setOhpCodes] = useState<Array<selectDataType>>([]);

  const [row, setRow] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
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
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const rowBlock =
    "ma-display-flex ma-display-flex-row ma-display-flex-align-items-center";

  const inputRef = useRef<any>();
  const dateInputRef = useRef<any>();
  const today = new Date();
  const min = new Date(
    today.getFullYear() - 5,
    today.getMonth(),
    today.getDate()
  );
  const max = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const { data } = useQuery({
    queryKey: ["reports", filter],
    queryFn: () => getExpensesReport(filter),
    onSuccess: (data: data) => {
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    },
  });

  const waitingApprovalQuery = useQuery({
    queryKey: ["waitingApprovalReports"],
    queryFn: getWaitingApprovalReports,
    onSuccess: (data: ObjectType) => {
      setWaitingApprovalReportsData(data.results);
    },
  });

  const tagQuery = useQuery({
    queryKey: ["tags"],
    queryFn: getTagData,
    onSuccess: (data: data) => {
      setTagData(filterObjects(data.results));
    },
  });

  const subCompaniesQuery = useQuery({
    queryKey: ["subCompanies"],
    queryFn: getSubCompanies,
    onSuccess: (data: ObjectType[]) => {
      setSubCompanies(filterObjects(data));
    },
  });

  useEffect(() => {
    if (data) {
      setExpenseData(data.results);
    }
  }, [data]);

  const changeStatu: any = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  const changeAddStatu: any = (isOpenAdd: boolean) => {
    setIsOpenAdd(isOpenAdd);
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
  const setRowId: any = (id: any) => {
    const currentRow = expenseData.filter((item: any) => item.id === id);
    setRow(currentRow[0]);
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
        {i18n.t("labels.expenseReports")}
      </h4>
      <MaSpacer size={MasraffSpacerSize.M} />

      <div className="ma-display-flex ma-display-flex-column">
        <MaTabStrip
          tabContainerId="report-container"
          className="ma-size-margin-bottom-16"
        >
          <MaTabItem tabContentId="report">{i18n.t("labels.form")}</MaTabItem>
          <MaTabItem tabContentId="awaiting-approval">
            {i18n.t("labels.awaitingApproval")}
          </MaTabItem>
        </MaTabStrip>
        <div>
          <MaTabContainer
            activeTabContentId="report"
            tabContainerId="report-container"
          >
            <MaTabContent tabContentId="report">
              <div
                className="ma-display-flex ma-display-flex-column"
                style={{ width: "2000px" }}
              >
                <div>
                  <MaButton
                    onMaClick={() => {
                      changeAddStatu(true);
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
                            <DropDown
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
                            <DropDown
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
                            <DropDown
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
                            <DropDown
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
                            <DropDown
                              input={input}
                              placeholder="Masraf Merkezi"
                              selectData={ohpCodes}
                              valueName="ohpCodeIds"
                              reset={reset}
                            />
                            <MaSpacer
                              size={MasraffSpacerSize.S}
                              orientation="horizontal"
                            />
                          </div>
                          <div className={`${rowBlock}`}>
                            <DropDown
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
                            <DropDown
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
                              {i18n.t("labels.search")}
                            </MaButton>
                            <MaButton onMaClick={resetFilterData}>
                              {i18n.t("labels.clear")}
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
                <div>
                  <DataTable
                    column={expenseReportColumns}
                    data={expenseData}
                    changeStatu={changeStatu}
                    setRowId={setRowId}
                  />
                </div>
                <div>
                  {i18n.t("labels.page")} {currentPage + 1}/{totalPages}
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
                </div>
              </div>
            </MaTabContent>
            <MaTabContent tabContentId="awaiting-approval">
              <DataTable
                column={waitingApprovalReportColumns}
                data={waitingApprovalReportsData}
                changeStatu={changeStatu}
                setRowId={setRowId}
              />
            </MaTabContent>
          </MaTabContainer>
        </div>
      </div>

      <DrawerExpenseReport
        isOpen={isOpenAdd}
        changeStatu={changeAddStatu}
        data={row}
      />
      <DrawerReportDetail
        isOpen={isOpen}
        changeStatu={changeStatu}
        data={row}
      />
    </>
  );
}
