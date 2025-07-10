'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
const wordList = ['rage', 'stolen data', 'fake news'];

export default function Home() {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Interval Set');
            setIndex((prev) => (prev + 1) % wordList.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation/menu bar is rendered by layout.js above this */}
            <main className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-purple-700 text-white px-6 text-center">
                <div className="max-w-4xl">
                    <h2 className="text-6xl">
                        No more{' '}
                        <span className="inline-block align-baseline relative w-[12ch] h-[3.5rem] overflow-hidden">
                            <div 
                            className="absolute top-0 left-0 transition-transform duration-700"
                            style={{ transform: `translateY(-${index * 3.6}rem)` }}
                            >
                                {wordList.map((word, i) => (
                                    <div
                                        key={i}
                                        className="h-[3.5rem] leading-[3.5rem] text-yellow-400"
                                    >
                                        {word}
                                    </div>
                                ))}
                            </div>
                        </span>
                    </h2>
                    <h1 className="text-[180px] font-extrabold mb-4 tracking-wide drop-shadow-lg">
                        AXIOM
                    </h1>
                    <h3 className="text-4xl leading-relaxed drop-shadow-md">
                        Knowledge first social network for serious intellectuals
                    </h3>
                </div>
            </main>
        </div>
    );
}
