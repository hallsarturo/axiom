import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function PaperPost() {
    return (
        <Card className="w-2xl">
            <CardHeader>
                <CardTitle>Journal Card</CardTitle>
                <CardDescription>metadata</CardDescription>
                <CardAction>
                    <div className="flex gap-2 items-center">
                        <div>...</div>
                        <div>x</div>
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p>Abstract</p>
                <p>img</p>
            </CardContent>
            <CardFooter className="justify-center">
                <div className="flex flex-col justify-center">
                    <p>Likes | metadata |metadata</p>

                    <p>Likes | Coment. |share</p>
                </div>
            </CardFooter>
        </Card>
    );
}
