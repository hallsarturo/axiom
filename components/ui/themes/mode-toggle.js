'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    // Determine checked state: true for dark, false for light
    const checked = theme === 'dark';

    return (
        <div className="flex items-center sm:ml-7 gap-2">
            <Sun className="h-3.5 w-3.5 text-primary dark:text-foreground" />
            <Switch
                checked={checked}
                onCheckedChange={(isChecked) =>
                    setTheme(isChecked ? 'dark' : 'light')
                }
                aria-label="Toggle theme"
            />
            <Moon className="h-3.5 w-3.5 text-primary dark:text-foreground" />
        </div>
    );
}
