import React from "react";
import { useTranslation } from "react-i18next";
import { MaIcon, MaText } from "@fabrikant-masraff/masraff-react";
import { MasraffIconNames } from "@fabrikant-masraff/masraff-core";

const NoData = () => {
  const { t } = useTranslation();
  return (
    <div className="ma-display-flex ma-size-padding-16">
      <MaIcon size={24} iconName={MasraffIconNames.CircleInfoSymbol} />
      <MaText className="ma-display-flex ma-display-flex-align-items-center ma-body-text-weight-bold ma-size-margin-left-8">{t("labels.noData")}</MaText>
    </div>
  );
};

export default NoData;
