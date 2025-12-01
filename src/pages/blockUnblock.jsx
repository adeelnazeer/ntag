/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { Typography, Button, Spinner } from "@material-tailwind/react";
import { useAppSelector } from "../redux/hooks";
import APICall from "../network/APICall";
import EndPoints from "../network/EndPoints";
import { toast } from 'react-toastify';
import { formatPhoneNumberCustom } from '../utilities/formatMobileNumber';
import { IoMdCloseCircle } from "react-icons/io";
import PhoneInput from "react-phone-number-input"; // Import PhoneInput

const BlockUnblock = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
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
      fetchBlockedNumbers(selectedMsisdn);
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
            fetchBlockedNumbers(activeData?.[0]?.msisdn)
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

  const fetchBlockedNumbers = async (msisdn) => {
    try {
      setLoading(true);
      // Remove "+" from the beginning if present
      const formattedMsisdn = msisdn.replace(/^\+/, '');

      const response = await APICall(
        "get",
        null,
        `${EndPoints.customer.getBlockNumber}?msisdn=${formattedMsisdn}`
      );

      if (response?.success && response?.data) {
        const blockedNumbers = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setNumbers(blockedNumbers);
      } else {
        toast.error("Failed to fetch blocked numbers");
        setNumbers([]);
      }
    } catch (error) {
      console.error("Error fetching blocked numbers:", error);
      toast.error("Error loading blocked numbers");
      setNumbers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (number) => {
    setSelectedNumber(number);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setDeletingNumber(true);

      const deleteResponse = await APICall(
        "delete",
        null,
        `${EndPoints.customer.deleteBlockNumber(selectedNumber.id)}`
      );

      if (deleteResponse?.success) {
        toast.success("Number removed from blocklist successfully");
        setNumbers(numbers.filter(num => num.id !== selectedNumber.id));
      } else {
        toast.error("Failed to remove number from blocklist");
      }
    } catch (error) {
      console.error("Error deleting blocked number:", error);
      toast.error("Error removing number from blocklist");
    } finally {
      setDeletingNumber(false);
      setShowConfirmDialog(false);
    }
  };

  const handleAddToBlocklist = () => {
    setShowAddDialog(true);
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

  const addNewNumber = async () => {
    if (!valueToBlock) {
      toast.error(`Please enter a ${blockType === 'mobileNumber' ? 'mobile number' : 'TAG number'} to block`);
      return;
    }

    if (blockType === 'mobileNumber') {
      if (!validatePhoneNumber(valueToBlock)) {
        return;
      }
    }

    try {
      setAddingNumber(true);

      const msisdnFormatted = selectedMsisdn.replace(/^\+/, '');

      const payload = {
        msisdn: msisdnFormatted,
        channel: "WEB",
        customer_type: "CORP_CUSTOMER"
      };

      if (blockType === 'tagNumber') {
        payload.blocked_tag = String(valueToBlock).replace(/^#/, '');
      } else {
        payload.blocked_no = String(valueToBlock).replace(/^\+/, '');
      }
      const response = await APICall(
        "post",
        payload,
        EndPoints.customer.saveBlockNumber
      );

      if (response?.success) {
        toast.success(`${blockType === 'mobileNumber' ? 'Mobile number' : 'TAG number'} added to blocklist successfully`);
        // fetchBlockedNumbers(selectedMsisdn); // Refresh the list
        setValueToBlock(blockType === 'mobileNumber' ? '+2519' : ''); // Reset with country code for mobile
        setShowAddDialog(false);
        fetchMobileNumbers()
      } else {
        toast.error(response?.message || `Failed to add ${blockType === 'mobileNumber' ? 'mobile number' : 'TAG number'} to blocklist`);
      }
    } catch (error) {
      console.error("Error adding blocked number:", error);
      toast.error(`Error adding ${blockType === 'mobileNumber' ? 'mobile number' : 'TAG number'} to blocklist`);
    } finally {
      setAddingNumber(false);
    }
  };

  const handleChangeSelectedMsisdn = (e) => {
    setSelectedMsisdn(e.target.value);
  };

  // Find the selected mobile number object for display
  const selectedMobileObject = mobileNumbers.find(num => num.msisdn === selectedMsisdn) || {};

  return (
    <div className="bg-white rounded-xl shadow pb-6">
      <div className="flex flex-col">
        <Typography className="block antialiased text-[#1F1F2C] p-3 px-6 border-b text-md font-medium">
          Manage Block Numbers
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
          </div>

          <Button
            onClick={handleAddToBlocklist}
            size="sm"
            className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
            disabled={!selectedMsisdn}
          >
            <BiPlusCircle className="w-4 h-4" />
            Add to Blocklist
          </Button>
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
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                    Sr#
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                    Blocked Number/TAG
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                    Number Type
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                    Registered Mobile Number
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#7A798A]">
                    Channel
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-[#7A798A]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {numbers.length > 0 ? numbers.map((number, index) => (
                  <tr key={number.id}>
                    <td className="py-4 px-4 text-xs text-gray-700">{index + 1}</td>
                    <td className="py-4 px-4 text-xs text-gray-700">
                      {number.blocked_tag ? (
                        `#${number.blocked_tag}`
                      ) : (
                        formatPhoneNumberCustom(number.blocked_no)
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-700">
                      {number.blocked_tag ? "TAG Number" : "Mobile Number"}
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-700">{formatPhoneNumberCustom(number.msisdn)}</td>
                    <td className="py-4 px-4 text-xs text-gray-700">{number.channel}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <Button
                          size="xs"
                          onClick={() => handleDelete(number)}
                          className="bg-secondary"
                        >
                          Unblock
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="py-6 px-4 text-center text-sm text-[#7A798A]">
                      No blocked numbers found
                    </td>
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
                Are you sure you want to remove this number from blocklist?
              </Typography>
              <Typography className="mt-2 text-sm text-gray-600">
                This number will be able to make calls on your TAG number
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
                onClick={confirmDelete}
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
      {showAddDialog && (
        <div className="fixed p-2 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6">
            <div
              className="absolute right-4 top-4 cursor-pointer text-xl text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddDialog(false)}
            >
              <IoMdCloseCircle />
            </div>

            <div className="mt-4 text-center">
              <Typography variant="h5" className="font-bold text-gray-900">
                Add to Blocklist
              </Typography>

              <Typography className="mt-2 text-sm text-gray-600">
                Please select what you want to block
              </Typography>
            </div>

            <div className="mt-6">
              <div className="mb-4">
                <div className="flex gap-4 mb-4">
                  <div
                    className={`flex-1 p-3 border rounded-lg cursor-pointer ${blockType === 'mobileNumber' ? 'border-secondary bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setBlockType('mobileNumber')}
                  >
                    <Typography className="text-center font-medium">
                      Mobile Number
                    </Typography>
                  </div>
                  <div
                    className={`flex-1 p-3 border rounded-lg cursor-pointer ${blockType === 'tagNumber' ? 'border-secondary bg-blue-50' : 'border-gray-300'}`}
                    onClick={() => setBlockType('tagNumber')}
                  >
                    <Typography className="text-center font-medium">
                      TAG Number
                    </Typography>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#7A798A] mb-1">
                    {blockType === 'mobileNumber' ? 'Mobile Number to Block' : 'TAG Number to Block'}
                  </label>
                  {blockType === 'mobileNumber' ? (
                    // Use PhoneInput for mobile numbers
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
                  ) : (
                    // Regular input for TAG numbers
                    <input
                      type="text"
                      value={valueToBlock}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#?\d*$/.test(val)) {
                          setValueToBlock(val);
                        }
                      }}
                      max={8}
                      maxLength={valueToBlock?.startsWith("#") ? 9 : 8}
                      min={2}
                      inputMode="numeric"
                      pattern="^#?\d*$"
                      placeholder="Enter TAG number (e.g. 4642)"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none text-sm"
                    />
                  )}
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
                onClick={() => setShowAddDialog(false)}
                disabled={addingNumber}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 py-2.5 bg-secondary text-white shadow-none hover:shadow-none"
                onClick={addNewNumber}
                disabled={addingNumber || (blockType === 'mobileNumber' && !isValidPhone)}
              >
                {addingNumber ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" className="h-3 w-3" /> Adding...
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

export default BlockUnblock;