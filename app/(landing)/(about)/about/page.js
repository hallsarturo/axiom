'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

export default function About() {
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
