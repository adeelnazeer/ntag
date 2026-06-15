/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { MdHomeFilled } from "react-icons/md";
import { FaHashtag, FaUser, FaBars } from "react-icons/fa";
import { BsFire, BsStarFill } from "react-icons/bs";
import { IoLogOutSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { removeToken } from "../utilities/auth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearUserData } from "../redux/userSlice";
import { useTranslation } from "react-i18next";

const Sidebar = ({
  data,
  isSidebarOpen = false,
  setIsSidebarOpen = () => {},
  hideFloatingTrigger = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation(["sideBar"]);

  let userData = {};
  userData = useAppSelector((state) => state.user.userData);
  if (userData == null || userData == undefined) {
    localStorage.getItem("user");
    userData = JSON.parse(localStorage.getItem("user"));
  }

  // Check if user has parent_id (sub-account)
  const hasParentId = userData?.parent_id != null;

  const activeDashboard = location?.pathname === ConstentRoutes.dashboard;
  const activeTwo = location?.pathname?.includes("dashboard");
  const activeThree =
    location?.pathname === ConstentRoutes.manageTagName ||
    location?.pathname === ConstentRoutes.blockUnblockTag ||
    location?.pathname === ConstentRoutes.UnSUBblockTag;
  const activeProfile = location?.pathname === ConstentRoutes.profilePage;

  // For child menu active states
  const activeCallSchedule =
    location?.pathname === ConstentRoutes.manageTagName;
  const activeBlock = location?.pathname === ConstentRoutes.blockUnblockTag;
  const activeCallPin = location?.pathname === ConstentRoutes.corporateCallPin;
  const activeUnsubscribe = location?.pathname === ConstentRoutes.UnSUBblockTag;
  const closeAccount = location?.pathname === ConstentRoutes.closeAccount;
  const changeNumber = location?.pathname === ConstentRoutes.changeNumber;
  const activeChangeMyTag =
    location?.pathname === ConstentRoutes.changeMyTAGCorporate;

  const brandRoutes = [
    ConstentRoutes.brandNameCallBuy,
    ConstentRoutes.brandNameCallRecurringFee,
    ConstentRoutes.brandNameCallIntro,
    ConstentRoutes.brandNameCallChange,
    ConstentRoutes.brandNameCallNumbers,
    ConstentRoutes.brandNameCallIncomingNumber,
    ConstentRoutes.brandNameCallStartStop,
    ConstentRoutes.brandNameCallSchedule,
    ConstentRoutes.brandNameCallUnsubscribe,
    ConstentRoutes.brandNameCallHistory,
  ];
  const activeBrand = brandRoutes.includes(location?.pathname);

  const [openManageMenu, setOpenManageMenu] = useState(activeThree);
  const [openBrandMenu, setOpenBrandMenu] = useState(activeBrand);

  // Update dropdown state when routes change
  // useEffect(() => {
  //   setOpenManageMenu(activeThree);
  // }, [activeThree]);

  const handleLogOut = () => {
    dispatch(clearUserData());
    removeToken();
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.clear();
    navigate(ConstentRoutes.login);
  };

  const sidebarData = [
    {
      icon: <MdHomeFilled className="h-5 w-5" />,
      text: t("sideBar.dashboard"),
      active: activeDashboard,
      route: ConstentRoutes.dashboard,
    },
    {
      icon: <FaHashtag className="h-4 w-4" />,
      text:
        data?.[0]?.doc_status == 1 &&
          data?.[1]?.doc_status == 1 &&
          data?.[2]?.doc_status == 1
          ? t("sideBar.buyTag")
          : t("sideBar.reserveTag"),
      active: activeTwo,
      route: ConstentRoutes.buyTag,
      disabled: userData?.status == 5,
    },
    {
      icon: <FaUser className="h-4 w-4" />,
      text: t("sideBar.profile"),
      active: activeProfile,
      route: ConstentRoutes.profilePage,
      disabled: userData?.status == 5,
    },
    {
      icon: <IoLogOutSharp className="h-4 w-4" />,
      text: t("sideBar.logout"),
      className: "text-[#FF4842]",
      onClick: handleLogOut,
    },
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.closest("[data-sidebar-exclude-close]")) return;
      if (sidebarRef.current?.contains(event.target)) return;
      setIsSidebarOpen(false);
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidebarOpen, setIsSidebarOpen]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname, setIsSidebarOpen]);

  const isDocumentDisabled =
    data?.[0]?.doc_status == 0 ||
    data?.[1]?.doc_status == 0 ||
    data?.[2]?.doc_status == 0;

  const brandPrimaryItems = [
    { key: "buyBrandName", route: ConstentRoutes.brandNameCallBuy, icon: "🛒" },
    {
      key: "brandRecurringFee",
      route: ConstentRoutes.brandNameCallRecurringFee,
      icon: "💳",
    },
    { key: "brandCallIntro", route: ConstentRoutes.brandNameCallIntro, icon: "ℹ️" },
  ];

  const brandManageItems = [
    { key: "changeBrandName", route: ConstentRoutes.brandNameCallChange, icon: "✏️" },
    {
      key: "brandAddRemoveNumbers",
      route: ConstentRoutes.brandNameCallNumbers,
      icon: "👥",
    },
    {
      key: "brandIncomingCallNumber",
      route: ConstentRoutes.brandNameCallIncomingNumber,
      icon: "📞",
    },
    {
      key: "brandStartStopCalls",
      route: ConstentRoutes.brandNameCallStartStop,
      icon: "▶️",
    },
    {
      key: "brandScheduleCalls",
      route: ConstentRoutes.brandNameCallSchedule,
      icon: "📅",
    },
    {
      key: "brandUnsubscribe",
      route: ConstentRoutes.brandNameCallUnsubscribe,
      icon: "🚫",
    },
    {
      key: "brandCallsHistory",
      route: ConstentRoutes.brandNameCallHistory,
      icon: "📊",
    },
  ];

  const renderBrandLink = (item, highlightGreen = false) => {
    const isActive = location?.pathname === item.route;
    return (
      <button
        key={item.key}
        type="button"
        onClick={() => {
          navigate(item.route);
          setIsSidebarOpen(false);
        }}
        disabled={isDocumentDisabled}
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm
          ${
            isActive
              ? "bg-secondary text-white"
              : highlightGreen
                ? "text-secondary hover:bg-[#8dc63f]/10"
                : "text-[#8A8AA0] hover:bg-gray-100"
          }
          ${isDocumentDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        <span>{t(`sideBar.${item.key}`)}</span>
      </button>
    );
  };

  return (
    <div className="relative h-full w-full">
      {!hideFloatingTrigger && (
        <div className="fixed right-5 top-4 z-50 lg:hidden" data-sidebar-exclude-close>
          <FaBars
            className="cursor-pointer text-3xl text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
          />
        </div>
      )}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/40 lg:hidden"
          aria-hidden
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-[120] flex h-[100dvh] w-64 max-w-[min(18rem,88vw)] flex-col bg-white shadow-xl transition-transform duration-300 ease-out lg:static lg:z-0 lg:h-full lg:max-w-none lg:w-72 lg:translate-x-0 lg:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full max-lg:pointer-events-none"
        } lg:pointer-events-auto`}
      >
        <div className="h-full overflow-y-auto" key={i18n.resolvedLanguage || i18n.language}>
          <Card className="w-full bg-transparent pr-4 py-4 shadow-none">
            <List className="text-base min-w-full w-full gap-4 p-0 font-normal text-black">
              {/* Standard menu items */}
              {sidebarData.slice(0, 2).map((item, index) => (
                <div key={index} className="flex md:gap-6 gap-2">
                  <div
                    className={`${item.active ? "bg-secondary" : "bg-white"
                      } w-2 h-auto rounded-tr-[10px] rounded-br-[10px]`}
                  />
                  <ListItem
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else if (item.route) {
                        navigate(item.route);
                      }
                      setIsSidebarOpen(false);
                    }}
                    className={`py-4 
                      ${item.active
                        ? "bg-secondary text-white hover:text-white hover:bg-secondary"
                        : ""
                      } 
                      ${item.className || ""}
                      focus:bg-secondary focus:text-white
                      ${item.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                      }`}
                  >
                    <ListItemPrefix className="md:mr-4 mr-2">
                      {item.icon}
                    </ListItemPrefix>
                    <span
                      className={`${item.active ? "text-white" : "text-[#8A8AA0]"
                        } font-medium`}
                    >
                      {item.text}
                    </span>
                  </ListItem>
                </div>
              ))}

              {/* Manage NameTAG with dropdown */}
              <div className="flex flex-col">
                <div className="flex md:gap-6 gap-2">
                  <div
                    className={`${activeThree ? "bg-secondary" : "bg-white"
                      } w-2 h-auto rounded-tr-[10px] rounded-br-[10px]`}
                  />
                  <ListItem
                    disabled={userData?.status == 5}
                    onClick={() => {
                      setOpenManageMenu(!openManageMenu);
                      // if (!(data?.[0]?.doc_status != 1 && data?.[1]?.doc_status != 1)) {
                      //   navigate(ConstentRoutes.manageTagName);
                      // }
                    }}
                    className={`py-4 
                      ${activeThree
                        ? "bg-secondary text-white hover:text-white hover:bg-secondary"
                        : ""
                      } 
                      focus:bg-secondary focus:text-white
                      ${"cursor-pointer"}`}
                  >
                    <ListItemPrefix className="md:mr-4 mr-2">
                      <BsFire className="h-4 w-4" />
                    </ListItemPrefix>
                    <span
                      className={`${activeThree ? "text-white" : "text-[#8A8AA0]"
                        } font-medium`}
                    >
                      {t("sideBar.manageTag")}
                    </span>
                  </ListItem>
                </div>

                {/* Submenu items */}
                {openManageMenu && (
                  <div className="ml-8 pl-4 mt-1 flex flex-col gap-1 mb-2">
                    <button
                      onClick={() => {
                        navigate(ConstentRoutes.manageTagName);
                        setIsSidebarOpen(false);
                      }}
                      disabled={isDocumentDisabled}
                      className={`py-2 px-3 text-left text-sm rounded-md cursor-pointer 
                        ${activeCallSchedule
                          ? "bg-secondary text-white"
                          : "text-[#8A8AA0] hover:bg-gray-100"
                        } ${isDocumentDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      {t("sideBar.callScheduling")}
                    </button>
                    <button
                      onClick={() => {
                        navigate(ConstentRoutes.corporateCallPin);
                        setIsSidebarOpen(false);
                      }}
                      disabled={isDocumentDisabled}
                      className={`py-2 px-3 text-sm text-left rounded-md cursor-pointer 
                        ${activeCallPin
                          ? "bg-secondary text-white"
                          : "text-[#8A8AA0] hover:bg-gray-100"
                        } ${isDocumentDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      {t("sideBar.incomingCallPin")}
                    </button>
                    <button
                      onClick={() => {
                        navigate(ConstentRoutes.blockUnblockTag);
                        setIsSidebarOpen(false);
                      }}
                      disabled={isDocumentDisabled}
                      className={`py-2 px-3 text-sm text-left rounded-md cursor-pointer 
                        ${activeBlock
                          ? "bg-secondary text-white"
                          : "text-[#8A8AA0] hover:bg-gray-100"
                        } ${isDocumentDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      {t("sideBar.BlockUnblock")}
                    </button>
                    <div
                      onClick={() => {
                        navigate(ConstentRoutes.changeMyTAGCorporate);
                        setIsSidebarOpen(false);
                      }}
                      className={`py-2 px-3 text-sm rounded-md ${"cursor-pointer"} 
                        ${activeChangeMyTag
                          ? "bg-secondary text-white"
                          : "text-[#8A8AA0] hover:bg-gray-100"
                        }`}
                    >
                      {t("sideBar.changeNameTag")}
                    </div>
                    <div
                      onClick={() => {
                        navigate(ConstentRoutes.changeNumber);
                        setIsSidebarOpen(false);
                      }}
                      className={`py-2 px-3 text-sm rounded-md ${"cursor-pointer"} 
                        ${changeNumber
                          ? "bg-secondary text-white"
                          : "text-[#8A8AA0] hover:bg-gray-100"
                        }`}
                    >
                      {t("sideBar.changeMobileNo")}
                    </div>
                    <button
                      onClick={() => {
                        navigate(ConstentRoutes.UnSUBblockTag);
                        setIsSidebarOpen(false);
                      }}
                      disabled={isDocumentDisabled}
                      className={`py-2 px-3 text-left text-sm rounded-md cursor-pointer 
                        ${activeUnsubscribe
                          ? "bg-secondary text-white"
                          : "text-[#8A8AA0] hover:bg-gray-100"
                        } ${isDocumentDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                    >
                      {t("sideBar.unsubscribe")}
                    </button>

                    {/* Hide Close Account tab when parent_id != null */}
                    {!hasParentId && (
                      <div
                        onClick={() => {
                          navigate(ConstentRoutes.closeAccount);
                          setIsSidebarOpen(false);
                        }}
                        className={`py-2 px-3 text-sm rounded-md cursor-pointer 
                          ${closeAccount
                            ? "bg-secondary text-white"
                            : "text-[#8A8AA0] hover:bg-gray-100"
                          }`}
                      >
                        {t("sideBar.closeAccount")}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="my-3 border-t border-gray-200" />

              {/* Brand Name Call */}
              <div className="flex flex-col">
                <div className="flex md:gap-6 gap-2">
                  <div
                    className={`${
                      activeBrand ? "bg-secondary" : "bg-white"
                    } w-2 h-auto rounded-tr-[10px] rounded-br-[10px]`}
                  />
                  <ListItem
                    disabled={userData?.status == 5}
                    onClick={() => setOpenBrandMenu(!openBrandMenu)}
                    className={`rounded-lg bg-[#8dc63f]/10 py-4 cursor-pointer
                      ${activeBrand ? "bg-secondary text-white hover:bg-secondary" : ""}
                      focus:bg-secondary focus:text-white`}
                  >
                    <ListItemPrefix className="md:mr-4 mr-2">
                      <BsStarFill
                        className={`h-4 w-4 ${activeBrand ? "text-white" : "text-secondary"}`}
                      />
                    </ListItemPrefix>
                    <span
                      className={`flex flex-1 items-center gap-2 font-medium ${
                        activeBrand ? "text-white" : "text-secondary"
                      }`}
                    >
                      {t("sideBar.brandNameCall")}
                      {/* <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        {t("sideBar.newBadge")}
                      </span> */}
                    </span>
                  </ListItem>
                </div>

                {openBrandMenu && (
                  <div className="ml-8 mt-1 flex flex-col gap-1 pl-4 mb-2">
                    {brandPrimaryItems.map((item) => renderBrandLink(item, true))}
                    <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {t("sideBar.manageBrandName")}
                    </p>
                    {brandManageItems.map((item) => renderBrandLink(item))}
                  </div>
                )}
              </div>

              {/* Remaining menu items */}
              {sidebarData.slice(2).map((item, index) => (
                <div key={index + 2} className="flex md:gap-6 gap-2">
                  <div
                    className={`${item.active ? "bg-secondary" : "bg-white"
                      } w-2 h-auto rounded-tr-[10px] rounded-br-[10px]`}
                  />
                  <ListItem
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                      } else if (item.route) {
                        navigate(item.route);
                      }
                      setIsSidebarOpen(false);
                    }}
                    className={`py-4 
                      ${item.active
                        ? "bg-secondary text-white hover:text-white hover:bg-secondary"
                        : ""
                      } 
                      ${item.className || ""}
                      focus:bg-secondary focus:text-white
                      ${item.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                      }`}
                  >
                    <ListItemPrefix className="md:mr-4 mr-2">
                      {item.icon}
                    </ListItemPrefix>
                    <span
                      className={`${item.active ? "text-white" : "text-[#8A8AA0]"
                        } font-medium`}
                    >
                      {item.text}
                    </span>
                  </ListItem>
                </div>
              ))}
            </List>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
