
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import React from "react";

const BuyNametag = () => {
  return (
    <div className="main">
      <div className="bg-secondary py-6">
        <h1 className="text-center text-[36px] text-white font-bold">
          Corporate Name TAG
        </h1>
      </div>
      <div className="">
        <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <div className="mb-2 p-4">
            <Typography variant="h5" color="blue-gray">
              Sidebar
            </Typography>
          </div>
          <List>
            <ListItem>
           
              Dashboard
            </ListItem>
            <ListItem>
             
              E-Commerce
            </ListItem>
            <ListItem>
           
              Inbox
              <ListItemSuffix>
                <Chip
                  value="14"
                  size="sm"
                  variant="ghost"
                  color="blue-gray"
                  className="rounded-full"
                />
              </ListItemSuffix>
            </ListItem>
            <ListItem>
              
              Profile
            </ListItem>
            <ListItem>
            
              Settings
            </ListItem>
            <ListItem>
          
              Log Out
            </ListItem>
          </List>
        </Card>
      </div>
    </div>
  );
};

export default BuyNametag;
