'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { H2Marquee } from '@/components/hero-elements/h2-marquee';
import {
    CloudArrowUpIcon,
    LockClosedIcon,
    ServerIcon,
} from '@heroicons/react/20/solid';
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

const features = [
    {
        name: 'Pick your feed sources',
        description:
            'Follow the authors, journals, and media you trust. Your feed starts with what you choose — not what an algorithm forces on you.',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'configure your algorithm',
        description:
            'Tune your feed to your curiosity. Prioritize papers, authors, or topics. Control how information flows, instead of being controlled by it.',
        icon: LockClosedIcon,
    },
    {
        name: 'filter your feed',
        description:
            'Cut through the noise. Apply filters to focus on quality discussions, relevant research, and expert insights — not clickbait.',
        icon: ServerIcon,
    },
];

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
    return (
        <div className="relative isolate min-h-screen px-6 lg:px-8 overflow-hidden">
            <div
                aria-hidden="true"
                className="fixed inset-x-0 -top-40 -z-10 w-full h-full transform-gpu overflow-hidden blur-3xl"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="absolute left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75 dark:from-[#22223b] dark:to-[#4a4e69] dark:opacity-50"
                />
            </div>
            {/* Section 1 */}
            <section>
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
                                className="text-8xl sm:text-9xl md:text-[11rem] font-semibold tracking-tight text-balance text-foreground"
                            >
                                <Image
                                    src="/axiom_purple.png"
                                    width={600}
                                    height={400}
                                    alt="AXIOM logo"
                                    className="mx-auto"
                                    style={{ objectFit: 'contain' }}
                                    priority
                                />
                            </motion.h1>
                            <motion.p
                                variants={itemVariants}
                                className="ml-60 mt-[-25px] sm:mt-[-40px] sm:ml-80 md:ml-130"
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
                            <Button asChild className="">
                                <Link href="/sign-up">Get started</Link>
                            </Button>
                            <Button
                                asChild
                                variant="link"
                                className="text-sm/6 font-semibold text-foreground"
                            >
                                <Link href="/feed">
                                    take a look{' '}
                                    <span aria-hidden="true">→</span>
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>
            {/* Section 2 */}
            <section className="min-h-screen">
                <div className="overflow-hidden  py-24 sm:py-32 ">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                            <div className="lg:pt-4 lg:pr-8">
                                <div className="lg:max-w-lg">
                                    <h2 className="text-base/7 font-semibold text-secondary-foreground dark:text-secondary-foreground">
                                        Expert opinions
                                    </h2>
                                    <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl dark:text-primary-foreground">
                                        A new paradigm
                                    </p>
                                    <p className="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">
                                        Build a feed on your terms. Choose the
                                        sources you trust — from academic papers
                                        to expert authors and scientific media.
                                        Here, knowledge takes the spotlight, not
                                        algorithms or clickbait.
                                    </p>
                                    <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none dark:text-gray-400">
                                        {features.map((feature) => (
                                            <div
                                                key={feature.name}
                                                className="relative pl-9"
                                            >
                                                <dt className="inline font-semibold text-gray-900 dark:text-white">
                                                    <feature.icon
                                                        aria-hidden="true"
                                                        className="absolute top-1 left-1 size-5 text-indigo-600 dark:text-indigo-400"
                                                    />
                                                    {feature.name}
                                                </dt>{' '}
                                                <dd className="inline">
                                                    {feature.description}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                            <Image
                                alt="Product screenshot"
                                src="/about/2.png"
                                width={2432}
                                height={1442}
                                className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 not-dark:hidden sm:w-228 md:-ml-4 lg:-ml-0 dark:ring-white/10"
                            />
                            <Image
                                alt="Product screenshot"
                                src="/about/2.png"
                                width={2432}
                                height={1442}
                                className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0 dark:hidden dark:ring-white/10"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3 */}
            <section className="min-h-screen">
                <div className="">
                    <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                        <h2 className="text-center text-base/7 font-semibold text-secondary-foreground dark:text-primary-foreground">
                            Deploy faster
                        </h2>
                        <p className="mx-auto mt-2 max-w-lg text-center text-4xl font-semibold tracking-tight text-balance text-primary sm:text-5xl dark:text-primary-foreground">
                            Everything you need to deploy your app
                        </p>
                        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
                            <div className="relative lg:row-span-2">
                                <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-4xl dark:bg-gray-800" />
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                    <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                        <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                            Mobile friendly
                                        </p>
                                        <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                            Anim aute id magna aliqua ad ad non
                                            deserunt sunt. Qui irure qui lorem
                                            cupidatat commodo.
                                        </p>
                                    </div>
                                    <div className="@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm">
                                        <div className="absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl dark:shadow-none dark:outline dark:outline-white/20">
                                            <Image
                                                alt=""
                                                src="/about/5.png"
                                                className="size-full object-cover object-top"
                                                height={100}
                                                width={500}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-l-4xl dark:outline-white/15" />
                            </div>
                            <div className="relative max-lg:row-start-1">
                                <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-4xl dark:bg-gray-800" />
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                        <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                            Performance
                                        </p>
                                        <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                            Lorem ipsum, dolor sit amet
                                            consectetur adipisicing elit maiores
                                            impedit.
                                        </p>
                                    </div>
                                    <div className="flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2">
                                        <Image
                                            alt=""
                                            src="/about/4.png"
                                            className="w-full max-lg:max-w-xs dark:hidden"
                                            height={1000}
                                            width={500}
                                        />
                                        <Image
                                            alt=""
                                            src="/about/4.png"
                                            className="w-full not-dark:hidden max-lg:max-w-xs"
                                            height={1000}
                                            width={500}
                                        />
                                    </div>
                                </div>
                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl dark:outline-white/15" />
                            </div>
                            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
                                <div className="absolute inset-px rounded-lg bg-white dark:bg-gray-800" />
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                                    <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                                        <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                            Security
                                        </p>
                                        <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                            Morbi viverra dui mi arcu sed.
                                            Tellus semper adipiscing suspendisse
                                            semper morbi.
                                        </p>
                                    </div>
                                    <div className="@container flex flex-1 items-center max-lg:py-6 lg:pb-2">
                                        <Image
                                            alt=""
                                            src="/about/9.png"
                                            className="h-[min(152px,40cqw)] object-botom object-cover dark:hidden"
                                            height={1000}
                                            width={500}
                                        />
                                        <Image
                                            alt=""
                                            src="/about/9.png"
                                            className="h-[min(152px,40cqw)] object-cover not-dark:hidden"
                                            height={1000}
                                            width={500}
                                        />
                                    </div>
                                </div>
                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 dark:outline-white/15" />
                            </div>
                            <div className="relative lg:row-span-2">
                                <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-r-4xl dark:bg-gray-800" />
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                                    <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                                        <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center dark:text-white">
                                            Powerful APIs
                                        </p>
                                        <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center dark:text-gray-400">
                                            Sit quis amet rutrum tellus
                                            ullamcorper ultricies libero dolor
                                            eget sem sodales gravida.
                                        </p>
                                    </div>
                                    <div className="relative min-h-120 w-full grow">
                                        <div className="absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl outline outline-white/10 dark:bg-gray-900/60 dark:shadow-none">
                                            <div className="flex bg-gray-900 outline outline-white/5">
                                                <div className="-mb-px flex text-sm/6 font-medium text-gray-400">
                                                    <div className="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white">
                                                        NotificationSetting.jsx
                                                    </div>
                                                    <div className="border-r border-gray-600/10 px-4 py-2">
                                                        App.jsx
                                                    </div>
                                                </div>
                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>
                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl dark:outline-white/15" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-40rem)]"
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
