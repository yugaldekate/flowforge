import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        credentialId: string;
    }>;
}

// http://localhost:3000/credentials/12345
const Page = async ({ params }: PageProps) => {

    await requireAuth();

    const { credentialId } = await params;

    return (
        <div>Credential Id : {credentialId} </div>
    )
}

export default Page;