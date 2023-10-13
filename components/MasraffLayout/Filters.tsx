"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MasraffFillStyle,
  MasraffIconNames,
  MasraffSelectionType,
  MasraffSize,
  MasraffSpacerSize,
} from "@fabrikant-masraff/masraff-core";
import {
  MaButton,
  MaContainer,
  MaDateInput,
  MaIcon,
  MaInput,
  MaList,
  MaListItem,
  MaNumericInput,
  MaPopover,
  MaSelect,
  MaSpacer,
  MaTagInput,
} from "@fabrikant-masraff/masraff-react";
import { GenericObject } from "@/utils/types";

export function Filter(props: {
  id: string;
  type:
    | "string"
    | "number"
    | "date"
    | "dateRange"
    | "single-select"
    | "multi-select";
  value: any;
  placeholder: string;
  selectionData?: GenericObject[];
  selectionType?: MasraffSelectionType;
  onValueChange: (value: any) => void;
  clearValuesSession: boolean;
}) {
  const inputRef = useRef<
    | HTMLMaInputElement
    | HTMLMaNumericInputElement
    | HTMLMaDateInputElement
    | null
  >(null);
  const endInputRef = useRef<
    | HTMLMaInputElement
    | HTMLMaNumericInputElement
    | HTMLMaDateInputElement
    | null
  >(null);
  const [editing, setIsEditing] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focusElement();
    }
    if (editing && endInputRef.current) {
      endInputRef.current.focusElement();
    }
  }, [editing]);

  useEffect(() => {
    if (
      props.clearValuesSession === true &&
      inputRef.current &&
      endInputRef.current
    ) {
      inputRef.current?.clearValue();
      endInputRef.current?.clearValue();
    }
  }, [props.clearValuesSession]);

  return (
    <MaContainer
      borderRadius={8}
      padding={8}
      elevation="one"
      verticalAlignment="center"
      horizontalAlignment="left"
      height={36}
    >
      <MaIcon
        iconName={
          props.type === "string"
            ? MasraffIconNames.T
            : props.type === "number"
            ? MasraffIconNames.Hash
            : props.type === "single-select"
            ? MasraffIconNames.CircleCheckmark
            : props.type === "multi-select"
            ? MasraffIconNames.OrderedList
            : MasraffIconNames.Calendar
        }
        size={16}
      />
      <MaSpacer size={MasraffSpacerSize.Xs} orientation="horizontal" />
      {props.type === "string" && (
        <MaInput
          id={props.id}
          fillStyle={MasraffFillStyle.Ghost}
          onMaBlur={() => {
            if (editing) {
              setIsEditing(!editing);
            }
          }}
          placeholder={props.placeholder}
          ref={inputRef as any}
          value={props.value}
          resizeWithText={true}
          size={MasraffSize.Small}
          onMaChange={(e) => props.onValueChange(e.target.value)}
          onMaKeyDown={(e) => {
            const key = e.detail.key;
            if (key === "Enter" || key === "Escape") {
              e.target.blurElement();
            }
          }}
        />
      )}
      {props.type === "number" && (
        <MaNumericInput
          id={props.id}
          fillStyle={MasraffFillStyle.Ghost}
          onMaBlur={() => {
            if (editing) {
              setIsEditing(!editing);
            }
          }}
          placeholder={props.placeholder}
          ref={inputRef as any}
          value={props.value}
          resizeWithText={true}
          size={MasraffSize.Small}
          onMaChange={(e) => props.onValueChange(e.target.value)}
          onMaKeyDown={(e) => {
            const key = e.detail.key;
            if (key === "Enter" || key === "Escape") {
              e.target.blurElement();
            }
          }}
        />
      )}
      {props.type === "date" && (
        <MaDateInput
          id={props.id}
          fillStyle={MasraffFillStyle.Ghost}
          onMaBlur={() => {
            if (editing) {
              setIsEditing(!editing);
            }
          }}
          resizeWithText={true}
          placeholder={props.placeholder}
          ref={inputRef as any}
          value={props.value}
          size={MasraffSize.Small}
          onMaDateChange={(e) => {
            props.onValueChange(e.target.value);
          }}
          onMaKeyDown={(e) => {
            const key = e.detail.key;
            if (key === "Enter" || key === "Escape") {
              e.target.blurElement();
            }
          }}
        />
      )}
      {props.type === "dateRange" && (
        <>
          <MaDateInput
            id={props.id + "start"}
            fillStyle={MasraffFillStyle.Ghost}
            onMaBlur={() => {
              if (editing) {
                setIsEditing(undefined);
              }
            }}
            resizeWithText={true}
            placeholder={props.placeholder}
            ref={inputRef as any}
            value={props.value && props.value[0] ? props.value[0] : undefined}
            size={MasraffSize.Small}
            onMaDateChange={(e) => {
              props.onValueChange([
                e.target.value,
                props.value && props.value[1] ? props.value[1] : undefined,
              ]);
            }}
            onMaKeyDown={(e) => {
              const key = e.detail.key;
              if (key === "Enter" || key === "Escape") {
                e.target.blurElement();
              }
            }}
          />
          <MaContainer padding={{ left: 4, right: 4, top: 0, bottom: 0 }}>
            <MaIcon iconName={MasraffIconNames.KeyTab} size={16} />
          </MaContainer>
          <MaDateInput
            id={props.id + "end"}
            fillStyle={MasraffFillStyle.Ghost}
            onMaBlur={() => {
              if (editing) {
                setIsEditing(undefined);
              }
            }}
            resizeWithText={true}
            placeholder={props.placeholder}
            ref={endInputRef as any}
            value={props.value && props.value[1] ? props.value[1] : undefined}
            size={MasraffSize.Small}
            onMaDateChange={(e) => {
              props.onValueChange([
                props.value && props.value[0] ? props.value[0] : undefined,
                e.target.value,
              ]);
            }}
            onMaKeyDown={(e) => {
              const key = e.detail.key;
              if (key === "Enter" || key === "Escape") {
                e.target.blurElement();
              }
            }}
          />
        </>
      )}
      {props.type === "single-select" && (
        <MaSelect
          onMaItemSelect={(e) => {
            props.onValueChange(e.target.value);
          }}
          ref={inputRef as any}
          placeholder={props.placeholder}
          shouldCloseOnSelect={true}
        >
          <MaInput
            fillStyle={MasraffFillStyle.Ghost}
            slot="select-target"
            resizeWithText={true}
            size={MasraffSize.Small}
            onMaBlur={() => {
              if (editing) {
                setIsEditing(undefined);
              }
            }}
          />
          <MaPopover>
            <MaList>
              {props.selectionData &&
                props.selectionData.map((value) => {
                  return (
                    <MaListItem
                      key={`key-${value}`}
                      value={value.id}
                      label={value.name}
                    >
                      <span>{value.name}</span>
                    </MaListItem>
                  );
                })}
            </MaList>
          </MaPopover>
        </MaSelect>
      )}
      {props.type === "multi-select" && (
        <MaSelect
          selectionType={MasraffSelectionType.Multiple}
          onMaValueCleared={(e) => {
            props.onValueChange(e.target.value);
          }}
          onMaItemSelect={(e) => {
            props.onValueChange(e.target.value);
          }}
          ref={inputRef as any}
        >
          <MaTagInput
            placeholder={props.placeholder}
            styleOverride={{
              input: !props.value
                ? `:host([size][shape][fill-style]) input { max-width: ${
                    (props.placeholder
                      ? props.placeholder.length
                      : "Select...".length) * 1
                  }ch }`
                : `:host([size][shape][fill-style]) input { max-width: 15px }`,
            }}
            slot="select-target"
            fillStyle={MasraffFillStyle.Ghost}
            size={MasraffSize.Small}
            showClearAffordance={false}
            onMaBlur={() => {
              if (editing) {
                setIsEditing(undefined);
              }
            }}
          />
          <MaPopover>
            <MaList>
              {props.selectionData &&
                props.selectionData.map((value) => {
                  return (
                    <MaListItem
                      key={`key-${value}`}
                      value={value.id}
                      label={value.name}
                    >
                      <span>{value.name}</span>
                    </MaListItem>
                  );
                })}
            </MaList>
          </MaPopover>
        </MaSelect>
      )}
    </MaContainer>
  );
}
export function Filters(props: {
  filters: {
    id: string;
    type:
      | "string"
      | "number"
      | "date"
      | "single-select"
      | "multi-select"
      | "dateRange";
    placeholder: string;
    value: any;
    selectionData?: GenericObject[];
    onValueChange: (value: any) => void;
  }[];
  onClearValues: () => void;
  onClickFilter: () => void;
}) {
  const { t } = useTranslation();
  const [clearValuesSession, setClearValuesSession] = useState(false);
  return (
    <MaContainer
      horizontalGap={8}
      verticalAlignment="top"
      horizontalAlignment="left"
      distribute="edges"
      fullWidth={true}
    >
      <MaContainer
        horizontalGap={8}
        verticalAlignment="center"
        horizontalAlignment="left"
        wrap={true}
        shrink={true}
      >
        {props.filters.map((filter) => {
          return (
            <Filter
              id={filter.id}
              key={filter.id}
              placeholder={filter.placeholder}
              type={filter.type}
              value={filter.value}
              selectionData={filter.selectionData}
              onValueChange={(change) => {
                setClearValuesSession(false);
                filter.onValueChange(change);
              }}
              clearValuesSession={clearValuesSession}
            />
          );
        })}
      </MaContainer>
      <MaContainer>
        <MaButton
          disabled={
            props.filters.filter((f) => f.value !== undefined).length === 0
          }
          fillStyle={MasraffFillStyle.Ghost}
          size={MasraffSize.Normal}
          onMaClick={() => {
            setClearValuesSession(true);
            props.onClearValues();
          }}
        >
          <span>{t("labels.clearFilters")}</span>
          <MaIcon iconName={MasraffIconNames.Cross} slot="left-icon" />
        </MaButton>
        <MaButton
          disabled={
            props.filters.filter((f) => f.value !== undefined).length === 0
          }
          fillStyle={MasraffFillStyle.Ghost}
          size={MasraffSize.Normal}
          onMaClick={props.onClickFilter}
        >
          <span>{t("labels.filter")}</span>
          <MaIcon iconName={MasraffIconNames.Filter} slot="left-icon" />
        </MaButton>
      </MaContainer>
    </MaContainer>
  );
}
