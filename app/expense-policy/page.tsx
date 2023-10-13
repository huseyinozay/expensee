import { dehydrate } from "@tanstack/query-core";
import { getPolicyExpenses } from "../api/expensePolicy";
import ExpensePolicy from "./ExpensePolicy";
import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";

export default async function Hydation() {
  const defaultFilter = {
    includes: "user, expenseType",
    clientId: "adminApp",
    page: 0,
    pageSize: 10,
    ascending: "false",
    searchTypeId: 0,
    isActiveExpenseTypeLimit: true,
  };
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    ["expenses", defaultFilter],
    getPolicyExpenses
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <ExpensePolicy />
    </Hydrate>
  );
}
