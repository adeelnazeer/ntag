import { useEffect, useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";


export const useVoiceMailHook = () => {
  const [voiceMail, setVoiceMail] = useState();
  const [loading, setLoading] = useState(true)
  const handleGetVoiceMail = () => {
    APICall("get", null, EndPoints.customer.getVoiceMail)
      .then((res) => {
        if (res?.success) {
          setVoiceMail(res);
        } else {
          toast.error(res?.message);
        }
        setLoading(false)
      })
      .catch((err) => {
        toast.error(err)
        setLoading(false)
      });
  };

  useEffect(() => {
    handleGetVoiceMail()
  }, [])

  return {
    handleGetVoiceMail,
    voiceMail,
    loading
  };
};
