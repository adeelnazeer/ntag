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

  return { data, setPagination, pagination, metaData };
};
