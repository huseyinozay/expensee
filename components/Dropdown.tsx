/* eslint-disable react/jsx-key */
import { useEffect, useRef, useState } from "react";
import {
  MasraffSelectionType,
  MasraffIconNames,
  MasraffFillStyle,
} from "@fabrikant-masraff/masraff-core";
import {
  MaSelect,
  MaIcon,
  MaPopover,
  MaList,
  MaListItem,
  MaInput,
} from "@fabrikant-masraff/masraff-react";
import { GenericObject } from "@/utils/types";

type InputData = {
  name: string;
  value: number | undefined;
};
type DropDownProps = {
  selectData: GenericObject[];
  placeholder: string;
  input: (value: InputData) => void;
  valueName: string;
  reset?: boolean;
  disabled?: boolean;
  selectionType?: MasraffSelectionType;
  isSelectValueByName?: boolean;
};

export default function Dropdown({
  placeholder,
  selectData,
  input,
  valueName,
  reset,
  disabled = false,
  isSelectValueByName = false,
  selectionType = MasraffSelectionType.Single,
}: DropDownProps) {
  const [editing, setIsEditing] = useState<any | undefined>(undefined);

  const rowBlock =
    "ma-display-flex ma-display-flex-row ma-display-flex-align-items-center";

  const selectRef = useRef<HTMLMaSelectElement>();

  const handleChange = (e: any) => {
    // @ts-ignore
    const result: InputData = { name: "", value: [] };
    result.name = valueName;
    result.value = e.target.value;
    input(result);
  };

  const clearSelection = () => {
    selectRef.current?.clearSelection();
  };

  useEffect(() => {
    if (editing && selectRef.current) {
      selectRef.current.focusElement();
    }
  }, [editing]);

  useEffect(() => {
    clearSelection();
  }, [reset]);

  return (
    <MaSelect
      selectionType={selectionType}
      fullWidth={true}
      onMaItemSelect={(e) => {
        handleChange(e);
      }}
      ref={selectRef as any}
      shouldCloseOnSelect
      disabled={disabled}
    >
      <MaInput
        fillStyle={MasraffFillStyle.Solid}
        slot="select-target"
        placeholder={placeholder}
        onMaBlur={() => {
          if (editing) {
            setIsEditing(undefined);
          }
        }}
        resizeWithText
      >
        <MaIcon iconName={MasraffIconNames.CaretDown} slot="right" />
      </MaInput>
      <MaPopover>
        <MaList>
          {selectData &&
            selectData.map((value) => {
              return (
                <MaListItem
                  key={`key-${value.id}`}
                  value={isSelectValueByName ? value.name : value.id}
                  label={value.name}
                >
                  <span className={`${rowBlock}`}>{value.name}</span>
                </MaListItem>
              );
            })}
        </MaList>
      </MaPopover>
    </MaSelect>
  );
}
