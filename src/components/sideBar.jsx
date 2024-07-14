import { Card, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { MdHomeFilled } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { BsFire } from "react-icons/bs";
import { ImStatsDots } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { ConstentRoutes } from "../utilities/routesConst";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeDashboard = location?.pathname?.includes(ConstentRoutes.dashboard);
  const activeTwo = location?.pathname == ConstentRoutes.buyTag;
  const activeThree = location?.pathname == ConstentRoutes.manageTagName;
  const activeProfile = location?.pathname == ConstentRoutes.profilePage;
  const activeVoiceMail = location?.pathname == ConstentRoutes.voiceMail;


  const handleLogOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    localStorage.clear()
    navigate('/')
  }
  return (
    <div className="main fixed overflow-auto">
      <div className="overflow-scroll">
        <Card className="px-4 py-4 h-[calc(100vh-325px)] w-full max-w-[20rem] overflow-scroll shadow-xl shadow-blue-gray-900/5">
          <List className="text-[16px] gap-4 p-0 font-normal text-black ">
            <div className="flex gap-6 ">
              <div
                className={`${activeDashboard ? "bg-secondary" : "bg-white"
                  }  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
              />
              <ListItem
                className={`py-4 ${activeDashboard ? " bg-secondary text-white" : ""
                  } focus:bg-secondary focus:text-white`}
                onClick={() => navigate(ConstentRoutes.dashboard)}
              >
                <ListItemPrefix>
                  <MdHomeFilled className="h-5 w-5" />
                </ListItemPrefix>
                Dashboard
              </ListItem>
            </div>
            <div className="flex gap-6 ">
              <div
                className={`${activeTwo ? "bg-secondary" : "bg-white"
                  }  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
              />
              <ListItem
                className={`py-4 ${activeTwo ? " bg-secondary text-white" : ""
                  } focus:bg-secondary focus:text-white`}
                onClick={() => navigate(ConstentRoutes.buyTag)}
              >
                <ListItemPrefix>
                  <FaHashtag className="h-4 w-4" />
                </ListItemPrefix>
                Buy Name Tag
              </ListItem>
            </div>
            <div className="flex gap-6 ">
              <div
                className={`${activeThree ? "bg-secondary" : "bg-white"
                  }  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
              />
              <ListItem
                className={`py-4 ${activeThree ? " bg-secondary text-white" : ""
                  } focus:bg-secondary focus:text-white`}
                onClick={() => navigate(ConstentRoutes.manageTagName)}
              >
                <ListItemPrefix>
                  <BsFire className="h-4 w-4" />
                </ListItemPrefix>
                Manage Tag Name
              </ListItem>
            </div>
            <div className="flex gap-6 ">
              <div className=" bg-white w-2 h-full rounded-tr-[10px] rounded-br-[10px]" />
              <ListItem className="py-4">
                <ListItemPrefix>
                  <ImStatsDots className="h-4 w-4" />
                </ListItemPrefix>
                Statistics
              </ListItem>
            </div>
            <div className="flex gap-6 ">
              <div
                className={`${activeVoiceMail ? "bg-secondary" : "bg-white"
                  }  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
              />
              <ListItem
                className={`py-4 ${activeVoiceMail ? " bg-secondary text-white" : ""
                  } focus:bg-secondary focus:text-white`}
                onClick={() => navigate(ConstentRoutes.voiceMail)}
              >
                <ListItemPrefix>
                  <FaMicrophone className="h-4 w-4" />
                </ListItemPrefix>
                Voice mail
              </ListItem>
            </div>
            <div className="flex gap-6 ">
            <div
                className={`${activeProfile ? "bg-secondary" : "bg-white"
                  }  w-2 h-full rounded-tr-[10px] rounded-br-[10px]`}
              />
              <ListItem
                className={`py-4 ${activeProfile ? " bg-secondary text-white" : ""
                  } focus:bg-secondary focus:text-white`}
                onClick={() => navigate(ConstentRoutes.profilePage)}
              >
                <ListItemPrefix>
                  <FaUser className="h-4 w-4" />
                </ListItemPrefix>
                Profile
              </ListItem>
            </div>
            <div className="flex gap-6 ">
              <div className=" bg-white w-2 h-full rounded-tr-[10px] rounded-br-[10px]" />
              <ListItem className="text-[#FF4842] py-4" onClick={handleLogOut}>
                <ListItemPrefix>
                  <IoLogOutSharp className="h-4 w-4" />
                </ListItemPrefix>
                Log Out
              </ListItem>
            </div>
          </List>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
