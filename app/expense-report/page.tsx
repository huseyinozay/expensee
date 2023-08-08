import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/query-core";
import ExpenseReport from "./ExpenseReport";
import { getExpensesReport } from "../api/expenseReport";



export default async function Hydation() {

  const defaultFilter = {
    includes: "user,approver,subCompany,user.company",
    clientId: "adminApp",
    page: 0,
    pageSize: 10,
    ascending: "false",
    searchTypeId: 0,
  };
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["expenses",defaultFilter],getExpensesReport);
  const dehydratedState = dehydrate(queryClient);

  console.log('dehydratedState',dehydratedState)

  return (
    <Hydrate state={dehydratedState}>
      <ExpenseReport />
    </Hydrate>
  );
}