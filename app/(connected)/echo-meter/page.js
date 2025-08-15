'use client';

import { RadarChart } from '@/components/echo-meter/radar-chart';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';

const data = [
    {
        taste: 'realist',
        politics: 89,
        science: 86,
        philosophy: 90,
    },
    {
        taste: 'scientist',
        politics: 62,
        science: 99,
        philosophy: 88,
    },
    {
        taste: 'tech',
        politics: 114,
        science: 38,
        philosophy: 61,
    },
    {
        taste: 'idealist',
        politics: 74,
        science: 99,
        philosophy: 45,
    },
    {
        taste: 'pragmatist',
        politics: 38,
        science: 58,
        philosophy: 32,
    },
];

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

export default function EchoMeter() {
    return (
        <motion.div
            className="flex flex-col justify-center m-8"
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
                    <motion.h1
                        className="text-3xl font-bold text-primary dark:text-foreground mb-4 tracking-tight"
                        variants={itemVariants}
                    >
                        Echo Meter
                    </motion.h1>
                    <motion.p
                        className="text-base sm:text-lg text-muted-foreground leading-relaxed"
                        variants={itemVariants}
                    >
                        Discover the shape of your intellectual world.
                        <br />
                        Our algorithm analyzes the content you share, bookmark,
                        and engage with — along with the perspectives of the
                        people you follow — to reveal how open or closed your
                        intellectual sphere is.
                        <br />
                        <br />
                        From politics to philosophy to science, Echo-meter maps
                        your exposure to diverse viewpoints and measures the
                        breadth of your knowledge interests. See whether you’re
                        exploring the full spectrum or living inside a tight
                        echo chamber… and decide where to go next.
                    </motion.p>
                </motion.div>
            </motion.div>
            <motion.div
                className="flex w-full justify-center"
                variants={itemVariants}
            >
                <motion.div
                    className="flex w-full max-w-2xl justify-center"
                    variants={itemVariants}
                >
                    <motion.div className="w-full" variants={itemVariants}>
                        <Card className="flex justify-center w-full">
                            <CardHeader className="text-center">
                                <CardTitle>Intellectual Stance</CardTitle>
                                <CardDescription></CardDescription>
                            </CardHeader>
                            <CardContent className="h-[450px]">
                                <RadarChart data={data} />
                            </CardContent>
                            <CardFooter></CardFooter>
                        </Card>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
