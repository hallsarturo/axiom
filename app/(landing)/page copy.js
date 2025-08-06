import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { H2Marquee } from '@/components/hero-elements/h2-marquee';

export default function Home() {
    return (
        <div className="flex flex-col  text-white">
            {/* Navigation/menu bar is rendered by layout.js above this */}
            <main className="flex-1 flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-blue-600 to-purple-700 px-6 text-center">
                <div className="flex flex-col">
                    <H2Marquee className="" />
                    <h1 className="text-8xl sm:text-[160px] md:text-[180px] font-extrabold tracking-wide drop-shadow-lg relative flex flex-col items-center">
                        AXIOM{' '}
                        <span
                            className="
            absolute bottom-7 right-0 text-4xl font-light tracking-normal
            [@media(max-width:942px)]:hidden
        "
                        >
                            alpha <span className="text-sm">0.1.0</span>
                        </span>
                    </h1>
                    <p className="hidden [@media(max-width:942px)]:block text-sm sm:text-2xl mt-2 text-center w-full">
                        alpha <span className="text-xs">0.1.0</span>
                    </p>
                    <h3 className="text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl leading-relaxed drop-shadow-md m-4">
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
