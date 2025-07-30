'use client';

import { Badge } from '@/components/ui/badge';
import { getCategoriesData } from '@/lib/actions/actions';
import { useEffect, useState } from 'react';

const level0Categories = [
    {
        id: 1,
        name: 'Metaphysics and Epistemology',
        href: null,
        level: 0,
        parentId: 1,
    },
    {
        id: 2,
        name: 'Value Theory',
        href: null,
        level: 0,
        parentId: 2094,
    },
    {
        id: 3,
        name: 'Science, Logic, and Mathematics',
        href: null,
        level: 0,
        parentId: 3790,
    },
    {
        id: 4,
        name: 'History of Western Philosophy',
        href: null,
        level: 0,
        parentId: 5126,
    },
    {
        id: 5,
        name: 'Philosophical Traditions',
        href: null,
        level: 0,
        parentId: 6653,
    },
    {
        id: 6,
        name: 'Philosophy, Misc',
        href: null,
        level: 0,
        parentId: 7310,
    },
    {
        id: 7,
        name: 'Other Academic Areas',
        href: null,
        level: 0,
        parentId: 7330,
    },
];

export function CategoriesBadger({ ...props }) {
    const [dashboardData, setCategoriesData] = useState(null);
    const [activeCategories, setActiveCategories] = useState([]);
    const [parentId, setParentId] = useState(null);

    useEffect(() => {
        async function fetchData() {
            let token = null;
            if (process.env.NODE_ENV === 'development') {
                token = localStorage.getItem('token');
            } else {
                token = null;
            }
            const result = await getCategoriesData(token, parentId);
            if (result.success) {
                setCategoriesData(result.data);
            }
        }
        fetchData();
    }, [parentId]);

    const handleBadgeClick = (id) => {
        setActiveCategories((prev) =>
            prev.includes(id)
                ? prev.filter((catId) => catId !== id)
                : [...prev, id]
        );
    };

    return (
        <div
            className={`flex flex-row flex-wrap gap-4 max-w-2xl ${props.className}`}
        >
            {level0Categories.map((categorie) => (
                <Badge
                    key={categorie.id}
                    variant="secondary"
                    className={`cursor-pointer transition-colors ${
                        activeCategories.includes(categorie.id)
                            ? 'bg-primary text-primary-foreground'
                            : ''
                    }`}
                    onClick={() => handleBadgeClick(categorie.id)}
                >
                    {categorie.name}
                </Badge>
            ))}
        </div>
    );
}
