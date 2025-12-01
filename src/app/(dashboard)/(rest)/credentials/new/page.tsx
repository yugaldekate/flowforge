import { requireAuth } from "@/lib/auth-utils";
import { CredentialForm } from "@/features/credentials/components/credential";

const Page = async () => {

    await requireAuth();

    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="flex flex-col w-full h-full gap-y-8 mx-auto max-w-7xl">
                <CredentialForm/>
            </div>
        </div>
    );
}

export default Page;