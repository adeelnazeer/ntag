/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { Typography, Button, Spinner } from "@material-tailwind/react";
import { useAppSelector } from "../redux/hooks";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { toast } from 'react-toastify';
import { formatPhoneNumberCustom } from '../utilities/formatMobileNumber';
import { IoMdCloseCircle } from "react-icons/io";
import PhoneInput from "react-phone-number-input"; // Import PhoneInput

const CallPinPage = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState({ show: false });
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingNumber, setAddingNumber] = useState(false);
  const [deletingNumber, setDeletingNumber] = useState(false);
  const [blockType, setBlockType] = useState('mobileNumber'); // 'mobileNumber' or 'tagNumber'
  const [valueToBlock, setValueToBlock] = useState('+2519'); // Initialize with country code
  const [mobileNumbers, setMobileNumbers] = useState([]);
  const [selectedMsisdn, setSelectedMsisdn] = useState('');
  const [phoneError, setPhoneError] = useState(""); // For validation errors
  const [isValidPhone, setIsValidPhone] = useState(false); // Track validation state
  const [data, setData] = useState([])

  const [showAddWhiteList, setShowAddWhiteList] = useState(false)
  const [pinState, setPinState] = useState({
    pin: "",
    error: false
  })

  let userData = useAppSelector(state => state?.user?.user);
  if (!userData) {
    userData = JSON.parse(localStorage.getItem('user'))
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
    if (blockType === 'mobileNumber') {
      setValueToBlock('+2519'); // Set default country code for mobile numbers
      setIsValidPhone(false); // Reset validation state
      setPhoneError(""); // Clear any error messages
    } else {
      setValueToBlock(''); // Clear for TAG numbers
      setPhoneError(""); // Clear any error messages
    }
  }, [blockType]);

  const fetchMobileNumbers = async () => {
    const user = JSON.parse(localStorage.getItem("user"))
    setLoading(true)
    APICall("get", null, `${EndPoints.customer.getReserve}/${user?.customer_account_id}`)
      .then((res) => {
        if (res?.success) {
          const activeData = res?.data?.filter(x => x?.status == 1 || x?.status == 4)
          setData(activeData);
          if (res?.data?.some(x => x?.status == 1 || x?.status == 4)) {
            setSelectedMsisdn(activeData?.[0]?.msisdn);
            fetchWhitelistNumber(activeData?.[0]?.msisdn)
          }
        } else {
          toast.error(res?.message);
        }
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      });
    if (!customerId) {
      console.error("No customer account ID found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await APICall("get", null, EndPoints.customer.GetAllNumbers(customerId));

      if (response?.success && response?.data) {
        const numbers = Array.isArray(response.data) ? response.data : [response.data];
        setMobileNumbers(numbers);

        // Pre-select the first number
        // if (numbers.length > 0) {
        //   setSelectedMsisdn(numbers[0].msisdn);
        // }
      } else {
        toast.error(response?.message || "Failed to fetch Mobile numbers");
        setMobileNumbers([]);
      }
    } catch (error) {
      console.error("Error fetching Mobile numbers:", error);
      toast.error("Error loading Mobile numbers");
      setMobileNumbers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWhitelistNumber = async (msisdn) => {
    try {
      setLoading(true);
      // Remove "+" from the beginning if present
      const formattedMsisdn = msisdn.replace(/^\+/, '');

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
        toast.error(response?.message || "Failed to fetch whitelist numbers");
        setNumbers([]);
      }
    } catch (error) {
      toast.error(error || error?.message || "Error loading whitelist numbers");
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
        fetchWhitelistNumber(selectedMsisdn)
      } else {
        toast.error(deleteResponse?.message || "");
      }
    } catch (error) {
      console.error("Error deleting blocked number:", error);
      toast.error(error || error?.message || "Error removing number from whitelist");
    } finally {
      setDeletingNumber(false);
      setShowConfirmDialog(false);
    }
  };

  const handleAddToBlocklist = (value) => {
    setShowAddDialog(st => ({
      ...st,
      show: true,
      value: value
    }));
    setBlockType('mobileNumber');
    setValueToBlock('+2519'); // Set default country code when opening modal
    setIsValidPhone(false); // Reset validation state
    setPhoneError(""); // Clear any error messages
  };

  // Function to validate phone number
  const validatePhoneNumber = (phone) => {
    if (!phone) {
      setPhoneError("Mobile Number is required");
      setIsValidPhone(false);
      return false;
    }

    // Check if the number starts with +251
    if (!phone.startsWith('+251')) {
      setPhoneError("Mobile Number must start with +251");
      setIsValidPhone(false);
      return false;
    }

    const cleanNumber = phone.replace('+251', '').replace(/\s/g, '');

    if (!cleanNumber.startsWith('9')) {
      setPhoneError("Mobile Numbers must start with 9 after country code");
      setIsValidPhone(false);
      return false;
    }

    if (cleanNumber.length !== 9) {
      setPhoneError("Mobile Number must be 9 digits after country code");
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
      const msisdnFormatted = selectedMsisdn.replace(/^\+/, '');

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
        fetchMobileNumbers()
        setPinState({ pin: "", error: false })
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
      const msisdnFormatted = selectedMsisdn.replace(/^\+/, '');
      const whiteListNumber = valueToBlock.replace(/^\+/, '');
      const payload = {
        msisdn: msisdnFormatted,
        aparty_no: whiteListNumber,
        channel: "WEB",
        customer_type: "Corporate"
      };
      const response = await APICall(
        "post",
        payload,
        EndPoints.customer.addWhiteList
      );
      if (response?.success) {
        toast.success(response?.message);
        setValueToBlock("")
        // // fetchWhitelistNumber(selectedMsisdn); // Refresh the list
        setShowAddWhiteList(false);
        fetchMobileNumbers()
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
  const selectedMobileObject = mobileNumbers.find(num => num.msisdn === selectedMsisdn) || {};
  const findNumber = data?.find(x => x?.msisdn == selectedMsisdn)

  useEffect(() => {
    if (findNumber?.callpin) {
      setPinState(st => ({
        ...st,
        pin: findNumber?.callpin?.toString(),
        error: false
      }))
    }
  }, [findNumber])


  console.log({ data, findNumber, pinState })

  return (
    <div className="bg-white rounded-xl shadow pb-6">
      <div className="flex flex-col">
        <Typography className="block antialiased text-[#1F1F2C] p-3 px-6 border-b text-md font-medium">
          Manage incoming Call PIN and White List  Numbers
        </Typography>

        <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="w-full md:w-64">
            <label className="block text-xs font-medium text-[#7A798A] mb-1">
              Select Your Registered Mobile Number
            </label>
            <select
              value={selectedMsisdn || ""}
              onChange={handleChangeSelectedMsisdn}
              placeholder="Select Number"
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none text-sm"
              disabled={loading || mobileNumbers.length === 0}
            >
              {data?.length === 0 && (
                <option value="">No mobile numbers found</option>
              )}
              {data?.map((num) => (
                <option key={num.id} value={num.msisdn}>
                  +{num.msisdn}
                </option>
              ))}
            </select>
            {findNumber?.callpin > 0 &&
              <p className=' text-xs mt-2'>Current PIN =  {findNumber?.callpin > 0 ? findNumber?.callpin : "Not Defined" || ""} </p>
            }
          </div>
          <div className=' flex gap-2 items-center'>
            <Button
              onClick={() => handleAddToBlocklist("set")}
              size="sm"
              className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
              disabled={!selectedMsisdn}
            >
              {findNumber?.callpin > 0 ? "Change PIN" : "Set PIN"}
            </Button>
            {findNumber?.callpin > 0 &&
              <Button
                onClick={() => handleAddToBlocklist("remove")}
                size="sm"
                className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
              >
                Remove PIN
              </Button>
            }
            <Button
              onClick={() => {
                setShowAddWhiteList(true)
              }}
              size="sm"
              className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
              disabled={!selectedMsisdn || findNumber?.callpin < 1}
            >
              <BiPlusCircle className="w-4 h-4" />
              Add to Whitelist
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
                    Sr#
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    NameTAG
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    Whitelist Number
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    Whitelist Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    PIN
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-[#7A798A]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {numbers.length > 0 ? numbers.map((number, index) => (
                  <tr key={number.id}>
                    <td className="py-4 px-4 text-sm text-gray-700">{index + 1}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      #{
                        (number?.subscriber?.tag_no || "")
                      }
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {formatPhoneNumberCustom(number?.aparty_no || "")}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{number?.created_at || ""}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{number?.subscriber?.callpin > 0 ? number?.subscriber?.callpin : "" || ""}</td>
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
                )) : (
                  <tr>
                    {findNumber?.callpin < 1 ?
                      <td colSpan="6" className="py-6 px-4 text-center text-sm text-[#7A798A]">
                        Currently No PIN is set for Incoming Calls. Please set a PIN to Add numbers to whitelist
                      </td>
                      : data?.length == 0 ?
                        <td colSpan="6" className="py-6 px-4 text-center text-sm text-[#7A798A]">
                          No active NameTAG is linked to your mobile number.
                        </td>
                        :
                        <td colSpan="6" className="py-6 px-4 text-center text-sm text-[#7A798A]">
                          No whitelist number found!
                        </td>
                    }
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
                Confirm Removal
              </Typography>

              <Typography className="mt-2 text-sm text-gray-600">
                Are you sure you want to remove mobile number +{selectedNumber?.aparty_no || ""} from whitelist?
              </Typography>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => setShowConfirmDialog(false)}
                disabled={deletingNumber}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={confirmDeleteWhiteList}
                disabled={deletingNumber}
              >
                {deletingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" /> Removing...
                  </div>
                ) : "Confirm"}
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
                {showAddDialog?.value == "remove" ? "Remove Call PIN for your incoming calls" : `${findNumber?.callpin > 0 ? "Change" : "Set"} Call PIN for your incoming Calls`}
              </Typography>

              <Typography className="mt-2 text-sm text-left text-gray-600">
                {showAddDialog?.value == "remove" ? <div>
                  <span>Once the PIN is removed, all callers will be able to reach your NameTAG without entering a PIN.</span>
                </div> :
                  <span>
                    Are you sure you want to {findNumber?.callpin > 0 ? "change" : "set a"} PIN for incoming calls? Your Callers will be required to enter the PIN before connecting to your NameTAG number.                  </span>
                }   <br /><br />             NameTAG =  #{findNumber?.tag_no || ""} <br />
                Mobile Number = +{selectedMsisdn} <br />
                <span>
                  Call PIN =  {findNumber?.callpin > 0 ? findNumber?.callpin : "Not Defined" || ""} <br />
                </span>
              </Typography>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                {showAddDialog?.value == "remove" ?
                  <Typography className="mt-2 text-sm text-left font-medium text-primary">
                    No PIN is required - callers can reach your NameTAG without entering the PIN
                  </Typography>
                  :
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#7A798A]">
                      Please select Single Digit PIN
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
                          setPinState(st => ({
                            ...st,
                            pin: e.target.value
                          }))
                        }}
                      >
                        <option value="">Select PIN</option>
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
                }
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <Button
                className="flex-1 py-2.5 bg-gray-300 text-gray-800 shadow-none hover:shadow-none"
                onClick={() => setShowAddDialog({ show: false })}
                disabled={addingNumber}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={setCallPin}
                disabled={pinState?.pin == ""}
              >
                {addingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" /> Processing...
                  </div>
                ) : "Confirm"}
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
                Add to Whitelist
              </Typography>
              <Typography className="mt-2 text-sm text-left text-gray-600">
                Whitelisted callers can call your NameTAG without a PIN.
              </Typography>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#7A798A] mb-1">
                    Enter Mobile Number to add Whitelist
                  </label>
                  <PhoneInput
                    defaultCountry="ET"
                    international
                    countryCallingCodeEditable={false}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 bg-white outline-none"
                    value={valueToBlock}
                    onChange={(phone) => {
                      setValueToBlock(phone || '+2519');
                      validatePhoneNumber(phone || '+2519');
                    }}
                    limitMaxLength={13}
                  />
                  {blockType === 'mobileNumber' && (
                    <>
                      <p className="text-xs text-gray-500 mt-1">Format: +251xxxxxxxxx</p>
                      {phoneError && (
                        <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                      )}
                    </>
                  )}
                </div>

                {/* Display the selected mobile number instead of the dropdown */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#7A798A] mb-1">
                    Your Registered Mobile Number
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                    +{selectedMsisdn} {selectedMobileObject.mobile_type ? `(${selectedMobileObject.mobile_type})` : ''}
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
                Cancel
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={addNumberWhiteList}
                disabled={addingNumber}
              >
                {addingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" /> Processing...
                  </div>
                ) : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallPinPage;