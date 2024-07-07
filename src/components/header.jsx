import Logo from "../assets/images/logo.png";
import TagName from "../assets/images/tagname.png";
import MenuBar from "./menuBar";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useEffect, useState } from "react";
import { Menu, MenuHandler, Button, MenuItem, MenuList, Radio, Typography } from "@material-tailwind/react";
import "../App.css";
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  useEffect(() => {
    if (selectedValue == "corporate") {
      navigate(ConstentRoutes.register);
    }
  }, [selectedValue]);

  const handleLogout = () => {
    localStorage.clear()
    navigate(ConstentRoutes.login);
  }
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
          {token ?
            <div className="flex items-center">
              <Menu>
                <MenuHandler>
                  <Button
                    className=" bg-white text-base  font-medium text-secondary py-1 px-2">
                    {user?.comp_name}
                  </Button>
                </MenuHandler>
                <MenuList>
                  <MenuItem className=" focus:border-none border-none transition-none hover:border-none focus-within:border-none"
                  onClick={()=>navigate(ConstentRoutes.profilePage)}
                  >Profile</MenuItem>
                  <MenuItem className=" focus:border-none border-none transition-none hover:border-none"
                    onClick={() => {
                      handleLogout()
                    }}
                  >Logout</MenuItem>
                </MenuList>
              </Menu>
            </div>
            :
            <div className="flex items-center justify-between gap-6">
              <Button
                className=" bg-secondary text-base font-medium text-white border border-white py-1 px-2"
                onClick={() => navigate(ConstentRoutes.login)}
              >
                Login
              </Button>
              {/* <Button
              className=" bg-white text-base font-medium text-secondary py-1 px-2"
              onClick={() => navigate(ConstentRoutes.register)}
            >
              Register
            </Button> */}
              <div className="relative">
                <Button
                  className=" bg-white text-base font-medium text-secondary py-1 px-2"
                  onClick={toggleDropdown}
                >
                  Register
                </Button>
                {isOpen && (
                  <div>
                    <ul
                      role="menu"
                      className="absolute z-10 min-w-[180px] overflow-auto rounded-md border border-blue-gray-50 bg-white py-2 px-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none"
                    >
                      <li>
                        <p className="text-[13px] text-[#555555] font-[400]">
                          Select Customer Type
                        </p>
                      </li>
                      <li
                        role="menuitem"
                        className="block w-full cursor-pointer select-none rounded-md px-3 pt-[5px] pb-1 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                      >
                        <Radio
                          name="color"
                          value="corporate"
                          color="green"
                          checked={selectedValue === "corporate"}
                          onChange={handleChange}
                          label={
                            <Typography className="text-secondary text-sm">
                              Corporate
                            </Typography>
                          }
                        />
                      </li>
                      <li
                        role="menuitem"
                        className="block w-full cursor-pointer select-none rounded-md px-3 pt-[5px] pb-1 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                      >
                        <Radio
                          name="color"
                          value="individual"
                          color="green"
                          checked={selectedValue === "individual"}
                          onChange={handleChange}
                          label={
                            <Typography className="text-secondary text-sm">
                              Individual
                            </Typography>
                          }
                        />
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          }
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
