import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  MasraffColorType,
  MasraffIconNames,
} from "@fabrikant-masraff/masraff-core";
import {
  MaIcon,
  MaText,
  MaTree,
  MaTreeItem,
} from "@fabrikant-masraff/masraff-react";

const Sidebar = () => {
  const { t } = useTranslation();
  const menuItems = [
    {
      href: "/expense",
      title: "labels.expenses",
      icon: "Banknotes",
    },
    {
      href: "/expense-report",
      title: "labels.expenseReports",
      icon: "Document",
    },
  ];
  return (
    <div>
      <MaTree>
        {menuItems.map(({ href, title, icon }) => (
          <div key={title}>
            <Link href={href}>
              <MaTreeItem>
                <MaIcon
                  color={MasraffColorType.Warning}
                  // @ts-ignore
                  iconName={MasraffIconNames[icon]}
                ></MaIcon>
                <MaText colorType={MasraffColorType.White}>{t(title)}</MaText>
              </MaTreeItem>
            </Link>
          </div>
        ))}
      </MaTree>
    </div>
  );
};

export default Sidebar;
