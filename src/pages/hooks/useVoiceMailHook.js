import { useState } from "react";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";


export const useVoiceMailHook = () => {

  const [voiceMail, setVoiceMail] = useState();


  const handleGetVoiceMail = () => {
    APICall("get",voiceMail, EndPoints.customer.getVoiceMail)
      .then((res) => {
        console.log(res,"res")
        if (res?.success) {

          setVoiceMail(res?.data);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return {
    handleGetVoiceMail,
    voiceMail
  };
};
