import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';

const FileUpload = ({ 
  onFileChange, 
  accept = 'image/*,video/*', 
  multiple = false,
  maxFiles = 1,
  label,
  className = ''
}) => {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
    
    if (files.length > maxFiles) {
      toast.error(`You can only upload ${maxFiles} file(s)`);
      return;
    }
    const newPreviews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    if (multiple) {
      setPreviews(prev => [...prev, ...newPreviews]);
      onFileChange([...previews.map(p => p.file), ...files]);
    } else {
      setPreviews(newPreviews);
      onFileChange(files);
    }
  };

  const removeFile = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    onFileChange([]);
  };

  // Fix: Better accept attribute handling - remove spaces and ensure proper MIME types
  const formatAcceptAttribute = (acceptStr) => {
    // Convert common video extensions to proper MIME types
    return acceptStr
      .split(',')
      .map(type => {
        const trimmed = type.trim();
        // Handle specific extensions
        if (trimmed === '.mp4') return 'video/mp4';
        if (trimmed === '.mov') return 'video/quicktime';
        if (trimmed === '.avi') return 'video/x-msvideo';
        return trimmed;
      })
      .join(',');
  };

  const formattedAccept = formatAcceptAttribute(accept);

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
        <div className="space-y-1 text-center">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={`file-upload-${label?.replace(/\s+/g, '-').toLowerCase()}`}
              className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
            >
              <span>Upload a file</span>
              <input
                id={`file-upload-${label?.replace(/\s+/g, '-').toLowerCase()}`}
                name="file-upload"
                type="file"
                className="sr-only"
                accept={formattedAccept}
                multiple={multiple}
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            {accept.includes('image') ? 'PNG, JPG, GIF up to 10MB' : 'MP4, MOV, AVI up to 100MB'}
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {preview.file.type.startsWith('image/') ? (
                <img
                  src={preview.preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={preview.preview}
                  className="w-full h-32 object-cover rounded-lg"
                  controls
                />
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;