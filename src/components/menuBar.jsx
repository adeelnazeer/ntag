import { Button } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
const MenuBar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex py-6 gap-16 items-center max-w-6xl mx-auto">
      <Button
        className=" text-primaryLight font-medium  py-1 px-2"
        onClick={() => {
          navigate(ConstentRoutes.dashboard);
        }}
      >
        Home
      </Button>
      <Button className=" text-primaryLight font-medium py-1 px-2">
        Service Overview
      </Button>
      <Button className=" text-primaryLight font-medium py-1 px-2">
        Pricing
      </Button>
      <Button className=" text-primaryLight font-medium py-1 px-2">
        Solutions
      </Button>
      <Button className=" text-primaryLight font-medium py-1 px-2">Help</Button>
    </div>
  );
};

export default MenuBar;
