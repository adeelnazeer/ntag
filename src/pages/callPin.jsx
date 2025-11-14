/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { Typography, Button, Spinner } from "@material-tailwind/react";
import { useAppSelector } from "../redux/hooks";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { toast } from "react-toastify";
import { formatPhoneNumberCustom } from "../utilities/formatMobileNumber";
import { IoMdCloseCircle } from "react-icons/io";
import PhoneInput from "react-phone-number-input"; // Import PhoneInput
import { useTranslation } from "react-i18next";

const CallPinPage = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState({ show: false });
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingNumber, setAddingNumber] = useState(false);
  const [deletingNumber, setDeletingNumber] = useState(false);
  const [blockType, setBlockType] = useState("mobileNumber"); // 'mobileNumber' or 'tagNumber'
  const [valueToBlock, setValueToBlock] = useState("+2519"); // Initialize with country code
  const [mobileNumbers, setMobileNumbers] = useState([]);
  const [selectedMsisdn, setSelectedMsisdn] = useState("");
  const [phoneError, setPhoneError] = useState(""); // For validation errors
  const [isValidPhone, setIsValidPhone] = useState(false); // Track validation state
  const [data, setData] = useState([]);
  const { t } = useTranslation(["schedule"]);

  const [showAddWhiteList, setShowAddWhiteList] = useState(false);
  const [pinState, setPinState] = useState({
    pin: "",
    error: false,
  });

  let userData = useAppSelector((state) => state?.user?.user);
  if (!userData) {
    userData = JSON.parse(localStorage.getItem("user"));
  }
  const customerId = userData?.id;

  useEffect(() => {
    // Fetch mobile numbers first
    fetchMobileNumbers();
  }, []);

  useEffect(() => {
    // When mobile numbers are loaded or selected msisdn changes, fetch blocked numbers
    if (selectedMsisdn) {
      fetchWhitelistNumber(selectedMsisdn);
    }
  }, [selectedMsisdn]);

  // Reset valueToBlock and validation states when changing block type
  useEffect(() => {
    if (blockType === "mobileNumber") {
      setValueToBlock("+2519"); // Set default country code for mobile numbers
      setIsValidPhone(false); // Reset validation state
      setPhoneError(""); // Clear any error messages
    } else {
      setValueToBlock(""); // Clear for TAG numbers
      setPhoneError(""); // Clear any error messages
    }
  }, [blockType]);

  const fetchMobileNumbers = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setLoading(true);
    APICall(
      "get",
      null,
      `${EndPoints.customer.getReserve}/${user?.customer_account_id}`
    )
      .then((res) => {
        if (res?.success) {
          const activeData = res?.data?.filter(
            (x) => x?.status == 1 || x?.status == 4
          );
          setData(activeData);
          if (res?.data?.some((x) => x?.status == 1 || x?.status == 4)) {
            setSelectedMsisdn(activeData?.[0]?.msisdn);
            fetchWhitelistNumber(activeData?.[0]?.msisdn);
          }
        } else {
          toast.error(res?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await APICall(
        "get",
        null,
        EndPoints.customer.GetAllNumbers(customerId)
      );

      if (response?.success && response?.data) {
        const numbers = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setMobileNumbers(numbers);

        // Pre-select the first number
        // if (numbers.length > 0) {
        //   setSelectedMsisdn(numbers[0].msisdn);
        // }
      } else {
        toast.error(response?.message || t("errors.mobileFetch"));
        setMobileNumbers([]);
      }
    } catch (error) {
       toast.error(t("errors.mobileLoad"));
      setMobileNumbers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWhitelistNumber = async (msisdn) => {
    try {
      setLoading(true);
      // Remove "+" from the beginning if present
      const formattedMsisdn = msisdn.replace(/^\+/, "");

      const response = await APICall(
        "get",
        null,
        `${EndPoints.customer.getWhiteListNumber}?msisdn=${formattedMsisdn}`
      );

      if (response?.success && response?.data) {
        const blockedNumbers = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setNumbers(blockedNumbers);
      } else {
        toast.error(response?.message || t("errors.whitelistFetch"));
        setNumbers([]);
      }
    } catch (error) {
      toast.error(error || error?.message || t("errors.whitelistLoad"));
      setNumbers([]);
    } finally {
      setLoading(false);
    }
  };

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
        `${EndPoints.customer.deleteWhiteList(selectedNumber.id)}`
      );

      if (deleteResponse?.success) {
        toast.success(deleteResponse?.message || "");
        fetchWhitelistNumber(selectedMsisdn);
      } else {
        toast.error(deleteResponse?.message || "");
      }
    } catch (error) {
      toast.error(
        error || error?.message || t("errors.removeWhitelist")
      );
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
    setIsValidPhone(false); // Reset validation state
    setPhoneError(""); // Clear any error messages
  };

  // Function to validate phone number
  const validatePhoneNumber = (phone) => {
    if (!phone) {
      setPhoneError(t("errors.mobile.required"));
      setIsValidPhone(false);
      return false;
    }

    // Check if the number starts with +251
    if (!phone.startsWith("+251")) {
      setPhoneError(t("errors.mobile.mustStartCountry"));
      setIsValidPhone(false);
      return false;
    }

    const cleanNumber = phone.replace("+251", "").replace(/\s/g, "");

    if (!cleanNumber.startsWith("9")) {
      setPhoneError(t("errors.mobile.mustStart9"));
      setIsValidPhone(false);
      return false;
    }

    if (cleanNumber.length !== 9) {
      setPhoneError(t("errors.mobile.length"));
      setIsValidPhone(false);
      return false;
    }

    // All validations passed
    setPhoneError("");
    setIsValidPhone(true);
    return true;
  };

  const setCallPin = async () => {
    try {
      setAddingNumber(true);
      const msisdnFormatted = selectedMsisdn.replace(/^\+/, "");

      const payload = {
        msisdn: msisdnFormatted,
        callpin: showAddDialog?.value == "remove" ? -1 : pinState?.pin,
      };
      const response = await APICall(
        "post",
        payload,
        EndPoints.customer.setCallpin
      );
      if (response?.success) {
        toast.success(response?.message);
        // // fetchWhitelistNumber(selectedMsisdn); // Refresh the list
        setShowAddDialog({ show: false });
        fetchMobileNumbers();
        setPinState({ pin: "", error: false });
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error || error?.message);
    } finally {
      setAddingNumber(false);
    }
  };

  const addNumberWhiteList = async () => {
    try {
      setAddingNumber(true);
      const msisdnFormatted = selectedMsisdn.replace(/^\+/, "");
      const whiteListNumber = valueToBlock.replace(/^\+/, "");
      const payload = {
        msisdn: msisdnFormatted,
        aparty_no: whiteListNumber,
        channel: "WEB",
        customer_type: "Corporate",
      };
      const response = await APICall(
        "post",
        payload,
        EndPoints.customer.addWhiteList
      );
      if (response?.success) {
        toast.success(response?.message);
        setValueToBlock("");
        // // fetchWhitelistNumber(selectedMsisdn); // Refresh the list
        setShowAddWhiteList(false);
        fetchMobileNumbers();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error || error?.message);
    } finally {
      setAddingNumber(false);
    }
  };

  const handleChangeSelectedMsisdn = (e) => {
    setSelectedMsisdn(e.target.value);
  };

  // Find the selected mobile number object for display
  const selectedMobileObject =
    mobileNumbers.find((num) => num.msisdn === selectedMsisdn) || {};
  const findNumber = data?.find((x) => x?.msisdn == selectedMsisdn);

  useEffect(() => {
    if (findNumber?.callpin) {
      setPinState((st) => ({
        ...st,
        pin: findNumber?.callpin?.toString(),
        error: false,
      }));
    }
  }, [findNumber]);

  console.log({ data, findNumber, pinState });

  return (
    <div className="bg-white rounded-xl shadow pb-6">
      <div className="flex flex-col">
        <Typography className="block antialiased text-[#1F1F2C] p-3 px-6 border-b text-md font-medium">
          {t("callPin.title")}
        </Typography>

        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="w-full md:w-64">
            <label className="block text-xs font-medium text-[#7A798A] mb-1">
              {t("callPin.selectNumber")}
            </label>
            <select
              value={selectedMsisdn || ""}
              onChange={handleChangeSelectedMsisdn}
              placeholder="Select Number"
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none text-sm"
              disabled={loading || mobileNumbers.length === 0}
            >
              {data?.length === 0 && (
                <option value="">{t("callPin.noNumber")}</option>
              )}
              {data?.map((num) => (
                <option key={num.id} value={num.msisdn}>
                  +{num.msisdn}
                </option>
              ))}
            </select>
            {findNumber?.callpin > 0 && (
              <p className=" text-xs mt-2">
                {t("callPin.currentPin")} ={" "}
                {findNumber?.callpin > 0
                  ? findNumber?.callpin
                  : t("callPin.notDefined") || ""}{" "}
              </p>
            )}
          </div>
          <div className=" flex gap-2 items-center">
            <Button
              onClick={() => handleAddToBlocklist("set")}
              size="sm"
              className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
              disabled={!selectedMsisdn}
            >
              {findNumber?.callpin > 0
                ? t("callPin.changePin")
                : t("callPin.setPin")}
            </Button>
            {findNumber?.callpin > 0 && (
              <Button
                onClick={() => handleAddToBlocklist("remove")}
                size="sm"
                className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
              >
                {t("callPin.removePin")}
              </Button>
            )}
            <Button
              onClick={() => {
                setShowAddWhiteList(true);
              }}
              size="sm"
              className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
              disabled={!selectedMsisdn || findNumber?.callpin < 1}
            >
              <BiPlusCircle className="w-4 h-4" />
              {t("callPin.addWhiteList")}
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
                    {t("callPin.table.sr")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    {t("callPin.table.nametag")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    {t("callPin.table.whitelistNumber")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    {t("callPin.table.whitelistDate")}
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    {t("callPin.table.pin")}
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-[#7A798A]">
                    {t("callPin.table.action")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {numbers.length > 0 ? (
                  numbers.map((number, index) => (
                    <tr key={number.id}>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        #{number?.subscriber?.tag_no || ""}
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
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {findNumber?.callpin < 1 ? (
                      <td
                        colSpan="6"
                        className="py-6 px-4 text-center text-sm text-[#7A798A]"
                      >
                        {t("callPin.empty.noPin")}
                      </td>
                    ) : data?.length == 0 ? (
                      <td
                        colSpan="6"
                        className="py-6 px-4 text-center text-sm text-[#7A798A]"
                      >
                        {t("callPin.empty.noActive")}
                      </td>
                    ) : (
                      <td
                        colSpan="6"
                        className="py-6 px-4 text-center text-sm text-[#7A798A]"
                      >
                        {t("callPin.empty.noWhitelist")}
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
                {t("callPin.confirmRemoval.title")}
              </Typography>

              <Typography className="mt-2 text-sm text-gray-600">
                {t("callPin.confirmRemoval.desc", {
                  number: selectedNumber?.aparty_no,
                })}
              </Typography>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => setShowConfirmDialog(false)}
                disabled={deletingNumber}
              >
                {t("callPin.buttons.cancel")}
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={confirmDeleteWhiteList}
                disabled={deletingNumber}
              >
                {deletingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" />{" "}
                    {t("callPin.buttons.removing")}
                  </div>
                ) : (
                  t("callPin.buttons.confirm")
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
                {showAddDialog?.value == "remove"
                  ?  t("callPin.modalPin.removeTitle")
                  : `${
                      findNumber?.callpin > 0 ? t("callPin.modalPin.changeTitle"): t("callPin.modalPin.setTitle")
                    } `}
              </Typography>

              <Typography className="mt-2 text-sm text-left text-gray-600">
                {showAddDialog?.value == "remove" ? (
                  <div>
                    <span>
                      {t("callPin.modalPin.descRemove")}
                    </span>
                  </div>
                ) : (
                  <span>
                    {t("callPin.modalPin.descSet",{action:findNumber?.callpin > 0 ? "change" : "set"})}
                    {" "}
                  </span>
                )}{" "}
                <br />
                <br /> {t("callPin.modalPin.nameTag")} = #{findNumber?.tag_no || ""} <br />
                {t("callPin.modalPin.mobileNumber")} = +{selectedMsisdn} <br />
                <span>
                  {t("callPin.modalPin.callPin")} ={" "}
                  {findNumber?.callpin > 0
                    ? findNumber?.callpin
                    : t("callPin.modalPin.noPin") || ""}{" "}
                  <br />
                </span>
              </Typography>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                {showAddDialog?.value == "remove" ? (
                  <Typography className="mt-2 text-sm text-left font-medium text-primary">
                    {t("callPin.modalPin.noteNoPin")}
                  </Typography>
                ) : (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#7A798A]">
                      {t("callPin.modalPin.selectSingleDigit")}
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
                        <option value="">{t("callPin.modalPin.selectPinPlaceholder")}</option>
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
                {t("callPin.buttons.cancel")}
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={setCallPin}
                disabled={pinState?.pin == ""}
              >
                {addingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" /> {t("callPin.buttons.processing")}
                  </div>
                ) : (
                  t("callPin.buttons.confirm")
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
                {t("callPin.modalWhitelist.title")}
              </Typography>
              <Typography className="mt-2 text-sm text-left text-gray-600">
                {t("callPin.modalWhitelist.subtitle")}
              </Typography>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#7A798A] mb-1">
                    {t("callPin.modalWhitelist.enterMobileLabel")}
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
                        {t("callPin.modalWhitelist.")}
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
                    {t("callPin.modalWhitelist.yourRegistered")}
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                    +{selectedMsisdn}{" "}
                    {selectedMobileObject.mobile_type
                      ? `(${selectedMobileObject.mobile_type})`
                      : ""}
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
                {t("callPin.buttons.cancel")}
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={addNumberWhiteList}
                disabled={addingNumber}
              >
                {addingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" /> {t("callPin.buttons.processing")}
                  </div>
                ) : (
                  t("callPin.buttons.confirm")
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallPinPage;
