import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import { MdHomeFilled } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { BsFire } from "react-icons/bs";
import { ImStatsDots } from "react-icons/im";
import { FaUser } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className="main">
      <div className="">
        <Card className="h-[calc(100vh-6rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <List className="text-[16px] font-normal text-black ">
            <ListItem className="py-6">
              <ListItemPrefix>
                <MdHomeFilled className="h-5 w-5" />
              </ListItemPrefix>
              Dashboard
            </ListItem>
            <ListItem className="py-6">
              {" "}
              <ListItemPrefix>
                <FaHashtag className="h-4 w-4" />
              </ListItemPrefix>
              Buy Name Tag
            </ListItem>
            <ListItem className="py-6">
              <ListItemPrefix>
                <BsFire className="h-4 w-4" />
              </ListItemPrefix>
              Manage Tag Name
            </ListItem>
            <ListItem className="py-6">
              <ListItemPrefix>
                <ImStatsDots className="h-4 w-4" />
              </ListItemPrefix>
              Statistics
            </ListItem>
            <ListItem className="py-6">
              {" "}
              <ListItemPrefix>
                <FaMicrophone className="h-4 w-4" />
              </ListItemPrefix>
              Voice mail
            </ListItem>
            <ListItem className="py-6">
              {" "}
              <ListItemPrefix>
                <FaUser className="h-4 w-4" />
              </ListItemPrefix>
              Profile
            </ListItem>
            <ListItem className="text-[#FF4842] py-6">
              <ListItemPrefix>
                <IoLogOutSharp className="h-4 w-4" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
