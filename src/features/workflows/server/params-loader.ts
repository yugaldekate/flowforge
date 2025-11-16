import { createLoader } from "nuqs/server";
import { workflowParams } from "../params";

// read searchParams from URL for workFlows
export const workflowsParamsLoader = createLoader(workflowParams); 