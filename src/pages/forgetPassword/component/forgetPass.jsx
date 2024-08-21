import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import { Input } from "@headlessui/react";
import Img from "../../../assets/images/c.png";
import Img1 from "../../../assets/images/a.png";
import Img2 from "../../../assets/images/b.png";

const ForgetPass = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handleNewPasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      alert("Password changed successfully!");
      setStep(4);
    } else {
      alert("Passwords do not match. Please try again.");
    }
  };

  const handleLogin = () => {
    alert("Redirecting to login page...");
  };

  return (
    <div>
      <div className="image relative lg:h-[90vh] md:h-[100vh] h-[92vh] flex items-center justify-center md:pb-12 pb-0 lg:pb-0">
        <div>
          <p className=" text-center font-medium text-[18px] text-[#757575] absolute lg:left-[40%] md:left-[30%] left-[12%] md:bottom-0 bottom-32">
            ©2022 Layyyers. All rights reserved.
          </p>
          <img
            className="absolute left-0 bottom-0 lg:h-[300px] md:h-[150px] h-[100px]"
            src={Img}
            alt="rectangle"
          />
          <img
            className="absolute lg:right-[20%] md:right-[10%] right-[10%] lg:top-[10%] md:top-[10%] top-[7%] lg:h-[100px] md:h-[80px] h-[80px]"
            src={Img1}
            alt="rectangle"
          />
          <img
            className="absolute right-[4%] md:bottom-[10%] bottom-[5%] lg:h-[140px] md:h-[120px] h-[80px]"
            src={Img2}
            alt="rectangle"
          />
        </div>
        <div className="flex items-center justify-center mx-6 md:mx-0">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full min-h-[400px]">
            {step === 1 ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                <p className="text-gray-900 mb-6 text-xs font-medium">
                  Please enter your email or phone number to reset the password
                </p>
                <form onSubmit={handleSendOtp}>
                  <div className="mb-2">
                    <Input
                      className="mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                      placeholder="User Name"
                      type="text"
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      className="mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      className="mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                      placeholder="Phone Number"
                      type="number"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                    />
                  </div>
                  <Button
                    className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                    type="submit"
                  >
                    SEND OTP
                  </Button>
                </form>
              </>
            ) : step === 2 ? (
              <div className="py-6 px-6">
                <h2 className="text-2xl font-bold mb-4">OTP Verification</h2>
                <p className="text-gray-900 mb-6 text-xs font-medium">
                  Please enter the OTP code sent to this number 03*********08
                  {phoneNumber.replace(/(\d{2})(\d{8})(\d{2})/, "$1********$3")}
                </p>
                <form onSubmit={handleOtpSubmit}>
                  <div className="flex justify-between mb-2">
                    {[1, 2, 3, 4].map((_, index) => (
                      <Input
                        key={index}
                        className="mt-2 w-[60px] text-center rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                        placeholder="-"
                        maxLength="1"
                      />
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-4 text-center">
                    Resend Code: <span className="text-secondary">00:59</span>
                  </p>
                  <Button
                    className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                    type="submit"
                  >
                    Submit
                  </Button>
                </form>
              </div>
            ) : step === 3 ? (
              <>
                <h2 className="text-2xl font-bold mb-1">Set a New Password</h2>
                <p className="text-gray-900 mb-6 text-xs font-medium">
                  Create a new password. Ensure it differs from previous ones
                  for security.
                </p>
                <form onSubmit={handleNewPasswordSubmit}>
                  <div className="mb-2">
                    <Input
                      className="mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                      placeholder="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      className="mt-2 w-full rounded-xl px-4 py-3 bg-[#F6F7FB] outline-none"
                      placeholder="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                    type="submit"
                  >
                    Save
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">Password Reset</h2>
                <p className="text-gray-900 mb-6 text-xs font-medium">
                  Your password has been successfully reset. Click below to
                  login.
                </p>
                <Button
                  className="w-full mt-10 px-4 py-2 justify-center bg-secondary text-white text-[22px] font-semibold"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
