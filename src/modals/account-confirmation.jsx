import { Button } from "@headlessui/react";
import { Typography } from "@material-tailwind/react";
import { IoMdCloseCircle } from "react-icons/io";
import { useTranslation } from "react-i18next";

/* eslint-disable react/prop-types */
const AccountConfirmation = ({ isOpen, handleSubmit, setIsOpen }) => {
    const { t } = useTranslation(["common"]);
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
                    <div
                        className="relative m-4 w-full max-w-lg rounded-lg bg-white  text-base font-light leading-relaxed antialiased shadow-2xl sm:w-4/5 md:w-3/5 lg:w-2/5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-4 py-4 sm:px-6 md:px-8 lg:px-12">
                            <div
                                className="flex text-secondary justify-end text-2xl font-snormal cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                <IoMdCloseCircle />
                            </div>
                            <div className="flex justify-center items-center mt-2">
                                <div className="shadow rounded-xl p-4 sm:p-6 md:p-8 lg:p-12 w-full">
                                    <Typography className="text-center">
                                        {t("accountConfirmation.message")}
                                    </Typography>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex items-center justify-around mt-8 w-full">
                                    <Button
                                        className="bg-white text-[#757575] border border-secondary py-2 px-6 sm:px-6"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {t("accountConfirmation.cancel")}
                                    </Button>
                                    <Button
                                        className="bg-secondary py-2 px-6 text-white sm:px-6"
                                        onClick={() => handleSubmit()}
                                    >
                                        {t("accountConfirmation.submit")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}</>
    );
}

export default AccountConfirmation;