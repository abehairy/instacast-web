import React, { useState, useRef } from 'react';
import { MdAttachFile } from 'react-icons/md'; // Ensure you've imported MdAttachFile

const FileUploader = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleFileInput = (e) => {
    // handle validations
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file); // Pass the file to the parent component
    }
  };

  const handleButtonClick = () => {
    // Trigger the file input click event
    fileInputRef.current.click();
  };

  return (
    <div>
      <button onClick={handleButtonClick} className="upload-button">
        {!selectedFile ? <MdAttachFile size={28} /> : <span className='text-2xl'>✅</span>}
      </button>
      <input type="file" onChange={handleFileInput} style={{ display: 'none' }} ref={fileInputRef} />
      {selectedFile && <p>File name: {selectedFile.name}</p>}
    </div>
  );
};

export default FileUploader;
