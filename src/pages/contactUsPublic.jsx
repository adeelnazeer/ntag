/* eslint-disable react/prop-types */
import { FaTelegram } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { IoIosCall } from "react-icons/io";
import Header from "../components/header";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


const ContactUsPublic = () => {
    const navigate = useNavigate()
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
                    Contact Us
                </h1>

                <div className="mt-4">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Need Help? Contact Support
                        </h2>
                        <div className="flex items-center mb-6 space-x-2">
                            <IoIosCall size={24} className=' text-[#0072AB]' />
                            <a href="tel:+251991071051" className="text-[#008FD5] hover:underline hover:text-[#008FD5]">
                                +251991071051
                            </a>
                        </div>

                        {/* Email */}
                        <div className="flex items-center mb-6 space-x-2">
                            <CiMail size={24} className=' text-[#0072AB]' />
                            <a href="mailto:info@tech-vas.com" className="text-[#008FD5] hover:underline hover:text-[#008FD5]">
                                info@tech-vas.com
                            </a>
                        </div>

                        {/* Chat Buttons */}
                        <div className="space-y-3">
                            <a
                                href="https://wa.me/251991075160"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center mb-6 space-x-2 text-[#008FD5] hover:underline hover:text-[#008FD5]"
                            >
                                <FaWhatsapp size={24} className='text-[#0072AB]' />
                                <span>Chat on WhatsApp</span>
                            </a>

                            <a
                                href="https://t.me/Nametag_support"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 text-[#008FD5] hover:underline hover:text-[#008FD5]"
                            >
                                <FaTelegram size={24} className="text-[#0072AB]" />
                                <span>Message on Telegram</span>
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
};

export default ContactUsPublic;