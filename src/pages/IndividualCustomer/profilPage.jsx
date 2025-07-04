import { useState } from "react";
import CompanyInfo from './profile/components/company.jsx'
import TagDetails from "./profile/components/tagDetail.jsx";
import { useAppSelector } from "../../redux/hooks.js";

const ProfilePageCustomer = () => {
    const [component, setComponent] = useState("company");
    let userData = {}
    userData = useAppSelector(state => state.user.userData);
    if (userData == null || userData == undefined) {
        localStorage.getItem("user");
        userData = JSON.parse(localStorage.getItem("user"));
    }
    const RenderComponent = () => {
        switch (component) {
            case 'company':
                return <CompanyInfo
                    profileData={userData}
                />
            case "detail":
                return <TagDetails profileData={userData} />
            default:
                return <CompanyInfo profileData={userData} />
        }
    }

    return (
        <div className="bg-white max-w-[850px] rounded-lg px-4 py-6 pb-10 shadow">
            <div className="flex gap-8 overflow-auto border-b">
                <div className="w-full">
                    <p className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${component == "company" ? "opactity-1" : "opacity-40"}`}
                        onClick={() => {
                            setComponent("company")
                        }}
                    >
                        Account Information
                    </p>
                    <div className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "company" ? "bg-secondary" : ""}`}></div>
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
            </div>
            {RenderComponent()}
        </div>
    );
};

export default ProfilePageCustomer;