'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
                                Terms &amp; Conditions (Alpha/MVP Version)
                            </motion.h2>
                            <motion.p className="text-xs italic mb-4">
                                Last updated: 15 September 2025
                            </motion.p>
                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                1. Ownership and Intellectual Property
                            </motion.h3>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                All rights to the design, code, and intellectual
                                property of this platform belong exclusively to{' '}
                                <strong>Arturo Proal Walls</strong>. Users are
                                granted a limited, non-transferable right to
                                access and use the platform for personal,
                                non-commercial purposes.
                            </motion.p>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                2. User Content
                            </motion.h3>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                Users are responsible for any content they
                                upload, post, or share on this platform. By
                                submitting content, you grant the platform a
                                non-exclusive license to display and distribute
                                it within the service.
                            </motion.p>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                3. Prohibited Content
                            </motion.h3>
                            <motion.ul
                                className="list-disc text-left pl-8 text-md mb-4 space-y-2"
                                variants={itemVariants}
                            >
                                <li>
                                    Content that infringes intellectual property
                                    rights or copyrights.
                                </li>
                                <li>Illegal or unlawful material.</li>
                                <li>
                                    Defamatory, harassing, or harmful content.
                                </li>
                                <li>
                                    Content deemed inappropriate for the
                                    website’s purpose or community.
                                </li>
                            </motion.ul>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                Respectful free thought and open discussion are
                                encouraged, provided they do not violate these
                                rules.
                            </motion.p>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                4. Account Termination
                            </motion.h3>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                The platform owner reserves the right to suspend
                                or delete any user account or content that
                                violates these Terms, without prior notice.
                            </motion.p>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                5. Use Restrictions
                            </motion.h3>
                            <motion.ul
                                className="list-disc text-left pl-8 text-md mb-4 space-y-2"
                                variants={itemVariants}
                            >
                                <li>
                                    Scraping, automated data collection, or
                                    reverse engineering of the platform is
                                    strictly prohibited.
                                </li>
                                <li>
                                    Users may not attempt to bypass security
                                    measures or misuse the platform in any way.
                                </li>
                            </motion.ul>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                6. Disclaimer of Liability
                            </motion.h3>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                This platform is provided on an “as is” basis,
                                without warranties of any kind. The platform
                                owner is not liable for errors, downtime, data
                                loss, or damages arising from use of the
                                service.
                            </motion.p>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                7. Governing Law
                            </motion.h3>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                These Terms are governed by the laws of{' '}
                                <strong>Mexico</strong>, without regard to
                                conflict of law principles.
                            </motion.p>
                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                8. Advertisements
                            </motion.h3>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                This platform may display third-party
                                advertisements in the future. Any advertisements
                                shown will be limited to content that is
                                consistent with the mission of supporting{' '}
                                <strong>
                                    academic, educational, and intellectual
                                    growth
                                </strong>
                                .<br></br>
                                <br></br>
                                The platform owner will not knowingly permit
                                advertisements that are misleading,
                                exploitative, or contrary to these values.
                                However, the platform does not endorse or assume
                                responsibility for the accuracy or quality of
                                third-party advertisements, products, or
                                services. Any dealings between users and
                                advertisers are solely between those parties.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Card>
        </div>
    );
}
