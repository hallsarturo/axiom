'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Only show the toggle after mounting to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Show a placeholder during server rendering and first mount
    if (!mounted) {
        return (
            <div className="flex items-center sm:ml-7 gap-2">
                <Sun className="h-3.5 w-3.5 text-primary dark:text-foreground" />
                {/* Empty div with same dimensions as the Switch */}
                <div className="h-[1.15rem] w-8" aria-hidden="true" />
                <Moon className="h-3.5 w-3.5 text-primary dark:text-foreground" />
            </div>
        );
    }

    // Only render the actual switch on the client
    return (
        <div className="flex items-center sm:ml-7 gap-2">
            <Sun className="h-3.5 w-3.5 text-primary dark:text-foreground" />
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={(isChecked) =>
                    setTheme(isChecked ? 'dark' : 'light')
                }
                aria-label="Toggle theme"
            />
            <Moon className="h-3.5 w-3.5 text-primary dark:text-foreground" />
        </div>
    );
}
