import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            setLoading(true);
            setProgress(0);
            const response = await axios.post('https://textextracor-1.onrender.com/upload', formData, {
                responseType: 'blob',
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'output.docx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error uploading file', error);
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 text-white">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-gray-800">
                <h1 className="text-2xl font-bold mb-6 text-center">File Upload</h1>
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2 mb-4"
                />
                <button 
                    onClick={handleUpload} 
                    className={`w-full py-2 rounded-lg text-black  bg-blue-500 ${loading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} transition-all duration-300`}
                    disabled={loading}
                >
                    {loading ? `Uploading... ${progress}%` : 'Upload'}
                </button>
            </div>
          
        </div>
    );
};

export default FileUpload;
