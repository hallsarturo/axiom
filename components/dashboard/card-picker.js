'use client';

import Image from 'next/image';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function CardPicker({ title, imgSrc, imgAlt }) {
    return (
        <Card className="min-w-60 relative overflow-hidden h-48 flex items-end group transition-all duration-300 hover:scale-[1.03] hover:shadow-xl cursor-pointer">
            <div
                className="absolute inset-0 bg-cover bg-center blur-[1px] group-hover:blur-none transition-all duration-300"
                style={{
                    backgroundImage: `url(${imgSrc.replace(/^public\//, '/')})`,
                }}
                aria-label={imgAlt}
            />
            <CardHeader className="relative z-10 bg-black/60 w-full transition-all duration-300 group-hover:bg-black/40">
                <CardTitle className="text-xl text-white">{title}</CardTitle>
            </CardHeader>
        </Card>
    );
}
