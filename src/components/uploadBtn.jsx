/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const UploadBtn = ({ register, setIsOpen, watch, setValue }) => {
  const watchAll = watch();

  const [error, setError] = useState(null);
  const [fileNames, setFileNames] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState(null);

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
    if (file) {
      const base64String = await convertToBase64(file);
      setValue("doc_url", base64String);
      setValue("docFileName", file.name);

      setFileNames(file?.name);
      setUploadedFiles(file);

      setIsOpen(false);
    }
  };


  return (
    <div className="flex flex-col gap-4">
      <label
        className={`flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer`}
      >
        Upload documents
        <input
          type="file"
          id="uploadFile"
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
          Only jpg/jpeg/png/pdf files can be uploaded, and the size does not exceed 2MB
        </p>
        {fileNames &&
          <div className="flex items-center mt-1">
            <p className="text-sm text-green-500">{fileNames}</p>
          </div>
        }

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default UploadBtn;
