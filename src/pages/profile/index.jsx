import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CompanyInfo from './components/company.jsx'
import ContactInfo from './components/contact.jsx'
import DocumentInfo from './components/document.jsx'
import TagDetails from "./components/tagDetail.jsx";
import { useAppSelector } from "../../redux/hooks.js";
import NumberManagement from "./components/NumberManagement.jsx";

const RenderComponent = ({ user, component }) => {
  switch (component) {
    case 'company':
      return <CompanyInfo
        profileData={user}
      />
    case "contact":
      return <ContactInfo profileData={user} />
    case "document":
      return <DocumentInfo profileData={user} />
    case "detail":
      return <TagDetails profileData={user} />
    case "number":
      return <NumberManagement profileData={user} />
    default:
      return <CompanyInfo profileData={user} />
  }
}

const ProfilePage = () => {
  const location = useLocation();
  // Set initial component based on state passed from navigation
  const [component, setComponent] = useState(location.state?.activeTab || "company");

  const reduxUserData = useAppSelector(state => state.user.userData);
  const [userData, setUserData] = useState(reduxUserData);

  // Load from localStorage if Redux userData is missing
  useEffect(() => {
    if (!reduxUserData) {
      const local = localStorage.getItem("user");
      if (local) {
        const parsed = JSON.parse(local);
        setUserData(parsed); // ✅ this will re-render
        console.log("Fetched user from localStorage:", parsed);
      }
    } else {
      setUserData(reduxUserData);
    }
  }, [reduxUserData]);

  console.log("User Data in ProfilePage:", userData);



  return (
    <div className="bg-white md:max-w-[90%] rounded-lg px-4 py-6 pb-10 shadow">
      <div className="flex gap-8 overflow-auto border-b">
        <div className="w-full">
          <p className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${component == "company" ? "opactity-1" : "opacity-40"}`}
            onClick={() => {
              setComponent("company")
            }}
          >
            Company Information
          </p>
          <div className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "company" ? "bg-secondary" : ""}`}></div>
        </div>
        <div className="w-full">
          <p className={`w-full pb-2 text-center whitespace-pre text-[#000] font-medium text-base cursor-pointer ${component == "contact" ? "opactity-1" : "opacity-40"}`}
            onClick={() => {
              setComponent("contact")
            }}
          >
            Contact Information
          </p>
          <div className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "contact" ? "bg-secondary" : ""}`}></div>
        </div>
        <div className="w-full">
          <p className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${component == "document" ? "opactity-1" : "opacity-40"}`}
            onClick={() => {
              setComponent("document")
            }}
          >
            Documents
          </p>
          <div className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "document" ? "bg-secondary" : ""}`}></div>
        </div>
        <div className="w-full">
          <p className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${component == "detail" ? "opactity-1" : "opacity-40"}`}
            onClick={() => {
              setComponent("detail")
            }}
          >
            NameTAG Details
          </p>
          <div className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "detail" ? "bg-secondary" : ""}`}></div>
        </div>
        <div className="w-full">
          <p className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${component == "number" ? "opactity-1" : "opacity-40"}`}
            onClick={() => {
              setComponent("number")
            }}
          >
            Number Management
          </p>
          <div className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "number" ? "bg-secondary" : ""}`}></div>
        </div>
      </div>
      {<RenderComponent user={userData} component={component}
        key={JSON.stringify(userData)} // ensures re-render on data update
      />}
    </div>
  );
};

export default ProfilePage;