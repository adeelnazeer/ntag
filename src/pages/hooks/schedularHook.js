import { useEffect, useState } from "react"
import APICall from "../../network/APICall";
import { toast } from "react-toastify";
import EndPoints from "../../network/EndPoints";
import moment from "moment";

const useSchedularHook = (value) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const docStatus = JSON.parse(localStorage.getItem('data'))
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        setLoading(true)
        if (docStatus?.doc_approval_status == 0) {
            APICall("get", null, `${EndPoints.customer.getReserve}/${user?.customer_account_id}`)
                .then((res) => {
                    console.log(res, "res ddjjd")
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

        } else {
            APICall("get", null, `${EndPoints.customer.getSchedular}?account_id=${user?.id}`)
                .then((res) => {
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
        }
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
                toast.success(res?.message)
                console.log(res, "res")
                // if (res?.success) {

                //     setData(res?.data);
                // } else {
                //     toast.error(res?.message);
                // }

            })
            .catch((err) => {
                toast.error(err)
                console.log("err", err);
            });
    }

    return { data, loading, setData, handleSchedular }
}

export default useSchedularHook