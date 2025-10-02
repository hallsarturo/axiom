'use client';

import { CheckIcon, ChevronsUpDownIcon, Search } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { getSearchResults } from '@/lib/actions/client-actions';
import { useState, useEffect, Fragment } from 'react';

export function SearchBar({ size = 18, color = 'primary' }) {
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
        setOpen(true);
        const timer = setTimeout(async () => {
            setLoading(true);
            const data = await getSearchResults(query);
            setResults(data.data?.results || []);
            setLoading(false);
        }, 300); // debouncer
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="text-primary dark:text-foreground"
                    size="icon"
                >
                    <Search
                        size={size}
                        className={typeof color === 'string' ? color : ''}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput
                        value={query}
                        onValueChange={(val) => {
                            setOpen(true);
                            setQuery(val);
                        }}
                        placeholder="Type to search..."
                        className="w-full"
                    />
                    <CommandList>
                        {loading && (
                            <div className="p-4 text-center text-muted-foreground">
                                Loading...
                            </div>
                        )}
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {results.map((res, idx) => (
                                <Fragment key={res.key}>
                                    <CommandItem
                                        value={
                                            res.type === 'user'
                                                ? res.username
                                                : res.title
                                        }
                                        onSelect={() => {
                                            setValue(
                                                res.type === 'user'
                                                    ? res.username
                                                    : res.title
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <CheckIcon
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value ===
                                                    (res.type === 'user'
                                                        ? res.username
                                                        : res.title)
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {res.type === 'user'
                                            ? res.username
                                            : res.title}
                                    </CommandItem>
                                    <CommandItem
                                        value={res.title}
                                        onSelect={() => {
                                            setValue(res.title);
                                            setOpen(false);

                                            // Add navigation to the post detail page
                                            if (res.type !== 'user') {
                                                window.location.href = `/posts/${res.id}`;
                                            } else {
                                                window.location.href = `/profile/${res.id}`;
                                            }
                                        }}
                                    >
                                        <CheckIcon
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === res.title
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                        {res.title}
                                    </CommandItem>
                                    {/* <Separator className="my-1" /> */}
                                </Fragment>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
