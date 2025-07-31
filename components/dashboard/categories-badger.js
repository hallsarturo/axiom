'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import menuCategories from '@/data/menu-categories/menu-categories.json';
import { motion } from 'motion/react';
import { useRef, useState, useEffect } from 'react';

const level0Categories = menuCategories.level0;
const level1Categories = menuCategories.level1;

// Animation stagge badges
const staggerContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.07,
        },
    },
};

const badgeVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function CategoriesBadger({ onSelectionChange, ...props }) {
    const [activeCategories, setActiveCategories] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const prevVisibleCount = useRef(0);

    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(activeCategories);
        }
    }, [activeCategories, onSelectionChange]);
    
    
    useEffect(() => {
        prevVisibleCount.current = visibleCount - 10;
    }, [visibleCount]);

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

    return (
        <div>
            {/* Render level0 categories stagger*/}
            <motion.div
                className={`flex flex-row flex-wrap gap-4 max-w-2xl justify-center ${props.className}`}
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }} // triggers animation when 20% in view, only once
            >
                {level0Categories.map((categorie) => (
                    <motion.div key={categorie.id} variants={badgeVariant}>
                        <Badge
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
                    </motion.div>
                ))}
            </motion.div>

            {/* Render visible level1 categories stagger */}
            <p className="mt-5 mb-[-20px] text-sm/6 text-muted-foreground text-center">
                Subcategories
            </p>
            <div
                className={`flex flex-row flex-wrap gap-4 max-w-2xl justify-center ${props.className}`}
            >
                {/* Already visible badges (no animation) */}
                {level1Categories
                    .slice(0, prevVisibleCount.current)
                    .map((categorie) => (
                        <div key={categorie.id}>
                            <Badge
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
                        </div>
                    ))}

                {/* Only render motion.div if there are new badges */}
                {visibleCount > prevVisibleCount.current && (
                    <motion.div
                        key={visibleCount} // <-- This forces remount and retriggers stagger
                        className="flex flex-row flex-wrap gap-4 justify-center"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                    >
                        {level1Categories
                            .slice(prevVisibleCount.current, visibleCount)
                            .map((categorie) => (
                                <motion.div
                                    key={categorie.id}
                                    variants={badgeVariant}
                                >
                                    <Badge
                                        variant="secondary"
                                        className={`cursor-pointer transition-colors ${
                                            activeCategories.includes(
                                                categorie.id
                                            )
                                                ? 'bg-primary text-primary-foreground'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleBadgeClick(categorie.id)
                                        }
                                    >
                                        {categorie.name}
                                    </Badge>
                                </motion.div>
                            ))}
                    </motion.div>
                )}
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
