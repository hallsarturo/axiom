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

const data = [
    {
        taste: 'realist',
        politics: 89,
        science: 86,
        philosophy: 90,
    },
    {
        taste: 'tech',
        politics: 114,
        science: 38,
        philosophy: 61,
    },
    {
        taste: 'scientist',
        politics: 62,
        science: 99,
        philosophy: 88,
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

export default function EchoMeter() {
    return (
        <div className="flex flex-col justify-center">
            <div className="flex w-full justify-center">
                <div className="flex flex-col justify-center w-2/3 text-center mb-4">
                    <h1 className="text-xl text-center text-primary dark:text-foreground my-4">
                        Echo Meter
                    </h1>
                    <p>
                        Discover the shape of your intellectual world. Our algorithm
                        analyzes the content you share, bookmark, and engage with —
                        along with the perspectives of the people you follow — to reveal
                        how open or closed your intellectual sphere is. <br /> <br />{' '}
                        From politics to philosophy to science, Echo-meter maps your
                        exposure to diverse viewpoints and measures the breadth of your
                        knowledge interests. See whether you’re exploring the full
                        spectrum or living inside a tight echo chamber… and decide where
                        to go next.
                    </p>
                </div>
            </div>
            <div className="flex w-full justify-center">
                <div className="flex w-full max-w-2xl justify-center">
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
                </div>
            </div>
        </div>
    );
}
