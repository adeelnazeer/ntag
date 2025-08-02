/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { MdHomeFilled } from "react-icons/md";
import { FaHashtag, FaUser, FaBars } from "react-icons/fa";
import { BsFire } from "react-icons/bs";
import { IoLogOutSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { removeToken } from "../utilities/auth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearUserData } from "../redux/userSlice";

const Sidebar = ({ data, isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const dispatch = useAppDispatch();

  let userData = {}
  userData = useAppSelector(state => state.user.userData);
  if (userData == null || userData == undefined) {
    localStorage.getItem("user");
    userData = JSON.parse(localStorage.getItem("user"));
  }

  const activeDashboard = location?.pathname === ConstentRoutes.dashboard;
  const activeTwo = location?.pathname?.includes("dashboard");
  const activeThree = location?.pathname === ConstentRoutes.manageTagName ||
    location?.pathname === ConstentRoutes.blockUnblockTag ||
    location?.pathname === ConstentRoutes.UnSUBblockTag;
  const activeProfile = location?.pathname === ConstentRoutes.profilePage;

  // For child menu active states
  const activeCallSchedule = location?.pathname === ConstentRoutes.manageTagName;
  const activeBlock = location?.pathname === ConstentRoutes.blockUnblockTag;
  const activeUnsubscribe = location?.pathname === ConstentRoutes.UnSUBblockTag;
  const closeAccount = location?.pathname === ConstentRoutes.closeAccount;
  const changeNumber = location?.pathname === ConstentRoutes.changeNumber;
  const activeChangeMyTag = location?.pathname === ConstentRoutes.changeMyTAGCorporate;

  // State to manage dropdown open/closed
  const [openManageMenu, setOpenManageMenu] = useState(activeThree);

  // Update dropdown state when routes change
  useEffect(() => {
    setOpenManageMenu(activeThree);
  }, [activeThree]);

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
      text: "Dashboard",
      active: activeDashboard,
      route: ConstentRoutes.dashboard
    },
    {
      icon: <FaHashtag className="h-4 w-4" />,
      text: (data?.[0]?.doc_status == 1 && data?.[1]?.doc_status == 1 && data?.[2]?.doc_status == 1) ? "Buy NameTAG" : "Reserve NameTAG",
      active: activeTwo,
      route: ConstentRoutes.buyTag,
      disabled: userData?.status == 5
    },
    {
      icon: <FaUser className="h-4 w-4" />,
      text: "Profile",
      active: activeProfile,
      route: ConstentRoutes.profilePage,
      disabled: userData?.status == 5
    },
    {
      icon: <IoLogOutSharp className="h-4 w-4" />,
      text: "Log Out",
      className: "text-[#FF4842]",
      onClick: handleLogOut
    }
  ];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) &&
        !event.target.closest('button')) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isSidebarOpen]);

  const isDocumentDisabled = data?.[0]?.doc_status == 0 || data?.[1]?.doc_status == 0 || data?.[2]?.doc_status == 0

  return (
    <div className="w-full h-full">
      <div className="lg:hidden fixed top-4 right-2 z-50">
        <FaBars
          className="text-3xl cursor-pointer text-white"
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarOpen(!isSidebarOpen);
          }}
        />
      </div>

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full transition-transform transform pt-16 
          lg:w-72 md:min-w-[17rem]
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 z-40 bg-white rounded-tr-[60px] max-w-64 w-64`}
      >
        <div className="h-full overflow-y-auto">
          <Card className="px-4 py-4 h-full w-full bg-transparent shadow-blue-gray-900/5">
            <List className="text-base min-w-full w-full gap-4 p-0 font-normal text-black">
              {/* Standard menu items */}
              {sidebarData.slice(0, 2).map((item, index) => (
                <div key={index} className="flex md:gap-6 gap-1">
                  <div className={`${item.active ? "bg-secondary" : "bg-white"} w-2 h-full rounded-tr-[10px] rounded-br-[10px]`} />
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
                      ${item.active ? "bg-secondary text-white hover:text-white hover:bg-secondary" : ""} 
                      ${item.className || ""}
                      focus:bg-secondary focus:text-white
                      ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <ListItemPrefix className="md:mr-4 mr-2">{item.icon}</ListItemPrefix>
                    <span className={`${item.active ? "text-white" : "text-[#8A8AA0]"} font-medium`}>
                      {item.text}
                    </span>
                  </ListItem>
                </div>
              ))}

              {/* Manage NameTAG with dropdown */}
              <div className="flex flex-col">
                <div className="flex md:gap-6 gap-1">
                  <div className={`${activeThree ? "bg-secondary" : "bg-white"} w-2 h-full rounded-tr-[10px] rounded-br-[10px]`} />
                  <ListItem
                    disabled={(userData?.status == 5)}
                    onClick={() => {
                      setOpenManageMenu(!openManageMenu);
                      // if (!(data?.[0]?.doc_status != 1 && data?.[1]?.doc_status != 1)) {
                      //   navigate(ConstentRoutes.manageTagName);
                      // }
                    }}
                    className={`py-4 
                      ${activeThree ? "bg-secondary text-white hover:text-white hover:bg-secondary" : ""} 
                      focus:bg-secondary focus:text-white
                      ${"cursor-pointer"}`}
                  >
                    <ListItemPrefix className="md:mr-4 mr-2"><BsFire className="h-4 w-4" /></ListItemPrefix>
                    <span className={`${activeThree ? "text-white" : "text-[#8A8AA0]"} font-medium`}>
                      Manage NameTAG
                    </span>
                  </ListItem>
                </div>

                {/* Submenu items */}
                {openManageMenu && (
                  <div className="ml-8 pl-4 mt-1 flex flex-col gap-1 mb-2">
                    <button
                      onClick={() => {
                        navigate(ConstentRoutes.manageTagName)
                        setIsSidebarOpen(false);
                      }}
                      disabled={isDocumentDisabled}
                      className={`py-2 px-3 text-left text-sm rounded-md cursor-pointer 
                        ${activeCallSchedule ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"} ${isDocumentDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Call Scheduling
                    </button>
                    <button
                      onClick={() => {
                        navigate(ConstentRoutes.blockUnblockTag)
                        setIsSidebarOpen(false);

                      }}
                      disabled={isDocumentDisabled}
                      className={`py-2 px-3 text-sm text-left rounded-md cursor-pointer 
                        ${activeBlock ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"} ${isDocumentDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Block/Unblock
                    </button>
                    <div
                      onClick={() => {
                        navigate(ConstentRoutes.changeMyTAGCorporate)
                        setIsSidebarOpen(false);

                      }}
                      className={`py-2 px-3 text-sm rounded-md cursor-pointer 
                        ${activeChangeMyTag ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"}`}
                    >
                      Change NameTAG
                    </div>
                    <div
                      onClick={() => {
                        navigate(ConstentRoutes.changeNumber)
                        setIsSidebarOpen(false);

                      }}
                      className={`py-2 px-3 text-sm rounded-md cursor-pointer 
                        ${changeNumber ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"}`}
                    >
                      Change Mobile Number
                    </div>
                    <button
                      onClick={() => {
                        navigate(ConstentRoutes.UnSUBblockTag)
                        setIsSidebarOpen(false);

                      }}
                      disabled={isDocumentDisabled}
                      className={`py-2 px-3 text-left text-sm rounded-md cursor-pointer 
                        ${activeUnsubscribe ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"} ${isDocumentDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Unsubscribe
                    </button>

                    <div
                      onClick={() => {
                        navigate(ConstentRoutes.closeAccount)
                        setIsSidebarOpen(false);

                      }}
                      className={`py-2 px-3 text-sm rounded-md cursor-pointer 
                        ${closeAccount ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"}`}
                    >
                      Close Account
                    </div>
                  </div>
                )}
              </div>

              {/* Remaining menu items */}
              {sidebarData.slice(2).map((item, index) => (
                <div key={index + 2} className="flex md:gap-6 gap-1">
                  <div className={`${item.active ? "bg-secondary" : "bg-white"} w-2 h-full rounded-tr-[10px] rounded-br-[10px]`} />
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
                      ${item.active ? "bg-secondary text-white hover:text-white hover:bg-secondary" : ""} 
                      ${item.className || ""}
                      focus:bg-secondary focus:text-white
                      ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <ListItemPrefix className="md:mr-4 mr-2">{item.icon}</ListItemPrefix>
                    <span className={`${item.active ? "text-white" : "text-[#8A8AA0]"} font-medium`}>
                      {item.text}
                    </span>
                  </ListItem>
                </div>
              ))}
            </List>
          </Card>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;