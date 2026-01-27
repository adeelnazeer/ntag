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
import UploadSingleDocument from "../../../components/uploadSingleDocument";
import { useTranslation } from "react-i18next";

const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

const DocumentInfo = ({ profileData }) => {
  const dispatch = useAppDispatch();
  let userData = {};
  userData = useAppSelector((state) => state.user.userData);
  if (userData == null || userData == undefined) {
    localStorage.getItem("user");
    userData = JSON.parse(localStorage.getItem("user"));
  }
  const corporateDocuments = useAppSelector(
    (state) => state.user.corporateDocuments
  );
  const customerId = useAppSelector((state) => state.user.customerId);
  const { t } = useTranslation(["profile"]);

  const [data, setData] = useState(() => corporateDocuments || []);
  const [changedDocuments, setChangedDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [showModal, setShowModal] = useState({ show: false });

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

  console.log({ data });

  const isPdfFile = (docData) => {
    if (docData?.doc_url?.type === "application/pdf") {
      return true;
    }
    if (docData?.doc_name?.toLowerCase().endsWith(".pdf")) {
      return true;
    }
    return false;
  };

  const handleDocumentClick = (docData) => {
    if (!docData?.doc_url) return;

    if (isPdfFile(docData)) {
      if (
        typeof docData.doc_url === "string" &&
        docData.doc_url.startsWith("http")
      ) {
        window.open(docData.doc_url, "_blank");
      } else if (docData.doc_url instanceof File) {
        const blob = new Blob([docData.doc_url], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
        URL.revokeObjectURL(url);
      }
    } else {
      setPreviewUrl(docData.doc_url);
      setShowImagePreview(true);
    }
  };

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 3 * 1024 * 1024; // 3MB (increased from 2MB)

    if (!validTypes.includes(file.type)) {
      return "Only JPG, JPEG, PNG, and PDF files are allowed";
    }

    if (file.size > maxSize) {
      return "File size exceeds 3MB";
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
      event.target.value = ""; // clear the input
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
        docType,
      };
      setData(duplicate);

      if (!changedDocuments.includes(index)) {
        setChangedDocuments([...changedDocuments, index]);
      }
    }
  };

  const checkDocument = async () => {
    try {
      const res = await APICall(
        "get",
        null,
        `${EndPoints.customer.newSecurityEndPoints.corporate.checkDocumentStatus}`
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

  // Document type labels
  const getDocumentLabel = (index) => {
    switch (index) {
      case "application_letter_url":
        return t("profile.appLetter");
      case "trade_license_url":
        return t("profile.trade");
      case "registration_license_url":
        return t("profile.regLicense");
      default:
        return "Document";
    }
  };

  const applicationDocs = data.filter(
    (item) => item?.doc_type === "application_letter_url"
  );
  const tradeDocs = data.filter(
    (item) => item?.doc_type === "trade_license_url"
  );
  const registrationDocs = data.filter(
    (item) => item?.doc_type === "registration_license_url"
  );

  const TableComponent = (title, docArray) => {
    return (
      <div className="overflow-x-auto mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
        <table className="min-w-full table-auto text-sm text-gray-800 border-gray-200">
          <thead className="">
            <tr className="bg-[#80808014]">
              <th className="px-4 py-3 font-medium text-left text-[#555555CC]">
                {t("profile.preview")}
              </th>
              <th className="px-4 py-3 font-medium text-left text-[#555555CC]">
                {t("profile.version")}
              </th>
              <th className="px-4 py-3 font-medium text-left text-[#555555CC]">
                {t("profile.comment")}
              </th>
              <th className="px-4 py-3 font-medium text-left text-[#555555CC]">
                {t("profile.uploadDate")}
              </th>
              <th className="px-4 py-3 font-medium text-left text-[#555555CC]">
                {t("profile.date")}
              </th>
              <th className="px-4 py-3 font-medium text-left text-[#555555CC] ">
                {t("profile.action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {docArray.map((item, index) => (
              <tr
                key={`${item?.doc_type}-${index}`}
                className=" border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 max-w-40 min-w-40">
                  <div
                    className="w-24 h-28 bg-gray-100 rounded overflow-hidden relative cursor-pointer"
                    onClick={() => handleDocumentClick(item)}
                  >
                    {item?.doc_url ? (
                      <img
                        src={
                          typeof item?.doc_url === "string"
                            ? item?.doc_url
                            : URL.createObjectURL(item?.doc_url)
                        }
                        alt="Preview"
                        className="object-contain h-full w-full"
                      />
                    ) : (
                      <FiFileText className="text-gray-400 w-full h-full p-5" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 max-w-40 min-w-40">
                  {(item?.corp_document_id == null) & (item?.is_reuploaded == 0)
                    ? t("profile.orignal")
                    : t("profile.reuploaded")}
                </td>
                <td className="px-4 py-2 max-w-40 min-w-40">
                  {getDocStatus(item?.doc_status)}
                  <br />
                  {item?.comment != null && (
                    <span>
                      {" "}
                      {t("profile.comment")}: ({item?.comment})
                    </span>
                  )}
                </td>
                <td className="px-4 max-w-40 min-w-40 py-2">
                  {item?.created_at || "-"}
                </td>
                <td className="px-4 max-w-40 min-w-40 py-2">
                  {item?.status_update_date || "-"}
                </td>
                <td className="px-4 max-w-40 min-w-40 py-2 text-center">
                  {item?.corp_document_id == null && (
                    <>
                      {item?.doc_status == "1" &&
                      item?.corp_document_id == null ? (
                        <label
                          className="inline-block px-4 py-3 rounded-xl text-white text-xs cursor-pointer bg-secondary hover:bg-green-600"
                          onClick={() =>
                            setShowModal({
                              show: true,
                              label: getDocumentLabel(item?.doc_type),
                              name: item?.doc_type?.slice(0, -4),
                              id: item?.id,
                            })
                          }
                        >
                          {t("profile.reuploaded")}
                        </label>
                      ) : (
                        <label
                          className="inline-block px-4 py-3 rounded-xl text-white text-xs cursor-pointer bg-secondary hover:bg-green-600"
                          onClick={() =>
                            setShowModal({
                              show: true,
                              label: getDocumentLabel(item?.doc_type),
                              name: item?.doc_type?.slice(0, -4),
                              id: item?.id,
                            })
                          }
                        >
                          {t("profile.uploadBtn")}
                        </label>
                        // <label
                        //   className={`inline-block px-4 py-3 rounded-xl text-white text-xs cursor-pointer ${isEditingAllowed(item?.doc_status)
                        //     ? 'bg-secondary hover:bg-green-600'
                        //     : 'bg-gray-400 cursor-not-allowed'
                        //     }`}
                        // >
                        //   Upload Document
                        //   <input
                        //     type="file"
                        //     className="hidden"
                        //     onChange={(e) => handleChange(e, index)}
                        //     accept=".jpg,.jpeg,.png,.pdf"
                        //     disabled={item?.doc_status === "1"}
                        //   />
                        // </label>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="overflow-x-auto mt-6">
        {TableComponent(t("profile.regLicense"), registrationDocs)}
        {TableComponent(t("profile.appLetter"), applicationDocs)}
        {TableComponent(t("profile.trade"), tradeDocs)}

        <p className="mt-8 text-xs text-gray-600 italic">{t("profile.note")}</p>
      </div>

      {/* Notification for approved documents */}
      {/* {areDocumentsApproved && (
        <div className="mt-5 max-w-4xl bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            Your documents have been approved. You can reupload the latest document.
          </p>
        </div>
      )} */}
      <ImagePreviewModal />
      <UploadSingleDocument
        open={showModal}
        setOpen={setShowModal}
        checkDocument={checkDocument}
      />
    </>
  );
};

export default DocumentInfo;
