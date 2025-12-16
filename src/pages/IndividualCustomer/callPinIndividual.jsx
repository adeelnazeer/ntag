/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { Typography, Button, Spinner } from "@material-tailwind/react";
import { useAppSelector } from "../../redux/hooks";
import APICall from "../../network/APICall";
import EndPoints from "../../network/EndPoints";
import { toast } from "react-toastify";
import { formatPhoneNumberCustom } from "../../utilities/formatMobileNumber";
import { IoMdCloseCircle } from "react-icons/io";
import PhoneInput from "react-phone-number-input"; // Import PhoneInput
import { useTranslation } from "react-i18next";

const CallPinPageIndividual = () => {
  const { t } = useTranslation(["blockPage"]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState({ show: false });
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingNumber, setAddingNumber] = useState(false);
  const [deletingNumber, setDeletingNumber] = useState(false);
  const [blockType, setBlockType] = useState("mobileNumber"); // 'mobileNumber' or 'tagNumber'
  const [valueToBlock, setValueToBlock] = useState("+2519"); // Initialize with country code
  const [phoneError, setPhoneError] = useState(""); // For validation errors
  const [tagStatus, setTagStatus] = useState("loading"); // "active", "reserve", "none"
  const [reserveData, setReserveData] = useState([]);
  const [showAddWhiteList, setShowAddWhiteList] = useState(false);
  const [pinState, setPinState] = useState({
    pin: "",
    error: false,
  });

  let userData = useAppSelector((state) => state?.user?.user);
  if (!userData) {
    userData = JSON.parse(localStorage.getItem("user"));
  }

  const fetchWhitelistNumber = async () => {
    try {
      setLoading(true);
      // Remove "+" from the beginning if present
      const formattedMsisdn = userData?.phone_number?.replace(/^\+/, "");

      const response = await APICall(
        "get",
        null,
        `${EndPoints.customer.getWhiteListNumberIndividual}?msisdn=${formattedMsisdn}`
      );

      if (response?.success && response?.data) {
        const blockedNumbers = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setNumbers(blockedNumbers);
      } else {
        toast.error(response?.message || t("errors.fetchWhitelist"));
        setNumbers([]);
      }
    } catch (error) {
      toast.error(error?.message || t("errors.loadWhitelist"));
      setNumbers([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has an active TAG or only a reserved TAG
  const checkTagStatus = async () => {
    setLoading(true);
    try {
      const accountId = userData?.id;
      if (!accountId) {
        setTagStatus("none");
        return;
      }

      // Fetch user's TAGs
      const response = await APICall(
        "get",
        null,
        `${EndPoints.customer.getReserveTagsCustomer}/${accountId}`
      );

      if (response?.success && response?.data) {
        const userTags = Array.isArray(response.data)
          ? response.data
          : [response.data];

        // Check if there's at least one active TAG (not just reserved)
        const hasActiveTag = userTags.some(
          (tag) => tag.payment_status !== 0 && tag.type !== "reserve"
        );

        const reserve = userTags?.filter(
          (x) => x?.payment_status !== 0 && x.type !== "reserve"
        );
        setReserveData(reserve);

        // Check if there's at least one reserved TAG
        const hasReservedTag = userTags.some((tag) => tag.type === "reserve");

        if (hasActiveTag) {
          setTagStatus("active");
          fetchWhitelistNumber();
        } else if (hasReservedTag) {
          setTagStatus("reserve");
        } else {
          setTagStatus("none");
        }
      } else {
        // No TAGs found
        setTagStatus("none");
        setReserveData([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error checking TAG status:", error);
      setTagStatus("error");
      setReserveData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch mobile numbers first
    checkTagStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset valueToBlock and validation states when changing block type
  useEffect(() => {
    if (blockType === "mobileNumber") {
      setValueToBlock("+2519"); // Set default country code for mobile numbers
      setPhoneError(""); // Clear any error messages
    } else {
      setValueToBlock(""); // Clear for TAG numbers
      setPhoneError(""); // Clear any error messages
    }
  }, [blockType]);

  const handleDelete = (number) => {
    setSelectedNumber(number);
    setShowConfirmDialog(true);
  };

  const confirmDeleteWhiteList = async () => {
    try {
      setDeletingNumber(true);
      const deleteResponse = await APICall(
        "delete",
        null,
        `${EndPoints.customer.deleteWhiteListIndividual(selectedNumber.id)}`
      );

      if (deleteResponse?.success) {
        toast.success(deleteResponse?.message || "");
        fetchWhitelistNumber();
        checkTagStatus();
      } else {
        toast.error(deleteResponse?.message || "");
      }
    } catch (error) {
      console.error("Error deleting blocked number:", error);
      toast.error(error?.message || t("errors.removeWhitelist"));
    } finally {
      setDeletingNumber(false);
      setShowConfirmDialog(false);
    }
  };

  const handleAddToBlocklist = (value) => {
    setShowAddDialog((st) => ({
      ...st,
      show: true,
      value: value,
    }));
    setBlockType("mobileNumber");
    setValueToBlock("+2519"); // Set default country code when opening modal
    setPhoneError(""); // Clear any error messages
  };

  // Function to validate phone number
  const validatePhoneNumber = (phone) => {
    if (!phone) {
      setPhoneError(t("errors.required"));
      return false;
    }

    // Check if the number starts with +251
    if (!phone.startsWith("+251")) {
      setPhoneError(t("errors.mustStartCountry"));
      return false;
    }

    const cleanNumber = phone.replace("+251", "").replace(/\s/g, "");

    if (!cleanNumber.startsWith("9")) {
      setPhoneError(t("errors.mustStart9"));
      return false;
    }

    if (cleanNumber.length !== 9) {
      setPhoneError(t("errors.length"));
      return false;
    }

    // All validations passed
    setPhoneError("");
    return true;
  };

  const setCallPin = async () => {
    try {
      setAddingNumber(true);
      const msisdnFormatted = userData?.phone_number?.replace(/^\+/, "");

      const payload = {
        msisdn: msisdnFormatted,
        callpin: showAddDialog?.value == "remove" ? -1 : pinState?.pin,
      };
      const response = await APICall(
        "post",
        payload,
        EndPoints.customer.setCallpinIndividual
      );
      if (response?.success) {
        toast.success(response?.message);
        // // fetchWhitelistNumber(selectedMsisdn); // Refresh the list
        setShowAddDialog({ show: false });
        fetchWhitelistNumber();
        setValueToBlock("+2519");
        checkTagStatus();
        setPinState({ pin: "", error: false });
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error?.message || t("errors.loadWhitelist"));
    } finally {
      setAddingNumber(false);
    }
  };

  const addNumberWhiteList = async () => {
    if (phoneError) {
      toast.error(phoneError);
      return;
    }
    try {
      setAddingNumber(true);
      const msisdnFormatted = userData?.phone_number?.replace(/^\+/, "");
      const whiteListNumber = valueToBlock.replace(/^\+/, "");
      const payload = {
        msisdn: msisdnFormatted,
        aparty_no: whiteListNumber,
        channel: "WEB",
        customer_type: "individual",
      };
      const response = await APICall(
        "post",
        payload,
        EndPoints.customer.addWhiteListIndividual
      );
      if (response?.success) {
        toast.success(response?.message);
        // // fetchWhitelistNumber(selectedMsisdn); // Refresh the list
        setShowAddWhiteList(false);
        fetchWhitelistNumber();
        setPhoneError("");
        setValueToBlock("+2519");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error || error?.message || t("errors.addWhitelist"));
    } finally {
      setAddingNumber(false);
    }
  };

  useEffect(() => {
    if (reserveData?.length > 0) {
      setPinState((st) => ({
        ...st,
        pin: reserveData?.[0]?.callpin?.toString(),
        error: false,
      }));
    }
  }, [reserveData]);

  return (
    <div className="bg-white rounded-xl shadow pb-6">
      <div className="flex flex-col">
        <Typography className="block antialiased text-[#1F1F2C] p-3 px-6 border-b text-md font-medium">
          {t("callPinPage.title")}
        </Typography>

        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <Typography className="block  text-[#1F1F2C] text-xs ">
              {t("callPinPage.labels.mobileNumber")}{" "}
              {formatPhoneNumberCustom(userData?.phone_number)}
            </Typography>
            {reserveData?.[0]?.callpin > 0 && (
              <Typography className="block mt-2  text-[#1F1F2C] text-xs ">
                {t("callPinPage.labels.currentPin")} {reserveData?.[0]?.callpin}
              </Typography>
            )}
          </div>
          <div className=" flex gap-2 items-center">
            <Button
              onClick={() => handleAddToBlocklist("set")}
              size="sm"
              disabled={tagStatus != "active"}
              className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
            >
              {t("callPinPage.buttons.setPin")}
            </Button>
            {reserveData?.[0]?.callpin > 0 && (
              <Button
                onClick={() => handleAddToBlocklist("remove")}
                size="sm"
                disabled={tagStatus != "active"}
                className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
              >
                {t("callPinPage.buttons.removePin")}
              </Button>
            )}
            <Button
              onClick={() => {
                setShowAddWhiteList(true);
              }}
              size="sm"
              disabled={tagStatus != "active" || reserveData?.[0]?.callpin < 1}
              className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
            >
              <BiPlusCircle className="w-4 h-4" />
              {t("callPinPage.buttons.addWhitelist")}
            </Button>
          </div>
        </div>

        <div className="px-4 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Spinner className="h-8 w-8 text-secondary" />
            </div>
          ) : (
            <table className="min-w-full bg-white">
              <thead className="bg-[#F6F7FB]">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    {t("callPinPage.table.headers.sr")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    {t("callPinPage.table.headers.nameTag")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    {t("callPinPage.table.headers.whitelistNumber")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    {t("callPinPage.table.headers.whitelistDate")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    {t("callPinPage.table.headers.pin")}
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-[#7A798A]">
                    {t("callPinPage.table.headers.action")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {numbers?.length > 0 ? (
                  numbers?.map((number, index) => (
                    <tr key={number.id}>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        #{number?.subscriber?.tagno || ""}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {formatPhoneNumberCustom(number?.aparty_no || "")}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {number?.created_at || ""}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {number?.subscriber?.callpin > 0
                          ? number?.subscriber?.callpin
                          : "" || ""}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            onClick={() => handleDelete(number)}
                            className=" bg-red-500"
                          >
                            {t("callPinPage.table.actions.delete")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {reserveData?.[0]?.callpin < 1 ? (
                      <td
                        colSpan="6"
                        className="py-6 px-4 text-center text-sm text-[#7A798A]"
                      >
                        {t("callPinPage.table.empty.noPin")}
                      </td>
                    ) : reserveData?.length == 0 ? (
                      <td
                        colSpan="6"
                        className="py-6 px-4 text-center text-sm text-[#7A798A]"
                      >
                        {t("callPinPage.table.empty.noActiveLinked")}
                      </td>
                    ) : (
                      <td
                        colSpan="6"
                        className="py-6 px-4 text-center text-sm text-[#7A798A]"
                      >
                        {t("callPinPage.table.empty.noWhitelist")}
                      </td>
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Dialog - Custom Modal Style */}
      {showConfirmDialog && (
        <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
            <div
              className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmDialog(false)}
            >
              <IoMdCloseCircle />
            </div>

            <div className="mt-4 text-center">
              <Typography variant="h5" className="font-bold text-gray-900">
                {t("callPinPage.confirmRemoval.title")}
              </Typography>

              <Typography className="mt-2 text-sm text-gray-600">
                {t("callPinPage.confirmRemoval.description", {
                  number: selectedNumber?.aparty_no || "",
                })}
              </Typography>
              <Typography className="mt-2 text-sm text-gray-600">
                {t("callPinPage.confirmRemoval.hint")}
              </Typography>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => setShowConfirmDialog(false)}
                disabled={deletingNumber}
              >
                {t("callPinPage.buttons.cancel")}
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={confirmDeleteWhiteList}
                disabled={deletingNumber}
              >
                {deletingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" />{" "}
                    {t("callPinPage.buttons.removing")}
                  </div>
                ) : (
                  t("callPinPage.buttons.confirm")
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Number Dialog - Custom Modal Style */}
      {showAddDialog?.show && (
        <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
            <div
              className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddDialog({ show: false })}
            >
              <IoMdCloseCircle />
            </div>

            <div className="mt-4 text-center">
              <Typography variant="h5" className="font-bold text-gray-900">
                {showAddDialog?.value === "remove"
                  ? t("callPinPage.modalPin.removeTitle")
                  : t("callPinPage.modalPin.setTitle")}
              </Typography>

              <Typography className="mt-2 text-sm text-left text-gray-600">
                {showAddDialog?.value === "remove"
                  ? t("callPinPage.modalPin.descRemove")
                  : t("callPinPage.modalPin.descSet")}
                <br />
                <br />
                {t("callPinPage.modalPin.nameTag", {
                  tag: reserveData?.[0]?.tag_no || t("callPinPage.common.na"),
                })}
                <br />
                {t("callPinPage.modalPin.mobileNumber", {
                  number: userData?.phone_number || t("callPinPage.common.na"),
                })}
                <br />
                <span>
                  {t("callPinPage.modalPin.currentPin", {
                    pin:
                      reserveData?.[0]?.callpin > 0
                        ? reserveData?.[0]?.callpin
                        : t("callPinPage.modalPin.notDefined"),
                  })}
                  <br />
                </span>
              </Typography>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                {showAddDialog?.value === "remove" ? (
                  <Typography className="mt-2 text-sm text-left font-medium text-primary">
                    {t("callPinPage.modalPin.noteNoPin")}
                  </Typography>
                ) : (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#7A798A]">
                      {t("callPinPage.modalPin.selectSingleDigit")}
                    </label>
                    <div>
                      <select
                        className="mt-2 w-full rounded-xl px-4 py-2 bg-white outline-none border border-[#8A8AA033]"
                        style={
                          pinState?.error
                            ? { border: "1px solid red" }
                            : { border: "1px solid #8A8AA033" }
                        }
                        // {...register("comp_state", {
                        //   required: "Region is required"
                        // })}
                        value={pinState?.pin || ""}
                        onChange={(e) => {
                          setPinState((st) => ({
                            ...st,
                            pin: e.target.value,
                          }));
                        }}
                      >
                        <option value="">
                          {t("callPinPage.modalPin.selectPinPlaceholder")}
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>

                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => setShowAddDialog({ show: false })}
                disabled={addingNumber}
              >
                {t("callPinPage.buttons.cancel")}
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={setCallPin}
                disabled={pinState?.pin == ""}
              >
                {addingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" />{" "}
                    {t("callPinPage.buttons.processing")}
                  </div>
                ) : (
                  t("callPinPage.buttons.confirm")
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* {white list modals} */}
      {showAddWhiteList && (
        <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
            <div
              className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddWhiteList(false)}
            >
              <IoMdCloseCircle />
            </div>

            <div className="mt-4 text-center">
              <Typography variant="h5" className="font-bold text-gray-900">
                {t("callPinPage.modalAddWhitelist.title")}
              </Typography>
              <Typography className="mt-2 text-sm text-left text-gray-600">
                {t("callPinPage.modalAddWhitelist.subtitle")}
              </Typography>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#7A798A] mb-1">
                    {t("callPinPage.modalAddWhitelist.enterMobileLabel")}
                  </label>
                  <PhoneInput
                    defaultCountry="ET"
                    international
                    countryCallingCodeEditable={false}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-white outline-none"
                    value={valueToBlock}
                    onChange={(phone) => {
                      setValueToBlock(phone || "+2519");
                      validatePhoneNumber(phone || "+2519");
                    }}
                    limitMaxLength={13}
                  />
                  {blockType === "mobileNumber" && (
                    <>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("callPinPage.modalAddWhitelist.formatHint")}
                      </p>
                      {phoneError && (
                        <p className="text-xs text-red-500 mt-1">
                          {phoneError}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Display the selected mobile number instead of the dropdown */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#7A798A] mb-1">
                    {t("callPinPage.modalAddWhitelist.registeredMobileLabel")}
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                    +{userData?.phone_number || ""}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => setShowAddWhiteList(false)}
                disabled={addingNumber}
              >
                {t("callPinPage.buttons.cancel")}
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={addNumberWhiteList}
                disabled={addingNumber}
              >
                {addingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" />{" "}
                    {t("callPinPage.buttons.adding")}
                  </div>
                ) : (
                  t("callPinPage.buttons.confirm")
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallPinPageIndividual;
