import { useEffect, useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";

export const useTagList = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1 });
  const [metaData, setMetaData] = useState(null);
  useEffect(() => {
    APICall("get", pagination, EndPoints.customer.corp)
      .then((res) => {
        setData(res?.data || []);
        setMetaData(res?.meta);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [pagination]);

  const handleTagDetails = (data) => {
    const payLoad = {
      username: data?.username,
      password: data?.password,
      channel: "channel",
    };
    APICall("post", payLoad, EndPoints.buytags)
      .then((res) => {
        console.log(res,"res")
        if (res?.success) {
          toast.success(res?.message || "");
          const token = res?.data?.token;
          localStorage.setItem("token", token);
          navigate('/dashboard')
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return { data, setPagination, pagination, metaData,handleTagDetails };
};
