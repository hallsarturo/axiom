import { SelectPostType } from '@/components/feed/select-post-type';

export default function Feed() {
    return (
        <main className="flex min-h-screen justify-center items-center mt-6">
            <div className="fixed top-1/3 left-20">
                <div className="flex flex-col justify-center">
                    <SelectPostType className="flex justify-center"></SelectPostType>
                </div>
            </div>
        </main>
    );
}
