/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CompanyInfo from "./components/company.jsx";
import ContactInfo from "./components/contact.jsx";
import DocumentInfo from "./components/document.jsx";
import TagDetails from "./components/tagDetail.jsx";
import { useAppSelector } from "../../redux/hooks.js";
import NumberManagement from "./components/NumberManagement.jsx";
import APICall from "../../network/APICall.jsx";
import EndPoints from "../../network/EndPoints.jsx";
import { useTranslation } from "react-i18next";

const RenderComponent = ({ user, component, userProfileData }) => {
  switch (component) {
    case "company":
      return (
        <CompanyInfo profileData={user} userProfileData={userProfileData} />
      );
    case "contact":
      return (
        <ContactInfo profileData={user} userProfileData={userProfileData} />
      );
    case "document":
      return <DocumentInfo profileData={user} />;
    case "detail":
      return <TagDetails profileData={user} />;
    case "number":
      return <NumberManagement profileData={user} />;
    default:
      return <CompanyInfo profileData={user} />;
  }
};

const ProfilePage = () => {
  const location = useLocation();
  // Set initial component based on state passed from navigation
  const [component, setComponent] = useState(
    location.state?.activeTab || "company"
  );
  const [data, setData] = useState(null);
  const { t } = useTranslation(["profile"]);
  const reduxUserData = useAppSelector((state) => state.user.userData);
  const [userData, setUserData] = useState(reduxUserData);

  const getProfileDetail = () => {
    APICall(
      "get",
      null,
      `${EndPoints?.customer?.newSecurityEndPoints?.corporate?.getProfile}`,
      null,
      true
    )
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // Load from localStorage if Redux userData is missing
  useEffect(() => {
    if (!reduxUserData) {
      const local = localStorage.getItem("user");
      if (local) {
        const parsed = JSON.parse(local);
        setUserData(parsed); // ✅ this will re-render
      }
    } else {
      setUserData(reduxUserData);
    }
  }, [reduxUserData]);

  useEffect(() => {
    getProfileDetail();
  }, [component]);

  // Check if user has parent_id (sub-account) - disable document and numberManagement sections
  const hasParentId = userData?.parent_id != null;

  // If user navigates to disabled sections, redirect to company tab
  useEffect(() => {
    if (hasParentId && (component === "document" || component === "number")) {
      setComponent("company");
    }
  }, [hasParentId, component]);

  return (
    <div className="bg-white md:max-w-[90%] rounded-lg px-4 py-6 pb-10 shadow">
      <div className="flex gap-8 overflow-auto border-b">
        <div className="w-full">
          <p
            className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${
              component == "company" ? "opactity-1" : "opacity-40"
            }`}
            onClick={() => {
              setComponent("company");
            }}
          >
            {t("profile.item1")}
          </p>
          <div
            className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${
              component == "company" ? "bg-secondary" : ""
            }`}
          ></div>
        </div>
        <div className="w-full">
          <p
            className={`w-full pb-2 text-center whitespace-pre text-[#000] font-medium text-base cursor-pointer ${
              component == "contact" ? "opactity-1" : "opacity-40"
            }`}
            onClick={() => {
              setComponent("contact");
            }}
          >
            {t("profile.item2")}
          </p>
          <div
            className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${
              component == "contact" ? "bg-secondary" : ""
            }`}
          ></div>
        </div>
        <div className="w-full">
          <p
            className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base ${
              component == "document"
                ? "opactity-1"
                : "opacity-40"
            } ${
              hasParentId ? "cursor-not-allowed opacity-30" : "cursor-pointer"
            }`}
            onClick={() => {
              if (!hasParentId) {
                setComponent("document");
              }
            }}
          >
            {t("profile.item3")}
          </p>
          <div
            className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${
              component == "document" && !hasParentId ? "bg-secondary" : ""
            }`}
          ></div>
        </div>
        <div className="w-full">
          <p
            className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${
              component == "detail" ? "opactity-1" : "opacity-40"
            }`}
            onClick={() => {
              setComponent("detail");
            }}
          >
            {t("profile.item4")}
          </p>
          <div
            className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${
              component == "detail" ? "bg-secondary" : ""
            }`}
          ></div>
        </div>
        <div className="w-full">
          <p
            className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base ${
              component == "number" ? "opactity-1" : "opacity-40"
            } ${
              hasParentId ? "cursor-not-allowed opacity-30" : "cursor-pointer"
            }`}
            onClick={() => {
              if (!hasParentId) {
                setComponent("number");
              }
            }}
          >
            {t("profile.item5")}
          </p>
          <div
            className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${
              component == "number" && !hasParentId ? "bg-secondary" : ""
            }`}
          ></div>
        </div>
      </div>
      {
        // Don't render document or numberManagement components if parent_id != null
        (hasParentId && (component === "document" || component === "number")) ? (
          <div className="mt-8 text-center py-8">
            <p className="text-gray-500">{t("profile.accessRestricted") || "This section is not available for sub-accounts."}</p>
          </div>
        ) : (
          <RenderComponent
            user={userData}
            component={component}
            userProfileData={data}
            key={JSON.stringify(data)} // ensures re-render on data update
          />
        )
      }
    </div>
  );
};

export default ProfilePage;
