import { Button, Checkbox, Typography } from "@material-tailwind/react";
import { useState } from "react";
import Img from "../assets/images/wallet (2).png";
import Paymentsuccessful from "../modals/paymentsuccessful";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@headlessui/react";
import { useTagList } from "../pages/hooks/useDashboard";
import { useForm } from "react-hook-form";
import { GiVibratingSmartphone } from "react-icons/gi";
import { useRegisterHook } from "./hooks/useRegisterHook";
import CountdownTimer from "../components/counter";
import PhoneInput from "react-phone-number-input";
import { ConstentRoutes } from "../utilities/routesConst";
const ProceedPayment = () => {
  const {
    handleSubmit,
  } = useForm();
  const dashboard = useTagList();
  const navigate = useNavigate()
  const registerData = useRegisterHook();
  const location = useLocation();
  const state = location.state;
  const [isOpen, setIsOpen] = useState(false);
  const [newNumber, setNewNumber] = useState(false)
  const docStatus = JSON.parse(localStorage.getItem('data'))
  const [stateNewNumber, setStateNumber] = useState({
    term: false
  })
  const user = JSON.parse(localStorage.getItem("user"))
  const [phoneNumber, setPhoneNumber] = useState({
    checked1: false,
    checked2: false
  })

  const handleNewNumber = () => {
    registerData.handleVerifyOtp(stateNewNumber?.verification_code, setNewNumber, true)
  }

  const onSubmit = () => {
    const values = {
      transaction_type: "CORP_BUYTAG",
      channel: "WEB",
      account_id: user?.customer_account_id,
      customer_tag_id: state?.id,
      title: state?.tag_name,
      customer_tag_no: state?.tag_no,
      phone_number: user?.phone_number,
      amount: state?.totalPrice?.toString(),
      payment_method: "Mobile Wallet",
      reserve_type: "R",
      msisdn: user?.phone_number,
    }
    if (phoneNumber?.checked2) {
      values.msisdn = value
    }
    dashboard.handleTagDetails(values, setIsOpen);
    // setIsOpen(true);
  };

  console.log({ state })

  const [value, setValue] = useState()

  return (
    <>
      {newNumber ?
        <div className="p-4 bg-[#FFFFFF] max-w-[800px] rounded-xl shadow pb-6 mt-6">
          <div className=" pb-3 px-6 border-b mb-4">
            <Typography className="text-[#1F1F2C] text-lg font-bold ">
              {docStatus?.status == 0 ? "Reserve" : "Buy"} Name TAG
            </Typography>
            <Typography className="text-[#1F1F2C] text-xs mt-1 ">
              Enter Your Number To Map Your TAG Number
            </Typography>
          </div>
          <div className="px-6">
            <label className="text-[14px] text-[#555]">
              Mobile Number <span className=" text-red-500">*</span>
            </label>
            <div className="relative mt-2  items-center flex w-full">
              <PhoneInput
                defaultCountry="ET"
                international
                countryCallingCodeEditable={false}
                className="w-full rounded-xl border border-[#8A8AA033] px-4 py-2 bg-white outline-none "
                value={value}
                onChange={setValue}
                limitMaxLength={10}
                disabled={registerData?.expirationTime}
              />
              {/* <Input
                type="text"
                label="verification code"
                placeholder="Phone number"
                className="w-full rounded-xl border border-[#8A8AA033] px-4 py-2 bg-white outline-none "
                containerProps={{
                  className: "min-w-0",
                }}
                value={stateNewNumber?.phone_number}
                onChange={(e) => setStateNumber(st => ({
                  ...st, phone_number: e.target.value
                }))}
                style={
                  stateNewNumber?.errors?.phone_number ? { border: "1px solid red" } : { border: "1px solid #8A8AA033" }
                }
              /> */}
              {registerData?.expirationTime != null ? (
                <CountdownTimer
                  expirationTime={registerData?.expirationTime}
                  onExpire={registerData?.handleExipre}
                />
              ) : (
                value && (
                  <p
                    size="sm"
                    className="!absolute right-3  bg-[#f5f5f5] p-2 shadow-sm border border-[#8A8AA033] cursor-pointer text-xs font-medium rounded"
                    onClick={() =>
                      registerData.handleGetOtp(value)
                    }
                  >
                    Get Code
                  </p>
                )
              )}

            </div>
          </div>
          {registerData?.expirationTime &&
            <div className="mt-4 px-6">
              <label className="text-[14px]  text-[#555]">
                Verification Code <span className=" text-red-500">*</span>
              </label>
              <div className="relative mt-2  items-center flex w-full">
                <Input
                  type="text"
                  label="verification code"
                  placeholder="Phone verification code"
                  maxLength={4}
                  className="w-full rounded-xl border border-[#8A8AA033] px-4 py-2 bg-white outline-none "
                  containerProps={{
                    className: "min-w-0",
                  }}
                  value={stateNewNumber?.verification_code}
                  onChange={(e) => setStateNumber(st => ({
                    ...st, verification_code: e.target.value
                  }))}
                  style={
                    stateNewNumber?.errors?.verification_code ? { border: "1px solid red" } : { border: "1px solid #8A8AA033" }
                  }
                />
              </div>
            </div>
          }
          <div className="rounded-xl mt-3 px-6 text-[#555]">
            <div className=" flex items-start">
              <Checkbox
                value={stateNewNumber?.term == true}
                onChange={(e) => setStateNumber(st => ({
                  ...st, term: e.target.checked
                }))}
                style={
                  stateNewNumber?.errors?.term ? { border: "1px solid red" } : { border: "1px solid #8A8AA033" }
                }
              />
              <Typography className="text-sm cursor-pointer  leading-[40px] ">
                <span className="text-[#5B6AB0] hover:underline"
                  onClick={() => {
                    window.open(ConstentRoutes.termofuse, '_blank');
                  }}
                >Terms and Conditions </span> & <span className="text-[#5B6AB0] hover:underline"
                  onClick={() => {
                    window.open(ConstentRoutes.privacyPolicy, '_blank');
                  }}
                > Privacy Policy</span>
              </Typography>
            </div>
          </div>
          <div className="flex justify-center">
            <Button className=" bg-secondary  mt-3 mx-auto text-white text-[14px]"
              disabled={!value || !stateNewNumber?.verification_code || stateNewNumber?.term == false}
              onClick={() => { handleNewNumber() }}
            >
              Submit
            </Button>
          </div>
        </div> :
        <form onSubmit={handleSubmit(onSubmit)} className=" bg-white max-w-[800px]">
          <div className="p-4 rounded-xl shadow pb-6 mt-6">
            <Typography className="text-[#1F1F2C] pb-3 px-6 border-b text-lg font-bold ">
              {docStatus?.status == 0 ? "Reserve" : "Buy"} Name TAG
            </Typography>
            <div className="flex justify-between border-[#77777733] mt-4 border bg-[#F6F7FB] px-5 py-3 rounded-xl">
              <Typography className="text-[14px]">Name Tag</Typography>
              <Typography className="text-[14px] ">{state.tag_name}</Typography>
            </div>
            <div className="flex justify-between border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <Typography className="text-[14px]">TAG Price</Typography>
              <Typography className="text-[14px] ">Birr. {state.totalPrice}</Typography>
            </div>
            <div className=" border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <Typography className="text-[14px]">
                    Primary Mobile Number
                  </Typography>
                  <GiVibratingSmartphone />

                </div>

                <div className="flex items-center gap-2">
                  {/* <div
                    className={`text-[14px] px-4 py-2 font-medium text-[#7A798A] rounded-2xl border border-[#7A798A] bg-transparent ${phoneNumber?.checked1 == false ? "opacity-70" : " opacity-100"}`} size="small"
                    disabled={phoneNumber?.checked1 == false}
                    type="text"
                  >Add TAG #</div> */}
                  <Typography className="text-[14px] md:min-w-[200px] border border-[#88C140] p-2 rounded-lg text-[#0000008F]">
                    {user?.phone_number}
                  </Typography>
                  <Checkbox
                    checked={phoneNumber?.checked1}
                    onChange={() => { setPhoneNumber(st => ({ ...st, checked1: !st.checked1, checked2: false })) }}
                  />
                </div>
              </div>
            </div>
            <div className=" border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <Typography className="text-[14px]">
                    Enter New Mobile Number <span className="ml-4">{value || ""}</span>
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className={`text-[14px] flex gap-2 items-center px-4 py-2 font-medium text-[#7A798A] rounded-lg border border-[#88C140] bg-transparent ${phoneNumber?.checked2 == false ? "opacity-70" : " opacity-100"}`} size="small"
                    disabled={phoneNumber?.checked2 == false}
                    type="text"
                    onClick={() => {
                      setNewNumber(true)
                      registerData.setExpirationTime(null)
                      setStateNumber({ term: false })
                    }}
                  >
                    <GiVibratingSmartphone />
                    Add Mobile Number</button>
                  <Checkbox
                    checked={phoneNumber?.checked2}
                    onChange={() => { setPhoneNumber(st => ({ ...st, checked2: !st.checked2, checked1: false })) }}
                  />
                </div>
              </div>
            </div>
            <div className="flex  items-center justify-between border-[#77777733] border bg-[#F6F7FB] px-5 py-3 rounded-xl mt-3">
              <Typography className="text-[14px]">Payment Method</Typography>
              <div className="flex items-center px-2 py-1 border rounded-lg border-[#88C140] gap-2">
                <img src={Img} alt="abc" />
                <Typography className="text-[17px] font-bold">
                  Mobile Wallet
                </Typography>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button className=" bg-secondary text-white text-[14px] w-[280px]"
                type="submit"
                loading={dashboard?.loadingPayment}
              >
                {docStatus?.status == 0 ? "Proceed to Reservation" : "Proceed to Payment"}
              </Button>
            </div>
            {isOpen && <Paymentsuccessful isOpen={isOpen} setIsOpen={setIsOpen}
              state={state}
              user={phoneNumber?.checked2 ? value : user?.phone_number}
            />}
          </div>
        </form>
      }
    </>
  );
};

export default ProceedPayment;
