import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/query-core";
import { getExpenses } from "../api/expense";
import Expense from "./Expense";



export default async function Hydation() {

  const defaultFilter = {
    includes: "user, expenseType",
    clientId: "adminApp",
    page: 0,
    pageSize: 10,
    ascending: "false",
    searchTypeId: 0,
  };
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["expenses",defaultFilter],getExpenses);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Expense />
    </Hydrate>
  );
}