import React, { useState } from 'react';
import Dropzone from 'react-dropzone';

const Uploader = ({ onDrop, isLoading, LoaderComponent, isButton, buttonText, dropzoneContent, uploadedMessage }) => {
  const [isUploaded, setIsUploaded] = useState(false);
  const dropzoneClass = "border-2 border-dashed w-50 bg-gray-300 border-gray-300 rounded-lg p-6 text-center cursor-pointer";
  const buttonClass = "inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium text-sm leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out";

  const handleDrop = (acceptedFiles) => {
    setIsUploaded(false); // Reset the uploaded state
    if (onDrop) {
      onDrop(acceptedFiles);
      setIsUploaded(true); // Set uploaded state to true if files are accepted
    }
  };

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps, open }) => (
        <div {...getRootProps()} className={isButton ? '' : dropzoneClass}>
          <input {...getInputProps()} />

          {isLoading ? (
            <div class="text-center">{LoaderComponent}</div>
          ) : isButton ? (
            <button onClick={open} className={buttonClass}>
              {buttonText}
            </button>
          ) : (
            <div>
              {!isUploaded && (dropzoneContent || <p> ⬆️ Drag 'n' drop some files here, or click to select files</p>)}
              {isUploaded && <p>{uploadedMessage || 'Dropped'}</p>/* Display message after successful upload */}
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default Uploader;
