/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  let userData = {};
  userData = useAppSelector((state) => state.user.userData);

  if (userData == null || userData == undefined) {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      userData = JSON.parse(localUser);
    }
  }

  useEffect(() => {
    if (userData?.parent_id != null) {
      // Redirect to previous route if user has parent_id
      navigate(-1);
    }
  }, [userData?.parent_id, navigate]);

  // If user has parent_id, don't render the children
  if (userData?.parent_id != null) {
    return null;
  }

  return children;
};

export default ProtectedRoute;

