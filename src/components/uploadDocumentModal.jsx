/* eslint-disable react/prop-types */
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Radio, Typography } from "@material-tailwind/react"
import { useState } from "react";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { toast } from "react-toastify";

const UplaodDocument = ({ open, setOpen, checkDocument }) => {
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [base64, setBase64] = useState(null);
    const [type, setType] = useState("NTN")

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

    const handleChange = async (event) => {
        const file = event.target.files[0];
        const validationError = file ? validateFile(file) : null;
        const reader = new FileReader()
        const { files } = event.target
        setError(validationError);
        if (!validationError) {
            setFileName(file.name);
            if (files && files.length !== 0) {
                reader.onload = () =>
                    setBase64(reader?.result);
                reader.readAsDataURL(files[0])
            }
        } else {
            setFileName(null);
            setBase64(null);
            console.error('File validation error:', validationError);
        }
    };

    const handleSubmit = () => {
        const id = localStorage.getItem("id")

        const uploadDocumentPayload = {
            doc_type: type,
            doc_url: base64,
            doc_name: fileName,
        }

        APICall("post", uploadDocumentPayload, `${EndPoints?.customer?.uploadDocument}/${id}`)
            .then((res) => {
                if (res?.success) {
                    setOpen({ show: false })
                    checkDocument()
                } else {
                    toast.error(res?.message);
                }
            })
            .catch((err) => {
                toast.error(err);
                console.log("err", err);
            })
    }
    return (
        <Dialog open={open?.show}
            zIndex={99}
        >
            <DialogHeader>
                <Typography variant="h5" color="blue-gray">
                    Your Attention is Required!
                </Typography>
            </DialogHeader>
            <DialogBody divider className="grid  gap-3">
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
                    You need to upload documents!
                </Typography>
                <div >
                    <div>
                        <p className="text-sm text-[#555]">
                            Please Select Document Type
                        </p>
                    </div>
                    <div className="flex gap-10">
                        <Radio name="type" label="NTN" checked={type == "NTN"} className="text-sm text-secondary"
                            onChange={() => {
                                setType("NTN")
                            }}
                        />
                        <Radio name="type" label="NIC" checked={type == "NIC"} className="text-sm text-secondary"
                            onChange={() => {
                                setType("NIC")
                            }}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <label className="flex items-center bg-secondary hover:bg-secondary rounded-lg text-white text-base px-5 py-3 outline-none w-max cursor-pointer">
                        Upload documents
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
            </DialogBody>
            <DialogFooter className="space-x-2">
                <Button className=" bg-secondary"
                    onClick={() => {
                        handleSubmit()
                    }}
                >
                    Submit
                </Button>
            </DialogFooter>
        </Dialog>
    )
}

export default UplaodDocument