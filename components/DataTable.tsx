/* eslint-disable react/jsx-key */
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BlobImage } from "./BlobImage";
import { MasraffSize, MasraffIconNames } from "@fabrikant-masraff/masraff-core";
import {
  MaDisplayTable,
  MaDisplayTableBody,
  MaDisplayTableRow,
  MaDisplayTableCell,
  MaButton,
  MaIcon,
  MaCheckbox,
} from "@fabrikant-masraff/masraff-react";
import "../app/globals.css";

type Column = {
  field: string;
  title: string;
};

type DataTableProps = {
  column: Array<Column>;
  data: Array<Object>;
  isInteractive?: boolean;
  changeStatus?(arg: boolean): void;
  changeStatus2?(arg: boolean): void;
  hasSecondaryInteraction?: boolean;
  setRowId?(arg: number): void;
  multiSelect?: boolean;
};

function processAndOrderDataByFieldTitlePairs(
  data: any,
  fieldTitlePairs: Array<{
    field: string;
    title: string;
    formatter?: (val: any) => any;
  }>
): any {
  let processedDataList = [];

  for (let dataItem of data) {
    let processedData: any = {};

    for (let pair of fieldTitlePairs) {
      if (pair.field in dataItem) {
        let value = pair.formatter
          ? pair.formatter(dataItem[pair.field])
          : dataItem[pair.field];

        if (typeof value === "string" && value.startsWith("BLOBIMAGE_")) {
          const fileId = value.replace("BLOBIMAGE_", "");
          console.log('fileId::',fileId)
          value = <BlobImage isThumbnail file={`${fileId}.jpg`} />;
        }

        processedData[pair.field] = value;
      }
    }

    processedDataList.push(processedData);
  }

  return processedDataList;
}
export default function DataTable({
  column,
  data,
  changeStatus = () => {},
  changeStatus2 = () => {},
  isInteractive = true,
  hasSecondaryInteraction = false,
  setRowId = () => {},
  multiSelect = false,
}: DataTableProps) {
  const fields = column.map((column) => column.field);
  const orderedData: Array<object> = processAndOrderDataByFieldTitlePairs(
    data,
    column
  );

  const { t } = useTranslation();

  useEffect(() => {
    const elements = document.getElementsByClassName("table-cell");

    if (elements) {
      for (var i = 0; i < elements.length; i++) {
        const shadowRoot = elements[i].shadowRoot;
        const style = document.createElement("style");
        style.innerHTML = `.ma-display-table-cell-content { width: initial !important}`;
        if (shadowRoot) shadowRoot.appendChild(style);
      }
    }
  }, []);

  function renderCellValue(value: any) {
    if (React.isValidElement(value)) {
      return value;  
    }
    return <div dangerouslySetInnerHTML={{ __html: value }} />;
  }

  return (
    <MaDisplayTable size={MasraffSize.Normal}>
      <MaDisplayTableBody>
        <MaDisplayTableRow sticky={true} header={true}>
          <MaDisplayTableCell
            class="table-cell"
            className="data-table-formatter"
            columnId="actions"
          ></MaDisplayTableCell>
          {column.map((hv) => {
            return (
              <MaDisplayTableCell
                class="table-cell"
                className="data-table-formatter"
                style={{
                  minWidth: "100px",
                }}
                key={hv.field}
                columnId={hv.field}
              >
                {t(hv.title)}
              </MaDisplayTableCell>
            );
          })}
        </MaDisplayTableRow>
        {orderedData
          .filter((_x, i) => i < 100)
          .map((row: any) => {
            return (
              <MaDisplayTableRow key={row?.id}>
                <MaDisplayTableCell
                  class="table-cell"
                  className="data-table-formatter"
                  key={row?.id}
                  columnId="actions"
                >
                  {isInteractive ? (
                    <div>
                      {!multiSelect ? (
                        <div>
                          <MaButton
                            size={MasraffSize.Small}
                            onMaClick={() => {
                              changeStatus(true);
                              setRowId(row?.id);
                            }}
                          >
                            <MaIcon
                              size={hasSecondaryInteraction ? 18 : 24}
                              iconName={MasraffIconNames.Pencil}
                            />
                          </MaButton>
                          {hasSecondaryInteraction && (
                            <MaButton
                              style={{ marginLeft: "5px" }}
                              size={MasraffSize.Small}
                              onMaClick={() => {
                                changeStatus2(true);
                                setRowId(row?.id);
                              }}
                            >
                              <MaIcon
                                size={18}
                                iconName={MasraffIconNames.Repository}
                              />
                            </MaButton>
                          )}
                        </div>
                      ) : (
                        <MaCheckbox
                          onMaClick={() => {
                            setRowId(row?.id);
                          }}
                        ></MaCheckbox>
                      )}
                    </div>
                  ) : (
                    <MaIcon
                      size={24}
                      iconName={MasraffIconNames.CircleInfoSymbol}
                    />
                  )}
                </MaDisplayTableCell>
                {Object.entries(row)
                  .filter((row) => fields.includes(row[0]))
                  .map((en) => {
                    return (
                      <MaDisplayTableCell
                        class="table-cell"
                        className="data-table-formatter"
                        key={en[0]}
                        columnId={en[0]}
                      >
                        {/* @ts-ignore */}
                        {renderCellValue(en[1])}
                      </MaDisplayTableCell>
                    );
                  })}
              </MaDisplayTableRow>
            );
          })}
      </MaDisplayTableBody>
    </MaDisplayTable>
  );
}
