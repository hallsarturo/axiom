'use client';

import { Badge } from '@/components/ui/badge';

export function CategoriesBadger({ ...props }) {
    return (
        <div className={props.className}>
            <Badge variant="outline">Badge</Badge>
        </div>
    );
}
