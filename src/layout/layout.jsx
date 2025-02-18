/* eslint-disable react/prop-types */
import Sidebar from "../components/sideBar";
import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import APICall from "../network/APICall";
import UplaodDocument from "../components/uploadDocumentModal";

const DashboardLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [data, setData] = useState(user || null)
  const [open, setOpen] = useState({ show: false })
  const checkDocument = () => {
    APICall("get", null, `/customer/check-documents/${user?.customer_account_id}`).then(res => {
      if (res?.data?.corp_document?.length==0) {
        setOpen(st => ({
          ...st,
          show: true,
          data: res?.data
        }))
      }
      localStorage.setItem('data', JSON.stringify(res?.data))
      setData(res?.data)
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
      <div className=" flex-1 flex flex-col overflow-auto">
        {/* <div className="bg-secondary py-6 ">
          <h1 className="text-center lg:text-[36px] md:text-[15px] text-[25px] text-white font-bold">
            Corporate Name TAG
          </h1>
        </div> */}
        <div className="flex  flex-1 overflow-auto grid-cols-12  h-full">
          <div className="md:w-72 h-full bg-[#fbfbfb]">
            <Sidebar data={data} />
          </div>
          <div className="w-full col-span-12 md:px-5 px-2 h-full overflow-auto md:py-4 py-2 mt-2 md:mt-0 md:block ">
            <div className="md:w-11/12 w-full md:mx-auto ">{children}</div>
          </div>
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
