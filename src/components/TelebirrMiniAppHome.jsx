import { useEffect } from "react";
import Home2Page from "../pages/home2";
import { saveTelebirrMiniAppChannel } from "../utilities/telebirrMiniAppChannel";

/** Captures mini-app channel from route, renders home (no redirect). */
const TelebirrMiniAppHome = ({ channel }) => {
  useEffect(() => {
    saveTelebirrMiniAppChannel(channel);
  }, [channel]);

  return <Home2Page />;
};

export default TelebirrMiniAppHome;
