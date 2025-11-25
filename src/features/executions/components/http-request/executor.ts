import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
    body?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step}) => {
    // TODO: Publish "loading" state for http-request

    if(!data.method){
        // TODO: Publish "error" for http-request
        throw new NonRetriableError("HTTP request node: No endpoint configured")
    }

    const result  = await step.run("http-request", async () => {
        const endpoint = data.endpoint!;
        const method = data.method || "GET";

        const options: KyOptions = {
            method: method,
        };

        if(["POST", "PUT", "PATCH"].includes(method)) {
            options.body = data.body;
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type");

        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();

        return {
            ...context,
            httpResponse: {
                data: responseData,
                status: response.status,
                statusText: response.statusText,
            }
        }
    });

    // TODO: Publish "success" state for http-request

    return result;
}