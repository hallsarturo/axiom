import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export function Post() {
    return (
        <Card className="w-2xl">
            <CardHeader>
                <CardTitle>User Card</CardTitle>
                <CardDescription>metadata</CardDescription>
                <CardAction>...</CardAction>
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
