import { Button } from "@headlessui/react";
import Logo from "../assets/images/logo.png";
import TagName from "../assets/images/tagname.png";

const MenuBar = () => {
  return (
    <div>
      <div className="flex mx-4 justify-between items-center">
        <div>
          <img
            className=" rounded-tr-[50px] pr-6 bg-white"
            src={Logo}
            alt="logo"
          />
        </div>
        <div className="h-full flex gap-8">
          <div className="flex items-center justify-between gap-6">
            <Button className=" bg-secondary text-base font-medium text-white border border-white py-1 px-2">
              Login
            </Button>
            <Button className=" bg-white text-base font-medium text-secondary py-1 px-2">
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
    </div>
  );
};

export default MenuBar;
