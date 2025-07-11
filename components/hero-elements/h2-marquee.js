'use client';

import { useState, useEffect } from 'react';

const wordList = ['comment rage', 'stolen data', 'fake news'];
const longestWordLength = Math.max(...wordList.map(word => word.length));

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
        <div className="pl-32">
            <h2 className="text-6xl flex justify-center items-center">
                No more{'  '}
                <span
                    className="inline-block align-baseline relative h-[3.5rem] text-5xl overflow-hidden ml-4"
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
                                className="h-[3.5rem] leading-[3.5rem] text-yellow-400 px-2"
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
