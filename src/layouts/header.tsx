import React, { ReactNode, useEffect } from "react";
import { NextPage } from "next";
import store from "../store";
import {
  MasraffColorType,
  MasraffSpacerSize,
} from "@fabrikant-masraff/masraff-core";
import { MaButton, MaSpacer, MaText } from "@fabrikant-masraff/masraff-react";
// import { UserMenu } from "../UserMenu/UserMenu";
import { useState } from "react";
import Sidebar from "./sidebar";
import { useTranslation } from "react-i18next";

type Props = {
  children: ReactNode;
};

const Header: NextPage<Props> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [user, setUser]: object | null = useState();
  const { t } = useTranslation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = window.localStorage.getItem("userName");
    if (user) {
      setUserName(user);
    }
    // console.log(user);
  }, []);
  // const userName = user.firstName + " " + user.lastName;
  const rowBlock =
    "ma-display-flex ma-display-flex-row ma-display-flex-align-items-center";

  return (
    <div className="allPage">
      <div
        style={{
          zIndex: 4,
          position: "fixed",
          top: 0,
          width: "100%",
          height: "50px",
        }}
        className="ma-default-background ma-size-padding-left-16 ma-size-padding-right-16 ma-elevation-shadow-one ma-display-flex ma-display-flex-row ma-display-flex-justify-content-spacebetween"
      >
        <div className={`${rowBlock}`}>
          <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
          <h3 className="ma-ultraviolet-color ma-body-text-weight-bold">
            masraff
          </h3>
        </div>
        <div className={`${rowBlock}`}>
          <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
          <MaText>
            <span>{userName}</span>
          </MaText>
          <MaSpacer size={MasraffSpacerSize.M} orientation="horizontal" />
          <MaButton colorType={MasraffColorType.Primary}>
            <span>{t("labels.logOut")}</span>
          </MaButton>
          <MaSpacer size={MasraffSpacerSize.Xl} orientation="horizontal" />
        </div>
      </div>

      <div className="ma-display-flex">
        <div className="sidebar-column">
          <div style={{ marginTop: "50px" }}>
            <Sidebar />
          </div>
        </div>
        <div className="main-column">
          <div style={{ marginTop: "50px" }}>
            <div className="scroll-container">
              <main>{children}</main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
