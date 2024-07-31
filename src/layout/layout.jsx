/* eslint-disable react/prop-types */
import Sidebar from "../components/sideBar";
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APICall from "../network/APICall";
import UplaodDocument from "../components/uploadDocumentModal";

const DashboardLayout = ({ children }) => {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()
  const [open, setOpen] = useState({ show: false })
  const checkDocument = () => {
    APICall("get", null, `/customer/check-documents/${user?.customer_account_id}`).then(res => {
      if (res?.data?.file_doc_name1 == null) {
        setOpen(st => ({
          ...st,
          show: true,
          data: res?.data
        }))
      }
      localStorage.setItem('data', JSON.stringify(res?.data))
    }).catch(err => console.log("err", err))
  }

  useEffect(() => {
    // if (!token) {
    //   navigate('/login')
    // }
    checkDocument()
  }, [])


  return (
    <div className=" h-screen flex flex-col">
      <Header />
      <div className=" flex-1 overflow-auto">
        <div className="bg-secondary py-6 ">
          <h1 className="text-center md:text-[36px] text-[25px] text-white font-bold">
            Corporate Name TAG
          </h1>
        </div>
        <div className="grid grid-cols-12 ">
          <div className="col-span-2">
            <Sidebar />
          </div>
          <div className="md:col-span-10 col-span-12 md:px-5 px-2 md:pt-4 pt-2 mt-2 md:mt-0 md:block "><div className="md:w-11/12 w-full md:mx-auto ">{children}</div></div>
        </div>
      </div>
      <Footer />
      <UplaodDocument open={open} setOpen={setOpen}
        checkDocument={checkDocument}
      />
    </div>
  );
};

export default DashboardLayout;
