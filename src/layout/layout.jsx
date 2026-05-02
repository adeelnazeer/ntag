/* eslint-disable react/prop-types */
import Sidebar from "../components/sideBar";
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
import HeaderNew from "../pages/home2/components/HeaderNew";

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
          if (userData?.parent_id == null) {
            dispatch(setUserData(res.data));
            dispatch(setCorporateDocuments(res.data.corp_document || []));
          }
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

    const user = userData?.customer_type != null
      ? userData
      : JSON.parse(localStorage.getItem("user") || "{}");
    const customerType = user?.customer_type;

    if (customerType !== "individual") {
      checkDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when customer_type is known
  }, [userData?.customer_type]);

  return (
    <div className="flex h-screen min-h-0 w-full flex-col overflow-hidden">
      <header className="relative z-[50] shrink-0">
        <HeaderNew
          corporateSidebar={{
            isOpen: isSidebarOpen,
            setOpen: setIsSidebarOpen,
          }}
        />
      </header>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-full min-h-0 flex-1 overflow-hidden">
          <div className="relative h-full w-0 shrink-0 overflow-visible bg-[#fbfbfb] lg:w-72 lg:shrink-0">
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <Sidebar
                  setIsSidebarOpen={setIsSidebarOpen}
                  isSidebarOpen={isSidebarOpen}
                  data={corporateDocuments}
                  hideFloatingTrigger
                />
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1 overflow-auto px-2 py-2 pt-2 md:mt-0 md:px-5 md:py-4">
            <div className="w-full sm:mx-auto sm:w-full md:mx-auto md:w-11/12">
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
      <footer className="relative z-[50] w-full shrink-0">
        <Footer />
      </footer>
      <UplaodDocument
        open={open}
        setOpen={setOpen}
        checkDocument={checkDocument}
      />
    </div>
  );
};

export default DashboardLayout;
