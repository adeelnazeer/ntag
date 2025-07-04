/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FiFileText } from "react-icons/fi";
import { CgCloseR } from "react-icons/cg";
import { getDocStatus } from "../../../utilities/routesConst";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setCorporateDocuments } from "../../../redux/userSlice";

const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

const DocumentInfo = ({ profileData }) => {
  const dispatch = useAppDispatch();
  let userData = {}
  userData = useAppSelector(state => state.user.userData);
  if (userData == null || userData == undefined) {
    localStorage.getItem("user");
    userData = JSON.parse(localStorage.getItem("user"));
  }
  const corporateDocuments = useAppSelector(state => state.user.corporateDocuments);
  const customerId = useAppSelector(state => state.user.customerId);

  const [data, setData] = useState(() => corporateDocuments || []);
  const [changedDocuments, setChangedDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Update local state when Redux state changes
  useEffect(() => {
    if (corporateDocuments && corporateDocuments.length > 0) {
      setData(corporateDocuments);
    }
  }, [corporateDocuments]);

  // Determine if editing is allowed based on document status
  const isEditingAllowed = (value) => {
    // Allow editing if documents are pending approval (status 0) or rejected (status 2)
    return value != "1";
  };

  console.log({ data })

  const isPdfFile = (docData) => {
    if (docData?.doc_url?.type === 'application/pdf') {
      return true;
    }
    if (docData?.doc_name?.toLowerCase().endsWith('.pdf')) {
      return true;
    }
    return false;
  };

  const handleDocumentClick = (docData) => {
    if (!docData?.doc_url) return;

    if (isPdfFile(docData)) {
      if (typeof docData.doc_url === 'string' && docData.doc_url.startsWith('http')) {
        window.open(docData.doc_url, '_blank');
      } else if (docData.doc_url instanceof File) {
        const blob = new Blob([docData.doc_url], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        URL.revokeObjectURL(url);
      }
    } else {
      setPreviewUrl(docData.doc_url);
      setShowImagePreview(true);
    }
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 3 * 1024 * 1024; // 3MB (increased from 2MB)

    if (!validTypes.includes(file.type)) {
      return 'Only JPG, JPEG, PNG, and PDF files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size exceeds 3MB';
    }

    return null;
  };

  const handleChange = async (event, index) => {
    // Check if editing is allowed
    if (!isEditingAllowed()) {
      toast.error("Documents can't be modified after approval");
      return;
    }
    const file = event.target.files[0];
    if (!allowedTypes?.includes(file?.type)) {
      alert("Invalid file type. Only JPG, PNG, and PDF files are allowed.");
      event.target.value = ''; // clear the input
      return;
    }

    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        toast.error(validationError);
        return;
      }

      const duplicate = [...data];

      // Use new document type names
      let docType = "";
      switch (index) {
        case 0:
          docType = " Application";
          break;
        case 1:
          docType = "Trade";
          break;
        case 2:
          docType = "Registration";
          break;
      }

      duplicate[index] = {
        ...duplicate[index],
        doc_url: file,
        doc_name: file.name,
        docType
      };
      setData(duplicate);

      if (!changedDocuments.includes(index)) {
        setChangedDocuments([...changedDocuments, index]);
      }
    }
  };

  const checkDocument = async () => {
    try {
      if (!userData?.customer_account_id && !customerId) {
        console.error("No customer account ID found");
        return;
      }

      const accountId = userData?.customer_account_id || customerId;

      const res = await APICall(
        "get",
        null,
        `/customer/check-documents/${accountId}`
      );

      if (res?.data) {
        // Store document data in Redux
        dispatch(setCorporateDocuments(res.data.corp_document || []));

        // Update component state
        setData(res.data.corp_document || []);
      }
    } catch (err) {
      console.error("Error checking documents:", err);
      toast.error("Failed to refresh document status");
    }
  };

  const handleUpdate = () => {
    // Check if editing is allowed
    if (!isEditingAllowed()) {
      toast.error("Documents can't be modified after approval");
      return;
    }

    // Use ID from Redux if available, fall back to localStorage
    const id = customerId || localStorage.getItem("id");

    if (!id) {
      toast.error("Customer ID not found");
      return;
    }

    const formData = new FormData();

    // Map index to field name
    const getFieldName = (index) => {
      switch (index) {
        case 0: return "application_letter";
        case 1: return "trade_license";
        case 2: return "registration_license";
        default: return `document_${index}`;
      }
    };

    changedDocuments.forEach(index => {
      if (data[index]?.doc_url) {
        const fieldName = getFieldName(index);
        formData.append(`${fieldName}_url`, data[index].doc_url);
        formData.append(`${fieldName}_name`, data[index].doc_name);
        formData.append(`${fieldName}_type`, data[index].docType);

        // If doc has an ID (existing document), include it
        if (data[index].id) {
          formData.append(`${fieldName}_id`, data[index].id);
        }
      }
    });

    if (changedDocuments.length > 0) {
      APICall(
        "post",
        formData,
        `${EndPoints?.customer?.updateDocument}/${id}`,
        null,
        true
      )
        .then((res) => {
          toast.success(res?.message);
          checkDocument();
          setChangedDocuments([]);
        })
        .catch((err) => {
          toast.error(err?.message);
        });
    } else {
      toast.info("No changes to update");
    }
  };

  const DocumentPreview = ({ docData }) => {
    if (!docData?.doc_url) return null;

    const containerClass = "w-full h-full cursor-pointer";

    if (isPdfFile(docData)) {
      return (
        <div
          className={`${containerClass} flex flex-col items-center justify-center relative z-20`}
          onClick={() => handleDocumentClick(docData)}
        >
          <FiFileText className="w-16 h-16 text-white mb-2" />
          <p className="text-white text-sm font-medium">PDF Document</p>
          <p className="text-white/80 text-xs mt-1 max-w-[90%] truncate">
            {docData.doc_name || 'Document'}
          </p>
        </div>
      );
    }

    return (
      <div
        className={containerClass}
        onClick={() => handleDocumentClick(docData)}
      >
        <img
          className="h-44 w-full object-contain relative z-20"
          src={typeof docData.doc_url === 'string' ? docData.doc_url : URL.createObjectURL(docData.doc_url)}
          alt="Document"
        />
      </div>
    );
  };

  const ImagePreviewModal = () => {
    if (!showImagePreview) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
          <button
            onClick={() => setShowImagePreview(false)}
            className="absolute -top-10 right-0 text-white hover:text-gray-300"
          >
            <CgCloseR size={24} />
          </button>
          <img
            src={previewUrl}
            alt="Document Preview"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  };

  // Check if documents are approved (all have status 1)
  const areDocumentsApproved = data?.length >= 3 &&
    data.every(doc => doc?.doc_status === "1");

  // Document type labels
  const getDocumentLabel = (index) => {
    switch (index) {
      case 0: return "Application Letter";
      case 1: return "Trade License";
      case 2: return "Registration License";
      default: return "Document";
    }
  };

  return (
    <>
      {/* Notification for approved documents */}
      {areDocumentsApproved && (
        <div className="mt-5 max-w-4xl bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            Your documents have been approved. Document uploads are now locked.
          </p>
        </div>
      )}

      {/* Document Sections - Map through all 3 documents */}
      {[0, 1, 2].map(index => (
        <div key={index} className="mt-10 flex flex-col md:flex-row items-center max-w-5xl gap-6">
          <div className="relative h-44 w-40 min-w-40 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
            <DocumentPreview docData={data?.[index]} />
          </div>
          <div>
            <div className="flex items-center flex-col md:flex-row gap-4">
              <label className={`flex  h-fit items-center md:min-w-[260px] text-sm md:text-base justify-center shadow-xl ${isEditingAllowed(data[index]?.doc_status) ? 'bg-secondary hover:bg-secondary' : 'bg-gray-400 cursor-not-allowed'} rounded-lg text-white text-base px-5 py-3 outline-none w-max`}>
                Upload {getDocumentLabel(index)}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleChange(e, index)}
                  accept=".jpg,.jpeg,.png,.pdf"
                  disabled={data[index]?.doc_status == "1" || !isEditingAllowed()}
                />
              </label>
              <div>
                <p> Document: {getDocumentLabel(index)}</p>
                { <span className=" font-semibold  text-primary">
                  Approval Status: {getDocStatus(data?.[index]?.doc_status)}
                  <br />
                  <span className=" font-semibold  text-primary">
                    Approval Time:
                    <span className="font-medium ">  Within 48 hours of registration</span></span>
                </span>
                }
                {data?.[index]?.doc_status == 2 &&
                  <p className={`mb-2 font-bold ${data?.[index]?.doc_status == '1' ? 'text-secondary' : 'text-red-700'}`}>
                    {getDocStatus(data?.[index]?.doc_status)} {data?.[index]?.doc_status == 2 && <span className=" font-semibold  text-primary">(Reason for Rejection : <span className="font-medium ">{data?.[index]?.comment}</span>)</span>
                    }
                  </p>
                }
                {!isEditingAllowed() && (
                  <p className="mt-1 text-xs text-red-600">
                    Document uploads are locked after approval
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      <p className=" mt-10 text-sm text-[#555]">
        Only JPG, JPEG, PNG, or PDF files can be uploaded, and each file must not exceed 3MB.
      </p>
         <p className=" mt-1 text-sm text-[#555]">
        Once documents are approved, they cannot be edited.
      </p>
      <div className="mt-4 max-w-5xl text-center">

        <button
          className={`${isEditingAllowed() ? 'bg-secondary' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium px-10 py-3 rounded-lg`}
          onClick={handleUpdate}
          disabled={changedDocuments.length === 0 || !isEditingAllowed()}
        >
          Update Document
        </button>
      </div>

      <ImagePreviewModal />
    </>
  );
};

export default DocumentInfo;