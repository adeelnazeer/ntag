/* eslint-disable react/prop-types */
import { FaTelegram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { IoIosCall } from "react-icons/io";
import Header from "../components/header";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ContactUsPublic = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(["contactUs"]);
    return (
        <>
            <Header />
            <div className="max-w-4xl mx-auto p-4 my-6 bg-white rounded-lg shadow-md">
                <BiArrowBack className=" text-3xl cursor-auto text-secondary font-bold"
                    onClick={() => {
                        navigate(-1)
                    }}
                />
                <h1 className="text-2xl font-bold text-center mb-6 text-secondary">
                    {t("title")}
                </h1>

                <div className="mt-4">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            {t("heading")}
                        </h2>
                        <div className="flex items-center mb-6 space-x-2">
                            <IoIosCall size={24} className=' text-[#0072AB]' />
                            <a href={`tel:+${t("phone")}`} className="text-[#008FD5] hover:underline hover:text-[#008FD5]">
                                {t("phone")}
                            </a>
                        </div>

                        {/* Email */}
                        <div className="flex items-center mb-6 space-x-2">
                            <CiMail size={24} className=' text-[#0072AB]' />
                            <a href={`mailto:${t("email")}`} className="text-[#008FD5] hover:underline hover:text-[#008FD5]">
                                {t("email")}
                            </a>
                        </div>

                        {/* Chat Buttons */}
                        <div className="space-y-3">
                            <a
                                href={t("whatsappUrl")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center mb-6 space-x-2 text-[#008FD5] hover:underline hover:text-[#008FD5]"
                            >
                                <FaWhatsapp size={24} className='text-[#0072AB]' />
                                <span>{t("chatWhatsApp")}</span>
                            </a>

                            <a
                                href={t("telegramUrl")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-[#008FD5] hover:underline hover:text-[#008FD5]"
                            >
                                <FaTelegram size={24} className="text-[#0072AB]" />
                                <span>{t("messageTelegram")}</span>
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
};

export default ContactUsPublic;