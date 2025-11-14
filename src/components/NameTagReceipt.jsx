/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment';
import logo from '../assets/images/logo.png';
import { formatPhoneNumberCustom } from '../utilities/formatMobileNumber';

const NameTagReceipt = ({ paymentData }) => {
  // Exit early if no payment data is available
  if (!paymentData) {
    return <div>No payment data available</div>;
  }

  // Get user data from local storage
  const userData = JSON.parse(localStorage.getItem('user')) || {};

  // Use only the data provided by the API
  const {
    merch_order_id,
    payment_order_id,
    total_amount,
    trans_currency,
    trans_end_time,
    phone_number,
    msisdn,
    corp_subscriber_id,
    vat,
    excisetax,
    vatable_total,
    stamp_duty,
    customer_type,
    tag_name,
    tag_no,
    tag_type,
    corp_tag_list
  } = paymentData;

  // Format date for better readability
  const formattedDate = paymentData?.created_at ? moment(paymentData?.created_at).format("DD-MM-YYYY HH:mm") : "";

  // Determine the actual tag number and name
  const actualTagNo = corp_tag_list?.tag_no || tag_no;
  const actualTagName = corp_tag_list?.tag_name || tag_name;
  const actualTagType = corp_tag_list?.tag_type || tag_type;

  // Use the phone number from the data or user data
  const registeredNumber = phone_number || msisdn || userData.phone_number || "";

  const getUSer = () => {
    if (userData?.customer_type == "corporate") {
      return userData?.comp_name || ""
    }
    else {
      return userData.first_name || "" + " " + userData.last_name || ""
    }
  }

  return (
    <div className="w-full max-w-[650px] mx-auto bg-white p-3 text-xs">
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <div className="w-1/3">
          <img src={logo} alt="Ethio Telecom" className="h-14" />
        </div>
        {/* <div className="text-right text-xs w-2/3">
          <p>Ethio Telecom</p>
          <p>VAT Reg. No: 012700</p>
          <p>TIN No: 0000035603</p>
          <p>VAT Reg Date: 01/01/2023</p>
          <p>P.O.Box: 1047 Addis Ababa, Ethiopia</p>
          <p>Tel: 251(0) 115 505 678</p>
        </div> */}
      </div>

      {/* SALES INVOICE Title */}
      <div className="text-center font-bold text-base border-b border-t border-gray-300 py-1 my-1">
        SALES INVOICE
      </div>

      {/* Billing and Invoice Information */}
      <div className="flex justify-between mb-2">
        <div className="w-1/2 text-xs">
          <h3 className="font-bold mb-1">Bill To</h3>
          <p>{getUSer()}</p>
          <p>{formatPhoneNumberCustom(registeredNumber)}</p>

          {paymentData.tin_no && <p>TIN No: {paymentData.tin_no}</p>}
          {paymentData.vat_no && <p>VAT No: {paymentData.vat_no}</p>}
        </div>
        <div className="w-1/2 text-xs">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold py-0.5 w-1/3">Invoice No:</td>
                <td className="py-0.5">{payment_order_id}</td>
              </tr>
              <tr>
                <td className="font-bold py-0.5">Order No:</td>
                <td className="py-0.5 break-words"
                  style={{ wordBreak: "break-all" }}
                >{paymentData?.id}</td>
              </tr>

              <tr>
                <td className="font-bold py-0.5">Invoice Date:</td>
                <td className="py-0.5">{formattedDate}</td>
              </tr>
              {userData?.customer_type == "corporate" ?
                <tr>
                  <td className="font-bold py-0.5">TIN Number:</td>
                  <td className="py-0.5">{userData.ntn}</td>
                </tr> :
                <tr>
                  <td className="font-bold py-0.5">Fayda Number:</td>
                  <td className="py-0.5">{userData.cnic}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Header */}
      <div>
        <h3 className="font-bold py-1 px-2 border border-gray-300 bg-gray-100">Invoice Details</h3>

        {/* Service details table */}
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 p-1 text-left font-medium w-24">NameTAG</th>
              <th className="border border-gray-300 p-1 text-left font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-1">#{actualTagNo}</td>
              <td className="border border-gray-300 p-1">
                NameTAG - #{actualTagNo}
                {actualTagName && actualTagNo != actualTagName ? ` (${actualTagName})` : ""}
                {actualTagType ? ` - ${actualTagType} Package` : ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Summary info - separate table with right-aligned headers */}
        <div className="w-full">
          {paymentData?.outstanding_recurring_fee < 0 &&
            <div className="flex justify-end border-x border-gray-300">
              <div className="w-3/4 text-right pr-2 py-1 border-b border-gray-300">Outstanding Recurring Fee (Previous Plan)</div>
              <div className="w-1/4 text-right pr-2 py-1 border-b border-gray-300">{Number(paymentData?.outstanding_recurring_fee || 0)?.toFixed(2)} {'ETB'}</div>
            </div>
          }
          <div className="flex justify-end border-x border-gray-300">
            <div className="w-3/4 text-right pr-2 py-1 border-b border-gray-300">Recurring Fee</div>
            <div className="w-1/4 text-right pr-2 py-1 border-b border-gray-300">{Number(paymentData?.recurring_fee || 0)?.toFixed(2)} {'ETB'}</div>
          </div>
          {paymentData?.payment_type != "CHANGE_MSISDN" &&
            <div className="flex justify-end border-x border-gray-300">
              <div className="w-3/4 text-right pr-2 py-1 border-b border-gray-300">Subscription Fee</div>
              <div className="w-1/4 text-right pr-2 py-1 border-b border-gray-300">{Number(paymentData?.subscription_fee || 0)?.toFixed(2)} {'ETB'}</div>
            </div>
          }
          <div className="flex justify-end border-x border-gray-300">
            <div className="w-3/4 text-right pr-2 py-1 border-b border-gray-300">Sub Total</div>
            <div className="w-1/4 text-right pr-2 py-1 border-b border-gray-300">{Number(Number(total_amount || 0) - Number(vat || 0))?.toFixed(2)} {'ETB'}</div>
          </div>
          <div className="flex justify-end border-x border-gray-300">
            <div className="w-3/4 text-right pr-2 py-1 border-b border-gray-300">VAT (15%)</div>
            <div className="w-1/4 text-right pr-2 py-1 border-b border-gray-300">{Number(vat)?.toFixed(2) || 0} {'ETB'}</div>
          </div>
          {/* Only show excise tax if it exists in data and is greater than 0 */}
          {/* {excisetax && Number(excisetax) > 0 && ( */}
          <div className="flex justify-end border-x border-gray-300">
            <div className="w-3/4 text-right pr-2 py-1 border-b border-gray-300">Excise Tax</div>
            <div className="w-1/4 text-right pr-2 py-1 border-b border-gray-300">{Number(excisetax || 0)?.toFixed(2)} {'ETB'}</div>
          </div>
          {/* )} */}

          {/* Only show vatable total if it exists in data and is greater than 0 */}
          {/* {vatable_total && Number(vatable_total) > 0 && (
            <div className="flex justify-end border-x border-gray-300">
              <div className="w-3/4 text-right pr-2 py-1 border-b border-gray-300">Vatable Sub Total</div>
              <div className="w-1/4 text-right pr-2 py-1 border-b border-gray-300">{vatable_total} {'ETB'}</div>
            </div>
          )} */}

          {/* Only show VAT if it exists in data and is greater than 0 */}
          {/* {vat && Number(vat) > 0 && ( */}

          {/* )} */}

          {/* Only show stamp duty if it exists in data and is greater than 0 */}
          {/* {stamp_duty && Number(stamp_duty) > 0 && ( */}
          <div className="flex justify-end border-x border-gray-300">
            <div className="w-3/4 text-right pr-2 py-1 border-b border-gray-300">Stamp Duty</div>
            <div className="w-1/4 text-right pr-2 py-1 border-b border-gray-300">{Number(stamp_duty)?.toFixed(2)} {'ETB'}</div>
          </div>
          {/* )} */}

          {/* Total amount received - show actual amount from data */}
          <div className="flex justify-end border-x border-b border-gray-300 font-bold">
            <div className="w-3/4 text-right font-medium pr-2 py-1">Total</div>
            <div className="w-1/4 text-right font-medium pr-2 py-1">
              {total_amount} {'ETB'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 text-xs border-t border-gray-300 pt-1">
        <div className="flex justify-between items-start">
          <div className="w-1/2">
            <p className="font-bold mb-0.5">Bringing new possibilities →</p>
          </div>
          <div className="w-1/2 text-right">
            <p>Generated: {moment().format("DD-MM-YYYY HH:mm")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameTagReceipt;