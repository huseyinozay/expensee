/* eslint-disable react/jsx-key */
import {
  MasraffSelectionType,
  MasraffIconNames,
} from "@fabrikant-masraff/masraff-core";
import {
  MaSelect,
  MaIcon,
  MaPopover,
  MaList,
  MaListItem,
  MaTagInput,
} from "@fabrikant-masraff/masraff-react";
import { useEffect, useRef } from "react";

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
};

export default function Dropdown({
  placeholder,
  selectData,
  input,
  valueName,
  reset,
  disabled =false,
}: DropDownProps) {
  const rowBlock =
    "ma-display-flex ma-display-flex-row ma-display-flex-align-items-center";

  const selectRef = useRef<any>();

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
    clearSelection();
  }, [reset]);

  return (
    <MaSelect
      selectionType={MasraffSelectionType.Single}
      fullWidth={true}
      onMaItemSelect={(e) => {
        handleChange(e);
      }}
      ref={selectRef}
      shouldCloseOnSelect
      disabled={disabled}
    >
      <MaTagInput
        placeholder={placeholder}
        className="ma-custom-select-class"
        slot="select-target"
      >
        <MaIcon iconName={MasraffIconNames.CaretDown} slot="right" />
      </MaTagInput>
      <MaPopover>
        <MaList>
          {selectData && selectData.map((value) => {
            return (
              <MaListItem
                key={`key-${value.id}`}
                value={value.id}
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
