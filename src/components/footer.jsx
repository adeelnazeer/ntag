import { useLocation } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";

const Footer = () => {
  const location = useLocation();
  return (
    <div className="bg-[#f5f5f5] px-6 mt-4 py-6 sticky bottom-0 z-10 ">
      {(location?.pathname !== ConstentRoutes?.login &&
        location?.pathname !== ConstentRoutes?.register) && (
        <div className=" flex justify-between max-w-7xl mx-auto">
          <p className=" text-secondary  font-medium text-base  py-1 px-2">
            COMPUTER SERVICES
          </p>
          <p className=" text-secondary  font-medium text-base  py-1 px-2">
            STORAGE SERVICES
          </p>
          <p className=" text-secondary  font-medium text-base  py-1 px-2">
            NETWORK SERVICES
          </p>
          <p className=" text-secondary  font-medium text-base  py-1 px-2">
            SECURITY SERVICES
          </p>
          <p className=" text-secondary  font-medium text-base  py-1 px-2">
            CONTAINER SERVICES
          </p>
          <p className=" text-secondary  font-medium text-base  py-1 px-2">
            COMPUTER SERVICES
          </p>
        </div>
      )}
      <div className="mt-4">
        <p className=" text-center font-medium text-[18px] text-[#757575]">
          ©2022 Layyyers. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
