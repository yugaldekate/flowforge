import Link from 'next/link';
import Image from 'next/image';

const AuthLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <div className="bg-muted min-h-svh flex flex-col justify-center items-center gap-6 p-6 md:p-10">
            <div className="flex flex-col w-full max-w-sm gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <Image
                        src="/logos/logo1.svg"
                        alt="FlowForge Logo"
                        width={30}
                        height={30}
                    />
                    FlowForge
                </Link>
            </div>
            <div className="w-sm">
                {children}
            </div>
        </div>
    )
}

export default AuthLayout