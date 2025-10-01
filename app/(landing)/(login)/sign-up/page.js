import Image from 'next/image';
import { SignupForm } from '@/components/login/signup-form';

export default function SignUp() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center  gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex justify-center w-full">
                    <Image
                        src="/axiom_purple.png"
                        width={75}
                        height={50}
                        alt="Axiom logo"
                    />
                </div>
                <SignupForm />
            </div>
        </div>
    );
}
