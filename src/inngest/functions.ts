import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("Video fetching", "5s");
        await step.sleep("Video transcribing", "5s");
        await step.sleep("Sending transcription to AI", "5s");

        await step.run("create-workflow", () => {
            return prisma.workflow.create({
                data: {
                    name: "workflow-from-inngest",
                },
            });
        });
    },
);