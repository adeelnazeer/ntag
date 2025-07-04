// /* eslint-disable react/prop-types */
// import React, { useState } from 'react';
// import { IoCloseOutline } from 'react-icons/io5';
// import { FaCheck } from "react-icons/fa6";
// import { toast } from 'react-toastify';
// import Dropzone from 'react-dropzone';

// const UploadBtn = ({ setData, data }) => {
//   const [error, setError] = useState(null);
//   const [fileNames, setFileNames] = useState(["", "", ""]);
//   const [uploadedFiles, setUploadedFiles] = useState([null, null, null]);

//   const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

//   const convertToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const handleDrop = async (acceptedFiles, index, type) => {
//     const file = acceptedFiles[0];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error("Invalid file type. Only JPG, PNG, and PDF files are allowed.");
//       return;
//     }

//     const fileSizeMB = file.size / (1024 * 1024);
//     if (fileSizeMB > 3) {
//       setError("File size exceeds 3MB.");
//       return;
//     }

//     const base64String = await convertToBase64(file);
//     const updatedFileNames = [...fileNames];
//     const updatedUploadedFiles = [...uploadedFiles];

//     let fieldLabel = "";
//     switch (index) {
//       case 0:
//         fieldLabel = "Registration License";
//         break;
//       case 1:
//         fieldLabel = "Application Letter";
//         break;
//       case 2:
//         fieldLabel = "Trade License";
//         break;
//     }

//     updatedFileNames[index] = `${file.name}  ${fieldLabel}`;
//     updatedUploadedFiles[index] = base64String;

//     setFileNames(updatedFileNames);
//     setUploadedFiles(updatedUploadedFiles);

//     let fieldName = '';
//     switch (index) {
//       case 0:
//         fieldName = 'registration_license';
//         break;
//       case 1:
//         fieldName = 'application_letter';
//         break;
//       case 2:
//         fieldName = 'trade_license';
//         break;
//       default:
//         fieldName = `document_${index}`;
//     }

//     setData(st => ({
//       ...st,
//       [`${fieldName}_url`]: file,
//       [`${fieldName}_name`]: file?.name,
//       [`${fieldName}_type`]: type
//     }));

//     setError(null);
//   };

//   const handleRemove = (index) => {
//     const updatedFileNames = [...fileNames];
//     const updatedUploadedFiles = [...uploadedFiles];

//     updatedFileNames[index] = "";
//     updatedUploadedFiles[index] = null;

//     setFileNames(updatedFileNames);
//     setUploadedFiles(updatedUploadedFiles);

//     let fieldKey = "";
//     switch (index) {
//       case 0:
//         fieldKey = "registration_license";
//         break;
//       case 1:
//         fieldKey = "application_letter";
//         break;
//       case 2:
//         fieldKey = "trade_license";
//         break;
//       default:
//         fieldKey = `document_${index}`;
//     }

//     setData((prev) => {
//       const newData = { ...prev };
//       delete newData[`${fieldKey}_name`];
//       delete newData[`${fieldKey}_url`];
//       delete newData[`${fieldKey}_type`];
//       return newData;
//     });

//     setError(null);
//   };

//   const renderDropzone = (index, type, fieldKey) => (
//     <Dropzone onDrop={(acceptedFiles) => handleDrop(acceptedFiles, index, type)} multiple={false} accept={{'image/*': [], 'application/pdf': []}}>
//       {({ getRootProps, getInputProps, isDragActive }) => (
//         <div
//           {...getRootProps()}
//           className={`border-2 border-dashed rounded-lg p-5 w-full max-w-sm text-center cursor-pointer transition-colors duration-200 ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
//         >
//           <input {...getInputProps()} />
//           <p className="text-sm text-gray-600">Drag & drop or click to upload {type}</p>
//           {uploadedFiles[index] && (
//             <div className="mt-3">
//               {uploadedFiles[index].startsWith('data:image') ? (
//                 <img
//                   src={uploadedFiles[index]}
//                   alt="Preview"
//                   className="mx-auto max-h-40 rounded border mt-2"
//                 />
//               ) : (
//                 <p className="text-xs text-green-700 mt-2">PDF file uploaded</p>
//               )}
//             </div>
//           )}
//           {data?.[`${fieldKey}_url`] && !uploadedFiles[index] && <FaCheck className='mx-auto mt-2 text-green-500' />}
//         </div>
//       )}
//     </Dropzone>
//   );

//   return (
//     <div className="flex flex-col gap-4">
//       <div className="flex justify-between gap-4 flex-wrap">
//         {renderDropzone(0, "Registration License", "registration_license")}
//         {renderDropzone(1, "Application Letter", "application_letter")}
//         {renderDropzone(2, "Trade License", "trade_license")}
//       </div>
//       <div>
//         <p className="text-base font-semibold text-[#55555566]">
//           Business Registration License, Application Letter, and Trade License
//         </p>
//         <p className="mt-1 text-sm text-[#555]">
//           Only JPG, JPEG, PNG, or PDF files can be uploaded, and each file must not exceed 3MB.
//         </p>

//         {fileNames.map((fileName, index) => (
//           fileName && (
//             <div key={index} className="flex items-center mt-1">
//               <p className="text-sm text-secondary">{fileName}</p>
//               <IoCloseOutline className="ml-2 text-red-500 text-sm underline cursor-pointer"
//                 onClick={() => handleRemove(index)}
//               />
//             </div>
//           )
//         ))}

//         {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default UploadBtn;

/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { FaCheck } from "react-icons/fa6";
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';

