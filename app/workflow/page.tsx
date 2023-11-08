import { dehydrate } from "@tanstack/query-core";
import { getWorkflowData } from "../api/workflow";
import Workflow from "./Workflow";
import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";

export default async function Hydation() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["workflowData"], () => getWorkflowData(""));
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Workflow />
    </Hydrate>
  );
}
