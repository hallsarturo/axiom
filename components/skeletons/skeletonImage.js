import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonImage() {
    return (
        <div className="flex flex-col justify-center gap-4 space-y-3">
            <Skeleton className="h-[150px] w-[350px] sm:w-[250px] md:w-[350px] rounded-xl mb-4" />
            
        </div>
    );
}
