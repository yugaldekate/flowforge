import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        workflowId: string;
    }>;
}

// http://localhost:3000/workflows/12345
const Page = async ({ params }: PageProps) => {

    await requireAuth();

    const { workflowId } = await params;

    return (
        <div>Workflow Id : {workflowId} </div>
    )
}

export default Page;