const UploadBtn = ({ setData, data }) => {
  const [error, setError] = useState(null);
  const [fileNames, setFileNames] = useState(["", "", ""]);
  const [uploadedFiles, setUploadedFiles] = useState([null, null, null]);
  const [pdfModal, setPdfModal] = useState({ open: false, src: null });

  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDrop = async (acceptedFiles, index, type) => {
    const file = acceptedFiles[0];
    if (!allowedTypes?.includes(file?.type)) {
      toast.error("Invalid file type. Only JPG, PNG, and PDF files are allowed.");
      return;
    }

    const fileSizeMB = file?.size / (1024 * 1024);
    if (fileSizeMB > 3) {
      setError("File size exceeds 3MB.");
      return;
    }

    const base64String = await convertToBase64(file);
    const updatedFileNames = [...fileNames];
    const updatedUploadedFiles = [...uploadedFiles];

    let fieldLabel = "";
    switch (index) {
      case 0:
        fieldLabel = "Registration License";
        break;
      case 1:
        fieldLabel = "Application Letter";
        break;
      case 2:
        fieldLabel = "Trade License";
        break;
    }

    updatedFileNames[index] = `${file.name}  ${fieldLabel}`;
    updatedUploadedFiles[index] = base64String;

    setFileNames(updatedFileNames);
    setUploadedFiles(updatedUploadedFiles);

    let fieldName = '';
    switch (index) {
      case 0:
        fieldName = 'registration_license';
        break;
      case 1:
        fieldName = 'application_letter';
        break;
      case 2:
        fieldName = 'trade_license';
        break;
      default:
        fieldName = `document_${index}`;
    }

    setData(st => ({
      ...st,
      [`${fieldName}_url`]: file,
      [`${fieldName}_name`]: file?.name,
      [`${fieldName}_type`]: type
    }));

    setError(null);
  };

  const handleRemove = (index) => {
    const updatedFileNames = [...fileNames];
    const updatedUploadedFiles = [...uploadedFiles];

    updatedFileNames[index] = "";
    updatedUploadedFiles[index] = null;

    setFileNames(updatedFileNames);
    setUploadedFiles(updatedUploadedFiles);

    let fieldKey = "";
    switch (index) {
      case 0:
        fieldKey = "registration_license";
        break;
      case 1:
        fieldKey = "application_letter";
        break;
      case 2:
        fieldKey = "trade_license";
        break;
      default:
        fieldKey = `document_${index}`;
    }

    setData((prev) => {
      const newData = { ...prev };
      delete newData[`${fieldKey}_name`];
      delete newData[`${fieldKey}_url`];
      delete newData[`${fieldKey}_type`];
      return newData;
    });

    setError(null);
  };

  const openPdfModal = (base64) => {
    setPdfModal({ open: true, src: base64 });
  };

  const closePdfModal = () => {
    setPdfModal({ open: false, src: null });
  };

  const renderDropzone = (index, type, fieldKey) => (
    <Dropzone onDrop={(acceptedFiles) => handleDrop(acceptedFiles, index, type)} multiple={false} accept={{ 'image/*': [], 'application/pdf': [] }}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed relative rounded-lg p-5 w-full text-center cursor-pointer transition-colors duration-200 ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-left text-gray-600">Drag & drop or click to upload {type}</p>
          {uploadedFiles[index] && (
            <div className="mt-3">
              {uploadedFiles[index].startsWith('data:image') ? (
                <img
                  src={uploadedFiles[index]}
                  alt="Preview"
                  className="mx-auto max-h-40 rounded border "
                />
              ) : (
                <button
  type="button" // ✅ Correct button type
                  onClick={(e) => {
                    e.stopPropagation()
                    openPdfModal(uploadedFiles[index])
                  }}
                  className="text-[#008fd5] text-sm underline hover:border-transparent"
                >
                  View PDF
                </button>
              )}
            </div>
          )}
          {fileNames?.[index] != "" &&
            <div key={index} className="flex items-center mt-3">
              <p className="text-sm text-secondary">{fileNames?.[index]}</p>
              <IoCloseOutline className="ml-2 text-red-500 text-sm underline cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
              />
            </div>
          }
          {data?.[`${fieldKey}_url`] && !uploadedFiles[index] && <FaCheck className='mx-auto mt-2 text-green-500' />}
        </div>
      )}
    </Dropzone>
  );

  return (
    <div className="flex flex-col gap-2">
      <div>
        <label className="md:text-base text-[16px]  text-[#555]">
          Upload Documents <span className=" text-red-500">*</span>
        </label>
      </div>
      <div className="flex justify-between relative border border-gray-300 p-4 rounded-xl gap-4 flex-wrap">
        {renderDropzone(0, "Registration License", "registration_license")}
        {renderDropzone(1, "Application Letter", "application_letter")}
        {renderDropzone(2, "Trade License", "trade_license")}
      </div>
      <div>
        <p className="text-base font-semibold text-[#55555566]">
          Business Registration License, Application Letter, and Trade License
        </p>
        <p className="mt-1 text-sm text-[#555]">
          Only JPG, JPEG, PNG, or PDF files can be uploaded, and each file must not exceed 3MB.
        </p>

        {/* {fileNames.map((fileName, index) => (
          fileName && (
            <div key={index} className="flex items-center mt-1">
              <p className="text-sm text-secondary">{fileName}</p>
              <IoCloseOutline className="ml-2 text-red-500 text-sm underline cursor-pointer"
                onClick={() => handleRemove(index)}
              />
            </div>
          )
        ))} */}

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      {pdfModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-red-600 text-sm"
              onClick={closePdfModal}
            >
              Close
            </button>
            <h2 className="text-lg font-semibold mb-4">PDF Preview</h2>
            <iframe
              src={pdfModal.src}
              title="PDF Preview"
              className="w-full h-[500px] border"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBtn;
