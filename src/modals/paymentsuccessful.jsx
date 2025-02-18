/* eslint-disable react/prop-types */
import { Button, Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
const Paymentsuccessful = ({ isOpen, setIsOpen, state, user }) => {
  const navigate = useNavigate()
  const docStatus = JSON.parse(localStorage.getItem('data'))

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
        >
          <div
            className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed  antialiased shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex text-secondary justify-end text-2xl font-snormal cursor-pointer"
                onClick={() => {
                  navigate(ConstentRoutes.dashboard)
                  setIsOpen(false)
                }}
              >
                <IoMdCloseCircle />
              </div>
              <div className="text-center">
                <Typography variant="h5">{docStatus?.status == 0 ? "Reservation" : "Transaction"} Successfull</Typography>
                {docStatus?.status == 0 ?
                  <Typography className="text-[14px] mt-4">
                    Your Name TAG is successfully Reserved for 24 hours.
                  </Typography>
                  :
                  <Typography className="text-[14px] mt-4">
                    Your Name TAG is successfully Allocated To <br></br> Your
                    Number.
                  </Typography>
                }
              </div>
              <div className="p-4 shadow rounded-xl mt-2 border bg-[#80808021] border-[#80808038]">
                <div className="flex justify-between items-center">
                  <h1>{"Payment"} Status</h1>
                  <Button className="bg-secondary  py-2 px-6 text-white">
                    {docStatus?.doc_approval_status == 0 ? "Document Approval Pending" : "Success"}
                  </Button>
                </div>

                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-sm">Registered Mobile Number</h1>
                  <p className="text-sm font-bold">{user}</p>
                </div>
                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-sm">TAG Name</h1>
                  <p className="text-sm font-bold">{state?.tag_name}</p>
                </div>
                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-sm">Name TAG Price</h1>
                  <p className="text-sm font-bold">Birr. {state?.totalPrice}</p>
                </div>
                <div className="flex justify-between mt-3 items-center">
                  <h1 className="text-[#7A798A] text-sm">Service Fee</h1>
                  <p className="text-sm font-bold">Birr. {state?.service_fee}</p>
                </div>
              </div>
              <div className="flex items-center justify-center mt-4">
                <Button className="bg-secondary  py-2 px-6 text-white"
                  onClick={() => {
                    navigate(ConstentRoutes.dashboard)
                    setIsOpen(false)
                  }}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Paymentsuccessful;
