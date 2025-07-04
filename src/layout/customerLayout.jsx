/* eslint-disable react/prop-types */
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { getToken } from "../utilities/auth";
import SidebarCustomer from "../components/sideBarCustomer";
import { BiArrowBack } from "react-icons/bi";


const DashboardLayoutCustomer = ({ children }) => {
    const navigate = useNavigate();
    const locatiion = useLocation()

    let userData = {}
    userData = useAppSelector(state => state.user.userData);

    if (userData == null || userData == undefined) {

        localStorage.getItem("user");
        userData = JSON.parse(localStorage.getItem("user"));
    }
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/login');
            return;
        }
    }, []);

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
                            {!locatiion?.pathname?.includes("buy-tag") &&
                                <div className=" pb-4">
                                    <BiArrowBack className=" text-3xl cursor-pointer text-secondary font-bold"
                                        onClick={() => {
                                            navigate(-1)

                                        }}
                                    />
                                </div>
                            }
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