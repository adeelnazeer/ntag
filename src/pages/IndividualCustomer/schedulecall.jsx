import React, { useEffect, useState } from "react";
import {
  Button,
  Switch,
  Typography,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import { formatPhoneNumberCustom } from "../../utilities/formatMobileNumber";
import { useAppSelector } from "../../redux/hooks";
import { toast } from "react-toastify";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";

const SchedulecallCustomer = () => {
  const [serviceStatus, setServiceStatus] = useState(false);
  const [statusNew, setStatusNew] = useState("")
  const [loading, setLoading] = useState(false);
  const [tagData, setTagData] = useState({});
  const [fetchingData, setFetchingData] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [desiredStatus, setDesiredStatus] = useState(false);

  // Get user info
  let userData = useAppSelector(state => state?.user?.userData);
  if (!userData) {
    userData = JSON.parse(localStorage.getItem('user'));
  }

  useEffect(() => {
    fetchTagInfo();
  }, []);

  const fetchTagInfo = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setFetchingData(true);
      const response = await APICall("get", null, `${EndPoints.customer.getReserveTagsCustomer}/${user?.id}`);
      if (response?.success && response?.data) {
        setTagData(response?.data);

        // Set initial service status if available in response
        if (response.data[0]) {
          const status = response.data[0].service_status === 1;
          setServiceStatus(status);
          setStatusNew(response?.data?.[0]?.service_status)


          // Store service status in localStorage for sidebar to use
          localStorage.setItem('serviceStatus', response.data[0].service_status);

          // Trigger storage event to notify other components
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch (error) {
      console.error("Error fetching TAG info:", error);
      toast.error("Error loading TAG information");
    } finally {
      setFetchingData(false);
    }
  };

  const handleApply = () => {
    // Set the desired status (opposite of current status)
    setDesiredStatus(!serviceStatus);

    // Open confirmation dialog
    setOpenConfirmation(true);
  };

  const handleConfirmStatusChange = async () => {
    setLoading(true);
    setOpenConfirmation(false);

    try {
      const payload = {
        onoff_service: statusNew == 1 ? 0 : 1,
        msisdn: userData?.phone_number
      };

      const response = await APICall("post", payload, EndPoints.customer.IndividualPostSchedular);

      if (response?.success) {
        // Update service status
        setServiceStatus(desiredStatus);
        fetchTagInfo()
        // Update localStorage for sidebar
        localStorage.setItem('serviceStatus', desiredStatus ? 1 : 0);

        // Trigger storage event to notify other components
        window.dispatchEvent(new Event('storage'));

        toast.success(response?.message || `Service ${desiredStatus ? "activated" : "deactivated"} successfully`);
      } else {
        toast.error(response?.message || "Failed to update service status");
      }
    } catch (error) {
      console.error("Error updating service status:", error);
      toast.error("Error updating service status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelStatusChange = () => {
    setOpenConfirmation(false);
  };

  if (fetchingData) {
    return (
      <div className="grid rounded-xl bg-white shadow grid-cols-1 gap-x-6 gap-y-6 pb-6 max-w-4xl mx-auto">
        <Typography className="text-gray-800 p-3 px-6 border-b text-lg font-bold">
          Manage Incoming Calls
        </Typography>
        <div className="flex justify-center items-center p-12">
          <Spinner className="h-12 w-12" color="green" />
        </div>
      </div>
    );
  }

  console.log({ tagData })

  return (
    <div className="grid rounded-xl bg-white shadow grid-cols-1 gap-x-6 gap-y-6 pb-6 max-w-4xl">
      <Typography className="text-gray-800 p-3 px-6 border-b text-lg font-bold">
        Manage Incoming Calls
      </Typography>

      {(tagData?.[0]?.type == "reserve" || tagData?.[0]?.status != 1) ? (
        <div className="container px-6 pt-4 max-w-full">
          <p>No active NameTAG is linked to your mobile number.</p>
        </div>
      ) : (
        <div className="container px-6 max-w-full">
          {tagData[0] ? (
            <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow pb-6 mt-1">
              <div className="flex flex-wrap gap-4 pb-6">
                <div className="flex gap-4 p-3 rounded-lg shadow border border-gray-100">
                  <Typography className="font-medium text-sm md:text-base text-gray-700">
                    NameTAG:
                  </Typography>
                  <Typography className="text-sm md:text-base font-medium text-gray-800">
                    #{tagData[0]?.tag_no}
                  </Typography>
                </div>
                <div className="flex gap-4 p-3 rounded-lg shadow border border-gray-100">
                  <Typography className="text-sm md:text-base font-medium text-gray-700">
                    Mobile Number:
                  </Typography>
                  <Typography className="text-sm md:text-base font-medium text-gray-800">
                    {formatPhoneNumberCustom(userData?.phone_number)}
                  </Typography>
                </div>
              </div>

              <div className="my-6">
                {statusNew == 1 ?
                  <Typography className="text-xs text-gray-700">
                    Your current incoming call status is:<b className="font-semibold"> ON</b><br />
                    If you choose to stop incoming calls, you will not receive any incoming calls for the next 15 days.
                  </Typography>
                  :
                  <Typography className="text-xs text-gray-700">
                    Your current incoming call status is: <b className="font-semibold">Stopped</b> <br />You will not receive any incoming calls for 15 days from the date the service was stopped
                  </Typography>
                }
                {/* <Typography className="text-xs text-gray-700 mt-2">
                  Service Status • <span className={serviceStatus ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                    {serviceStatus ? "ON" : "OFF"}
                  </span>
                </Typography> */}
              </div>

              {/* <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Typography className="text-sm font-medium text-gray-700">
                    Service Status
                  </Typography>
                </div>
                <Switch
                  className="checked:bg-secondary"
                  checked={serviceStatus}
                  onChange={(e) => {
                    // Just update the visual state, but don't apply changes until confirmed
                    setServiceStatus(e.target.checked);
                  }}
                  disabled={loading}
                />
              </div> */}

              <div className="mt-6">
                <Button
                  className="bg-secondary text-white px-8 py-2 capitalize font-normal text-sm"
                  onClick={handleApply}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" className="h-4 w-4" /> Processing...
                    </div>
                  ) : statusNew == 1 ? "Stop Calls" : "Start Calls"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow pb-6 mt-1">
              <Typography className="text-center text-gray-700">
                No active NameTAG is linked to your mobile number.
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmation} size="sm" handler={setOpenConfirmation}>
        <DialogHeader className=" text-xl">
          { "Confirmation?"}
        </DialogHeader>
        <DialogBody>
          {serviceStatus ? (
            <Typography className="text-gray-700">
              Please confirm to Stop your incoming calls.
            </Typography>
          ) : (
            <Typography className="text-gray-700">
              Please confirm to Start receiving incoming calls.
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="d-flex justify-end gap-3">
          <Button
            className="py-2.5 bg-gray-300  w-fit text-gray-800 shadow-none hover:shadow-none"
            onClick={handleCancelStatusChange}
          >
            Cancel
          </Button>
          <Button
            className="py-2.5 bg-secondary  w-fit text-white shadow-none hover:shadow-none"
            onClick={handleConfirmStatusChange}
          >
            {"Confirm"}
          </Button>

        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default SchedulecallCustomer;