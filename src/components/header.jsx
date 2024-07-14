import Logo from "../assets/images/logo.png";
import TagName from "../assets/images/tagname.png";
import MenuBar from "./menuBar";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";
import { useEffect, useState } from "react";
import { Menu, MenuHandler, Button, MenuItem, MenuList, Radio, Typography, ListItemPrefix } from "@material-tailwind/react";
import "../App.css";
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  
  useEffect(() => {
    if (selectedValue == "corporate") {
      navigate(ConstentRoutes.register);
      setIsOpen(false)
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
                    onClick={() => navigate(ConstentRoutes.profilePage)}
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
                <Menu>
                  <MenuHandler>
                    <Button
                      className=" bg-white text-base  font-medium text-secondary py-1 px-2">
                      Register
                    </Button>
                  </MenuHandler>
                  <MenuList>
                    <p className="text-[13px] outline-none text-[#555555] font-[400]">
                      Select Customer Type
                    </p>
                    <MenuItem className=" focus:border-none border-none transition-none hover:border-none focus-within:border-none"
                      onClick={() => {
                        navigate(ConstentRoutes.register);
                      }}
                    >
                      <label
                        className="flex w-full cursor-pointer items-center"
                      >
                        <ListItemPrefix className="mr-3">
                          <Radio
                            id="vertical-list-react"
                            ripple={false}
                            name="color"
                            value="individual"
                            color="green"
                            checked={selectedValue === "individual"}
                            className="h-3 w-3 p-0 hover:before:opacity-0"
                            containerProps={{
                              className: "p-0",
                            }}
                          />
                        </ListItemPrefix>
                        <Typography className="text-secondary font-normal text-sm">
                          Corporate
                        </Typography>
                      </label>
                    </MenuItem>
                    <MenuItem className=" focus:border-none border-none transition-none hover:border-none focus-within:border-none"
                    >
                      <label
                        className="flex w-full cursor-pointer items-center"
                      >
                        <ListItemPrefix className="mr-3">
                          <Radio
                            id="vertical-list-react"
                            ripple={false}
                            name="color"
                            value="individual"
                            color="green"
                            checked={selectedValue === "individual"}
                            className="h-3 w-3 p-0 hover:before:opacity-0"
                            containerProps={{
                              className: "p-0",
                            }}
                          />
                        </ListItemPrefix>
                        <Typography className="text-secondary  font-normal text-sm">
                          Individual
                        </Typography>
                      </label>
                    </MenuItem>
                  </MenuList>
                </Menu>

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
