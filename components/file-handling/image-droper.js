'use client';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css'
import { Button } from '@/components/ui/button';


export function ImageDroper({ onUploaded }) {
  return (
    <FilePond
      allowMultiple={false}
      server={{
        process: {
          url: '/api/upload/notyet', // your upload endpoint
          onload: (response) => {
            const fileUrl = JSON.parse(response).url;
            onUploaded(fileUrl); // pass the uploaded file URL to parent
          },
        },
      }}
      onremovefile={() => onUploaded(null)}
      labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
    />
  );
}