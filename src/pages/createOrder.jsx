import { useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import APICall from "../network/APICall"
import { toast } from "react-toastify"

const CreateOrder = () => {
    const location = useLocation()
    console.log(location?.search)
    localStorage.setItem("query", location?.search)
    useEffect(() => {
        APICall("post", location?.search, "/customer/callBack")
            .then((res) => {
                if (res?.success) {
                    toast.error("Order Created successfully");
                } else {
                    toast.error(res?.message);
                }
            })
            .catch((err) => {
                toast.error(err?.message)
            });
    }, [])
    return (
        <div>
            {location?.search}
        </div>
    )
}

export default CreateOrder