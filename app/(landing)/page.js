'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { H2Marquee } from '@/components/hero-elements/h2-marquee';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
    return (
        <div className="relative isolate min-h-screen px-6 lg:px-8 overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75 dark:from-[#22223b] dark:to-[#4a4e69] dark:opacity-50"
                />
            </div>
            <motion.div
                className="flex flex-col mx-auto max-w-4xl py-32 sm:py-32 lg:py-48"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col w-full mt-3 mb-16 sm:my-6 md:mt-0"
                >
                    <H2Marquee />
                </motion.div>
                <motion.div
                    variants={itemVariants}
                    className="hidden sm:mb-8 sm:flex sm:justify-center"
                >
                    <div className="relative rounded-full px-3 py-1 text-sm/6 text-muted-foreground ring-1 ring-border hover:ring-ring">
                        Announcing our next round of funding.{' '}
                        <a href="#" className="font-semibold text-primary">
                            <span
                                aria-hidden="true"
                                className="absolute inset-0"
                            />
                            Read more <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                </motion.div>
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col text-center"
                >
                    <div className="">
                        <motion.h1
                            variants={itemVariants}
                            className="text-8xl sm:text-9xl md:text-[11rem] font-semibold tracking-tight text-balance text-foreground "
                        >
                            AXIOM
                        </motion.h1>
                        <motion.p
                            variants={itemVariants}
                            className="ml-50 mt-2 sm:ml-80 md:ml-120"
                        >
                            alpha v0.1.0
                        </motion.p>
                    </div>
                    <motion.p
                        variants={itemVariants}
                        className="mt-13 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8"
                    >
                        Knowledge-focused social network for serious
                        intellectuals
                    </motion.p>
                    <motion.div
                        variants={itemVariants}
                        className="mt-20 flex flex-col gap-8 md:flex-row items-center justify-center gap-x-6"
                    >
                        <Button href="#" className="">
                            Get started
                        </Button>
                        <Button
                            variant="link"
                            href="#"
                            className="text-sm/6 font-semibold text-foreground"
                        >
                            Learn more <span aria-hidden="true">→</span>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
                />
            </div>
        </div>
    );
}
