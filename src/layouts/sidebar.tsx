import {
  MasraffColorType,
  MasraffIconNames,
  MasraffSpacerSize,
} from "@fabrikant-masraff/masraff-core";
import {
  MaSpacer,
  MaButton,
  MaTree,
  MaTreeItem,
  MaIcon,
  MaText,
} from "@fabrikant-masraff/masraff-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
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
}
