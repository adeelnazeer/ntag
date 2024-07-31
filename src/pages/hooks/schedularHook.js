import { useEffect, useState } from "react"
import APICall from "../../network/APICall";
import { toast } from "react-toastify";
import EndPoints from "../../network/EndPoints";
import moment from "moment";

const useSchedularHook = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const user=JSON.parse(localStorage.getItem("user"))
        setLoading(true)
        APICall("get", null, `${EndPoints.customer.getSchedular}?account_id=${user?.id}`)
            .then((res) => {
                console.log(res, "res")
                if (res?.success) {
                    setData(res?.data);
                } else {
                    toast.error(res?.message);
                }
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
            });
    }, [])

    const handleSchedular = (item) => {
        const payload = {
            incoming_call_status: item?.incoming_call_status,
            incall_start_dt: moment(item?.incall_start_dt).format("YYYY-MM-DD hh:mm:ss"),
            incall_end_dt: moment(item?.incall_end_dt).format("YYYY-MM-DD hh:mm:ss"),
            voic_email: item?.voic_email
        }
        APICall("put", payload, `${EndPoints.customer.getSchedular}/${item?.corp_subscriber_id}`)
            .then((res) => {
                console.log(res, "res")
                // if (res?.success) {

                //     setData(res?.data);
                // } else {
                //     toast.error(res?.message);
                // }

            })
            .catch((err) => {
                console.log("err", err);
            });
    }

    return { data, loading, setData, handleSchedular }
}

export default useSchedularHook