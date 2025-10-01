import Image from 'next/image';
import { LoginForm } from '@/components/login/login-form';

export default function SignInPage() {
    return (
        <div className="bg-muted flex min-h-screen pt-10 sm:mt-0 flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex justify-center w-full max-w-sm flex-col gap-6">
                <div className="flex justify-center w-full">
                    <Image
                        src="/axiom_purple.png"
                        width={75}
                        height={50}
                        alt="Axiom logo"
                    />
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
