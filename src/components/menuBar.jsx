import { Button } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useTranslation } from "react-i18next";
const MenuBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className=" py-6 gap-16 items-center max-w-6xl mx-auto md:flex hidden">
      <Button
        className=" text-primaryLight font-medium  py-1 px-2"
      >
        <a href="#home" className="a-href"
          onClick={() => {
            navigate(ConstentRoutes.home);
          }}
        >
          {t("home")}
        </a>
      </Button>
      <Button className=" text-primaryLight font-medium py-1 px-2">
        <a href="#service" className="a-href"
          onClick={() => {
            navigate(ConstentRoutes.home);
          }}
        >
          {t("sectorOverview")}
        </a>
      </Button>

    </div>
  );
};

export default MenuBar;
