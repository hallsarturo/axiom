'use client';

import { CardContent } from '@/components/ui/card';
import Image from 'next/image';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function PostCardContent({ description, part1, part2, seeMore, setSeeMore, imgSrc }) {
    return (
        <CardContent>
            <Collapsible
                open={seeMore}
                onOpenChange={setSeeMore}
                className="text-justify mb-3"
            >
                {description ? part1 : null}
                <CollapsibleContent>
                    {part2 ? part2 : null}
                </CollapsibleContent>
                <CollapsibleTrigger className="text-primary dark:text-foreground font-medium cursor-pointer ml-2">
                    {seeMore ? 'See less' : 'See more'}
                </CollapsibleTrigger>
            </Collapsible>
            <div className="w-full flex justify-center items-center">
                {imgSrc ? (
                    <Image
                        src={imgSrc}
                        width={500}
                        height={500}
                        alt="Picture of the author"
                        className="rounded-t-lg object-cover max-h-[600px] w-full"
                    />
                ) : null}
            </div>
        </CardContent>
    );
}