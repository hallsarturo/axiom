'use client';

import { useState, useEffect } from 'react';

const wordList = ['comment rage', 'stolen data', 'fake news'];
const longestWordLength = Math.max(...wordList.map((word) => word.length));

export function H2Marquee() {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Interval Set');
            setIndex((prev) => (prev + 1) % wordList.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="flex justify-center md:pl-32">
            <h2 className="text-4xl text-center sm:text-5xl md:text-6xl flex md:flex-row flex-col justify-center items-center text-nowrap">
                no more:{' '}
                <span
                    className="flex flex-col justify-center text-center relative h-[3.5rem] lg:text-6xl md:text-5xl overflow-hidden ml-10 sm:ml-20 md:ml-0"
                    style={{ minWidth: `${longestWordLength + 2}ch` }}
                >
                    <div
                        className="absolute top-0 left-0 transition-transform duration-700"
                        style={{
                            transform: `translateY(-${index * 3.6}rem)`,
                        }}
                    >
                        {wordList.map((word, i) => (
                            <div
                                key={i}
                                className="h-[3.6rem] leading-[3.6rem] text-purple-800 px-2"
                            >
                                {word}
                            </div>
                        ))}
                    </div>
                </span>
            </h2>
        </div>
    );
}
