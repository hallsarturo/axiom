'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
    const [activeCategories, setActiveCategories] = useState([]);
    const [subCategoriesMap, setSubCategoriesMap] = useState({});

    const fetchData = async (parentId) => {
        let token = null;
        if (process.env.NODE_ENV === 'development') {
            token = localStorage.getItem('token');
        }
        const result = await getCategoriesData(token, parentId);
        if (result.success) {
            setSubCategoriesMap((prev) => ({
                ...prev,
                [parentId]: result.data.children,
            }));
        }
    };

    const handleBadgeClick = (id, parentId) => {
        setActiveCategories((prev) => {
            const isActive = prev.includes(id);
            if (isActive) {
                // Remove subcategories for this parentId
                setSubCategoriesMap((subPrev) => {
                    const updated = { ...subPrev };
                    delete updated[parentId];
                    return updated;
                });
                return prev.filter((catId) => catId !== id);
            } else {
                // Fetch and show subcategories for this parentId
                fetchData(parentId);
                return [...prev, id];
            }
        });
    };

    return (
        <div>
            <div
                className={`flex flex-row justify-center flex-wrap gap-4 max-w-2xl ${props.className}`}
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
                        onClick={() =>
                            handleBadgeClick(categorie.id, categorie.parentId)
                        }
                    >
                        {categorie.name}
                    </Badge>
                ))}
            </div>
            {/* Render subcategories for all active parent categories */}
            {activeCategories.map((catId) =>
                subCategoriesMap[catId] &&
                subCategoriesMap[catId].length > 0 ? (
                    <div key={catId}>
                        <Separator className="my-5" />
                        <p className="mt-1 text-sm/6 text-muted-foreground text-center">
                            Subcategories for{' '}
                            {level0Categories.find((c) => c.id === catId)?.name}
                        </p>
                        <div className="flex flex-row max-w-2xl justify-center flex-wrap gap-4 mt-8 ">
                            {subCategoriesMap[catId].map((subCat) => (
                                <Badge
                                    key={subCat.id}
                                    variant="secondary"
                                    className={`cursor-pointer transition-colors ${
                                        activeCategories.includes(subCat.id)
                                            ? 'bg-primary text-primary-foreground'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        handleBadgeClick(
                                            subCat.id,
                                            subCat.parentId
                                        )
                                    }
                                >
                                    {subCat.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ) : null
            )}
        </div>
    );
}
