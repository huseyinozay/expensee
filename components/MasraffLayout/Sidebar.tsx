"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MasraffColorName,
  MasraffColorShadeName,
  MasraffColorType,
  MasraffFillStyle,
  MasraffIconNames,
} from "@fabrikant-masraff/masraff-core";
import {
  MaButton,
  MaContainer,
  MaIcon,
} from "@fabrikant-masraff/masraff-react";
import Link from "next/link";

const sections = [
  {
    iconName: MasraffIconNames.Receipt,
    label: "labels.expenses",
    href: "/expense",
  },
  {
    iconName: MasraffIconNames.Document,
    label: "labels.expenseReports",
    href: "/expense-report",
  },
  {
    iconName: MasraffIconNames.DocumentArrowUp,
    label: "labels.requestForms",
    href: "/expense-custom-report",
  },
  {
    iconName: MasraffIconNames.Card,
    label: "labels.advanceReport",
    href: "/advance-report",
  },
  {
    iconName: MasraffIconNames.Airplane,
    label: "labels.tripReport",
    href: "/trip-report",
  },
  {
    iconName: MasraffIconNames.DocumentArrowDown,
    label: "labels.expensePolicy",
    href: "/expense-policy",
  },
  {
    iconName: MasraffIconNames.Branch,
    label: "labels.workflow",
    href: "/workflow",
  },
];
export function Sidebar() {
  const { t } = useTranslation();
  const [minimized, setMinimized] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<
    { target: any; label: string } | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState("labels.expenses");
  return (
    <MaContainer
      slot="sidebar"
      backgroundColor={{
        color: MasraffColorName.White,
        shadeName: MasraffColorShadeName.Lightest,
      }}
      elevation="one"
      verticalAlignment="top"
      horizontalAlignment="left"
      direction="column"
      verticalGap={4}
      maxWidth={!minimized ? 240 : undefined}
      padding={16}
      distribute="edges"
    >
      <MaContainer
        direction="column"
        verticalGap={4}
        verticalAlignment="top"
        horizontalAlignment="left"
        fullWidth={true}
      >
        {sections.map((s) => {
          const active = s.label === currentPage;
          return (
            <MaContainer key={s.label} fullWidth={true}>
              <Link href={s.href} style={{ width: "100%" }}>
                <MaButton
                  colorType={
                    active ? MasraffColorType.Primary : MasraffColorType.Neutral
                  }
                  fillStyle={MasraffFillStyle.Ghost}
                  fullWidth={!minimized}
                  alignContentToMargins={!minimized ? true : false}
                  active={active}
                  onMaMouseEnter={(e) => {
                    const target = e.target;
                    setHoveredItem({ target, label: s.label });
                  }}
                  onMaFocus={() => {
                    const target = document.getElementById(s.label);
                    setHoveredItem({ target, label: s.label });
                  }}
                  onMaMouseLeave={() => setHoveredItem(undefined)}
                  onMaBlur={() => setHoveredItem(undefined)}
                  onMaClick={() => {
                    setCurrentPage(s.label);
                  }}
                >
                  {!minimized && <span>{t(s.label)}</span>}
                  <MaIcon iconName={s.iconName} slot="left-icon" />
                </MaButton>
                {minimized && hoveredItem && hoveredItem.label === s.label && (
                  <MaContainer
                    padding={{ left: 8, right: 8, top: 4, bottom: 4 }}
                    style={{
                      transition: "all 0.1s linear",
                      position: "absolute",
                      left: minimized ? "100%" : 0,
                    }}
                    borderRadius={6}
                    margin={{ left: 8, right: 0, top: 0, bottom: 0 }}
                    backgroundColor={{ color: MasraffColorName.Black }}
                    textColor={{ color: MasraffColorName.White }}
                    minWidth={320}
                  >
                    <span>{t(hoveredItem?.label)}</span>
                  </MaContainer>
                )}
              </Link>
            </MaContainer>
          );
        })}
      </MaContainer>
      <MaButton
        onMaClick={() => setMinimized(!minimized)}
        colorType={MasraffColorType.Neutral}
        fillStyle={MasraffFillStyle.Ghost}
        fullWidth={!minimized}
        alignContentToMargins={!minimized ? true : false}
      >
        {!minimized && <span>Minimize</span>}
        <MaIcon
          iconName={
            !minimized
              ? MasraffIconNames.ArrowsFromLineLeft
              : MasraffIconNames.ArrowsFromLineRight
          }
          slot="left-icon"
        />
      </MaButton>
    </MaContainer>
  );
}
