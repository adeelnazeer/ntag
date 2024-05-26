/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const UploadBtn = ({register}) => {
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [base64, setBase64] = useState(null);

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

    if (!validationError) {
      setFileName(file.name);
      try {
        const base64String = await convertToBase64(file);
        register('document_name1', { value: base64String, required: true });
        register('document_file_name1', { value: fileName});

        setBase64(base64String);
      } catch (error) {
      }
    } else {
      setFileName(null);
      setBase64(null);
      console.error('File validation error:', validationError);
    }
  };
  console.log(base64,"asdsd")

  return (
    <div className="flex gap-4">
      <label className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer">
        Upload
        <input
          type="file"
          id="uploadFile1"
          className="hidden"
          onChange={handleChange}
          accept=".jpg,.jpeg,.png,.pdf"
        
          
        />
      </label>
      <div>
        <p className="text-base font-semibold text-[#55555566]">
          Business/Investment/Work Permit License and business registration/TIN
        </p>
        <p className="mt-1 text-sm text-[#555]">
          Only jpg/jpeg/png/pdf files can be uploaded, and the size does not
          exceed 2MB
        </p>
        {fileName && <p className="mt-1 text-sm text-green-500">{fileName}</p>}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default UploadBtn;
