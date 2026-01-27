import { useEffect, useState } from "react";
import CompanyInfo from './profile/components/company.jsx'
import TagDetails from "./profile/components/tagDetail.jsx";
import { useAppSelector } from "../../redux/hooks.js";
import APICall from "../../network/APICall.jsx";
import { useTranslation } from "react-i18next";
import EndPoints from "../../network/EndPoints.jsx";

const ProfilePageCustomer = () => {
    const { t } = useTranslation(["profile"]);
    const [component, setComponent] = useState("company");
    let userData = {}
    const [data, setData] = useState(null)
    userData = useAppSelector(state => state.user.userData);
    if (userData == null || userData == undefined) {
        localStorage.getItem("user");
        userData = JSON.parse(localStorage.getItem("user"));
    }


    const getProfileDetail = () => {
        APICall(
            "get",
            null,
            `${EndPoints.customer.newSecurityEndPoints.individual.getProfile}`,
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


    useEffect(() => {
        getProfileDetail()
    }, [component]);

    const RenderComponent = (userProfileData) => {
        switch (component) {
            case 'company':
                return <CompanyInfo
                    profileData={userData}
                    userProfileData={userProfileData}
                />
            case "detail":
                return <TagDetails profileData={userData} />
            default:
                return <CompanyInfo profileData={userData} userProfileData={userProfileData} />
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
                        {t("profile.profilePage.accountInformation")}
                    </p>
                    <div className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "company" ? "bg-secondary" : ""}`}></div>
                </div>
                <div className="w-full">
                    <p className={`w-full pb-2 whitespace-pre text-center text-[#000] font-medium text-base cursor-pointer ${component == "detail" ? "opactity-1" : "opacity-40"}`}
                        onClick={() => {
                            setComponent("detail")
                        }}
                    >
                        {t("profile.profilePage.nameTagDetails")}
                    </p>
                    <div className={`w-1/3 h-[3px] mx-auto rounded-tr-md rounded-tl-md ${component == "detail" ? "bg-secondary" : ""}`}></div>
                </div>
            </div>
            {RenderComponent(data)}
        </div>
    );
};

export default ProfilePageCustomer;