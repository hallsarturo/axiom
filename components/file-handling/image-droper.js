'use client';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

// Import FilePond plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register plugins
registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit
);

export function ImageDroper({ onUploaded, children }) {
    return (
        <>
            {children}
            <FilePond
                allowMultiple={false}
                acceptedFileTypes={['image/png', 'image/jpeg', 'image/gif']}
                server={{
                    process: {
                        url: '/api/upload/notyet',
                        onload: (response) => {
                            const fileUrl = JSON.parse(response).url;
                            onUploaded(fileUrl);
                        },
                    },
                }}
                onremovefile={() => onUploaded(null)}
                labelIdle='Drag & Drop your image or <span class="filepond--label-action">Browse</span>'
                imagePreviewHeight={85}
                imageCropAspectRatio="1:1"
                imageResizeTargetWidth={85}
                imageResizeTargetHeight={85}
                stylePanelLayout="compact circle"
                styleLoadIndicatorPosition="center bottom"
                styleProgressIndicatorPosition="right bottom"
                styleButtonRemoveItemPosition="left bottom"
                styleButtonProcessItemPosition="right bottom"
            />
        </>
    );
}
