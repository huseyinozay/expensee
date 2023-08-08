import React from "react";
import styles from "./Loading.module.css";

export const Loading = () => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50vh",
        flexDirection: "column",
      }}
    >
      <div className={styles.loader}>
        <span>M</span>
        <span>A</span>
        <span>S</span>
        <span>R</span>
        <span>A</span>
        <span>F</span>
        <span>F</span>
      </div>
    </div>
  );
};
