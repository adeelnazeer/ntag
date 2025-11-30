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

const LANGS = [
  { code: "en", label: "EN", native: "EN", flag: "🇬🇧" },
  { code: "amET", label: "AM", native: "AM", flag: "et" },
  { code: "or", label: "OR", native: "OR", flag: "or" },

];

const Header = () => {
  const { t, i18n } = useTranslation(["common"]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  let userData = {}
  userData = useAppSelector(state => state.user.userData);
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

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    try { 
      localStorage.setItem("i18nextLng", code); 
    } catch (e) {
      // Handle error silently
    }
  };

  const getCurrentLanguage = () => {
    return i18n.resolvedLanguage || i18n.language || "en";
  };

  const classes = location?.pathname !== ConstentRoutes.home ? "mb-8" : "";
  userData = JSON.parse(localStorage.getItem('user'))
  //  customer_type
  const hideMenu = [ConstentRoutes.termofuse, ConstentRoutes.privacyPolicy, ConstentRoutes.FrequentlyAskedQuestions]
  const getCorporate = () => {
    const path = location?.pathname;

    const shouldHide =
      path?.includes("customer") ||
      path?.includes("individual") ||
      path === ConstentRoutes.home ||
      path === ConstentRoutes.login ||
      path === ConstentRoutes.forgetPassword ||
      hideMenu.includes(path);

    return shouldHide ? "" : "Corporate";
  };
  return (
    <div
      className={`sticky top-0 z-[9999] bg-[#f5f5f5] md:${classes} `}
    >
      <div className="bg-white">
        <div className="flex justify-between items-center h-16 md:mx-4 mx-0 bg-secondary">
          <div className="h-full flex items-center"
            onClick={() => {
              window.open("https://ethiotelecom.et/", "_blank")
            }}
          >
            <img
              className="rounded-tr-[50px] w-[190px] md:w-full h-full pr-6 bg-white cursor-pointer"
              src={Logo}
              alt="logo"
            />
          </div>

          <div>
            <p className="text-white font-medium text-sm md:text-lg flex gap-1">{getCorporate()} {t("nameTag")}  <span className=" text-white font-medium text-sm md:text-lg hidden md:block"> {t("service")}</span></p>
          </div>
          <div className="md:hidden flex min-w-3" />
          <div className="hidden md:flex lg:flex h-full items-center gap-8">
            <div className="md:hidden flex py-6 gap-16 items-center max-w-6xl mx-auto">
              <Button
                className="text-primaryLight font-medium py-1 px-2"
                onClick={() => navigate(ConstentRoutes.home)}
              >
                {t("home")}
              </Button>
              <Button className="text-primaryLight font-medium py-1 px-2">
                {t("sectorOverview")}
              </Button>

            </div>
            {hideMenu?.includes(location?.pathname) ? <div /> :
              <>
                {token ? (
                  <div className="flex items-center">
                    <Menu>
                      <MenuHandler>
                        <Button className="bg-white text-base font-medium text-secondary py-1 px-2">
                          {userData?.comp_name || userData?.username}
                        </Button>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem
                          className="focus:border-none border-none transition-none hover:border-none focus-within:border-none"
                          onClick={() => userData.customer_type == 'individual' ? navigate(ConstentRoutes.profilePageCustomer) : navigate(ConstentRoutes.profilePage)}
                        >
                          {t("profile")}
                        </MenuItem>
                        <MenuItem
                          className="focus:border-none border-none transition-none hover:border-none focus-within:border-none"
                          onClick={() => {
                            if (location?.pathname?.includes("customer")) {
                              navigate(ConstentRoutes.changePasswordCustomer)
                            } else {
                              navigate(ConstentRoutes.changePassword)
                            }
                          }}
                        >
                          {t("changePassword")}
                        </MenuItem>
                        <div className="px-3 py-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">{t("language")}</p>
                          {LANGS.map((lang) => {
                            const active = lang.code === i18n.resolvedLanguage;
                            return (
                              <MenuItem
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`focus:border-none border-none transition-none hover:border-none focus-within:border-none text-sm ${active ? "bg-gray-50 font-medium" : ""}`}
                              >
                                {lang.native}
                              </MenuItem>
                            );
                          })}
                        </div>
                        <MenuItem
                          className="focus:border-none border-none transition-none hover:border-none"
                          onClick={handleLogout}
                        >
                          {t("logout")}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-6">
                    <Button
                      className="bg-secondary text-base font-medium text-white border border-white py-1 px-2"
                      onClick={() => navigate(ConstentRoutes.login)}
                    >
                      {t("login.login")}
                    </Button>
                    <div className="relative">
                      <Menu>
                        <MenuHandler>
                          <Button className="bg-white text-base font-medium text-secondary py-1 px-2">
                            {t("registerText")}
                          </Button>
                        </MenuHandler>
                        <MenuList>
                          <p className="text-[13px] outline-none text-[#555555] font-[400]">
                            {t("accountType")}
                          </p>
                          <MenuItem
                            className="focus:border-none border-none transition-none hover:border-none focus-within:border-none"
                            onClick={() => {
                              navigate(ConstentRoutes.register);
                            }}
                          >
                            <label className="flex w-full cursor-pointer items-center">
                              <ListItemPrefix className="mr-3">
                                <Radio
                                  id="vertical-list-react"
                                  ripple={false}
                                  name="color"
                                  value="corporate"
                                  color="green"
                                  className="h-3 w-3 p-0 hover:before:opacity-0"
                                  containerProps={{
                                    className: "p-0",
                                  }}
                                />
                              </ListItemPrefix>
                              <Typography className="text-secondary font-normal text-sm">
                                {t("corpCustomer")}
                              </Typography>
                            </label>
                          </MenuItem>
                          <MenuItem
                            className="focus:border-none border-none transition-none hover:border-none focus-within:border-none"
                            onClick={() => {
                              navigate(ConstentRoutes.registerNormalUser);
                            }}
                          >
                            <label className="flex w-full cursor-pointer items-center">
                              <ListItemPrefix className="mr-3">
                                <Radio
                                  id="vertical-list-react"
                                  ripple={false}
                                  name="color"
                                  value="corporate"
                                  color="green"
                                  className="h-3 w-3 p-0 hover:before:opacity-0"
                                  containerProps={{
                                    className: "p-0",
                                  }}
                                />
                              </ListItemPrefix>
                              <Typography className="text-secondary font-normal text-sm">
                                {t("indCustomer")}
                              </Typography>
                            </label>
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                  </div>
                )}
                {!token && <LanguageSwitcher />}

              </>
            }
            <div
              className="flex h-full font-semibold gap-2 items-center pl-6 rounded-tl-[50px] cursor-pointer lg:bg-white md:bg-transparent"
              onClick={() => {
                window.open("https://ethiotelecom.et/", "_blank")
              }}
            >
              <img src={TagName} alt="teleber" className="lg:block w-[7rem] md:hidden" />
            </div>
          </div>
          {(location.pathname == ConstentRoutes.login ||
            location.pathname == ConstentRoutes.registerNormalUser ||
            location.pathname == ConstentRoutes.register ||
            location.pathname == ConstentRoutes.home ||
            location.pathname == ConstentRoutes.forgetPassword ||
            token) ? (
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
            ) : ("")}
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-secondary p-4 max-h-[80vh] overflow-y-auto relative z-[9999]">
          <div className="flex flex-col items-start gap-6">
            <Button
              variant="outlined"
              className="text-white font-medium py-1 px-2 w-full border-white md:hidden"
              onClick={() => {
                navigate(ConstentRoutes.home)
                setMenuOpen(false)
              }}
            >
              {t("home")}
            </Button>


            {token ? (
              <>
                <Button
                  className="bg-white text-base font-medium text-secondary py-1 px-2 w-full"
                  onClick={() => navigate(ConstentRoutes.profilePage)}
                >
                  {t("profile")}
                </Button>
                <Button
                  className="bg-white text-base font-medium text-secondary py-1 px-2 w-full"
                  onClick={() => {
                    if (location?.pathname?.includes("customer")) {
                      navigate(ConstentRoutes.changePasswordCustomer)
                    } else {
                      navigate(ConstentRoutes.changePassword)
                    }
                    setMenuOpen(false);
                  }}
                >
                  {t("changePassword")}
                </Button>
                <div className="w-full border-t border-white/20 pt-4 mt-4">
                  <p className="text-white text-sm font-medium mb-3 px-2">{t("language")}</p>
                  <div className="flex flex-row gap-2">
                    {LANGS.map((lang) => {
                      const active = lang.code === getCurrentLanguage();
                      return (
                        <Button
                          key={lang.code}
                          className={`bg-white text-base font-medium text-secondary py-2 px-4 flex-1 ${active ? "bg-gray-200 border-2 border-secondary" : ""}`}
                          onClick={() => {
                            handleLanguageChange(lang.code);
                            setMenuOpen(false);
                          }}
                        >
                          {lang.native}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <Button
                  className="bg-white text-base font-medium text-secondary py-1 px-2 w-full mt-4"
                  onClick={handleLogout}
                >
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="bg-secondary text-base font-medium text-white border border-white py-1 px-2 w-full"
                  onClick={() => {
                    navigate(ConstentRoutes.login)
                    setMenuOpen(false)
                  }}
                >
                  {t("login.login")}
                </Button>
                <Button
                  className="bg-white text-base font-medium text-secondary py-1 px-2 w-full"
                  onClick={() => {
                    navigate(ConstentRoutes.register)
                    setMenuOpen(false)
                  }}
                >
                  {t("login.link1")}
                </Button>
                <Button
                  className="bg-white text-base font-medium text-secondary py-1 px-2 w-full"
                  onClick={() => {
                    navigate(ConstentRoutes.registerNormalUser)
                    setMenuOpen(false)
                  }}
                >
                  {t("login.link2")}
                </Button>
                <div className="w-full border-t border-white/20 pt-4 mt-4">
                  <p className="text-white text-sm font-medium mb-3 px-2">{t("language")}</p>
                  <div className="flex flex-row gap-2">
                    {LANGS.map((lang) => {
                      const active = lang.code === getCurrentLanguage();
                      return (
                        <Button
                          key={lang.code}
                          className={`bg-white text-base font-medium text-secondary py-2 px-4 flex-1 ${active ? "bg-gray-200 border-2 border-secondary" : ""}`}
                          onClick={() => {
                            handleLanguageChange(lang.code);
                            setMenuOpen(false);
                          }}
                        >
                          {lang.native}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {(location?.pathname === ConstentRoutes.home || location?.pathname === ConstentRoutes.login) && <MenuBar />}
    </div>
  );
};

export default Header;