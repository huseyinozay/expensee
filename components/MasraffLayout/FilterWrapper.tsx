import {
  MasraffColorType,
  MasraffFillStyle,
  MasraffIconNames,
} from "@fabrikant-masraff/masraff-core";
import {
  MaAccordion,
  MaBadge,
  MaButton,
  MaContainer,
  MaIcon,
  MaSeparator,
  MaTabItem,
  MaTabStrip,
} from "@fabrikant-masraff/masraff-react";
import { useTranslation } from "react-i18next";

interface FilterWrapperProps {
  filters?: JSX.Element;
  activeFilters?: number;
  filtersOpen: boolean;
  setFiltersOpen: (filtersOpen: boolean) => void;
  onAddClick?: () => void;
  pageName?: string;
}

export function FilterWrapper({
  filters,
  activeFilters,
  pageName,
  filtersOpen,
  setFiltersOpen,
  onAddClick,
}: FilterWrapperProps) {
  const { t } = useTranslation();

  return (
    <MaContainer
      elevation="zero"
      padding={16}
      fullWidth={true}
      direction="column"
      verticalGap={filtersOpen ? 16 : undefined}
    >
      <MaContainer
        fullWidth={true}
        verticalAlignment="center"
        horizontalAlignment="center"
        distribute="edges"
      >
        {pageName && <h5>{pageName}</h5>}
        <MaContainer
          verticalAlignment="center"
          horizontalAlignment="center"
          horizontalGap={16}
        >
          {filters && activeFilters !== 0 ? (
            <MaBadge value={activeFilters?.toString()}>
              <MaButton
                active={filtersOpen}
                onMaClick={() => setFiltersOpen(!filtersOpen)}
                fillStyle={MasraffFillStyle.Ghost}
              >
                <MaIcon iconName={MasraffIconNames.Filter} slot="left-icon" />
                <span>{t("labels.filter")}</span>
              </MaButton>
            </MaBadge>
          ) : (
            <MaButton
              active={filtersOpen}
              onMaClick={() => setFiltersOpen(!filtersOpen)}
              fillStyle={MasraffFillStyle.Ghost}
            >
              <span>{t("labels.filter")}</span>
              <MaIcon iconName={MasraffIconNames.Filter} slot="left-icon" />
            </MaButton>
          )}
          {onAddClick ? (
            <MaButton
              fillStyle={MasraffFillStyle.Solid}
              colorType={MasraffColorType.Constructive}
              onMaClick={onAddClick}
            >
              <span>{t("labels.add")}</span>
              <MaIcon iconName={MasraffIconNames.CirclePlus} slot="left-icon" />
            </MaButton>
          ) : null}
        </MaContainer>
      </MaContainer>
      {filters && (
        <MaAccordion isOpen={filtersOpen} className="ma-display-fullwidth">
          <MaSeparator
            orientation="horizontal"
            marginObject={{ left: 0, top: 0, bottom: 16, right: 0 }}
          />
          {filters}
        </MaAccordion>
      )}

      {/* <MaContainer direction="column" fullWidth>
        <MaSeparator
          marginObject={{
            left: 0,
            top: filtersOpen ? 0 : 16,
            bottom: 8,
            right: 0,
          }}
        />
        <MaTabStrip tabContainerId="report-container">
          <MaTabItem tabContentId="report">{t("labels.form")}</MaTabItem>
          <MaTabItem tabContentId="awaiting-approval">
            {t("labels.awaitingApproval")}
          </MaTabItem>
        </MaTabStrip>
      </MaContainer> */}
    </MaContainer>
  );
}
