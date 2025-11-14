import React, { useEffect, useRef } from 'react';
import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css'; // Optional: default Dropzone styling

// Disable auto discover to avoid conflicts with React
Dropzone.autoDiscover = false;

const DropzoneUploader = ({ url = '/upload', acceptedFiles = 'image/*', onUploadSuccess, onUploadError }) => {
    const dropzoneRef = useRef(null);
    const dzInstance = useRef(null);

    useEffect(() => {
        if (dropzoneRef.current && !dzInstance.current) {
            dzInstance.current = new Dropzone(dropzoneRef.current, {
                url,
                acceptedFiles,
                maxFilesize: 5, // in MB
                addRemoveLinks: true,
                init: function () {
                    this.on('success', (file, response) => {
                        console.log('Upload success:', response);
                        if (onUploadSuccess) onUploadSuccess(file, response);
                    });

                    this.on('error', (file, errorMessage) => {
                        console.error('Upload error:', errorMessage);
                        if (onUploadError) onUploadError(file, errorMessage);
                    });
                },
            });
        }

        return () => {
            if (dzInstance.current) {
                dzInstance.current.destroy();
                dzInstance.current = null;
            }
        };
    }, [url, acceptedFiles, onUploadSuccess, onUploadError]);

    return (
        <div>
            <div
                ref={dropzoneRef}
                className="dropzone"
                style={{
                    border: '2px dashed #0073e6',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    background: '#f9f9f9',
                }}
            >
                <p>Drag & drop files here or click to browse</p>
            </div>
        </div>
    );
};

export default DropzoneUploader;
