import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BlobImage } from "@/components/BlobImage";
import {
  MasraffColorName,
  MasraffColorShadeName,
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
import { expensePolicyColumns } from "@/utils/data";
import { ExpenseTableData } from "@/utils/types";
import { getIconForExpense, isEqual, statusTagPicker } from "@/utils/helpers";

interface ExpenseTableProps {
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

  return processedDataList;
}

export function ExpensePolicyTable({
  onOpenRow = () => {},
  data,
}: ExpenseTableProps) {
  const [tableColumnWidths, setTableColumnWidths] = useState([
    { columnId: "id", value: 220, unit: "px", sticky: true },
    { columnId: "guid", value: 72, unit: "px" },
    { columnId: "user", value: 180, unit: "px" },
    { columnId: "expenseType.expenseTypeLimit", value: 20, unit: "%" },
    { columnId: "combinedAmount", value: 20, unit: "%" },
    { columnId: "limitDifference", value: 20, unit: "%" },
    { columnId: "status", value: 25, unit: "%" },
    { columnId: "paymentMethod", value: 20, unit: "%" },
    { columnId: "expenseTypeId", value: 25, unit: "%" },
    { columnId: "expenseDate", value: 20, unit: "%" },
    { columnId: "createDate", value: 20, unit: "%" },
    { columnId: "details", value: 58, unit: "px" },
  ]);
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<any>(undefined);
  const [constrained, setConstrained] = useState(false);

  const combinedColumns = expensePolicyColumns.map((column) => {
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

  const orderedData: Array<ExpenseTableData> =
    processAndOrderDataByFieldTitlePairs(data, expensePolicyColumns);

  useEffect(() => {
    const isStatusExceeding = orderedData.some(
      (object) => object.status && object.status.length > 7
    );

    const updatedColumnWidths = tableColumnWidths.map((column) => {
      if (column.columnId === "id") {
        return { ...column, value: isStatusExceeding ? 270 : 220, unit: "px" };
      }
      return column;
    });

    const widthsAreDifferent = !tableColumnWidths.every((column, index) =>
      isEqual(column, updatedColumnWidths[index])
    );

    if (widthsAreDifferent) {
      setTableColumnWidths(updatedColumnWidths);
    }
  }, [orderedData]);

  return (
    <MaContainer
      fullWidth
      fullHeight
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
                  c.columnId === "user" ||
                  c.columnId === "merchant" ||
                  c.columnId === "id" ||
                  c.columnId === "details"
              ) as any)
        }
      >
        <MaDisplayTableBody>
          <MaDisplayTableRow sticky={true} header={true}>
            {combinedColumns
              .filter((c) => c.field !== "guid" && c.field !== "status")
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
                      style={{ wordBreak: "break-word", textAlign: "center" }}
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
                        <MaButton fillStyle={MasraffFillStyle.Ghost}>
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
                  if (c[0] !== "guid" && c[0] !== "status") {
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
                        ellipsis={c[0] === "merchant"}
                      >
                        <MaTooltip>
                          <style>{`.ma-tooltip-inner-target { overflow: hidden; text-overflow: ellipsis; }`}</style>
                          <span>{c[1]}</span>
                          <span slot="target">
                            {c[0] === "merchant" && c[1]}
                          </span>
                        </MaTooltip>
                        {c[0] !== "merchant" && (
                          <MaContainer
                            fullWidth={true}
                            fullHeight={true}
                            verticalAlignment="top"
                          >
                            <MaContainer
                              horizontalGap={8}
                              fullWidth={true}
                              distribute="edges"
                              style={{
                                wordBreak: "break-word",
                                textAlign: "center",
                              }}
                            >
                              {/* {c[0] === "id" && (
                                <MaCheckbox
                                  onMaClick={(e) => {
                                    e.stopPropagation();
                                    e.detail.stopPropagation();
                                  }}
                                ></MaCheckbox>
                              )}// may necessary in future*/}
                              {c[0] === "id" && (
                                <MaContainer
                                  padding={4}
                                  borderRadius={6}
                                  backgroundColor={{
                                    color: MasraffColorName.Mustard,
                                    shadeName: MasraffColorShadeName.Lightest,
                                  }}
                                >
                                  <MaIcon
                                    size={16}
                                    color={MasraffColorName.Mustard}
                                    shadeName={MasraffColorShadeName.Darkest}
                                    iconName={getIconForExpense(
                                      typeof r.expenseTypeId === "string"
                                        ? r.expenseTypeId
                                        : "Diğer"
                                    )}
                                  />
                                </MaContainer>
                              )}
                              {c[0] === "user" && (
                                <MaAvatar
                                  size={MasraffSize.Small}
                                  firstName={c[1].split(" ")[0]}
                                  lastName={c[1].split(" ")[1]}
                                  userId="1234567asdasd"
                                />
                              )}
                              {c[0] !== "guid" && <span>{c[1]}</span>}
                              {c[0] === "id" && (
                                <MaContainer
                                  width={24}
                                  height={24}
                                  elevation="one"
                                  borderRadius={4}
                                >
                                  {r.guid}
                                </MaContainer>
                              )}
                              {c[0] === "id" && (
                                <MaTag colorType={statusTagPicker(r.status)}>
                                  {r.status}
                                </MaTag>
                              )}
                            </MaContainer>
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
