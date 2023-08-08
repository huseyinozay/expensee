/* eslint-disable react/jsx-key */
import { useTranslation } from "react-i18next";
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

type Column = {
  field: string;
  title: string;
};

type DataTableProps = {
  column: Array<Column>;
  data: Array<Object>;
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
        processedData[pair.field] = pair.formatter
          ? pair.formatter(dataItem[pair.field])
          : dataItem[pair.field];
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
  return (
    <MaDisplayTable size={MasraffSize.Normal}>
      <MaDisplayTableBody>
        <MaDisplayTableRow sticky={true} header={true}>
          <MaDisplayTableCell columnId="actions"></MaDisplayTableCell>
          {column.map((hv) => {
            return (
              <MaDisplayTableCell key={hv.field} columnId={hv.field}>
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
                <MaDisplayTableCell key={row?.id} columnId="actions">
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
                </MaDisplayTableCell>
                {Object.entries(row)
                  .filter((row) => fields.includes(row[0]))
                  .map((en) => {
                    return (
                      <MaDisplayTableCell key={en[0]} columnId={en[0]}>
                        {/* @ts-ignore */}
                        <div dangerouslySetInnerHTML={{ __html: en[1] }} />
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
