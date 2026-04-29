import { Button } from "@material-tailwind/react";
import Logo from "../../../assets/images/logo.png";
import TagName from "../../../assets/images/Telebirr.png";
import { useTranslation } from "react-i18next";
import { ConstentRoutes } from "../../../utilities/routesConst";
import { useNavigate } from "react-router-dom";

const SimpleHeader = () => {
    const { t } = useTranslation(["common"]);
    const deleteToken = localStorage.getItem("deleteToken");
    const { t: t2 } = useTranslation(["unsubscribe"]);
    const navigate = useNavigate();


    return (
        <div className="sticky top-0 z-[99] bg-[#f5f5f5]">
            <div className="bg-white">
                <div className="flex justify-between items-center h-16 md:mx-4 mx-0 bg-secondary">
                    <div
                        className="h-full flex items-center"
                        onClick={() => {
                            window.open("https://ethiotelecom.et/", "_blank");
                        }}
                    >
                        <img
                            className="rounded-tr-[50px] w-[190px] md:w-full h-full pr-6 bg-white cursor-pointer"
                            src={Logo}
                            alt="logo"
                        />
                    </div>

                    <div>
                        <p className="text-white font-medium text-sm md:text-lg flex gap-1">
                            {t("nameTag")}{" "}
                            <span className=" text-white font-medium text-sm md:text-lg hidden md:block">
                                {" "}
                                {t("service")}
                            </span>
                        </p>
                    </div>

                    <div className="md:hidden flex min-w-3" />
                    <div className="hidden md:flex lg:flex h-full items-center gap-8">
                        {deleteToken && (
                            <div className="flex items-center">
                                <Button
                                    variant="text"
                                    className="bg-secondary text-base capitalize font-medium text-white border border-white py-1 px-2"
                                    onClick={() => {
                                        localStorage.removeItem("deleteToken");
                                        localStorage.clear();
                                        navigate("/delaccount");
                                    }}
                                >
                                    {t2("logout")}
                                </Button>
                            </div>
                        )}

                        <div
                            className="flex h-full font-semibold gap-2 items-center pl-6 rounded-tl-[50px] cursor-pointer lg:bg-white md:bg-transparent"
                            onClick={() => {
                                window.open("https://ethiotelecom.et/", "_blank");
                            }}
                        >
                            <img
                                src={TagName}
                                alt="teleber"
                                className="lg:block w-[7rem] md:hidden"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SimpleHeader;