import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Button,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Radio,
    Typography,
    ListItemPrefix,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import Logo from "../../../assets/images/logo.png";
import TelebirrLogo from "../../../assets/images/Telebirr.png";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { clearUserData } from "../../../redux/userSlice";
import { removeToken } from "../../../utilities/auth";
import APICall from "../../../network/APICall";
import EndPoints from "../../../network/EndPoints";
import { ConstentRoutes } from "../../../utilities/routesConst";

const LANGS = [
    { code: "en", label: "EN", native: "EN", flag: "🇬🇧" },
    { code: "amET", label: "AM", native: "AM", flag: "et" },
    { code: "or", label: "OR", native: "OR", flag: "or" },
    { code: "so", label: "SO", native: "SO", flag: "so" },
    { code: "ti", label: "TI", native: "TI", flag: "ti" },
];

function resolveLangCode(resolved) {
    if (!resolved) return "en";
    if (resolved === "am-ET" || resolved === "am") return "amET";
    return resolved;
}


export default function HeaderNew({ customerSidebar, corporateSidebar, isGuest = false } = {}) {
    const { t } = useTranslation("homePage2");
    const { t: tc, i18n } = useTranslation("common");
    const { t: t2 } = useTranslation("sideBar");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const userFromStore = useAppSelector((state) => state.user.userData);
    const userFromStorage = useMemo(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }, []);
    const userData = userFromStore ?? userFromStorage;
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
    const isIndividual = userData?.customer_type === "individual";
    const drawerSidebar = customerSidebar || corporateSidebar;
    const mobileMenuOpensSidebar = Boolean(token && drawerSidebar);


    const hideMenu = [
        ConstentRoutes.termofuse,
        ConstentRoutes.privacyPolicy,
        ConstentRoutes.FrequentlyAskedQuestions,
      ];

    /** Below lg the layout sidebar is a drawer — keep hamburger visible through tablet (md). */
    const navLayout = useMemo(
        () =>
            mobileMenuOpensSidebar
                ? { desktop: "hidden lg:flex", mobileBar: "flex items-center gap-2 lg:hidden", mobileSheet: "lg:hidden" }
                : { desktop: "hidden md:flex", mobileBar: "flex items-center gap-2 md:hidden", mobileSheet: "md:hidden" },
        [mobileMenuOpensSidebar]
    );

    const navLinks = useMemo(() => {
        const links = t("nav.links", { returnObjects: true });
        return Array.isArray(links) ? links : [];
    }, [t]);

    const getCurrentLanguage = () => resolveLangCode(i18n.resolvedLanguage || i18n.language || "en");

    const currentLang = useMemo(() => {
        const code = getCurrentLanguage();
        return LANGS.find((l) => l.code === code) || LANGS[0];
    }, [i18n.resolvedLanguage, i18n.language]);

    const displayName =
        userData?.comp_name ||
        [userData?.first_name, userData?.last_name].filter(Boolean).join(" ").trim() ||
        userData?.username ||
        userData?.phone ||
        "Account";

    const handleLogout = () => {
        dispatch(clearUserData());
        removeToken();
        localStorage.clear();
        setMobileOpen(false);
        navigate(ConstentRoutes.login);
    };

    const handleLanguageChange = async (code) => {
        i18n.changeLanguage(code);
        try {
            localStorage.setItem("i18nextLng", code);
        } catch {
            /* ignore */
        }

        if (token && userData) {
            try {
                const userId =
                    localStorage.getItem("id") ||
                    userData?.id ||
                    userData?.customer_account_id ||
                    userData?.customer_id;

                if (userId) {
                    const payload = {
                        user_lang: code === "amET" ? "am" : code,
                    };
                    const endpoint =
                        userData?.customer_type === "individual"
                            ? EndPoints.customer.newSecurityEndPoints.individual.updateProfile
                            : EndPoints.customer.newSecurityEndPoints.corporate.updateProfile;
                    const method = userData?.customer_type === "individual" ? "post" : "put";

                    const response = await APICall(method, payload, endpoint);

                    if (response?.success) {
                        if (response?.data) {
                            localStorage.setItem("user", JSON.stringify(response.data));
                        }
                        window.location.reload();
                    } else {
                        console.error("Failed to update language on server:", response?.message);
                    }
                }
            } catch (error) {
                console.error("Error updating language:", error);
            }
        }
        setMobileOpen(false);
    };

    const showMarketingNavStrip = location.pathname === "/home-2";
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

    return (
        <nav className="sticky top-0 z-40 bg-[#F3F3F3] shadow-sm">
            <div className="border-t border-brand-green-nav-border bg-secondary">
                {
                    showMarketingNavStrip ?
                        <div className="mx-auto hidden h-[54px] max-w-7xl items-center justify-center gap-5 px-4 md:flex">
                            {navLinks.map((link, index) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={`rounded-md px-4 py-1 text-[13px] font-semibold text-white transition ${index === 0 ? "border border-white/70 bg-white/15" : "hover:bg-white/15"
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                        :
                        <div className="mx-auto hidden h-[54px] max-w-7xl items-center justify-center gap-5 px-4 md:flex">
                            <p className="text-white font-medium text-sm md:text-lg flex gap-1">
                                {getCorporate()} {tc("nameTag")}{" "}
                                <span className=" text-white font-medium text-sm md:text-lg hidden md:block">
                                    {" "}
                                    {tc("service")}
                                </span>
                            </p>
                        </div>
                }
            </div>
            <div className="bg-white">
                <div className={`mx-auto flex h-[62px] w-full ${showMarketingNavStrip ? "max-w-7xl" : "max-w-full"} items-center justify-between px-4 md:px-6`}>
                    <div className="flex items-center">
                        <img src={Logo} alt={t("nav.logoAlt")} className="h-[38px] w-auto object-contain md:h-[52px]" />
                    </div>

                    <div className={`ml-auto hidden items-center gap-3 ${navLayout.desktop}`}>
                        {token ? (
                            <Menu placement="bottom-end">
                                <MenuHandler>
                                    <Button
                                        variant="text"
                                        className="rounded-md shadow-sm bg-white px-4 py-1.5 text-sm font-semibold normal-case text-secondary  ring-1 ring-gray-200 hover:shadow-none"
                                    >
                                        {displayName}
                                    </Button>
                                </MenuHandler>
                                <MenuList className="z-[110]">
                                    <p className="mb-1 px-3 text-xs text-gray-500">
                                        Account Type:{" "}
                                        {userData?.customer_type === "corporate"
                                            ? `Corporate ${userData?.parent_id == null ? "(Primary)" : "(Additional)"}`
                                            : "Individual"}
                                    </p>
                                    <MenuItem
                                        className="focus:border-none border-none"
                                        onClick={() =>
                                            userData?.customer_type === "individual"
                                                ? navigate(ConstentRoutes.profilePageCustomer)
                                                : navigate(ConstentRoutes.profilePage)
                                        }
                                    >
                                        {tc("profile")}
                                    </MenuItem>
                                    <MenuItem
                                        className="focus:border-none border-none"
                                        onClick={() => {
                                            if (userData?.customer_type === "individual") {
                                                navigate(ConstentRoutes.changePasswordCustomer);
                                            } else {
                                                navigate(ConstentRoutes.changePassword);
                                            }
                                        }}
                                    >
                                        {tc("changePassword")}
                                    </MenuItem>
                                    <div className="border-t border-gray-200 px-3 py-2">
                                        <p className="mb-1 text-xs text-gray-500">{tc("language")}</p>
                                        {LANGS.map((lang) => {
                                            const active = lang.code === getCurrentLanguage();
                                            return (
                                                <MenuItem
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className={`focus:border-none border-none text-sm ${active ? "bg-gray-50 font-medium" : ""}`}
                                                >
                                                    {lang.native}
                                                </MenuItem>
                                            );
                                        })}
                                    </div>
                                    <MenuItem className="focus:border-none border-none" onClick={handleLogout}>
                                        {tc("logout")}
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <>
                                <Menu placement="bottom-end">
                                    <MenuHandler>
                                        <button
                                            type="button"
                                            className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-[#4B4B4B]"
                                        >
                                            {currentLang.native}
                                            <span className="text-[10px]">▾</span>
                                        </button>
                                    </MenuHandler>
                                    <MenuList className="z-[110] min-w-[180px] p-2">
                                        {LANGS.map((lang) => {
                                            const active = lang.code === getCurrentLanguage();
                                            return (
                                                <MenuItem
                                                    key={lang.code}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                    className={`rounded-lg px-3 py-2 text-sm focus:border-none ${active ? "bg-gray-50 font-medium" : ""}`}
                                                >
                                                    {lang.native}
                                                </MenuItem>
                                            );
                                        })}
                                    </MenuList>
                                </Menu>

                                <Button
                                    variant="text"
                                    className="rounded-md border border-[#CFD8BF] bg-[#F7F7F2] px-4 py-1.5 text-sm font-semibold normal-case text-[#8A8A8A] shadow-none hover:shadow-none"
                                    onClick={() => navigate(ConstentRoutes.login)}
                                >
                                    {tc("login.login")}
                                </Button>

                                <Menu placement="bottom-end">
                                    <MenuHandler>
                                        <Button
                                            variant="text"
                                            className="rounded-md bg-secondary px-4 py-1.5 text-sm font-semibold normal-case text-white shadow-none hover:shadow-none"
                                        >
                                            {tc("registerText")}
                                        </Button>
                                    </MenuHandler>
                                    <MenuList className="z-[110]">
                                        <p className="px-3 pb-1 text-[13px] font-normal text-[#555555]">{tc("accountType")}</p>
                                        <MenuItem className="focus:border-none" onClick={() => navigate(ConstentRoutes.register)}>
                                            <label className="flex w-full cursor-pointer items-center">
                                                <ListItemPrefix className="mr-3">
                                                    <Radio
                                                        ripple={false}
                                                        name="header-register-type"
                                                        value="corporate"
                                                        color="green"
                                                        className="h-3 w-3 p-0 hover:before:opacity-0"
                                                        containerProps={{ className: "p-0" }}
                                                    />
                                                </ListItemPrefix>
                                                <Typography className="text-secondary font-normal text-sm">{tc("corpCustomer")}</Typography>
                                            </label>
                                        </MenuItem>
                                        <MenuItem
                                            className="focus:border-none"
                                            onClick={() => navigate(ConstentRoutes.registerNormalUser, { state: null })}
                                        >
                                            <label className="flex w-full cursor-pointer items-center">
                                                <ListItemPrefix className="mr-3">
                                                    <Radio
                                                        ripple={false}
                                                        name="header-register-type"
                                                        value="individual"
                                                        color="green"
                                                        className="h-3 w-3 p-0 hover:before:opacity-0"
                                                        containerProps={{ className: "p-0" }}
                                                    />
                                                </ListItemPrefix>
                                                <Typography className="text-secondary font-normal text-sm">{tc("indCustomer")}</Typography>
                                            </label>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </>
                        )}

                        <img src={TelebirrLogo} alt={t("nav.telebirrAlt")} className="h-[48px] w-auto object-contain pl-3" />
                    </div>

                    <div className={navLayout.mobileBar}>
                        {mobileMenuOpensSidebar ? (
                            <>
                                <Menu placement="bottom-end">
                                    <MenuHandler>
                                        <button
                                            type="button"
                                            data-sidebar-exclude-close
                                            className="grid place-items-center rounded-md text-secondary hover:bg-gray-100 px-4 py-1.5 text-sm font-semibold normal-case shadow-sm"
                                            aria-label={tc("profile")}
                                        >
                                           {displayName}
                                        </button>
                                    </MenuHandler>
                                    <MenuList className="z-[110] max-h-[70vh] overflow-y-auto">
                                        <MenuItem
                                            className="focus:border-none border-none"
                                            onClick={() =>
                                                userData?.customer_type === "individual"
                                                    ? navigate(ConstentRoutes.profilePageCustomer)
                                                    : navigate(ConstentRoutes.profilePage)
                                            }
                                        >
                                            {tc("profile")}
                                        </MenuItem>
                                        <MenuItem
                                            className="focus:border-none border-none"
                                            onClick={() => {
                                                if (userData?.customer_type === "individual") {
                                                    navigate(ConstentRoutes.changePasswordCustomer);
                                                } else {
                                                    navigate(ConstentRoutes.changePassword);
                                                }
                                            }}
                                        >
                                            {tc("changePassword")}
                                        </MenuItem>
                                        <div className="border-t border-gray-200 px-3 py-2">
                                            <p className="mb-1 text-xs text-gray-500">{tc("language")}</p>
                                            {LANGS.map((lang) => {
                                                const active = lang.code === getCurrentLanguage();
                                                return (
                                                    <MenuItem
                                                        key={lang.code}
                                                        onClick={() => handleLanguageChange(lang.code)}
                                                        className={`focus:border-none border-none text-sm ${active ? "bg-gray-50 font-medium" : ""}`}
                                                    >
                                                        {lang.native}
                                                    </MenuItem>
                                                );
                                            })}
                                        </div>
                                        <MenuItem className="focus:border-none border-none" onClick={handleLogout}>
                                            {tc("logout")}
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                                <button
                                    type="button"
                                    data-sidebar-exclude-close
                                    className="grid h-10 w-10 place-items-center rounded-md text-[#2D2D2D] hover:bg-gray-100"
                                    onClick={() => drawerSidebar.setOpen(!drawerSidebar.isOpen)}
                                    aria-expanded={drawerSidebar.isOpen}
                                    aria-label={drawerSidebar.isOpen ? t("nav.menuCloseAria") : t("nav.menuAria")}
                                >
                                    {drawerSidebar.isOpen ? (
                                        <FaTimes className="text-xl" aria-hidden />
                                    ) : (
                                        <FaBars className="text-xl" aria-hidden />
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="grid h-10 w-10 place-items-center rounded-md text-[#2D2D2D] hover:bg-gray-100"
                                onClick={() => setMobileOpen((s) => !s)}
                                aria-expanded={mobileOpen}
                                aria-label={mobileOpen ? t("nav.menuCloseAria") : t("nav.menuAria")}
                            >
                                {mobileOpen ? <FaTimes className="text-xl" aria-hidden /> : <FaBars className="text-xl" aria-hidden />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {mobileOpen && !mobileMenuOpensSidebar && (
                <div className={`border-t border-gray-200 bg-white px-4 py-3 ${navLayout.mobileSheet}`}>
                    <div className="flex max-h-[80vh] flex-col gap-3 overflow-y-auto pb-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="rounded-md px-3 py-2 text-sm font-semibold text-brand-blue hover:bg-brand-green-pale"
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}

                        {token ? (
                            <>
                                <div className="border-t border-gray-200 pt-3">
                                    <Button
                                        variant="outlined"
                                        className="w-full border-brand-blue text-sm font-semibold normal-case text-brand-blue"
                                        onClick={() => {
                                            navigate(isIndividual ? ConstentRoutes.dashboardCustomer : ConstentRoutes.dashboard);
                                            setMobileOpen(false);
                                        }}
                                    >
                                        {t2("sideBar.dashboard")}
                                    </Button>
                                </div>
                                <Button
                                    variant="outlined"
                                    className="w-full border-brand-blue text-sm font-semibold normal-case text-brand-blue"
                                    onClick={() => {
                                        navigate(isIndividual ? ConstentRoutes.buyTagCustomer : ConstentRoutes.buyTag);
                                        setMobileOpen(false);
                                    }}
                                >
                                    {t2("sideBar.buyTag")}
                                </Button>
                                <div className="border-t border-gray-200 pt-3">
                                    <p className="mb-2 px-1 text-xs font-semibold text-[#555]">{t2("sideBar.manageTag")}</p>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="text"
                                            className="justify-start px-3 py-2 text-left text-sm font-medium normal-case text-brand-blue hover:bg-brand-green-pale"
                                            onClick={() => {
                                                navigate(isIndividual ? ConstentRoutes.manageTagNameCustomer : ConstentRoutes.manageTagName);
                                                setMobileOpen(false);
                                            }}
                                        >
                                            {t2("sideBar.callScheduling")}
                                        </Button>
                                        <Button
                                            variant="text"
                                            className="justify-start px-3 py-2 text-left text-sm font-medium normal-case text-brand-blue hover:bg-brand-green-pale"
                                            onClick={() => {
                                                navigate(isIndividual ? ConstentRoutes.incomingCallPin : ConstentRoutes.corporateCallPin);
                                                setMobileOpen(false);
                                            }}
                                        >
                                            {t2("sideBar.incomingCallPin")}
                                        </Button>
                                        <Button
                                            variant="text"
                                            className="justify-start px-3 py-2 text-left text-sm font-medium normal-case text-brand-blue hover:bg-brand-green-pale"
                                            onClick={() => {
                                                navigate(isIndividual ? ConstentRoutes.blockUnblockTagCustomer : ConstentRoutes.blockUnblockTag);
                                                setMobileOpen(false);
                                            }}
                                        >
                                            {t2("sideBar.BlockUnblock")}
                                        </Button>
                                        <Button
                                            variant="text"
                                            className="justify-start px-3 py-2 text-left text-sm font-medium normal-case text-brand-blue hover:bg-brand-green-pale"
                                            onClick={() => {
                                                navigate(isIndividual ? ConstentRoutes.changeMyTAG : ConstentRoutes.changeMyTAGCorporate);
                                                setMobileOpen(false);
                                            }}
                                        >
                                            {t2("sideBar.changeNameTag")}
                                        </Button>
                                        {!isIndividual && (
                                            <Button
                                                variant="text"
                                                className="justify-start px-3 py-2 text-left text-sm font-medium normal-case text-brand-blue hover:bg-brand-green-pale"
                                                onClick={() => {
                                                    navigate(ConstentRoutes.changeNumber);
                                                    setMobileOpen(false);
                                                }}
                                            >
                                                {t2("sideBar.changeMobileNo")}
                                            </Button>
                                        )}
                                        <Button
                                            variant="text"
                                            className="justify-start px-3 py-2 text-left text-sm font-medium normal-case text-brand-blue hover:bg-brand-green-pale"
                                            onClick={() => {
                                                navigate(isIndividual ? ConstentRoutes.unsubTagCustomer : ConstentRoutes.UnSUBblockTag);
                                                setMobileOpen(false);
                                            }}
                                        >
                                            {t2("sideBar.unsubscribe")}
                                        </Button>
                                        <Button
                                            variant="text"
                                            className="justify-start px-3 py-2 text-left text-sm font-medium normal-case text-brand-blue hover:bg-brand-green-pale"
                                            onClick={() => {
                                                navigate(isIndividual ? ConstentRoutes.closeAccountCustomer : ConstentRoutes.closeAccount);
                                                setMobileOpen(false);
                                            }}
                                        >
                                            {t2("sideBar.closeAccount")}
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    variant="outlined"
                                    className="w-full border-[#CFD8BF] text-sm font-semibold normal-case text-[#8A8A8A]"
                                    onClick={() => {
                                        navigate(isIndividual ? ConstentRoutes.profilePageCustomer : ConstentRoutes.profilePage);
                                        setMobileOpen(false);
                                    }}
                                >
                                    {tc("profile")}
                                </Button>
                                <Button
                                    variant="outlined"
                                    className="w-full border-[#CFD8BF] text-sm font-semibold normal-case text-[#8A8A8A]"
                                    onClick={() => {
                                        navigate(isIndividual ? ConstentRoutes.changePasswordCustomer : ConstentRoutes.changePassword);
                                        setMobileOpen(false);
                                    }}
                                >
                                    {tc("changePassword")}
                                </Button>
                                <div className="border-t border-gray-200 pt-3">
                                    <p className="mb-2 px-1 text-xs font-semibold text-[#555]">{tc("language")}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {LANGS.map((lang) => {
                                            const active = lang.code === getCurrentLanguage();
                                            return (
                                                <button
                                                    key={lang.code}
                                                    type="button"
                                                    className={`rounded-md border px-3 py-2 text-sm font-semibold ${active ? "border-secondary bg-gray-100 text-secondary" : "border-gray-200 bg-white text-brand-blue"
                                                        }`}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                >
                                                    {lang.native}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <Button
                                    variant="outlined"
                                    className="w-full border-secondary text-sm font-semibold normal-case text-secondary"
                                    onClick={handleLogout}
                                >
                                    {tc("logout")}
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="border-t border-gray-200 pt-3">
                                    <p className="mb-2 px-1 text-xs font-semibold text-[#555]">{tc("language")}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {LANGS.map((lang) => {
                                            const active = lang.code === getCurrentLanguage();
                                            return (
                                                <button
                                                    key={lang.code}
                                                    type="button"
                                                    className={`rounded-md border px-3 py-2 text-sm font-semibold ${active ? "border-secondary bg-gray-100 text-secondary" : "border-gray-200 bg-white text-brand-blue"
                                                        }`}
                                                    onClick={() => handleLanguageChange(lang.code)}
                                                >
                                                    {lang.native}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Button
                                    variant="outlined"
                                    className="w-full border-[#CFD8BF] bg-[#F7F7F2] text-sm font-semibold normal-case text-[#8A8A8A]"
                                    onClick={() => {
                                        navigate(ConstentRoutes.login);
                                        setMobileOpen(false);
                                    }}
                                >
                                    {tc("login.login")}
                                </Button>
                                <Button
                                    variant="outlined"
                                    className="w-full border-secondary bg-secondary text-sm font-semibold normal-case text-white"
                                    onClick={() => {
                                        navigate(ConstentRoutes.register);
                                        setMobileOpen(false);
                                    }}
                                >
                                    {tc("login.link1")}
                                </Button>
                                <Button
                                    variant="outlined"
                                    className="w-full border-secondary text-sm font-semibold normal-case text-secondary"
                                    onClick={() => {
                                        navigate(ConstentRoutes.registerNormalUser);
                                        setMobileOpen(false);
                                    }}
                                >
                                    {tc("login.link2")}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
