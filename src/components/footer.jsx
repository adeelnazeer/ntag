import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
 let  userData = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-[#D7D7D7] z-[99] px-6 py-4 sticky bottom-0">
      {(location?.pathname !== ConstentRoutes?.login &&
        location?.pathname !== ConstentRoutes?.register) && (
          <div className="flex justify-center max-w-7xl mx-auto">
            {/* Existing commented items kept for reference */}
            {/* <p className=" text-secondary  font-medium text-base  py-1 px-2">
              COMPUTER SERVICES
            </p>
            <p className=" text-secondary  font-medium text-base  py-1 px-2">
              STORAGE SERVICES
            </p> */}

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
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6">
        {/* Terms & Conditions links added to footer */}
        <div className="flex md:gap-4 gap-2 items-center flex-wrap mb-2 md:mb-0">
          <p className="text-[#008fd5] hover:underline cursor-pointer text-sm md:text-base"
            onClick={() => {
              window.open(ConstentRoutes.termofuse, '_blank');
            }}
          >
            Terms & Conditions
          </p>
          <p className="text-[#008fd5] hover:underline cursor-pointer text-sm md:text-base"
            onClick={() => {
              window.open(ConstentRoutes.privacyPolicy, '_blank');
            }}
          >
            Privacy Policy
          </p>
          <p className="text-[#008fd5] hover:underline cursor-pointer text-sm md:text-base"
            onClick={() => {
              navigate("/faq", { state: { isIndividual: location?.pathname?.includes("customer") ? true : false } });
            }}
          >
            FAQs
          </p>
          <p className="text-[#008fd5] hover:underline cursor-pointer text-sm md:text-base"
            onClick={() => {
              if (token) {
                if(userData.customer_type=='individual'){
                  navigate("/individual/contact");
                }else{
                  navigate("/contact");
                }

              }
              else {
                navigate("/contact-us");

              }
            }}
          >
            Contact Us
          </p>
        </div>
        <p className="text-center font-medium text-xs md:text-base text-[#008fd5]">
          ©{new Date()?.getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;