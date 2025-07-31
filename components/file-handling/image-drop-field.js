'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';

export function ImageDropField({ onDrop }) {
    const handleDrop = useCallback(
        (acceptedFiles) => {
            // You can handle the file upload here or pass to parent
            onDrop(acceptedFiles);
        },
        [onDrop]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: { 'image/*': [] },
        multiple: false,
    });

    return (
        <div
            {...getRootProps()}
            className="border border-dashed border-secundary rounded-md p-6 flex flex-col items-center cursor-pointer"
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the image here ...</p>
            ) : (
                <p>Drag & drop an image here, or click to select one</p>
            )}
            <Button variant="outline" className="mt-2">
                Browse
            </Button>
        </div>
    );
}
