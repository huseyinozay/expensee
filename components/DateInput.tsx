import { TripReport } from "@/utils/types";
import { maxDate, minDate } from "@/utils/utils";
import { MasraffFillStyle, MasraffSize } from "@fabrikant-masraff/masraff-core";
import { MaDateInput } from "@fabrikant-masraff/masraff-react";
import React, { RefObject } from "react";
import { useTranslation } from "react-i18next";

interface DateInputFieldProps {
  fieldKey: keyof TripReport;
  currentValue: Date;
  handleInputChange: (
    el: any,
    fieldsOrKey: string | string[],
    isNumeric?: boolean
  ) => void;
  editing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: RefObject<any>;
}

export const DateInputField: React.FC<DateInputFieldProps> = ({
  fieldKey,
  currentValue,
  handleInputChange,
  editing,
  setIsEditing,
  inputRef,
}) => {
  const { t } = useTranslation();
  const handleDateChange = (el: any) => {
    // Adjust the type of `el` based on your event
    if (currentValue !== el.value) {
      handleInputChange(el, fieldKey);
    }
  };

  return (
    <MaDateInput
      id={fieldKey}
      fillStyle={MasraffFillStyle.Solid}
      fullWidth
      size={MasraffSize.Normal}
      max={maxDate}
      min={minDate}
      onMaBlur={() => {
        if (editing) {
          setIsEditing(!editing);
        }
      }}
      resizeWithText
      placeholder={currentValue ? "" : t(`labels.${fieldKey}`)}
      ref={inputRef as any}
      value={currentValue}
      onMaDateChange={(el) => {
        handleDateChange(el);
      }}
      onMaKeyDown={(e) => {
        const keyPress = e.detail.key;
        if (keyPress === "Enter" || keyPress === "Escape") {
          e.target.blurElement();
        }
      }}
      shouldCloseOnSelect
    />
  );
};
