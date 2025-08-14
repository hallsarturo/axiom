'use client';

import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { getSearchResults } from '@/lib/actions/actions';
import { useState, useEffect } from 'react';

const frameworks = [
    {
        value: 'next.js',
        label: 'Next.js',
    },
    {
        value: 'sveltekit',
        label: 'SvelteKit',
    },
    {
        value: 'nuxt.js',
        label: 'Nuxt.js',
    },
    {
        value: 'remix',
        label: 'Remix',
    },
    {
        value: 'astro',
        label: 'Astro',
    },
];

export function SearchBar() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setOpen(false);
            return;
        }
        setOpen(true); // Open popover when search starts
        const timer = setTimeout(async () => {
            setLoading(true);
            const data = await getSearchResults(query);
            setResults(data.data?.results || []);
            setLoading(false);
        }, 300); // debounce 300ms
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div>
            <div className="flex">
                <Input
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {/* Optional: You can use a Button or leave empty if you want only input to trigger */}
                    <div />
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Type to search..."
                        />
                        <CommandList>
                            {loading && (
                                <div className="p-4 text-center text-muted-foreground">
                                    Loading...
                                </div>
                            )}
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {results.map((res) => (
                                    <CommandItem
                                        key={res.value}
                                        value={res.value}
                                        onSelect={() => {
                                            setValue(res.value);
                                            setOpen(false);
                                            // TODO: Show detailed view for res
                                        }}
                                    >
                                        <CheckIcon
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === res.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {res.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
