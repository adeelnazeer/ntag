import { useEffect, useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";

export const useTagList = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1 });
  const [metaData, setMetaData] = useState(null);
  const [filters, setFilters] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    APICall("get", pagination, EndPoints.customer.corp)
      .then((res) => {
        setData(res?.data || []);
        setMetaData(res?.meta);
        setLoading(false)
      })
      .catch((err) => {
        console.log("err", err);
        setLoading(false)
      });
  }, [pagination]);

  useEffect(() => {
    APICall("get", pagination, EndPoints.customer.getFilter)
      .then((res) => {
        setFilters(res?.data)
      })
      .catch((err) => {
        setFilters([])
      });
  }, [])

  const handleTagDetails = (data, setOpenModal) => {
    APICall("post", data, EndPoints.customer.buytags)
      .then((res) => {
        if (res?.success) {
          toast.success(res?.message || "");
          setOpenModal(true)
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.message)
        console.log("err", err);
      });
  };

  return { data, setPagination,filters, pagination, metaData, handleTagDetails, loading };
};
