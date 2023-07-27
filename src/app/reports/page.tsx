"use client";

import Image from "next/image";
import styles from "../page.module.css";
import ApiService from "@/apiService";
import { useEffect, useState } from "react";

const api = new ApiService();

export default function Reports() {
  const authData = {
    grant_type: "password",
    username: "huseyin.ozay@masraff.co",
    password: 145236,
    client_id: "adminApp",
  };
  const filter = {
    includes: "user,approver,subCompany,user.company",
    clientId: "adminApp",
    page: 0,
    pageSize: 10,
    ascending: "false",
    searchTypeId: 0,
  };
  const [token, setToken] = useState();
  async function logIn() {
    const response = await api.post("token", authData);
    console.log(response);
    //@ts-ignore
    setToken(response.access_token);
    return response;
  }

  async function getReports() {
    const response = await api.get("v1/reports/getDefaultReports", filter);
    console.log(response);
  }

  useEffect(() => {
    //@ts-ignore
    localStorage.setItem("access_token", token);
  }, [token]);
  return (
    <main className={styles.main}>
      Bir takım güzellikler...
      <button onClick={logIn}>login</button>
      <button onClick={getReports}>getReports</button>
    </main>
  );
}
