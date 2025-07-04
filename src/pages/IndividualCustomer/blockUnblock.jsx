/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { Typography, Button, Spinner } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { formatPhoneNumberCustom } from '../../utilities/formatMobileNumber';
import EndPoints from '../../network/EndPoints';
import APICall from '../../network/APICall';
import { useAppSelector } from '../../redux/hooks';
import { IoMdCloseCircle } from "react-icons/io";
import PhoneInput from "react-phone-number-input";

const BlockUnblockCustomer = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingNumber, setAddingNumber] = useState(false);
  const [deletingNumber, setDeletingNumber] = useState(false);
  const [tagStatus, setTagStatus] = useState("loading"); // "active", "reserve", "none"

  // New state variables for corporate-like modal
  const [blockType, setBlockType] = useState('mobileNumber'); // 'mobileNumber' or 'tagNumber'
  const [valueToBlock, setValueToBlock] = useState('+2519'); // Initialize with country code
  const [newTagNumber, setNewTagNumber] = useState('');
  const [phoneError, setPhoneError] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [tagError, setTagError] = useState("");
  const [isValidTag, setIsValidTag] = useState(false);
  const [status, setStatus] = useState(null)

  // Get user info
  let userData = useAppSelector(state => state?.user?.userData);
  if (!userData) {
    userData = JSON.parse(localStorage.getItem('user'))
  }
  // const customerId = userData?.id;

  useEffect(() => {
    fetchBlockedNumbers();
    checkTagStatus();
  }, []);

  // Check if user has an active TAG or only a reserved TAG
  const checkTagStatus = async () => {
    try {
      const accountId = userData?.id;
      if (!accountId) {
        setTagStatus("none");
        return;
      }

      // Fetch user's TAGs
      const response = await APICall("get", null, `${EndPoints.customer.getReserveTagsCustomer}/${accountId}`);
      setStatus(response?.data?.[0]?.status)

      if (response?.success && response?.data) {
        const userTags = Array.isArray(response.data) ? response.data : [response.data];

        // Check if there's at least one active TAG (not just reserved)
        const hasActiveTag = userTags.some(tag =>
          tag.payment_status !== 0 && tag.type !== 'reserve'
        );

        // Check if there's at least one reserved TAG
        const hasReservedTag = userTags.some(tag =>
          tag.type === 'reserve'
        );

        if (hasActiveTag) {
          setTagStatus("active");
        } else if (hasReservedTag) {
          setTagStatus("reserve");
        } else {
          setTagStatus("none");
        }
      } else {
        // No TAGs found
        setTagStatus("none");
      }
    } catch (error) {
      console.error("Error checking TAG status:", error);
      setTagStatus("error");
    }
  };

  // Reset valueToBlock and validation states when changing block type
  useEffect(() => {
    if (blockType === 'mobileNumber') {
      setValueToBlock('+2519'); // Set default country code for mobile numbers
      setIsValidPhone(false); // Reset validation state
      setPhoneError(""); // Clear any error messages
    } else {
      setValueToBlock(''); // Clear for TAG numbers
      setPhoneError(""); // Clear any error messages
      setTagError(""); // Clear tag error messages
      setIsValidTag(false);
    }
  }, [blockType]);

  const fetchBlockedNumbers = async () => {
    try {
      setLoading(true);
      const response = await APICall("get", null, EndPoints.customer.getIndividualBlockNumber);

      if (response?.success && response?.data) {
        const blockedNumbers = Array.isArray(response.data)
          ? response.data
          : [response.data];

        setNumbers(blockedNumbers);
      } else {
        toast.error("Failed to fetch blocked numbers");
      }
    } catch (error) {
      console.error("Error fetching blocked numbers:", error);
      toast.error("Error loading blocked numbers");
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
        `${EndPoints.customer.individualdeleteBlockNumber(selectedNumber.id)}`
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
    setNewTagNumber('');
    setIsValidPhone(false); // Reset validation state
    setPhoneError(""); // Clear any error messages
    setTagError("");
    setIsValidTag(false);
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

  // Function to validate TAG number
  const validateTagNumber = (tagNumber) => {
    if (!tagNumber) {
      setTagError("TAG Number is required");
      setIsValidTag(false);
      return false;
    }

    // Remove # prefix if present
    const cleanTag = tagNumber.replace(/^#/, '');

    // Check length between 2 and 8 characters
    if (cleanTag.length < 2) {
      setTagError("TAG Number must be at least 2 characters");
      setIsValidTag(false);
      return false;
    }

    if (cleanTag.length > 8) {
      setTagError("TAG Number must not exceed 8 characters");
      setIsValidTag(false);
      return false;
    }

    // All validations passed
    setTagError("");
    setIsValidTag(true);
    return true;
  };

  const addNewNumber = async () => {
    // Validate based on the block type
    const isBlockingOwnTag = numbers?.some(
      x => String(x?.blocked_tag).replace(/^#/, '') === String(valueToBlock).replace(/^#/, '')
    );
    if (blockType === 'mobileNumber') {
      if (!validatePhoneNumber(valueToBlock)) {
        return;
      }

      // // For mobile numbers, also validate the user's TAG number
      // if (!validateTagNumber(newTagNumber)) {
      //   return;
      // }
    } else { // TAG number
      if (!valueToBlock) {
        setTagError("Please enter a TAG number to block");
        return;
      }

      if (!validateTagNumber(valueToBlock)) {
        return;
      }
      if (isBlockingOwnTag) {
        toast.error("You can not block your own NameTAG")
        return
      }
    }

    try {
      setAddingNumber(true);

      // Base payload with common fields
      const payload = {
        msisdn: userData?.phone_number?.replace(/^\+/, '') || "",
        channel: "WEB",
        customer_type: "NORMAL_CUSTOMER" // Updated as requested
      };

      if (blockType === 'tagNumber') {
        payload.blocked_tag = String(valueToBlock).replace(/^#/, '');
      } else {
        payload.blocked_no = String(valueToBlock).replace(/^\+/, '');
      }

      const response = await APICall(
        "post",
        payload,
        EndPoints.customer.saveIndividualBlockNumber
      );

      if (response?.success) {
        toast.success(`${blockType === 'mobileNumber' ? 'Mobile number' : 'TAG number'} added to blocklist successfully`);
        fetchBlockedNumbers(); // Refresh the list
        setValueToBlock(blockType === 'mobileNumber' ? '+2519' : '');
        setNewTagNumber('');
        setShowAddDialog(false);
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

  // Render the appropriate view based on tag status
  const renderContent = () => {
    if (tagStatus === "loading") {
      return (
        <div className="flex justify-center items-center py-10">
          <Spinner className="h-8 w-8 text-secondary" />
        </div>
      );
    }

    if (tagStatus === "reserve") {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Typography className="text-lg font-medium text-gray-700 text-center">
            No active NameTAG is linked to your mobile number.
          </Typography>
          <Typography className="text-sm text-gray-500 mt-2 text-center">
            Please purchase your reserved TAG to use the Block/Unblock feature.
          </Typography>
        </div>
      );
    }

    if (status != 1) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Typography className="text-lg font-medium text-gray-700 text-center">
            No active NameTAG is linked to your mobile number.
          </Typography>
        </div>
      );
    }


    if (tagStatus === "none") {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Typography className="text-lg font-medium text-gray-700 text-center">
            You don't have any TAG linked to your mobile number.
          </Typography>
          <Typography className="text-sm text-gray-500 mt-2 text-center">
            Please purchase a TAG to use the Block/Unblock feature.
          </Typography>
        </div>
      );
    }

    // Default view (active TAG)
    return (
      <>
        <div className="p-4 flex flex-col md:flex-row justify-end items-start md:items-center gap-3">
          <Button
            onClick={handleAddToBlocklist}
            size="sm"
            className="bg-secondary flex items-center gap-1 py-2 px-4 text-sm"
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
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    TAG Number
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    Blocked Number
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    Regestered Mobile Number
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-[#7A798A]">
                    Channel
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-[#7A798A]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {numbers.length > 0 ? numbers.map((number) => {
                  return (
                    <tr key={number.id}>
                      <td className="py-4 px-4 text-sm text-gray-700">#{number?.blocked_tag}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{formatPhoneNumberCustom(number?.blocked_no)}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{formatPhoneNumberCustom(number?.msisdn)}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{number?.channel}</td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <Button
                            size="sm"
                            onClick={() => handleDelete(number)}
                            className="bg-secondary"
                          >
                            Unblock Number
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="5" className="py-6 px-4 text-center text-sm text-[#7A798A]">
                      No blocked numbers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  };

  console.log({ numbers })

  return (
    <div className="bg-white rounded-xl shadow pb-6">
      <div className="flex flex-col">
        <Typography className="block antialiased  text-[#1F1F2C] p-3 px-6 border-b text-md font-medium">
          Blocked Numbers
        </Typography>

        {renderContent()}
      </div>

      {/* Confirmation Dialog */}
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

      {/* Add Number Dialog - Corporate Style Modal */}
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

                {blockType === 'mobileNumber' ? (
                  // Mobile Number to Block section
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-[#7A798A] mb-1">
                      Mobile Number to Block
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
                    <p className="text-xs text-gray-500 mt-1">Format: +251xxxxxxxxx</p>
                    {phoneError && (
                      <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                    )}


                  </div>
                ) : (
                  // TAG Number to Block section - single field only
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-[#7A798A] mb-1">
                      TAG Number to Block
                    </label>
                    <div>
                      <input
                        type="text"
                        value={valueToBlock}
                        maxLength={valueToBlock?.startsWith("#") ? 9 : 8}
                        min={2}
                        onChange={(e) => {
                          setValueToBlock(e.target.value);
                          validateTagNumber(e.target.value);
                        }}
                        placeholder="Enter TAG number to block"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none text-sm"
                      />
                      {tagError && (
                        <p className="text-xs text-red-500 mt-1">{tagError}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">TAG Number must be between 2-8 characters</p>
                    </div>
                  </div>
                )}
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
                disabled={addingNumber ||
                  (blockType === 'mobileNumber' && (!isValidPhone)) ||
                  (blockType === 'tagNumber' && !isValidTag)}
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

export default BlockUnblockCustomer;