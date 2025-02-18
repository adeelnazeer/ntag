import { useLocation } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";

const Footer = () => {
  const location = useLocation();
  return (
    <div className="bg-[#f5f5f5] px-6 py-4 sticky bottom-0 z-10 ">
      {(location?.pathname !== ConstentRoutes?.login &&
        location?.pathname !== ConstentRoutes?.register) && (
          <div className=" flex justify-center max-w-7xl mx-auto">
            {/* <p className=" text-secondary  font-medium text-base  py-1 px-2">
              COMPUTER SERVICES
            </p>
            <p className=" text-secondary  font-medium text-base  py-1 px-2">
              STORAGE SERVICES
            </p> */}
            <p className=" text-secondary mt-2 hover:underline cursor-pointer  font-medium text-base  py-1 px-2"
            onClick={()=>{
              window.open(ConstentRoutes.termofuse,"_blank")
            }}
            >
              Terms and Conditions
            </p>
            {/* <p className=" text-secondary  font-medium text-base  py-1 px-2">
              SECURITY SERVICES
            </p>
            <p className=" text-secondary  font-medium text-base  py-1 px-2">
              CONTAINER SERVICES
            </p>
            <p className=" text-secondary  font-medium text-base  py-1 px-2">
              COMPUTER SERVICES
            </p> */}
          </div>
        )}
      <div>
        <p className=" text-center font-medium text-[18px] text-[#757575]">
          ©2024 All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
