import { createLoader } from "nuqs/server";
import { executionsParams } from "../params";

// read searchParams from URL for executions
export const executionsParamsLoader = createLoader(executionsParams); 