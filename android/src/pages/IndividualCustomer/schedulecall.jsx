import { useEffect, useState } from "react";
import {
  Button,
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
import { useTranslation } from "react-i18next";

const SchedulecallCustomer = () => {
  const { t } = useTranslation(["schedule"]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.error(t("manageIncomingCalls.toastMessages.errorLoading"));
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

        toast.success(response?.message || (desiredStatus ? t("manageIncomingCalls.toastMessages.serviceActivated") : t("manageIncomingCalls.toastMessages.serviceDeactivated")));
      } else {
        toast.error(response?.message || t("manageIncomingCalls.toastMessages.failedToUpdate"));
      }
    } catch (error) {
      console.error("Error updating service status:", error);
      toast.error(t("manageIncomingCalls.toastMessages.errorUpdating"));
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
          {t("manageIncomingCalls.title")}
        </Typography>
        <div className="flex justify-center items-center p-12">
          <Spinner className="h-12 w-12" color="green" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid rounded-xl bg-white shadow grid-cols-1 gap-x-6 gap-y-6 pb-6 max-w-4xl">
      <Typography className="text-gray-800 p-3 px-6 border-b text-lg font-bold">
        {t("manageIncomingCalls.title")}
      </Typography>

      {(tagData?.[0]?.type == "reserve" || tagData?.[0]?.status != 1) ? (
        <div className="container px-6 pt-4 max-w-full">
          <p>{t("manageIncomingCalls.emptyState")}</p>
        </div>
      ) : (
        <div className="container px-6 max-w-full">
          {tagData[0] ? (
            <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow pb-6 mt-1">
              <div className="flex flex-wrap gap-4 pb-6">
                <div className="flex gap-4 p-3 rounded-lg shadow border border-gray-100">
                  <Typography className="font-medium text-sm md:text-base text-gray-700">
                    {t("manageIncomingCalls.labels.nameTag")}
                  </Typography>
                  <Typography className="text-sm md:text-base font-medium text-gray-800">
                    #{tagData[0]?.tag_no}
                  </Typography>
                </div>
                <div className="flex gap-4 p-3 rounded-lg shadow border border-gray-100">
                  <Typography className="text-sm md:text-base font-medium text-gray-700">
                    {t("manageIncomingCalls.labels.mobileNumber")}
                  </Typography>
                  <Typography className="text-sm md:text-base font-medium text-gray-800">
                    {formatPhoneNumberCustom(userData?.phone_number)}
                  </Typography>
                </div>
              </div>

              <div className="my-6">
                {statusNew == 1 ?
                  <Typography className="text-xs text-gray-700">
                    {t("manageIncomingCalls.status.currentStatus")}<b className="font-semibold"> {t("manageIncomingCalls.status.on")}</b><br />
                    {t("manageIncomingCalls.status.stopInfo")}
                  </Typography>
                  :
                  <Typography className="text-xs text-gray-700">
                    {t("manageIncomingCalls.status.currentStatus")} <b className="font-semibold">{t("manageIncomingCalls.status.stopped")}</b> <br />{t("manageIncomingCalls.status.stoppedInfo")}
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
                  className={`${statusNew==1?" bg-red-500":"bg-secondary"} text-white px-8 py-2 capitalize font-normal text-sm`}
                  onClick={handleApply}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner size="sm" className="h-4 w-4" /> {t("manageIncomingCalls.buttons.processing")}
                    </div>
                  ) : statusNew == 1 ? t("manageIncomingCalls.buttons.stopCalls") : t("manageIncomingCalls.buttons.startCalls")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 border border-gray-200 rounded-2xl bg-white shadow pb-6 mt-1">
              <Typography className="text-center text-gray-700">
                {t("manageIncomingCalls.emptyState")}
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmation} size="sm" handler={setOpenConfirmation}>
        <DialogHeader className=" text-xl">
          {t("manageIncomingCalls.modal.title")}
        </DialogHeader>
        <DialogBody>
          {serviceStatus ? (
            <Typography className="text-gray-700">
              {t("manageIncomingCalls.modal.confirmStop")}
            </Typography>
          ) : (
            <Typography className="text-gray-700">
              {t("manageIncomingCalls.modal.confirmStart")}
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="d-flex justify-end gap-3">
          <Button
            className="py-2.5 bg-gray-300  w-fit text-gray-800 shadow-none hover:shadow-none"
            onClick={handleCancelStatusChange}
          >
            {t("manageIncomingCalls.buttons.cancel")}
          </Button>
          <Button
            className="py-2.5 bg-secondary  w-fit text-white shadow-none hover:shadow-none"
            onClick={handleConfirmStatusChange}
          >
            {t("manageIncomingCalls.buttons.confirm")}
          </Button>

        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default SchedulecallCustomer;