import { useState, useEffect, useRef } from "react";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { MdHomeFilled } from "react-icons/md";
import { FaHashtag, FaUser, FaMicrophone, FaBars } from "react-icons/fa";
import { BsFire } from "react-icons/bs";
import { ImStatsDots } from "react-icons/im";
import { IoLogOutSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const docStatus = JSON.parse(localStorage.getItem('data'))
  const activeDashboard = location?.pathname === ConstentRoutes.dashboard;
  const activeTwo = location?.pathname?.includes("dashboard");
  const activeThree = location?.pathname === ConstentRoutes.manageTagName;
  const activeProfile = location?.pathname === ConstentRoutes.profilePage;
  const activeVoiceMail = location?.pathname === ConstentRoutes.voiceMail;

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.clear();
    navigate("/");
    setIsOpen(false); // Close the sidebar
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="w-full h-full">
      <div className="lg:hidden fixed top-4 right-5 z-50">
        <FaBars className="text-3xl cursor-pointer text-white" onClick={toggleSidebar} />
      </div>
      <div
        ref={sidebarRef}
        className={` top-0 fixed   md:relative md:z-0 md:top-auto left-0 h-full w-64 bg-white shadow-lg transition-transform transform pt-4 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 z-50`}
      >
        <div className="overflow-scroll h-full ">
          <Card className="px-4 py-4  h-full w-full  overflow-scroll shadow-xl shadow-blue-gray-900/5">
            <List className="text-[16px] min-w-full w-full gap-4 p-0 font-normal text-black">
              <div className="flex gap-6">
                <div
                  className={`${activeDashboard ? "bg-secondary" : "bg-white"
                    }  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
                />
                <ListItem
                  className={`py-4 ${activeDashboard ? "bg-secondary text-white" : ""
                    } focus:bg-secondary focus:text-white`}
                  onClick={() => {
                    navigate(ConstentRoutes.dashboard);
                    setIsOpen(false);
                  }}
                >
                  <ListItemPrefix>
                    <MdHomeFilled className="h-5 w-5" />
                  </ListItemPrefix>
                  Dashboard
                </ListItem>
              </div>
              <div className="flex gap-6">
                <div
                  className={`${activeTwo ? "bg-secondary" : "bg-white"}  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
                />
                <ListItem
                  className={`py-4 ${activeTwo ? "bg-secondary text-white" : ""} focus:bg-secondary focus:text-white`}
                  onClick={() => {
                    navigate(ConstentRoutes.buyTag);
                    setIsOpen(false);
                  }}
                >
                  <ListItemPrefix>
                    <FaHashtag className="h-4 w-4" />
                  </ListItemPrefix>
                  {docStatus?.doc_approval_status != 0 ? "Buy Name Tag" : "Reserve Name Tag"}
                </ListItem>
              </div>
              <div className="flex gap-6">
                <div
                  className={`${activeThree ? "bg-secondary" : "bg-white"}  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
                />
                <ListItem
                  className={`py-4 ${activeThree ? "bg-secondary text-white" : ""} focus:bg-secondary focus:text-white`}
                  onClick={() => {
                    navigate(ConstentRoutes.manageTagName);
                    setIsOpen(false);
                  }}
                  disabled={docStatus?.doc_approval_status == 0}
                >
                  <ListItemPrefix>
                    <BsFire className="h-4 w-4" />
                  </ListItemPrefix>
                  Manage Tag Name
                </ListItem>
              </div>
              <div className="flex gap-6">
                <div className="bg-white w-2 h-full rounded-tr-[10px] rounded-br-[10px]" />
                <ListItem className="py-4"
                  disabled={docStatus?.doc_approval_status == 0}

                >
                  <ListItemPrefix>
                    <ImStatsDots className="h-4 w-4" />
                  </ListItemPrefix>
                  Statistics
                </ListItem>
              </div>
              <div className="flex gap-6">
                <div
                  className={`${activeVoiceMail ? "bg-secondary" : "bg-white"}  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
                />
                <ListItem
                  className={`py-4 ${activeVoiceMail ? "bg-secondary text-white" : ""} focus:bg-secondary focus:text-white`}
                  onClick={() => {
                    navigate(ConstentRoutes.voiceMail);
                    setIsOpen(false);
                  }}
                  disabled={docStatus?.doc_approval_status == 0}
                >
                  <ListItemPrefix>
                    <FaMicrophone className="h-4 w-4" />
                  </ListItemPrefix>
                  Voice mail
                </ListItem>
              </div>
              <div className="flex gap-6">
                <div
                  className={`${activeProfile ? "bg-secondary" : "bg-white"}  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
                />
                <ListItem
                  className={`py-4 ${activeProfile ? "bg-secondary text-white" : ""} focus:bg-secondary focus:text-white`}
                  onClick={() => {
                    navigate(ConstentRoutes.profilePage);
                    setIsOpen(false);
                  }}
                >
                  <ListItemPrefix>
                    <FaUser className="h-4 w-4" />
                  </ListItemPrefix>
                  Profile
                </ListItem>
              </div>
              <div className="flex gap-6">
                <div className="bg-white w-2 h-full rounded-tr-[10px] rounded-br-[10px]" />
                <ListItem className="text-[#FF4842] py-4" onClick={handleLogOut}>
                  <ListItemPrefix>
                    <IoLogOutSharp className="h-4 w-4" />
                  </ListItemPrefix>
                  Log Out
                </ListItem>
              </div>
            </List>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
