'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
// Tailwind imports
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import {
    AcademicCapIcon,
    CheckCircleIcon,
    HandRaisedIcon,
    RocketLaunchIcon,
    SparklesIcon,
    SunIcon,
    UserGroupIcon,
} from '@heroicons/react/20/solid';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

function OldAbout() {
    return (
        <div className="flex w-full justify-center mt-8">
            <Card className="flex justify-center mx-auto md:max-w-3xl md:m-18">
                <motion.div
                    className="flex flex-col justify-center m-10"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="flex w-full justify-center"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="flex flex-col justify-center w-full max-w-2xl text-center mb-8 px-4"
                            variants={itemVariants}
                        >
                            <div className="flex w-full justify-center mb-6">
                                <Image
                                    src="/axiom_purple.png"
                                    width={75}
                                    height={50}
                                    alt="Axiom logo"
                                />
                            </div>
                            <motion.h2
                                className="text-2xl font-bold mb-4 text-primary dark:text-foreground"
                                variants={itemVariants}
                            >
                                About AXIOM
                            </motion.h2>
                            <motion.p className="text-xs italic mb-4"></motion.p>

                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                AXIOM is{' '}
                                <strong>about doing things differently</strong>.
                                It&apos;s a space for people who think
                                critically and deeply, who are curious about
                                life, knowledge, humanity, and ethics. People
                                who don&apos;t want to depend on profit-driven
                                platforms that decide what content they should
                                see.
                                <br></br>
                                <br></br>
                                Here, the{' '}
                                <strong>
                                    quality of information comes first
                                </strong>{' '}
                                — and so does your freedom to choose it.
                                <br></br>
                                <br></br>
                                Mainstream social networks have changed the way
                                we handle ideas, and not for the better. Ideas
                                spread fast, they&apos;re often controversial,
                                and discussions quickly turn confrontational.
                                Real debate, thoughtful reflection, and the
                                search for truth get lost in the noise.
                                <br></br>
                                <br></br>
                                AXIOM is for those of us who don&apos;t want
                                hidden agendas, ideologies, cult-like thinking,
                                or economic greed to dictate what truth is.
                                Instead,{' '}
                                <strong>we gather around axioms </strong>—
                                bundles of knowledge — as the starting point for
                                meaningful discussion, scientific inquiry, and
                                philosophical exploration.
                                <br></br>
                                <br></br>
                                How do we make that work?{' '}
                                <strong>
                                    By putting academic papers at the center of
                                    conversations
                                </strong>
                                , so discussions are grounded in evidence rather
                                than random opinion. And by making sure posts
                                and debates aren&apos;t just fleeting — you can
                                pin a post and return to it as your
                                understanding grows and new data emerges.
                                <br></br>
                                <br></br>
                                We also believe in{' '}
                                <strong>
                                    tools that help us check ourselves:
                                </strong>{' '}
                                How biased are we? How open-minded? Are we
                                exploring diverse perspectives, or staying stuck
                                in our comfort zones? Only by challenging
                                ourselves can we truly understand and resolve
                                the big questions and controversies we face.
                                <br></br>
                                <br></br>
                                AXIOM is where knowledge, debate, and curiosity
                                meet. Join in — and let&apos;s build something
                                different.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Card>
        </div>
    );
}

// TAILWIND ABOUT

const stats = [
    { label: 'Project started', value: '2025' },
    { label: 'People on the team', value: '1' },
    { label: 'Users on the platform', value: '4' },
    { label: 'Made with a free stack ', value: '$0' },
];
const values = [
    {
        name: 'Papers at the center.',
        description:
            'Strong, solid reality-aware knowledge is based on axioms, which at the same time are connected to other strong axioms.',
        icon: RocketLaunchIcon,
    },
    {
        name: 'Take responsibility.',
        description:
            'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
        icon: HandRaisedIcon,
    },
    {
        name: 'Be supportive.',
        description:
            'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus voluptas blanditiis et.',
        icon: UserGroupIcon,
    },
    {
        name: 'Always learning.',
        description:
            'Iure sed ab. Aperiam optio placeat dolor facere. Officiis pariatur eveniet atque et dolor.',
        icon: AcademicCapIcon,
    },
    {
        name: 'Share everything you know.',
        description:
            'Laudantium tempora sint ut consectetur ratione. Ut illum ut rem numquam fuga delectus.',
        icon: SparklesIcon,
    },
    {
        name: 'Enjoy downtime.',
        description:
            'Culpa dolorem voluptatem velit autem rerum qui et corrupti. Quibusdam quo placeat.',
        icon: SunIcon,
    },
];

