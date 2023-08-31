import {
  getCustomReportForm,
  updateCustomReport,
} from "@/app/api/expenseCustomReport";
import { emptyCustomReportForm } from "@/utils/utils";
import {
  MaInputCustomEvent,
  MasraffColorType,
  MasraffFillStyle,
  MasraffShape,
  MasraffSize,
} from "@fabrikant-masraff/masraff-core";
import {
  MaButton,
  MaDrawer,
  MaDrawerContent,
  MaDrawerFooter,
  MaDrawerHeader,
  MaGrid,
  MaGridRow,
  MaInput,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Dropdown from "../Dropdown";
import { filterObjectsByIdAndName } from "@/utils/helpers";
import { CustomFields } from "../CustomFields";

interface CustomReportDrawerProps {
  isOpen: boolean;
  changeStatus(arg: boolean): void;
  data?: any;
}

export default function CustomReportDrawer({
  isOpen,
  changeStatus,
  data,
}: CustomReportDrawerProps) {
  const { t } = useTranslation();
  const { id: formId } = data;

  const { data: customReportForm, status } = useQuery<CustomReportForm>({
    queryKey: ["customForm"],
    queryFn: async () => getCustomReportForm(formId),
  });

  const [selectedForm, setSelectedForm] = useState<CustomReportForm>(
    emptyCustomReportForm
  );
  const [customFields, setCustomFields] = useState<any[]>([]);

  const updateCustomReportRecord = useMutation(updateCustomReport, {
    onSuccess: () => {
      changeStatus(false);
    },
  });

  const handleInputChange = (e: MaInputCustomEvent<any>, field: string) => {
    const newValue = e.target.value;

    setSelectedForm((prevState) => ({
      ...prevState,
      report: {
        ...prevState.report,
        [field]: newValue,
      },
    }));
  };

  const handleChange = (data: DropdownSelection) => {
    setSelectedForm((prevState) => ({
      ...prevState,
      report: {
        ...prevState.report,
        [data.name]: data.value,
      },
    }));
  };

  useEffect(() => {
    if (selectedForm.report.name === "" && status === "success") {
      setSelectedForm(JSON.parse(JSON.stringify(customReportForm)));
      setCustomFields(
        JSON.parse(JSON.stringify(customReportForm.report.customFields))
      );
    }
  }, [customReportForm]);

  useEffect(() => {
    setSelectedForm((prevState) => ({
      ...prevState,
      report: {
        ...prevState.report,
        customFields: customFields,
      },
    }));
  }, [customFields]);

  return (
    <>
      <MaButton>Click to open</MaButton>
      <MaDrawer isOpen={isOpen} onMaClose={() => changeStatus(false)}>
        <MaDrawerHeader>
          <span style={{ fontFamily: "sans-serif" }}>{data.name} - </span>
          <span
            style={{ fontStyle: "italic", color: "gray", fontSize: "16px" }}
          >
            {data.customReportType}
          </span>
        </MaDrawerHeader>
        <MaDrawerContent>
          <MaGrid>
            <MaGridRow>
              <div style={{ paddingBottom: "8px" }}>
                <MaText className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8">
                  {t("labels.reportName")}
                </MaText>
                <MaInput
                  fullWidth
                  value={customReportForm?.report.name}
                  type="text"
                  showInputError={false}
                  onMaChange={(el) => {
                    handleInputChange(el, "name");
                  }}
                />
              </div>

              {customReportForm?.userBySubCompyList && (
                <div style={{ paddingTop: "8px", paddingBottom: "8px" }}>
                  <MaText className="ma-display-flex ma-size-margin-bottom-3 ma-size-margin-top-8">
                    {t("labels.organizationPlace")}
                  </MaText>
                  <Dropdown
                    input={handleChange}
                    disabled={customReportForm.userBySubCompyList.length < 2}
                    placeholder={
                      !data.subCompanyName
                        ? t("labels.select")
                        : data.subCompanyName
                    }
                    selectData={filterObjectsByIdAndName(
                      customReportForm.userBySubCompyList
                    )}
                    valueName="subCompanyId"
                  />
                </div>
              )}

              {customFields && customFields.length > 0 && (
                <div>
                  {customFields.map((field, index) => (
                    <div
                      style={{ paddingTop: "8px", paddingBottom: "8px" }}
                      key={field.id}
                    >
                      <CustomFields
                        field={field}
                        index={index}
                        data={customFields}
                        setData={(value) => setCustomFields(value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </MaGridRow>
          </MaGrid>
        </MaDrawerContent>
        <MaDrawerFooter>
          <MaButton
            fillStyle={MasraffFillStyle.Ghost}
            colorType={MasraffColorType.Neutral}
            size={MasraffSize.Normal}
            shape={MasraffShape.Rectangular}
          >
            {t("labels.cancel")}
          </MaButton>
          <MaButton
            fillStyle={MasraffFillStyle.Solid}
            colorType={MasraffColorType.Primary}
            size={MasraffSize.Normal}
            shape={MasraffShape.Rectangular}
            onMaClick={() => {
              updateCustomReportRecord.mutate(selectedForm.report);
            }}
          >
            {t("labels.update")}
          </MaButton>
        </MaDrawerFooter>
      </MaDrawer>
    </>
  );
}
