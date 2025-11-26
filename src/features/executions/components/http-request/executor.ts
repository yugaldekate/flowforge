import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

type HttpRequestData = {
    variableName?: string;
    body?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step}) => {
    // TODO: Publish "loading" state for http-request

    if(!data.endpoint){
        // TODO: Publish "error" for http-request
        throw new NonRetriableError("HTTP request node: No endpoint configured")
    }

    if(!data.variableName){
        // TODO: Publish "error" for http-request
        throw new NonRetriableError("Variable name not configured")
    }

    const result  = await step.run("http-request", async () => {
        const endpoint = data.endpoint!;
        const method = data.method || "GET";

        const options: KyOptions = {
            method: method,
        };

        if(["POST", "PUT", "PATCH"].includes(method)) {
            options.body = data.body;
            options.headers = {
                "Content-Type": "application/json",
            }
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type");

        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text();

        const responsePayload = {
            httpResponse: {
                data: responseData,
                status: response.status,
                statusText: response.statusText,
            }
        }

        if(data.variableName){ 
            return {
                ...context,
                [data.variableName] : responsePayload,
            }
        }

        //Fallback to direct httpResponse for backward compatiblity
        return {
            ...context,
            ...responsePayload,
        }
    });

    // TODO: Publish "success" state for http-request

    return result;
}