export default function About() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="bg-white dark:bg-gray-900">
            <main className="relative isolate">
                {/* Background */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-4 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
                        }}
                        className="aspect-1108/632 w-277 flex-none bg-linear-to-r from-[#ff80b5] to-[#9089fc] opacity-50"
                    />
                </div>

                {/* Header section */}
                <div className="px-6 pt-14 lg:px-8">
                    <div className="mx-auto max-w-2xl pt-24 text-center sm:pt-40">
                        <h1 className="text-5xl font-semibold tracking-tight text-primary dark:text-primary-foreground sm:text-7xl ">
                            We love knowledge
                        </h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-secondary-foreground sm:text-xl/8 dark:text-gray-400">
                            AXIOM is{' '}
                            <strong>about doing things differently</strong>.
                            It&apos;s a space for people who think critically
                            and deeply, who are curious about life, knowledge,
                            humanity, and ethics. People who don&apos;t want to
                            depend on profit-driven platforms that decide what
                            content they should see.
                        </p>
                    </div>
                </div>

                {/* Stat section */}
                <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                        <div className="grid max-w-xl grid-cols-1 gap-8 text-base/7 text-gray-600 lg:max-w-none lg:grid-cols-2 dark:text-gray-300">
                            <div>
                                <p>
                                    Here, the{' '}
                                    <strong>
                                        quality of information comes first
                                    </strong>{' '}
                                    — and so does your freedom to choose it.
                                    Mainstream social networks have changed the
                                    way we handle ideas, and not for the better.
                                    Ideas spread fast, they&apos;re often
                                    controversial, and discussions quickly turn
                                    confrontational. Real debate, thoughtful
                                    reflection, and the search for truth get
                                    lost in the noise.
                                </p>
                                <p className="mt-8">
                                    AXIOM is for those of us who don&apos;t want
                                    hidden agendas, ideologies, cult-like
                                    thinking, or economic greed to dictate what
                                    truth is. Instead,{' '}
                                    <strong>we gather around axioms </strong>—
                                    bundles of knowledge — as the starting point
                                    for meaningful discussion, scientific
                                    inquiry, and philosophical exploration.
                                </p>
                            </div>
                            <div>
                                <p>
                                    How do we make that work?{' '}
                                    <strong>
                                        By putting academic papers at the center
                                        of conversations
                                    </strong>
                                    , so discussions are grounded in evidence
                                    rather than random opinion. And by making
                                    sure posts and debates aren&apos;t just
                                    fleeting — you can pin a post and return to
                                    it as your understanding grows and new data
                                    emerges.
                                </p>
                                <p className="mt-8">
                                    We also believe in{' '}
                                    <strong>
                                        tools that help us check ourselves:
                                    </strong>{' '}
                                    How biased are we? How open-minded? Are we
                                    exploring diverse perspectives, or staying
                                    stuck in our comfort zones? Only by
                                    challenging ourselves can we truly
                                    understand and resolve the big questions and
                                    controversies we face. AXIOM is where
                                    knowledge, debate, and curiosity meet. Join
                                    in — and let&apos;s build something
                                    different.
                                </p>
                            </div>
                        </div>
                        <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 sm:grid-cols-2 sm:gap-y-16 lg:mt-28 lg:grid-cols-4">
                            {stats.map((stat, statIdx) => (
                                <div
                                    key={statIdx}
                                    className="flex flex-col-reverse gap-y-3 border-l border-gray-200 pl-6 dark:border-white/20"
                                >
                                    <dt className="text-base/7 text-gray-600 dark:text-gray-300">
                                        {stat.label}
                                    </dt>
                                    <dd className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* Image section */}
                <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
                    <Image
                        alt="coders"
                        src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2894&q=80"
                        height={2500}
                        width={2000}
                        className="aspect-9/4 w-full object-cover outline-1 -outline-offset-1 outline-black/5 xl:rounded-3xl dark:outline-white/10"
                    />
                </div>

                {/* Feature section */}
                <div className="mx-auto mt-32 max-w-7xl px-6 pb-8 sm:my-40 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-4xl font-semibold tracking-tight text-pretty text-primary sm:text-5xl dark:text-primary-foreground">
                            Our values
                        </h2>
                        <p className="mt-6 text-lg/8 text-secondary-foreground dark:text-secondary">
                            We have to stand against disinformation, political
                            bias, and dangerous ideologies.
                        </p>
                    </div>
                    <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16 dark:text-gray-400">
                        {values.map((value) => (
                            <div key={value.name} className="relative pl-9">
                                <dt className="inline font-semibold text-gray-900 dark:text-white">
                                    <value.icon
                                        aria-hidden="true"
                                        className="absolute top-1 left-1 size-5 text-indigo-600 dark:text-indigo-500"
                                    />
                                    {value.name}
                                </dt>{' '}
                                <dd className="inline">{value.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </main>
        </div>
    );
}
