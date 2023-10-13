import { BlobImage } from "@/components/BlobImage";
import { advanceReportColumns } from "@/utils/data";
import { isEqual, statusTagPicker } from "@/utils/helpers";
import { AdvanceReportTableData } from "@/utils/types";
import {
  MasraffColorName,
  MasraffColorType,
  MasraffFillStyle,
  MasraffIconNames,
  MasraffSize,
} from "@fabrikant-masraff/masraff-core";
import {
  MaAvatar,
  MaButton,
  MaCheckbox,
  MaContainer,
  MaDisplayTable,
  MaDisplayTableBody,
  MaDisplayTableCell,
  MaDisplayTableRow,
  MaIcon,
  MaTag,
  MaTooltip,
} from "@fabrikant-masraff/masraff-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AdvanceReportTableProps {
  onOpenRow?(arg: any): void;
  data: any;
}

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

          value = <BlobImage isThumbnail file={`${fileId}.jpg`} />;
        }

        processedData[pair.field] = value;
      }
    }

    processedDataList.push(processedData);
  }
  processedDataList.forEach((dataObj) => {
    for (const key in dataObj) {
      if (dataObj.hasOwnProperty(key) && dataObj[key] === "") {
        dataObj[key] = "-";
      }
    }
  });

  return processedDataList;
}

