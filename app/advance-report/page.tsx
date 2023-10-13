import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate } from "@tanstack/query-core";
import AdvanceReport from "./AdvanceReport";
import { getAdvanceReports } from "../api/advanceReport";



export default async function Hydation() {

  const defaultFilter = {
    includes: "user,approver,subCompany",
    clientId: "adminApp",
    page: 0,
    pageSize: 10,
    ascending: "false",
    isCoreReport: true
  };
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["advanceReports",defaultFilter],getAdvanceReports);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
        <AdvanceReport/>
    </Hydrate>
  );
}