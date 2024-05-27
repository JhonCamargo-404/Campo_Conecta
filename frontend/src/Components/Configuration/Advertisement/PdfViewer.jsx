import React, { useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { pdfjs } from 'react-pdf';

const PdfViewer = ({ fileUrl, onClose }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    }, []);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg overflow-auto relative max-w-5xl w-full h-3/4 m-auto">
                <button className="absolute top-4 right-4 text-lg font-bold text-black" onClick={onClose}>&times;</button>
                <Worker>
                    <Viewer
                        fileUrl={fileUrl}
                        plugins={[defaultLayoutPluginInstance]}
                    />
                </Worker>
            </div>
        </div>
    );
};

export default PdfViewer;