import React, { useState } from 'react';

const UploadBtn = ({ register, setIsOpen, watch, setValue }) => {
  const watchAll = watch();
 
  const [error, setError] = useState(null);
  const [fileNames, setFileNames] = useState([null, null]);
  const [uploadedFiles, setUploadedFiles] = useState([null, null]);

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      return 'Only JPG, JPEG, PNG, and PDF files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size exceeds 2MB';
    }

    return null;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = async (event) => {
    const file = event.target.files[0];
    const validationError = file ? validateFile(file) : null;
    setError(validationError);

    if (file && !validationError) {
      const base64String = await convertToBase64(file);

    
      const index = fileNames[0] ? (fileNames[1] ? null : 1) : 0;

      if (index !== null) {
        const docName = `document_name${index + 1}`;
        const docFileName = `document_file_name${index + 1}`;


        setValue(docName, base64String);
        setValue(docFileName, file.name);

        const newFileNames = [...fileNames];
        newFileNames[index] = file.name;
        setFileNames(newFileNames);

        const newUploadedFiles = [...uploadedFiles];
        newUploadedFiles[index] = file;
        setUploadedFiles(newUploadedFiles);

        setIsOpen(false);
      }
    }
  };

  const handleRemove = (index) => {
    const newFileNames = [...fileNames];
    newFileNames[index] = null;
    setFileNames(newFileNames);

    const newUploadedFiles = [...uploadedFiles];
    newUploadedFiles[index] = null;
    setUploadedFiles(newUploadedFiles);

    setValue(`document_name${index + 1}`, null);
    setValue(`document_file_name${index + 1}`, null);

    setError(null);
  };

  const isUploadDisabled = fileNames[0] !== null && fileNames[1] !== null;


  return (
    <div className="flex flex-col gap-4">
      <label
        className={`flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer ${isUploadDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Upload
        <input
          type="file"
          id="uploadFile"
          className="hidden"
          onChange={handleChange}
          accept=".jpg,.jpeg,.png,.pdf"
          disabled={isUploadDisabled}
        />
      </label>
      <div>
        <p className="text-base font-semibold text-[#55555566]">
          Business/Investment/Work Permit License and business registration/TIN
        </p>
        <p className="mt-1 text-sm text-[#555]">
          Only jpg/jpeg/png/pdf files can be uploaded, and the size does not exceed 2MB
        </p>
        {fileNames.map((name, index) => (
          name && (
            <div key={index} className="flex items-center mt-1">
              <p className="text-sm text-green-500">{name}</p>
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => handleRemove(index)}
              >
                &times;
              </button>
            </div>
          )
        ))}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default UploadBtn;
