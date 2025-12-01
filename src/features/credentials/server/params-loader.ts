import { createLoader } from "nuqs/server";
import { credentialsParams } from "../params";

// read searchParams from URL for credentials
export const credentialsParamsLoader = createLoader(credentialsParams); 