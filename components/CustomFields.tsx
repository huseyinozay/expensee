import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { useUserState } from "@/context/user";
import { getUserEmails } from "@/app/api/expense";
import { uploadCustomFieldFile } from "@/app/api/expenseCustomReport";
import Dropdown from "./Dropdown";
import { BlobImage } from "./BlobImage";
import { MaButton, MaInput, MaText } from "@fabrikant-masraff/masraff-react";
import {
  MasraffColorType,
  MasraffFillStyle,
  MasraffSelectionType,
  MasraffShape,
  MasraffSize,
  MasraffTypographyFontStyles,
} from "@fabrikant-masraff/masraff-core";
import {
  filterObjectsByIdAndGivenField,
  filterObjectsByIdAndValue,
} from "@/utils/helpers";

interface CustomFieldsProps {
  field: any;
  index: number;
  data: any;
  setData: (newData: any) => void;
}

export function CustomFields({
  field,
  index,
  data,
  setData,
}: CustomFieldsProps) {
  const { t } = useTranslation();
  const { companyId } = useUserState();
  const containerName = `prod-${companyId}`;
  const [file, setFile] = useState<string>("");
  const [postedFilename, setPostedFileName] = useState<string>("");
  const { getRootProps, getInputProps } = useDropzone({
    //@ts-ignore
    accept: "image/*",
    onDrop: (acceptedFile) => {
      uploadCustomFieldFile(acceptedFile[0], containerName, setPostedFileName);
    },
    multiple: false,
  });

  const { data: userList } = useQuery<UserEmailData[]>({
    queryKey: ["userEmails"],
    queryFn: async () => getUserEmails(),
  });
  let userEmails: GenericObject[] = [];
  if (userList)
    userEmails = filterObjectsByIdAndGivenField(userList, "fullName");

  const getCustomValues = (data: any) => {
    let ids;
    if (data.customValue.includes(",")) {
      ids = data.customValue.split(",").map((id: string) => parseInt(id));
    } else {
      ids = [parseInt(data.customValue)];
    }

    const values = ids.map((id: any) => {
      const customFieldValue = data.customFieldValues.find(
        (val: { id: any }) => val.id === id
      );

      return customFieldValue ? customFieldValue.value : null;
    });

    return values;
  };

  const handleSelectChange = (input: DropdownSelection) => {
    const tempData = [...data];
    //@ts-ignore
    tempData[index][input.name] = String(input.value);

    setData(tempData);
  };

  const handleCustomFieldsChange = (
    event: any,
    index: number,
    type: string = "not date"
  ) => {
    const tempData = [...data];
    if (type === "date") {
      if (
        JSON.stringify(event.target.value) ===
        JSON.stringify(new Date(data[index].customValue))
      )
        return;
      if (typeof event.target.value === "object") {
        let rawDate = event.target.value.toString();
        rawDate = new Date(event.target.value);
        const date = rawDate.toISOString();
        tempData[index].customValue = date;
      }
    } else {
      tempData[index].customValue = event.target.value;
    }
    setData(tempData);
  };

  const changeInputElement = () => {
    let inputElement;
    switch (field.valueType) {
      case 0:
        inputElement = (
          <MaInput
            fullWidth
            onMaInput={(e) => handleCustomFieldsChange(e, index)}
            value={field.customValue ? String(field.customValue) : ""}
          />
        );
        break;
      case 1:
      case 2:
        inputElement = (
          <MaInput
            fullWidth
            value={field.customValue ? String(field.customValue) : ""}
            type="number"
            showInputError={false}
            onMaInput={(e) => handleCustomFieldsChange(e, index)}
          />
        );
        break;
      case 3:
        inputElement = (
          <div
            style={{ color: "Red", paddingTop: "8px", paddingBottom: "8px" }}
          >
            {/* <MaDateInput
                fullWidth
                max={new Date()}
                value={
                  !field.customValue ? undefined : new Date(field.customValue)
                }
                onMaDateChange={(e) => handleCustomFieldsChange(e, index, "date")}
                shouldCloseOnSelect
              /> */}
            After solving blocksfabrikk bug, date input will come here
          </div>
        );
        break;
      case 4:
        if (field.customFieldValues) {
          inputElement = (
            <Dropdown
              selectionType={
                field.customFieldValues.length > 1
                  ? MasraffSelectionType.Multiple
                  : MasraffSelectionType.Single
              }
              input={handleSelectChange}
              placeholder={
                field.customValue ? getCustomValues(field) : t("labels.select")
              }
              selectData={filterObjectsByIdAndValue(field.customFieldValues)}
              valueName="customValue"
            />
          );
        }
        break;
      case 5:
        inputElement = (
          <Dropdown
            input={handleSelectChange}
            placeholder={
              field.customValue ? field.customValue : t("labels.select")
            }
            selectData={userEmails}
            valueName="customValue"
            isSelectValueByName
          />
        );
        break;
      case 6:
        inputElement = (
          <section className="container">
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <MaButton
                fillStyle={MasraffFillStyle.Solid}
                colorType={MasraffColorType.Primary}
                size={MasraffSize.Normal}
                shape={MasraffShape.Rectangular}
              >
                <p>{"Dosya Yükle"}</p>
              </MaButton>
            </div>
            {file && (
              <aside style={{ paddingTop: "10px" }}>
                <BlobImage file={file} />
              </aside>
            )}
          </section>
        );
        break;
    }

    return inputElement;
  };

  useEffect(() => {
    if (field.valueType === 6 && field.customValue) {
      setFile(field.customValue);
    }
  }, []);

  useEffect(() => {
    if (postedFilename !== "") {
      setFile(postedFilename);
      field.customValue = postedFilename;
    }
  }, [postedFilename]);

  return (
    <div>
      <MaText
        textStyle={MasraffTypographyFontStyles.Ghosted}
        className="ma-display-flex ma-size-margin-bottom-8 ma-size-margin-top-8"
      >
        {field.fieldName}
      </MaText>
      {changeInputElement()}
    </div>
  );
}
