import { dehydrate } from "@tanstack/query-core";
import { getCustomReportsView } from "../api/expenseCustomReport";
import ExpenseCustomReport from "./ExpenseCustomReport";
import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";

export default async function Hydation() {
  const defaultFilter = {
    includes: "user,approver,subCompany",
    clientId: "adminApp",
    page: 0,
    pageSize: 10,
    ascending: "false",
  };
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    ["expenses", defaultFilter],
    getCustomReportsView
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <ExpenseCustomReport />
    </Hydrate>
  );
}
