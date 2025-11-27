import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";

type HttpRequestData = {
    variableName: string;
    body?: string;
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);

    return safeString;
});

// context is the previous node data
export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step, publish}) => {
    
    await publish(httpRequestChannel()
        .status({
            nodeId: nodeId,
            status: "loading",
        })
    );

    if(!data.endpoint){
        await publish(httpRequestChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("HTTP request node: No endpoint configured")
    }

    if(!data.variableName){
        await publish(httpRequestChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("HTTP request node: Variable name not configured")
    }

    if(!data.method){
        await publish(httpRequestChannel()
            .status({
                nodeId: nodeId,
                status: "error",
            })
        );

        throw new NonRetriableError("HTTP request node: Method not configured")
    }

    try{
        const result  = await step.run("http-request", async () => {
            /*
                Example endpoint template — supports Handlebars templating using values from `context`.
                E.g. "https://jsonplaceholder.typicode.com/users/{{todo.httpResponse.data.userId}}"
                will be compiled with `context` before the request is made.
            */
            const endpoint = Handlebars.compile(data.endpoint)(context);

            const method = data.method;

            const options: KyOptions = {
                method: method,
            };

            if(["POST", "PUT", "PATCH"].includes(method)) {
                const resolved = Handlebars.compile(data.body || "{}")(context);
                JSON.parse(resolved);

                options.body = resolved;
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

            return {
                ...context,
                [data.variableName] : responsePayload,
            }
        });

        await publish(httpRequestChannel()
            .status({
                nodeId: nodeId,
                    status: "success",
            })
        );

        return result;
        
    } catch (error){
        await publish(httpRequestChannel()
            .status({
                nodeId: nodeId,
                    status: "error",
            })
        );

        throw error;
    }
}