export default function AdvanceReportTable({
  onOpenRow = () => {},
  data,
}: AdvanceReportTableProps) {
  const [tableColumnWidths, setTableColumnWidths] = useState([
    { columnId: "id", value: 150, unit: "px", sticky: true },
    { columnId: "name", value: 20, unit: "%" },
    { columnId: "userEmail", value: 200, unit: "px" },
    { columnId: "subCompanyName", value: 20, unit: "%" },
    { columnId: "approverFullName", value: 20, unit: "%" },
    { columnId: "statusText", value: 20, unit: "%" },
    { columnId: "approvedDate", value: 20, unit: "%" },
    { columnId: "sendDate", value: 20, unit: "%" },
    { columnId: "details", value: 58, unit: "px" },
  ]);
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<any>(undefined);
  const [constrained, setConstrained] = useState(false);

  const combinedColumns = advanceReportColumns.map((column) => {
    const width = tableColumnWidths.find(
      (widthObj) => widthObj.columnId === column.field
    );

    if (width) {
      return {
        field: column.field,
        value: width.value,
        unit: width.unit,
        title: column.title,
      };
    }

    return column;
  });

  const orderedData: Array<AdvanceReportTableData> =
    processAndOrderDataByFieldTitlePairs(data, advanceReportColumns);

  useEffect(() => {
    const isStatusExceeding = orderedData.some(
      (object) => object.statusText && object.statusText.length > 10
    );

    const updatedColumnWidths = tableColumnWidths.map((column) => {
      if (column.columnId === "id") {
        return { ...column, value: isStatusExceeding ? 220 : 150, unit: "px" };
      }
      return column;
    });

    const widthsAreDifferent = !tableColumnWidths.every((column, index) =>
      isEqual(column, updatedColumnWidths[index])
    );

    if (widthsAreDifferent) {
      setTableColumnWidths(updatedColumnWidths);
    }
  }, [orderedData, tableColumnWidths]);
  return (
    <MaContainer
      fullWidth
      direction="column"
      verticalAlignment="top"
      backgroundColor={{ color: MasraffColorName.White }}
      monitorResize
      onMaResized={(e) => {
        if (e.target.offsetWidth < 1000) {
          setConstrained(true);
        } else {
          setConstrained(false);
        }
      }}
    >
      <MaDisplayTable
        style={{ borderRadius: "0px" }}
        columnWidths={
          constrained
            ? tableColumnWidths
            : (tableColumnWidths.filter(
                (c) =>
                  c.columnId === "userEmail" ||
                  c.columnId === "id" ||
                  c.columnId === "details"
              ) as any)
        }
      >
        <MaDisplayTableBody>
          <MaDisplayTableRow sticky={true} header={true}>
            {combinedColumns
              .filter((c) => c.field !== "statusText")
              .map((c) => {
                return (
                  <MaDisplayTableCell
                    style={{ boxShadow: "none" }}
                    key={c.field}
                    columnId={c.field}
                  >
                    <MaContainer
                      fullHeight={true}
                      verticalAlignment="center"
                      horizontalGap={8}
                      style={{ wordBreak: "break-word" }}
                    >
                      {c.field === "id" && (
                        <MaCheckbox
                          onMaClick={(e) => {
                            e.stopPropagation();
                            e.detail.stopPropagation();
                          }}
                        ></MaCheckbox>
                      )}
                      {c.field !== "details" && <span>{t(c.title)}</span>}
                      {c.field === "details" && (
                        <MaButton disabled fillStyle={MasraffFillStyle.Ghost}>
                          <MaIcon
                            slot="left-icon"
                            iconName={MasraffIconNames.DotsHorizontal}
                          />
                        </MaButton>
                      )}
                    </MaContainer>
                  </MaDisplayTableCell>
                );
              })}
          </MaDisplayTableRow>
          {orderedData.map((r, i) => {
            return (
              <MaDisplayTableRow
                onMaMouseOver={() => {
                  setHovered(r.id);
                }}
                onMaMouseLeave={() => {
                  if (hovered === r.id) {
                    setHovered(undefined);
                  }
                }}
                key={r.id + i}
                onMaClick={() => onOpenRow(r.id)}
                style={{
                  cursor: "pointer",
                  transition: "all 0.15s linear",
                  transform:
                    hovered && hovered !== r.id
                      ? `scale(0.99, 0.99)`
                      : `scale(1, 1)`,
                  opacity: hovered && hovered !== r.id ? `0.5` : `1`,
                }}
              >
                {Object.entries(r).map((c, j) => {
                  if (c[0] !== "statusText") {
                    return (
                      <MaDisplayTableCell
                        columnId={c[0]}
                        key={c[1] + "row" + i + "column" + j}
                        style={{
                          boxShadow: "none",
                          backgroundColor:
                            hovered === r.id
                              ? "color-mix(in srgb, var(--ma-color-primary) 10%, white)"
                              : undefined,
                        }}
                        ellipsis={c[0] === "subCompanyName"}
                      >
                        <MaTooltip>
                          <style>{`.ma-tooltip-inner-target { overflow: hidden; text-overflow: ellipsis; }`}</style>
                          <span>{c[1]}</span>
                          <span slot="target">
                            {c[0] === "subCompanyName" && c[1]}
                          </span>
                        </MaTooltip>

                        {c[0] !== "subCompanyName" && (
                          <MaContainer
                            horizontalGap={8}
                            fullWidth={true}
                            distribute="edges"
                            fullHeight={true}
                            verticalAlignment="center"
                            style={{
                              wordBreak: "break-word",
                            }}
                          >
                            {c[0] === "userEmail" && (
                              <MaAvatar
                                size={MasraffSize.Small}
                                firstName={c[1]}
                                lastName={'M'}
                                userId={r.userEmail} // should change
                              />
                            )}
                            {c[0] === "id" ? (
                              <MaContainer width={56}>{c[1]}</MaContainer>
                            ) : (
                              <span>{c[1]}</span>
                            )}

                            {c[0] === "id" && (
                              <MaTag colorType={statusTagPicker(r.statusText)}>
                                {r.statusText}
                              </MaTag>
                            )}
                          </MaContainer>
                        )}
                      </MaDisplayTableCell>
                    );
                  }
                })}
                <MaDisplayTableCell
                  columnId={"details"}
                  key={"details" + i}
                  style={{
                    boxShadow: "none",
                    backgroundColor:
                      hovered === r.id
                        ? "color-mix(in srgb, var(--ma-color-primary) 10%, white)"
                        : undefined,
                  }}
                >
                  <MaButton
                    fillStyle={MasraffFillStyle.Ghost}
                    onMaClick={(e) => {
                      e.stopPropagation();
                      e.detail.stopPropagation();
                    }}
                  >
                    <MaIcon
                      slot="left-icon"
                      iconName={MasraffIconNames.DotsHorizontal}
                    />
                  </MaButton>
                </MaDisplayTableCell>
              </MaDisplayTableRow>
            );
          })}
        </MaDisplayTableBody>
      </MaDisplayTable>
    </MaContainer>
  );
}
