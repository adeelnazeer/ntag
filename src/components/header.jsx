import { Button } from "@headlessui/react";
import Logo from "../assets/images/logo.png";
import TagName from "../assets/images/tagname.png";
import MenuBar from "./menuBar";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = location?.pathname != ConstentRoutes.home ? "mb-8" : "";
  return (
    <div className={`sticky top-0 z-10 bg-[#f5f5f5] ${classes}`}>
      <div className="flex mx-4 h-16  justify-between items-center bg-secondary">
        <div className="h-full">
          <img
            className=" rounded-tr-[50px] h-full pr-6 bg-white cursor-pointer"
            src={Logo}
            alt="logo"
            onClick={() => navigate(ConstentRoutes.home)}
          />
        </div>
        <div className="h-full flex gap-8">
          <div className="flex items-center justify-between gap-6">
            <Button
              className=" bg-secondary text-base font-medium text-white border border-white py-1 px-2"
              onClick={() => navigate(ConstentRoutes.login)}
            >
              Login
            </Button>
            <Button
              className=" bg-white text-base font-medium text-secondary py-1 px-2"
              onClick={() => navigate(ConstentRoutes.register)}
            >
              Register
            </Button>
          </div>
          <div className="flex h-full font-semibold gap-2 items-center pl-6 rounded-tl-[50px] bg-white ">
            <div>
              <img src={TagName} alt="tagname" />
            </div>
            <h2>Name TAG</h2>
          </div>
        </div>
      </div>
      {location?.pathname == ConstentRoutes.home && <MenuBar />}
    </div>
  );
};

export default Header;
