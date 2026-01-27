/* eslint-disable react/prop-types */
import Sidebar from "../components/sideBar";
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import APICall from "../network/APICall";
import UplaodDocument from "../components/uploadDocumentModal";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setUserData, setCorporateDocuments } from "../redux/userSlice";
import { getToken } from "../utilities/auth";
import { BiArrowBack } from "react-icons/bi";
import EndPoints from "../network/EndPoints";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const locatiion = useLocation();

  let userData = {};
  userData = useAppSelector((state) => state.user.userData);

  if (userData == null || userData == undefined) {
    localStorage.getItem("user");
    userData = JSON.parse(localStorage.getItem("user"));
  }
  const corporateDocuments = useAppSelector(
    (state) => state.user.corporateDocuments
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [open, setOpen] = useState({ show: false });

  const checkDocument = () => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    APICall("get", null, `${EndPoints.customer.newSecurityEndPoints.corporate.checkDocumentStatus}`)
      .then((res) => {
        if (res?.data) {
          // Store user data in Redux

          if (userData?.parent_id == null) {
            dispatch(setUserData(res.data));
            // Store documents in Redux
            dispatch(setCorporateDocuments(res.data.corp_document || []));
          }
          // Show upload modal if no documents
          if (
            res?.data?.corp_document?.length < 3 &&
            userData?.parent_id == null
          ) {
            setOpen((st) => ({
              ...st,
              show: true,
              data: res.data,
            }));
          }
        }
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    checkDocument();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="flex flex-1 overflow-auto grid-cols-12 h-full">
          <div className="lg:w-72 h-full bg-[#fbfbfb]">
            <Sidebar
              setIsSidebarOpen={setIsSidebarOpen}
              isSidebarOpen={isSidebarOpen}
              data={corporateDocuments}
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
              {children}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <UplaodDocument
        open={open}
        setOpen={setOpen}
        checkDocument={checkDocument}
      />
    </div>
  );
};

export default DashboardLayout;
