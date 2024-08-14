import { useLocation } from "react-router-dom";
import Header from "../components/header";

const TermOfUse = () => {
    const location = useLocation()
    console.log({ location })
    return (
        <div className=" h-screen flex flex-col">
            <Header />
            <div className="p-3 flex-1">
                <div className="w-full h-full  max-w-7xl mx-auto  bg-[#fff] rounded-[24px] shadow-sm">
                    <div className="p-4 pb-8">
                        <p className=" text-base font-semibold">
                            {location?.pathname == "/term-of-use" ? "Terms of Use" : "Privacy Policy"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TermOfUse;
