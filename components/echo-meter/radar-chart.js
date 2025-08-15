'use client';

import { ResponsiveRadar } from '@nivo/radar';

export function RadarChart({ data }) {
    return (
        <div
            className="w-full mx-auto"
            style={{
                height: '300px',
                maxWidth: '100%',
            }}
        >
            <div
                className="hidden md:block"
                style={{ height: '500px', maxWidth: '800px', margin: '0 auto' }}
            >
                <ResponsiveRadar
                    data={data}
                    keys={['politics', 'science', 'philosophy']}
                    indexBy="taste"
                    margin={{ top: 40, right: 120, bottom: 40, left: 120 }}
                    gridLabelOffset={24}
                    dotSize={8}
                    dotColor={{ theme: 'background' }}
                    dotBorderWidth={2}
                    blendMode="multiply"
                    legends={[
                        {
                            anchor: 'top-left',
                            direction: 'column',
                            translateX: -60,
                            translateY: -20,
                            itemWidth: 300,
                            itemHeight: 20,
                            symbolShape: 'circle',
                        },
                    ]}
                />
            </div>
            <div className="md:hidden" style={{ height: '300px' }}>
                <ResponsiveRadar
                    data={data}
                    keys={['politics', 'science', 'philosophy']}
                    indexBy="taste"
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    gridLabelOffset={16}
                    dotSize={6}
                    dotColor={{ theme: 'background' }}
                    dotBorderWidth={2}
                    blendMode="multiply"
                    legends={[
                        {
                            anchor: 'top-left',
                            direction: 'column',
                            translateX: -20, // less space for mobile
                            translateY: -10,
                            itemWidth: 100, // smaller width for mobile
                            itemHeight: 16,
                            symbolShape: 'circle',
                        },
                    ]}
                />
            </div>
        </div>
    );
}
