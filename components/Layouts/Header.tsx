"use client";

import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/features/user";
import Sidebar from "./Sidebar";
import {
  MasraffColorType,
  MasraffSpacerSize,
} from "@fabrikant-masraff/masraff-core";
import { MaButton, MaSpacer, MaText } from "@fabrikant-masraff/masraff-react";
import styles from "./index.module.css";
import "../../app/globals.css";

interface HeaderProps {
  children: React.ReactNode;
}

const Header: NextPage<HeaderProps> = ({ children }) => {
  const [userString, setUserString] = useState<any>("");
  const { t } = useTranslation();
  const router = useRouter();
  const { firstName, lastName } = userString && JSON.parse(userString);
  const dispatch = useAppDispatch();
  const rowBlockClassname =
    "ma-display-flex ma-display-flex-row ma-display-flex-align-items-center";

  useEffect(() => {
    setUserString(localStorage.getItem("user"));
  }, []);

  return (
    <div className="full-screen">
      <div
        className={`${styles.header} ma-default-background ma-size-padding-left-16 ma-size-padding-right-16 ma-elevation-shadow-one ma-display-flex ma-display-flex-row ma-display-flex-justify-content-spacebetween`}
      >
        <div className={`${rowBlockClassname}`}>
          <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
          <h3 className="ma-ultraviolet-color ma-body-text-weight-bold">
            masraff
          </h3>
        </div>
        <div className={`${rowBlockClassname}`}>
          <MaSpacer size={MasraffSpacerSize.S} orientation="horizontal" />
          {firstName ? (
            <MaText>
              <span>{firstName + " " + lastName}</span>
            </MaText>
          ) : (
            <span className="skeleton-box"></span>
          )}
          <MaSpacer size={MasraffSpacerSize.M} orientation="horizontal" />
          <MaButton
            colorType={MasraffColorType.Primary}
            onMaClick={() => {
              dispatch(logoutUser());
              router.push("/login");
            }}
          >
            <span>{t("labels.logOut")}</span>
          </MaButton>
          <MaSpacer size={MasraffSpacerSize.Xl} orientation="horizontal" />
        </div>
      </div>

      <div style={{ marginTop: "50px" }} className="ma-display-flex">
        <div className={styles.sidebarColumn}>
          <div>
            <Sidebar />
          </div>
        </div>
        <div className={styles.mainColumn}>
          <div>
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
