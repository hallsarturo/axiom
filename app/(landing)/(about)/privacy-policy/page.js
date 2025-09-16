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

export default function PrivacyPolicy() {
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
                                Privacy Policy (Alpha/MVP Version)
                            </motion.h2>
                            <motion.p className="text-xs italic mb-4">
                                Last updated: 15 September 2025
                            </motion.p>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                1. Introduction
                            </motion.h3>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                This Privacy Policy explains how this platform
                                AXIOM collects, uses, and protects your personal
                                information. By creating an account, signing in,
                                or otherwise using the service, you agree to the
                                practices described here.
                                <br />
                                <br />
                                The platform is currently in a non-commercial
                                Alpha/MVP stage. In the future, this Privacy
                                Policy will be updated to reflect changes if
                                advertisement features are introduced.
                            </motion.p>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                2. Data We Collect
                            </motion.h3>
                            <motion.p
                                className="text-md mb-2"
                                variants={itemVariants}
                            >
                                We collect the following types of data:
                            </motion.p>
                            <motion.ul
                                className="list-disc text-left pl-8 text-md mb-4 space-y-2"
                                variants={itemVariants}
                            >
                                <li>
                                    <strong>Account Information:</strong> When
                                    you register or sign in using Google Single
                                    Sign-On (SSO) or ORCID OAuth, we collect
                                    identifiers such as your name, email
                                    address, and profile data that you authorize
                                    us to access.
                                </li>
                                <li>
                                    <strong>
                                        Profile Preferences and Activity:
                                    </strong>{' '}
                                    Information you provide directly, such as
                                    interests, followed topics, or other profile
                                    details. Your interactions within the
                                    platform (e.g., connections, posts, and
                                    preferences).
                                </li>
                                <li>
                                    <strong>System Data:</strong> Technical
                                    information such as login timestamps,
                                    session activity, and usage patterns.
                                </li>
                            </motion.ul>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                3. How We Use Your Data
                            </motion.h3>
                            <motion.ul
                                className="list-disc text-left pl-8 text-md mb-4 space-y-2"
                                variants={itemVariants}
                            >
                                <li>
                                    Authenticate your account and provide secure
                                    access.
                                </li>
                                <li>
                                    Improve platform functionality, including:
                                    <ul className="list-disc pl-6">
                                        <li>Personalized feeds.</li>
                                        <li>Suggested profile matches.</li>
                                        <li>Topic recommendations.</li>
                                    </ul>
                                </li>
                                <li>
                                    Train and improve our algorithms for content
                                    discovery and user experience.
                                </li>
                                <li>
                                    Maintain security, prevent misuse, and
                                    monitor performance.
                                </li>
                                <li>
                                    <strong>Future use:</strong> Deliver
                                    advertisements that are limited to academic,
                                    educational, and ethical content in
                                    alignment with the mission of supporting
                                    intellectual growth.
                                </li>
                            </motion.ul>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                4. ORCID-Specific Provisions
                            </motion.h3>
                            <motion.ul
                                className="list-disc text-left pl-8 text-md mb-4 space-y-2"
                                variants={itemVariants}
                            >
                                <li>
                                    We will only access ORCID data fields that
                                    you have authorized through the OAuth
                                    process or made Public in your ORCID record.
                                </li>
                                <li>
                                    We will respect your ORCID privacy settings
                                    (Public / Limited / Private).
                                </li>
                                <li>
                                    We will not alter or misrepresent your ORCID
                                    record data. Any corrections should be made
                                    through ORCID directly.
                                </li>
                                <li>
                                    We will not use ORCID-provided email
                                    addresses or other contact data for
                                    unsolicited marketing.
                                </li>
                                <li>
                                    Any use of ORCID logos or trademarks by this
                                    platform will comply with ORCID&apos;s brand
                                    and trademark guidelines.
                                </li>
                                <li>
                                    ORCID-provided data is used “as is.” We do
                                    not guarantee its accuracy and are not
                                    liable for errors or omissions.
                                </li>
                            </motion.ul>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                5. Data Sharing
                            </motion.h3>
                            <motion.ul
                                className="list-disc text-left pl-8 text-md mb-4 space-y-2"
                                variants={itemVariants}
                            >
                                <li>
                                    <strong>Authentication Providers:</strong>{' '}
                                    Google and ORCID receive and process your
                                    data for authentication purposes, according
                                    to their own Terms of Use and Privacy
                                    Policies.
                                </li>
                                <li>
                                    <strong>Third Parties (Future):</strong> If
                                    academic and ethical advertisements are
                                    introduced, limited profile and interest
                                    data may be used to provide targeted ads.
                                    These ads will be restricted to content
                                    consistent with educational and intellectual
                                    values.
                                </li>
                                <li>
                                    <strong>General:</strong> We do not sell or
                                    rent personal data to third parties.
                                </li>
                            </motion.ul>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                6. Data Storage and Security
                            </motion.h3>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                User data is stored in our database for the
                                purposes outlined in this policy.
                                <br />
                                We implement reasonable technical and
                                organizational measures to protect your data
                                from unauthorized access, alteration, or
                                disclosure.
                                <br />
                                However, no system is completely secure, and we
                                cannot guarantee absolute security of your data.
                            </motion.p>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                7. User Rights
                            </motion.h3>
                            <motion.ul
                                className="list-disc text-left pl-8 text-md mb-4 space-y-2"
                                variants={itemVariants}
                            >
                                <li>
                                    Request access to the data we hold about
                                    you.
                                </li>
                                <li>
                                    Request corrections or updates to your
                                    personal data.
                                </li>
                                <li>
                                    Request deletion of your account and
                                    associated data.
                                </li>
                                <li>
                                    Withdraw consent to data use where
                                    applicable (e.g., targeted advertisements
                                    once implemented).
                                </li>
                            </motion.ul>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                To exercise these rights, you may contact us at{' '}
                                <strong>[Insert Contact Email]</strong>.
                            </motion.p>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                8. Non-Commercial Status and Future Updates
                            </motion.h3>
                            <motion.div
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                Currently, the platform is non-commercial. If
                                the platform begins offering advertisement slots
                                or other commercial services:
                                <ul className="list-disc pl-6 text-left mt-2">
                                    <li>
                                        This Privacy Policy will be updated.
                                    </li>
                                    <li>
                                        Required licenses and permissions
                                        (including compliance with ORCID&apos;s
                                        requirements) will be obtained.
                                    </li>
                                    <li>
                                        Users will be notified of material
                                        changes.
                                    </li>
                                </ul>
                            </motion.div>

                            <motion.h3
                                className="text-xl font-semibold mt-6 mb-2"
                                variants={itemVariants}
                            >
                                9. Governing Law
                            </motion.h3>
                            <motion.p
                                className="text-md mb-4"
                                variants={itemVariants}
                            >
                                This Privacy Policy is governed by the laws of{' '}
                                <strong>Mexico</strong>, without regard to
                                conflict of law principles.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </Card>
        </div>
    );
}
