import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        executionId: string;
    }>;
}
// http://localhost:3000/executions/12345
const Page = async ({ params }: PageProps) => {

    await requireAuth();

    const { executionId } = await params;

    return (
        <div>Execution Id : {executionId} </div>
    )
}

export default Page;