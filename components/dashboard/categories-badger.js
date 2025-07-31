'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import menuCategories from '@/data/menu-categories/menu-categories.json';
import { useState } from 'react';

const level0Categories = menuCategories.level0;
const level1Categories = menuCategories.level1;

export function CategoriesBadger({ onSelectionChange, ...props }) {
    const [activeCategories, setActiveCategories] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);

    // Toggle badge active state
    const handleBadgeClick = (id) => {
        setActiveCategories((prev) =>
            prev.includes(id)
                ? prev.filter((catId) => catId !== id)
                : [...prev, id]
        );
    };

    // Load more categoriesLevel1
    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    // Send selected ids to parent (form) when needed
    // Call onSelectionChange(activeCategories) in parent on save

    return (
        <div>
            {/* Render level0 categories */}
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

            {/* Render visible level1 categories */}
            <p className="mt-5 text-sm/6 text-muted-foreground text-center">
                Subcategories
            </p>
            <div
                className={`flex flex-row flex-wrap gap-4 max-w-2xl ${props.className}`}
            >
                {level1Categories.slice(0, visibleCount).map((categorie) => (
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

            {/* Load more button */}
            {visibleCount < level1Categories.length && (
                <div className="flex justify-center mt-6">
                    <Button
                        size="sm"
                        className="text-xs"
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLoadMore();
                        }}
                    >
                        load more
                    </Button>
                </div>
            )}
        </div>
    );
}
