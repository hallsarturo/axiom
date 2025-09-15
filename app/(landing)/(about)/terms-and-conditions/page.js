'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export default function TermsAndConditions() {
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
                            <motion.h2
                                className="text-2xl font-bold mb-4 text-primary dark:text-foreground"
                                variants={itemVariants}
                            >
                                Legal Notice – Alpha Version
                            </motion.h2>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                This platform (“the Social Network”) is
                                currently in its{' '}
                                <strong>Alpha testing phase</strong>. By
                                accessing and using this service, you
                                acknowledge and agree to the following:
                            </motion.p>
                            <motion.h2
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                1. Ownership
                            </motion.h2>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                All rights to the design, code, and intellectual
                                property of this platform belong exclusively to{' '}
                                <strong>Arturo Proal Walls</strong>.
                            </motion.p>
                            <motion.h2
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                2. Data Sources
                            </motion.h2>
                            <motion.p
                                className="text-md mb-2"
                                variants={itemVariants}
                            >
                                The data integrated into this Alpha version
                                comes exclusively from{' '}
                                <strong>open-access sources</strong>.
                                Specifically:
                            </motion.p>
                            <motion.ul
                                className="list-disc pt-4 px-18 text-md mb-4 space-y-2"
                                variants={itemVariants}
                            >
                                <li>
                                    Metadata and bibliographic information have
                                    been accessed through the
                                    <strong>
                                        {' '}
                                        Open Access content version
                                    </strong>{' '}
                                    of <em>PhilPapers</em> and{' '}
                                    <em>PhilArchive</em>.
                                </li>
                                <li>
                                    No copyrighted content or full texts have
                                    been copied or reproduced.
                                </li>
                                <li>
                                    Only bibliographic and metadata information
                                    provided via the
                                    <strong>
                                        {' '}
                                        Dublin Core API (OAI-PMH)
                                    </strong>{' '}
                                    has been used, in accordance with{' '}
                                    <Button variant="link">
                                        <a
                                            href="https://philpapers.org/help/terms.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            PhilPapers&apos; Terms
                                        </a>{' '}
                                    </Button>
                                    and{' '}
                                    <Button variant="link">
                                        <a
                                            href="https://philpapers.org/help/oai.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            PhilPapers&apos; OAI Policy.
                                        </a>
                                    </Button>
                                </li>
                            </motion.ul>
                            <motion.h1
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                3. Attribution
                            </motion.h1>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                This platform uses third-party resources that
                                require attribution:
                            </motion.p>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                <Button variant="link">
                                    <a
                                        href="https://www.flaticon.com/free-icons/user"
                                        title="user icons"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        User icons created by Smashicons -
                                        Flaticon
                                    </a>
                                </Button>
                            </motion.p>
                            <motion.h2
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                4. Disclaimer
                            </motion.h2>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                This platform is experimental and may contain
                                errors or incomplete features. It is provided{' '}
                                <strong>
                                    “as is” without warranties of any kind
                                </strong>
                                . The creator assumes no liability for any
                                damages or issues arising from its use.
                            </motion.p>
                            <motion.h2
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                5. Future Terms
                            </motion.h2>
                            <motion.p
                                className="text-md"
                                variants={itemVariants}
                            >
                                This is a temporary legal notice for the Alpha
                                release. A complete{' '}
                                <strong>Terms of Service</strong> and{' '}
                                <strong>Privacy Policy</strong> will be
                                published prior to public launch.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="flex w-full justify-center"
                        variants={itemVariants}
                    ></motion.div>
                </motion.div>
            </Card>
        </div>
    );
}
