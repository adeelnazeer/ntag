/* eslint-disable react/prop-types */
import Header from "../components/header";
import Footer from "../components/footer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../redux/hooks";
import { getToken } from "../utilities/auth";
import SidebarCustomer from "../components/sideBarCustomer";
import { BiArrowBack } from "react-icons/bi";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { ConstentRoutes } from "../utilities/routesConst";
import { useRecaptchaToken } from "../hooks/useRecaptchaToken";

const DashboardLayoutCustomer = ({ children }) => {
    const navigate = useNavigate();
    const locatiion = useLocation();
    const { t } = useTranslation();
     let userData = {};
    userData = useAppSelector((state) => state.user.userData);

    if (userData == null || userData == undefined) {
        localStorage.getItem("user");
        userData = JSON.parse(localStorage.getItem("user"));
    }
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [verifyFaydaLoading, setVerifyFaydaLoading] = useState(false);

    const fetchCustomerProfile = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        setProfileLoading(true);
        try {
            const res = await APICall(
                "get",
                null,
                EndPoints.customer.newSecurityEndPoints.individual.getProfile,
                null,
                true
            );
            setProfile(res?.data ?? res ?? null);
        } catch {
            setProfile(null);
        } finally {
            setProfileLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate("/login");
            return;
        }
        fetchCustomerProfile();
    }, [navigate, fetchCustomerProfile, locatiion.pathname]);

    const isFaydaVerified = useMemo(() => {
        if (!profile) return true;
        const v = profile?.fayda_verification;
        if (v?.is_registered === true) return true;
        if (v?.status === "VERIFIED" || profile?.fayda_verification_status === "VERIFIED") return true;
        return false;
    }, [profile]);

    const showFaydaAlert = !profileLoading && profile && !isFaydaVerified;

    const handleVerifyFayda = async () => {
        setVerifyFaydaLoading(true);
        try {
            const tokens = {
                recaptcha_token: localStorage.getItem("token"),
            };

            const res = await APICall("post", tokens, EndPoints.customer.faydaUrlForLogin);
            const { auth_url, code_verifier, state } = res || {};
            if (!auth_url || !code_verifier || !state) {
                console.error("Fayda auth response missing required fields", res);
                return;
            }
            localStorage.setItem("fayda_code_verifier", code_verifier);
            localStorage.setItem("fayda_state", state);
            window.location.replace(auth_url);
        } catch (err) {
            console.error("Fayda auth-url error", err);
        } finally {
            setVerifyFaydaLoading(false);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex flex-col overflow-auto">
                <div className="flex flex-1 overflow-auto grid-cols-12 h-full">
                    <div className="lg:w-72 h-full bg-[#fbfbfb]">
                        <SidebarCustomer
                            setIsSidebarOpen={setIsSidebarOpen}
                            isSidebarOpen={isSidebarOpen}
                        />
                    </div>
                    <div className="w-full col-span-12 md:px-5 px-2 h-full overflow-auto md:py-4 py-2 pt-2 md:mt-0 md:block">
                        <div className="md:w-11/12 w-full md:mx-auto sm:w-full sm:mx-auto">
                            {!locatiion?.pathname?.includes("buy-tag") && (
                                <div className=" pb-4">
                                    <BiArrowBack
                                        className=" text-3xl cursor-pointer text-secondary font-bold"
                                        onClick={() => {
                                            navigate(-1);
                                        }}
                                    />
                                </div>
                            )}
                            {showFaydaAlert && (
                                <div
                                    className="mb-4 flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                    role="alert"
                                >
                                    <p className="text-sm text-amber-950 sm:pr-4">
                                        {t("common.form.faydaNotVerifiedLayoutMessage", {
                                            defaultValue:
                                                "Hi, your Fayda (NID) verification is pending. Please complete it now to avoid service suspension.",
                                        })}
                                    </p>
                                    <button
                                        type="button"
                                        className="shrink-0 rounded-lg bg-secondary px-4 py-2 text-sm text-white shadow-sm hover:opacity-95"
                                        onClick={handleVerifyFayda}
                                    >
                                        {t("common.form.verifyFayda", { defaultValue: "Verify Fayda" })}
                                    </button>
                                </div>
                            )}
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayoutCustomer;