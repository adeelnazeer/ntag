/* eslint-disable react/prop-types */
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Radio, Typography } from "@material-tailwind/react"
import { useState } from "react";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { toast } from "react-toastify";
import { IoCloseOutline } from "react-icons/io5";
import { useAppSelector } from "../redux/hooks";

const UploadDocument = ({ open, setOpen, checkDocument }) => {
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [fileNames, setFileNames] = useState(["", "", ""]); // Added third slot for the new document
    const [uploadedFiles, setUploadedFiles] = useState([null, null, null]); // Added third slot

    // Get customer ID from Redux
    const customerId = useAppSelector(state => state.user.customerId);

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleChange = async (event, index, type) => {
        const file = event.target.files[0];
        if (file) {
            const fileSizeMB = file.size / (1024 * 1024);
            if (fileSizeMB > 3) { // Increased to 3MB from 2MB
                setError("File size exceeds 3MB.");
                return;
            }

            const base64String = await convertToBase64(file);

            // Update the respective index in arrays
            const updatedFileNames = [...fileNames];
            const updatedUploadedFiles = [...uploadedFiles];

            updatedFileNames[index] = `${file.name}  ${type}`;
            updatedUploadedFiles[index] = base64String;

            setFileNames(updatedFileNames);
            setUploadedFiles(updatedUploadedFiles);

            // Use new field names based on index
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

            setError(null); // Clear error if the file is valid

            // Reset input value to allow re-upload of the same file
            event.target.value = null;
        }
    };

    const handleSubmit = () => {
        // Use customer ID from Redux if available, otherwise fall back to localStorage
        const id = customerId || localStorage.getItem("id");

        if (!id) {
            toast.error("Customer ID not found");
            return;
        }

        // Create a FormData object for proper file uploads
        const formData = new FormData();

        // Add each file to the FormData if it exists
        if (data?.registration_license_url) {
            formData.append("registration_license_url", data.registration_license_url);
        }
        if (data?.application_letter_url) {
            formData.append("application_letter_url", data.application_letter_url);
        }
        if (data?.trade_license_url) {
            formData.append("trade_license_url", data.trade_license_url);
        }

        // Add document names if they exist
        if (data?.registration_license_name) {
            formData.append("registration_license_name", data.registration_license_name);
        }
        if (data?.application_letter_name) {
            formData.append("application_letter_name", data.application_letter_name);
        }
        if (data?.trade_license_name) {
            formData.append("trade_license_name", data.trade_license_name);
        }

        APICall("post", formData, `${EndPoints?.customer?.updateDocument}/${id}`, null, true)
            .then((res) => {
                if (res?.success) {
                    setOpen({ show: false });
                    checkDocument();
                } else {
                    toast.error(res?.message);
                }
            })
            .catch((err) => {
                toast.error(err);
                console.log("err", err);
            });
    };

    const handleRemove = (index) => {
        const updatedFileNames = [...fileNames];
        const updatedUploadedFiles = [...uploadedFiles];

        updatedFileNames[index] = "";
        updatedUploadedFiles[index] = null;

        setFileNames(updatedFileNames);
        setUploadedFiles(updatedUploadedFiles);

        // Update data state by creating a new object
        setData(prevData => {
            if (!prevData) return null;

            const newData = { ...prevData };
            // Use new field names based on index
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

            delete newData[`${fieldName}_url`];
            delete newData[`${fieldName}_name`];
            delete newData[`${fieldName}_type`];

            return newData;
        });

        setError(null); // Clear any existing error
    };

    return (
        <Dialog open={open?.show} zIndex={99}>
            <DialogHeader>
                <Typography variant="h5" color="blue-gray">
                    Your Attention is Required!
                </Typography>
            </DialogHeader>
            <DialogBody divider className="grid gap-3">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-16 w-16 mx-auto text-secondary"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                        clipRule="evenodd"
                    />
                </svg>
                <Typography variant="h6">
                    Please Upload The Documents to Complete the Registration
                </Typography>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between gap-2 flex-wrap">
                        <label
                            className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer"
                        >
                            Upload Application Letter

                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleChange(e, 0, "Registration")}
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                        </label>
                        <label
                            className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer"
                        >
                            Upload Trade License
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleChange(e, 1, "Application")}
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                        </label>
                        <label
                            className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer"
                        >
                            Upload Registration License
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => handleChange(e, 2, "Trade")}
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                        </label>
                    </div>
                    <div>
                        <p className="text-base font-semibold text-[#55555566]">
                            Business Registration License, Application Letter, and Trade License
                        </p>
                        <p className="mt-1 text-sm text-[#555]">
                            Only jpg/jpeg/png/pdf files can be uploaded, and the size does not
                            exceed 3MB
                        </p>
                        {fileNames.map((fileName, index) => (
                            fileName && (
                                <div key={index} className="flex items-center mt-1">
                                    <p className="text-sm text-secondary">{fileName}</p>
                                    <IoCloseOutline
                                        className="ml-2 text-red-500 text-sm underline cursor-pointer"
                                        onClick={() => handleRemove(index)}
                                    />
                                </div>
                            )
                        ))}
                        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                    </div>
                </div>
            </DialogBody>
            <DialogFooter className="space-x-2">
                <Button
                    className="bg-secondary"
                    onClick={() => {
                        handleSubmit();
                    }}
                    disabled={!data?.trade_license_type || !data?.registration_license_type || !data?.application_letter_type}
                >
                    Submit
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default UploadDocument;