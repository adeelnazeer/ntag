/* eslint-disable react/prop-types */
import Logo from "../assets/images/logo.png";
import TagName from "../assets/images/Telebirr.png";
import MenuBar from "./menuBar";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useState } from "react";
import {
    Menu,
    MenuHandler,
    Button,
    MenuItem,
    MenuList,
    Radio,
    Typography,
    ListItemPrefix,
    IconButton,
} from "@material-tailwind/react";
import { FaBars, FaTimes } from "react-icons/fa";
import "../App.css";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { clearUserData } from "../redux/userSlice";
import { removeToken } from "../utilities/auth";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";

const LANGS = [
    { code: "en", label: "EN", native: "EN", flag: "🇬🇧" },
    { code: "amET", label: "AM", native: "AM", flag: "et" },
    { code: "or", label: "OR", native: "OR", flag: "or" },
    { code: "so", label: "SO", native: "SO", flag: "so" },
    { code: "ti", label: "TI", native: "TI", flag: "ti" },
];

const HeaderSimple = ({ isGuest = false }) => {
    const { t, i18n } = useTranslation(["common"]);
    const { t: t2 } = useTranslation(["sideBar"]);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    let userData = {};
    userData = useAppSelector((state) => state.user.userData);
    if (userData == null || userData == undefined) {
        localStorage.getItem("user");
        userData = JSON.parse(localStorage.getItem("user"));
    }

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        dispatch(clearUserData());

        removeToken();

        localStorage.clear();

        navigate(ConstentRoutes.login);
    };

    const handleLanguageChange = async (code) => {
        // Change language immediately for UI
        i18n.changeLanguage(code);
        try {
            localStorage.setItem("i18nextLng", code);
        } catch (e) {
            // Handle error silently
        }

        // Update language on server if user is logged in
        if (token && userData) {
            try {
                // Get user ID - check multiple possible locations
                const userId =
                    localStorage.getItem("id") ||
                    userData?.id ||
                    userData?.customer_account_id ||
                    userData?.customer_id;

                if (userId) {
                    // Prepare payload
                    const payload = {
                        user_lang: code == "amET" ? "am" : code,
                    };

                    // Call appropriate endpoint
                    // Use individual endpoint if customer_type is "individual", otherwise corporate
                    const endpoint =
                        userData?.customer_type === "individual"
                            ? EndPoints.customer.newSecurityEndPoints.individual.updateProfile
                            : EndPoints.customer.newSecurityEndPoints.corporate.updateProfile
                    const method = userData?.customer_type === "individual" ? "post" : "put";

                    const response = await APICall(method, payload, endpoint);

                    if (response?.success) {
                        // Update user data in localStorage if returned
                        if (response?.data) {
                            localStorage.setItem("user", JSON.stringify(response.data));
                        }

                        // Refresh the page to load data with new locale
                        window.location.reload();
                    } else {
                        // If API call fails, still keep the language change
                        console.error(
                            "Failed to update language on server:",
                            response?.message
                        );
                    }
                }
            } catch (error) {
                // If API call fails, still keep the language change
                console.error("Error updating language:", error);
            }
        }
    };

    const getCurrentLanguage = () => {
        return i18n.resolvedLanguage || i18n.language || "en";
    };

    const classes = location?.pathname !== ConstentRoutes.home ? "mb-8" : "";
    userData = JSON.parse(localStorage.getItem("user"));
    //  customer_type
    const hideMenu = [
        ConstentRoutes.termofuse,
        ConstentRoutes.privacyPolicy,
        ConstentRoutes.FrequentlyAskedQuestions,
    ];
    const getCorporate = () => {
        if (isGuest || location?.pathname?.includes("contact-us")) {
            return "";
        }
        const path = location?.pathname;

        const shouldHide =
            path?.includes("customer") ||
            path?.includes("individual") ||
            path?.includes("bill") ||
            path === ConstentRoutes.home ||
            path === ConstentRoutes.login ||
            path === ConstentRoutes.forgetPassword ||
            hideMenu.includes(path);

        return shouldHide ? "" : "Corporate";
    };

    const isIndividual = userData?.customer_type === "individual";
    return (
        <div className={`sticky top-0 z-[99] bg-[#f5f5f5] md:${classes} `}>
            <div className="bg-white">
                <div className="flex justify-between items-center h-16 md:mx-4 mx-0 bg-secondary">
                    <div
                        className="h-full flex items-center"
                        onClick={() => {
                            window.open("https://ethiotelecom.et/", "_blank");
                        }}
                    >
                        <img
                            className="rounded-tr-[50px] w-[190px] md:w-full h-full pr-6 bg-white cursor-pointer"
                            src={Logo}
                            alt="logo"
                        />
                    </div>

                    <div>
                        <p className="text-white font-medium text-sm md:text-lg flex gap-1">
                            {t("nameTag")}{" "}
                            <span className=" text-white font-medium text-sm md:text-lg hidden md:block">
                                {" "}
                                {t("service")}
                            </span>
                        </p>
                    </div>
                    <div className="md:hidden flex min-w-3" />
                    <div className="hidden md:flex lg:flex h-full items-center gap-8">
                        <div
                            className="flex h-full font-semibold gap-2 items-center pl-6 rounded-tl-[50px] cursor-pointer lg:bg-white md:bg-transparent"
                            onClick={() => {
                                window.open("https://ethiotelecom.et/", "_blank");
                            }}
                        >
                            <img
                                src={TagName}
                                alt="teleber"
                                className="lg:block w-[7rem] md:hidden"
                            />
                        </div>
                    </div>
                    {location.pathname == ConstentRoutes.login ||
                        location.pathname == ConstentRoutes.registerNormalUser ||
                        location.pathname == ConstentRoutes.register ||
                        location.pathname == ConstentRoutes.home ||
                        location.pathname == ConstentRoutes.forgetPassword ||
                        token ? (
                        <div className="md:hidden flex items-center bg-secondary">
                            <IconButton
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="bg-secondary"
                            >
                                {menuOpen ? (
                                    <FaTimes className="h-6 w-6" />
                                ) : (
                                    <FaBars className="h-6 w-6 bg-secondary" />
                                )}
                            </IconButton>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeaderSimple;
