import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { H2Marquee } from '@/components/hero-elements/h2-marquee';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation/menu bar is rendered by layout.js above this */}
            <main className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-700 text-white px-6 text-center">
                <div className="max-w-4xl">
                    <H2Marquee className="" />
                    <h1 className="text-[180px] font-extrabold mb-4 tracking-wide drop-shadow-lg">
                        AXIOM
                    </h1>
                    <h3 className="text-4xl leading-relaxed drop-shadow-md">
                        Knowledge first social network for serious intellectuals
                    </h3>
                    <div className="mt-8">
                        <Button className=" mr-10">Sign Up</Button>
                        <Button className="bg-transparent" variant="outline">
                            <Link href="/">Learn more</Link>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
