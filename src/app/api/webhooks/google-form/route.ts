import { NextRequest, NextResponse } from 'next/server';

import { sendExecutionWorkflow } from '@/inngest/utils';

export async function POST( request: NextRequest){
    try {
        const url = new URL(request.url);
        const workflowId = url.searchParams.get("workflowId");

        if(!workflowId){
            return NextResponse.json(
                { success: false, error: "Missing required query parameter: workflowId" },
                { status: 400 }
            );
        }

        const body = await request.json();

        const formData = {
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondantEmail: body.respondentEmail,
            responses: body.responses,
            raw: body,
        };

        // Trigger an Inngest Job
        await sendExecutionWorkflow({
            workflowId: workflowId,
            initialData: {
                googleForm: formData,
            }
        });

    } catch (error) {
        console.error("Google form webhook error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process Google Form submission"},
            { status: 500 }
        );
    }
}