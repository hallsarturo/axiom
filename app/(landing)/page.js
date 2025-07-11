import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { H2Marquee } from '@/components/hero-elements/h2-marquee';

export default function Home() {
    return (
        <div className="flex flex-col  text-white">
            {/* Navigation/menu bar is rendered by layout.js above this */}
            <main className="flex-1 flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-blue-600 to-purple-700 px-6 text-center">
                <div className="max-w-4xl">
                    <H2Marquee className="" />
                    <h1 className="text-[180px] font-extrabold tracking-wide drop-shadow-lg">
                        AXIOM{' '}
                        <span className="absolute bottom-7 text-4xl font-light tracking-normal">
                            beta*
                        </span>
                    </h1>
                    <h3 className="text-4xl leading-relaxed drop-shadow-md">
                        Knowledge-focused social network for serious
                        intellectuals
                    </h3>
                    <div className="mt-8">
                        <Button className="mr-10">
                            <Link href="/sign-up">Sign Up</Link>
                        </Button>
                        <Button className="bg-transparent" variant="outline">
                            <Link href="#about">Learn more</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
