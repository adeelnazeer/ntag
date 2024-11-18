import { useState } from "react";
import CompanyInfo from './components/company.jsx'
import ContactInfo from './components/contact.jsx'
import DocumentInfo from './components/document.jsx'
import TagDetails from "./components/tagDetail.jsx";
 
const ProfilePage = () => {
  const [component, setComponent] = useState("company")
  const profileData = JSON.parse(localStorage.getItem("user"))

  const RenderComponent = () => {
    switch (component) {
      case 'company':
        return <CompanyInfo
          profileData={profileData}
        />
      case "contact":
        return <ContactInfo profileData={profileData} />
      case "document":
        return <DocumentInfo profileData={profileData} />
      case "detail":
        return <TagDetails profileData={profileData} />
    }
  }

  return (
    <div className=" bg-white max-w-[850px] rounded-lg px-4 py-6 pb-10 shadow">
      <div className="flex gap-8 overflow-auto border-b">
        <div className="w-full ">
          <p className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${component == "company" ? " opactity-1" : "opacity-40"}`}
            onClick={() => {
              setComponent("company")
            }}
          >
            Company Information
          </p>
          <div className={` w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "company" ? "bg-secondary" : ""}`}></div>
        </div>
        <div className="w-full">
          <p className={`w-full pb-2 text-center whitespace-pre text-[#000] font-medium text-base cursor-pointer ${component == "contact" ? " opactity-1" : "opacity-40"}`}
            onClick={() => {
              setComponent("contact")
            }}
          >
            Contact Information
          </p>
          <div className={` w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "contact" ? "bg-secondary" : ""}`}></div>
        </div>
        <div className="w-full">
          <p className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${component == "document" ? " opactity-1" : "opacity-40"}`}
            onClick={() => {
              setComponent("document")
            }}
          >
            Documents
          </p>
          <div className={` w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "document" ? "bg-secondary" : ""}`}></div>
        </div>
        <div className="w-full">
          <p className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${component == "detail" ? " opactity-1" : "opacity-40"}`}
            onClick={() => {
              setComponent("detail")
            }}
          >
            NameTag Details
          </p>
          <div className={` w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "detail" ? "bg-secondary" : ""}`}></div>
        </div>
        {/* <div className="w-full">
          <p className={`w-full pb-2 text-center text-[#000] font-medium text-base cursor-pointer ${component == "tag" ? " opactity-1" : "opacity-40"}`}
          >
            NameTag Details
          </p>
          <div className={` w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "tag" ? "bg-secondary" : ""}`}></div>
        </div> */}
      </div>
      {RenderComponent()}
    </div>
  );
};
export default ProfilePage;
