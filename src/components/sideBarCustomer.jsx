/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { MdHomeFilled } from "react-icons/md";
import { FaHashtag, FaUser, FaBars, FaPhoneSlash, FaPhone } from "react-icons/fa";
import { BsFire } from "react-icons/bs";
import { IoLogOutSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { removeToken } from "../utilities/auth";
import { useAppDispatch } from "../redux/hooks";
import { clearUserData } from "../redux/userSlice";

const SidebarCustomer = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const location = useLocation();
    const sidebarRef = useRef(null);
    const [callStatus, setCallStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    const activeDashboard = location?.pathname === ConstentRoutes.dashboardCustomer;
    const activeTwo = location?.pathname?.includes("dashboard");
    const activeThree = location?.pathname === ConstentRoutes.manageTagNameCustomer ||
        location?.pathname === ConstentRoutes.blockUnblockTagCustomer ||
        location?.pathname === ConstentRoutes.unsubTagCustomer ||
        location?.pathname === ConstentRoutes.changeMyTAG;
    const activeProfile = location?.pathname === ConstentRoutes.profilePageCustomer;

    // For child menu active states
    const activeCallSchedule = location?.pathname === ConstentRoutes.manageTagNameCustomer;
    const activeBlock = location?.pathname === ConstentRoutes.blockUnblockTagCustomer;
    const activeUnsubscribe = location?.pathname === ConstentRoutes.unsubTagCustomer;
    const activeChangeMyTag = location?.pathname === ConstentRoutes.changeMyTAG;
    const closeAccount = location?.pathname === ConstentRoutes.closeAccountCustomer;

    // State to manage dropdown open/closed
    const [openManageMenu, setOpenManageMenu] = useState(activeThree);

    // Fetch tag data and call status from the API
    useEffect(() => {
        const fetchTagData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user?.id) return;

                const response = await APICall("get", null, `${EndPoints.customer.getReserveTagsCustomer}/${user?.id}`);

                if (response?.success && response?.data && response?.data.length > 0) {
                    // Save the service_status in localStorage for persistence
                    const serviceStatus = response.data[0]?.service_status;
                    localStorage.setItem('serviceStatus', serviceStatus);
                    setCallStatus(serviceStatus);
                }
            } catch (error) {
                console.error("Error fetching tag data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTagData();

        // Also check localStorage on component mount
        const storedStatus = localStorage.getItem('serviceStatus');
        if (storedStatus !== null) {
            setCallStatus(parseInt(storedStatus));
        }
    }, []);

    // Update dropdown state when routes change
    useEffect(() => {
        setOpenManageMenu(activeThree);
    }, [activeThree]);

    // Listen for changes in localStorage from other components
    useEffect(() => {
        const handleStorageChange = () => {
            const storedStatus = localStorage.getItem('serviceStatus');
            if (storedStatus !== null) {
                setCallStatus(parseInt(storedStatus));
            }
        };

        // Add event listener
        window.addEventListener('storage', handleStorageChange);

        // Clean up
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogOut = () => {
        dispatch(clearUserData());
        removeToken();
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.clear();
        navigate(ConstentRoutes.login);
    };

    // Determine the text and icon for the Manage Calls menu item
    const getCallManagementLabel = () => {
        if (callStatus === 1) {
            return {
                text: "Stop Incoming Calls",
                // icon: <FaPhoneSlash className="h-4 w-4 text-red-500" />
            };
        } else {
            return {
                text: "Start Incoming Calls",
                // icon: <FaPhone className="h-4 w-4 text-green-500" />
            };
        }
    };

    const callManagement = getCallManagementLabel();

    const sidebarData = [
        {
            icon: <MdHomeFilled className="h-5 w-5" />,
            text: "Dashboard",
            active: activeDashboard,
            route: ConstentRoutes.dashboardCustomer
        },
        {
            icon: <FaHashtag className="h-4 w-4" />,
            text: "Buy NameTAG",
            active: activeTwo,
            route: ConstentRoutes.buyTagCustomer
        },
        {
            icon: <FaUser className="h-4 w-4" />,
            text: "Profile",
            active: activeProfile,
            route: ConstentRoutes.profilePageCustomer,
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

    return (
        <div className="w-full h-full">
            <div className="lg:hidden  fixed top-4 right-5 z-50">
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
                lg:w-72  md:min-w-[17rem]
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
                                        <ListItemPrefix>{item.icon}</ListItemPrefix>
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
                                        onClick={() => {
                                            setOpenManageMenu(!openManageMenu);
                                        }}
                                        className={`py-4 
                                            ${activeThree ? "bg-secondary text-white hover:text-white hover:bg-secondary  " : " hover:text-[#8A8AA0]"} 
                                            focus:bg-secondary active:bg-secondary focus:text-white cursor-pointer `}
                                    >
                                        <ListItemPrefix><BsFire className="h-4 w-4" /></ListItemPrefix>
                                        <span className={`font-medium ${activeThree ? "text-white" : "text-[#8A8AA0]"}`}>
                                            Manage NameTAG
                                        </span>
                                    </ListItem>
                                </div>

                                {/* Submenu items */}
                                {openManageMenu && (
                                    <div className="ml-8 pl-4 mt-1 flex flex-col gap-1 mb-2">
                                        <div
                                            onClick={() => {
                                                navigate(ConstentRoutes.manageTagNameCustomer)
                                                setIsSidebarOpen(false);

                                            }}
                                            className={`py-2 px-3 text-sm rounded-md cursor-pointer flex items-center gap-2
                                                ${activeCallSchedule ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"}`}
                                        >
                                            {/* {callManagement.icon} */}
                                            {callManagement.text}
                                        </div>

                                        <div
                                            onClick={() => {
                                                navigate(ConstentRoutes.blockUnblockTagCustomer)
                                                setIsSidebarOpen(false);

                                            }}
                                            className={`py-2 px-3 text-sm rounded-md cursor-pointer 
                                                ${activeBlock ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"}`}
                                        >
                                            Block/Unblock
                                        </div>
                                        <div
                                            onClick={() => {
                                                navigate(ConstentRoutes.changeMyTAG)
                                                setIsSidebarOpen(false);

                                            }}
                                            className={`py-2 px-3 text-sm rounded-md cursor-pointer 
                                                ${activeChangeMyTag ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"}`}
                                        >
                                            Change NameTAG
                                        </div>
                                        <div
                                            onClick={() => {
                                                navigate(ConstentRoutes.unsubTagCustomer)

                                                setIsSidebarOpen(false);

                                            }}
                                            className={`py-2 px-3 text-sm rounded-md cursor-pointer 
                                                ${activeUnsubscribe ? "bg-secondary text-white" : "text-[#8A8AA0] hover:bg-gray-100"}`}
                                        >
                                            Unsubscribe
                                        </div>
                                        <div
                                            onClick={() => {
                                                navigate(ConstentRoutes.closeAccountCustomer)
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
                                        <ListItemPrefix>{item.icon}</ListItemPrefix>
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

export default SidebarCustomer;