import { useEffect, useState } from "react"
import APICall from "../../network/APICall";
import { toast } from "react-toastify";
import EndPoints from "../../network/EndPoints";
import moment from "moment";

const useSchedularHook = (value) => {
    const [data, setData] = useState([])
    const [CompleteResponse, setCompleteResponse] = useState([])
    const [buyData, setBuyData] = useState([])
    const [incommingCallStatus, setincommingCallStatus] = useState(false)
    const [loading, setLoading] = useState(true)
    const [serverStatus, setServiceStatus] = useState([])
    const docStatus = JSON.parse(localStorage.getItem('data'))
    const getData = () => {
        const user = JSON.parse(localStorage.getItem("user"))
        const accountId = user?.parent_id != null && user?.parent?.customer_account_id
            ? user.parent.customer_account_id
            : user?.customer_account_id;
        setLoading(true)
        const params = {
            msisdn: user?.phone_number
        }
        APICall("get", user?.parent_id != null ? params : null, `${EndPoints.customer.getReserve}/${accountId}`)
            .then((res) => {
                if (res?.success) {
                    setData(res?.data);
                    setCompleteResponse(res)
                } else {
                    toast.error(res?.message);
                }
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
            });

        APICall("get", user?.parent_id != null ? params : null, `${EndPoints.customer.getSchedular}?account_id=${user?.id}`)
            .then((res) => {
                if (res?.success) {

                    setincommingCallStatus(res.data[0].incoming_call_status)
                    setBuyData(res?.data);
                    setServiceStatus(res?.data)
                } else {
                    toast.error(res?.message);
                }
                setLoading(false)
            })
            .catch((err) => {
                setBuyData([])
                setLoading(false)
            });
    }
    useEffect(() => {
        getData()
    }, [])

    const handleSchedular = (item) => {
        const payload = {
            incoming_call_status: item?.incoming_call_status,
            incall_start_dt: item?.incoming_call_status == 0 ? "0000-00-00 00:00:00" : moment(item?.incall_start_dt).format("YYYY-MM-DD HH:mm:ss"),
            incall_end_dt: item?.incoming_call_status == 0 ? "0000-00-00 00:00:00" : moment(item?.incall_end_dt).format("YYYY-MM-DD HH:mm:ss"),
            voic_email: item?.voic_email,
            service_status: item?.service_status
        }
        APICall("put", payload, `${EndPoints.customer.getSchedular}/${item?.corp_subscriber_id}`)
            .then((res) => {
                toast.success(res?.message)
                getData()
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

    return { data, loading, setData, CompleteResponse, setCompleteResponse, handleSchedular, buyData, serverStatus, incommingCallStatus }
}

export default useSchedularHook