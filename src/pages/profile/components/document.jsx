import { useState } from "react";
import { useRegisterHook } from "../../hooks/useRegisterHook";

/* eslint-disable react/prop-types */

const DocumentInfo = ({ profileData }) => {
  const [data, setData] = useState(profileData)
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
  const { handleUpdateUserInfo } = useRegisterHook()
  const handleUpdate = () => {
    const payload = {
      document_name1: data?.comp_doc_name1,
      document_name2: data?.comp_doc_name2,
      document_file_name2: data?.file_doc_name1 || "",
      document_file_name1: data?.file_doc_name2

    }
    handleUpdateUserInfo(payload)

  }
  const handleChange = async (event, name, fileName) => {
    const file = event.target.files[0];
    const validationError = file ? validateFile(file) : null;
    setError(validationError);

    if (file && !validationError) {
      const base64String = await convertToBase64(file);
      setData(st => ({
        ...st,
        [name]: base64String,
        [fileName]: file.name,
      }))

      const index = fileNames[0] ? (fileNames[1] ? null : 1) : 0;

      if (index !== null) {
        const docName = `document_name${index + 1}`;
        const docFileName = `document_file_name${index + 1}`;


        // setValue(docName, base64String);
        // setValue(docFileName, file.name);

        const newFileNames = [...fileNames];
        newFileNames[index] = file.name;
        setFileNames(newFileNames);

        const newUploadedFiles = [...uploadedFiles];
        newUploadedFiles[index] = file;
        setUploadedFiles(newUploadedFiles);

      }
    }
  };
  return (
    <>
      <div className="mt-10 flex items-center max-w-3xl mx-auto  gap-6">
        <div className="relative h-44 w-40 ">
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>


          {data?.comp_doc_name1?.endsWith(".pdf") ? (
            // Render link if the file is a PDF
            <a
              href={data.comp_doc_name1}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 flex items-center hover:text-secondary justify-center h-44 w-full text-white font-semibold"
            >
              Open File
            </a>
          ) : (
            // Render image if the file is not a PDF
            <img
              className="h-44 w-full object-contain relative z-20"
              src={data?.comp_doc_name1}
              alt="Document"
            />
          )}
        </div>
        <div className="flex gap-4">
          <label className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer">
            Upload
            <input
              type="file"
              id="uploadFile1"
              className="hidden"
              onChange={(e) => handleChange(e, "comp_doc_name1", "file_doc_name1")}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </label>
          <div>
            <p>Upload Documents</p>
            <p className="text-base font-semibold text-[#55555566]">
              Business/Investment/Work Permit License and business
              registration/TIN
            </p>
            <p className="mt-1 text-sm text-[#555]">
              Only jpg/jpeg/png/pdf files can be uploaded, and the size does not
              exceed 2MB
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 flex items-center max-w-3xl mx-auto  gap-6">
        <div className="relative h-44 w-40 ">
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
          <img
            className="h-44 w-full object-contain relative z-20"
            src={data?.comp_doc_name2}
            alt=""
          />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer">
            Upload
            <input
              type="file"
              id="uploadFile1"
              className="hidden"
              onChange={(e) => handleChange(e, "comp_doc_name2", "file_doc_name2")}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </label>
          <div>
            <p>Upload Documents</p>
            <p className="text-base font-semibold text-[#55555566]">
              Business/Investment/Work Permit License and business
              registration/TIN
            </p>
            <p className="mt-1 text-sm text-[#555]">
              Only jpg/jpeg/png/pdf files can be uploaded, and the size does not
              exceed 2MB
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center">
        <button className=" bg-secondary text-white font-medium px-10 py-3"
          onClick={() => {
            handleUpdate()
          }}
        >
          Update Document
        </button>
      </div>
    </>
  );
};

export default DocumentInfo;
