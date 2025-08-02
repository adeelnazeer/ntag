/* eslint-disable react/prop-types */
import {
    Button,
    Dialog,
    DialogFooter,
    DialogHeader,
    Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { toast } from "react-toastify";
import { IoCloseOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Dropzone from "react-dropzone";
import { IoMdCloseCircle } from "react-icons/io";

const UploadSingleDocument = ({ open, setOpen, checkDocument }) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [fileNames, setFileNames] = useState(["", "", ""]); // Added third slot for the new document
    const [uploadedFiles, setUploadedFiles] = useState([null, null, null]); // Added third slot
    const [loading, setLoading] = useState(false)
    const [pdfModal, setPdfModal] = useState({ open: false, src: null });

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const openPdfModal = (base64) => {
        setPdfModal({ open: true, src: base64 });
    };

    const closePdfModal = () => {
        setPdfModal({ open: false, src: null });
    };

    const handleSubmit = () => {

        // Use customer ID from Redux if available, otherwise fall back to localStorage
        const id = localStorage.getItem("id");

        if (!id) {
            toast.error("Customer ID not found");
            return;
        }
        setLoading(true)

        // Create a FormData object for proper file uploads
        const formData = new FormData();

        const fileKeys = [
            "registration_license",
            "application_letter",
            "trade_license",
        ];

        fileKeys.forEach((key) => {
            const file = data?.[`${key}_url`];
            const name = data?.[`${key}_name`];

            if (file) {
                formData.append(`${key}_url`, file);
            }

            if (name) {
                formData.append(`${key}_name`, name);
            }
        });
        formData.append("id", open?.id);

        APICall(
            "post",
            formData,
            `${EndPoints?.customer?.updateDocument}/${id}`,
            null,
            true
        )
            .then((res) => {
                if (res?.success) {
                    setOpen({ show: false });
                    setData(null);
                    toast.success(res?.message || "");
                    checkDocument();
                    setLoading(false)
                    setFileNames(["","",""])
                    setUploadedFiles([null, null, null])
                } else {
                    toast.error(res?.message);
                    setLoading(false)
                }
            })
            .catch((err) => {
                toast.error(err);
                setLoading(false)
            })
    };

    const handleRemove = (index) => {
        const updatedFileNames = [...fileNames];
        const updatedUploadedFiles = [...uploadedFiles];

        updatedFileNames[index] = "";
        updatedUploadedFiles[index] = null;

        setFileNames(updatedFileNames);
        setUploadedFiles(updatedUploadedFiles);

        // Update data state by creating a new object
        setData(null);

        setError(null); // Clear any existing error
    };

    const handleDrop = async (acceptedFiles, index, type) => {
        const file = acceptedFiles[0];
        if (!allowedTypes?.includes(file?.type)) {
            toast.error(
                "Invalid file type. Only JPG, PNG, and PDF files are allowed."
            );
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

        updatedFileNames[index] = `${file.name}  ${open?.label}`;
        updatedUploadedFiles[index] = base64String;

        setFileNames(updatedFileNames);
        setUploadedFiles(updatedUploadedFiles);

        let fieldName = type;

        setData((st) => ({
            ...st,
            [`${fieldName}_url`]: file,
            [`${fieldName}_name`]: file?.name,
            [`${fieldName}_type`]: type,
        }));

        setError(null);
    };

    const renderDropzone = (index, type, fieldKey) => (
        <Dropzone
            onDrop={(acceptedFiles) => handleDrop(acceptedFiles, index, fieldKey)}
            multiple={false}
            accept={{ "image/*": [], "application/pdf": [] }}
        >
            {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed relative rounded-lg p-5 w-full text-center cursor-pointer transition-colors duration-200 ${isDragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white"
                        }`}
                >
                    <input {...getInputProps()} />
                    <p className="text-sm text-left text-gray-600">
                        Drag & drop or click to upload {type}
                    </p>
                    {uploadedFiles[index] && (
                        <div className="mt-3">
                            {uploadedFiles[index].startsWith("data:image") ? (
                                <img
                                    src={uploadedFiles[index]}
                                    alt="Preview"
                                    className="mx-auto max-h-40 rounded border "
                                />
                            ) : (
                                <button
                                    type="button" // ✅ Correct button type
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openPdfModal(uploadedFiles[index]);
                                    }}
                                    className="text-[#008fd5] text-sm underline hover:border-transparent"
                                >
                                    View PDF
                                </button>
                            )}
                        </div>
                    )}
                    {fileNames?.[index] != "" && (
                        <div key={index} className="flex items-center mt-3">
                            <p className="text-sm text-secondary">{fileNames?.[index]}</p>
                            <IoCloseOutline
                                className="ml-2 text-red-500 text-sm underline cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(index);
                                }}
                            />
                        </div>
                    )}
                    {data?.[`${fieldKey}_url`] && !uploadedFiles[index] && (
                        <FaCheck className="mx-auto mt-2 text-green-500" />
                    )}
                </div>
            )}
        </Dropzone>
    );

    return (
        <Dialog open={open?.show} zIndex={99}>
            <DialogHeader>
                <Typography
                    variant="h5"
                    color="blue-gray"
                    className=" text-[#555555CC]"
                >
                    Re-upload {open?.label || ""}
                </Typography>
                <div
                    className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
                    onClick={() => {
                        setOpen({ show: false });
                        setData(null);
                        setFileNames(["", "", ""]);
                        setUploadedFiles([null, null, null])
                    }}
                >
                    <IoMdCloseCircle />
                </div>
            </DialogHeader>
            <div>
                <div className="flex flex-col gap-2 p-4">
                    <div>
                        <label className="md:text-base text-[16px]  text-[#555]">
                            Please upload new {open?.label || ""} to replace with existing
                            approved document Upload Document{" "}
                            <span className=" text-red-500">*</span>
                        </label>
                    </div>
                    <div className="flex justify-between relative border border-gray-300 p-4 rounded-xl gap-4 flex-wrap">
                        {renderDropzone(0, open?.label, open?.name)}
                    </div>
                    <div>
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
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
            <DialogFooter className="space-x-2">
                <Button
                    className="bg-secondary"
                    onClick={() => {
                        handleSubmit();
                    }}
                    loading={loading}
                    disabled={data == null}
                >
                    Submit
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default UploadSingleDocument;
