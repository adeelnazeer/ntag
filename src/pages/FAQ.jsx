/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Typography } from "@material-tailwind/react";
import Header from "../components/header";
import { useLocation, useNavigate } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const locatiion = useLocation()
  const navigate = useNavigate()

  const [data, setData] = useState([])

  useEffect(() => {
    if (locatiion?.state?.isIndividual) {
      setData([
        {
          "question": "How do I register with the NameTAG service and get my NameTAG number?",
          "answer": "You can register via USSD by dialing *883#, or through the web portal or mobile app. After selecting your NameTAG, you can complete your registration and activate your service."
        },
        {
          "question": "How can I pay for my NameTAG number subscription fee and recurring fee?",
          "answer": "For regular NameTAGs (registered via USSD), you can pay using your airtime balance. If you will select Web or App channel to registered with NameTAG service, payments must be completed via the telebirr."
        },
        {
          "question": "How can I dial calls to others using my NameTAG number?",
          "answer": "After subscribing, you can initiate calls through the NameTAG platform. Calls made from your NameTAG will display your NameTAG number to the receiving party with prefix #."
        },
        {
          "question": "How can I identify whether an incoming call is on my NameTAG number or my mobile number?",
          "answer": "Incoming calls to your NameTAG will appear with a \"#\" symbol before the caller\u2019s mobile number (example: #0912345678), allowing you to differentiate them from regular calls."
        },
        {
          "question": "How can I manage my service and incoming calls?",
          "answer": "You can manage your NameTAG service, including call blocking, service turn on or turn off, and profile updates, through USSD (*883#), the web portal, or the mobile app."
        },
        {
          "question": "How can I TurnOff or Turn On my NameTAG number to receive calls based on my personal requirements?",
          "answer": "You can manage your incoming call settings through the web portal, mobile app, or USSD menu. This allows you to turn incoming calls ON or OFF for your NameTAG number based on your needs."
        },
        {
          "question": "What are the call rules if I turn off my incoming calls?",
          "answer": "If you choose to turn off incoming calls, they will remain off for a maximum of 15 days. After that period, the NameTAG platform will automatically turn incoming calls back ON."
        },
        {
          "question": "How can I block or unblock mobile numbers or other NameTAG numbers?",
          "answer": "You can easily block or unblock unwanted numbers via the NameTAG management menu in USSD, the app, or the web portal."
        },
        {
          "question": "How many NameTAG numbers can I register against my account?",
          "answer": "As an individual customer, you can register only one (1) NameTAG number for your primary mobile number at any time."
        },
        {
          "question": "Can I change my existing NameTAG number to a new NameTAG number?",
          "answer": "Yes, you can change your NmaeTAG number with any other NameTAG. Each new NameTAG will require you to pay the applicable subscription fee based on the category and length. Monthly service recurring fee will be applicable accordingly."
        },
        {
          "question": "How can I unsubscribe from the NameTAG service?",
          "answer": "You can unsubscribe from any NameTAG number through the USSD, web portal or Mobile App. Once unsubscribed, the recurring fee will no longer be charged. Your NameTAG number will be removed from your number and NameTAG number will be released to the public and cannot be reclaimed."
        }
      ]);

    } else {
      setData([
        {
          "question": "How do I register with the NameTAG service and get a NameTAG number for my business number?",
          "answer": "You can register by visiting www.nametag.et. Create a corporate account using your valid company details and upload the required company documents. After document approval, you can reserve and purchase your preferred NameTAG number. You will receive SMS notification once NameTAG service administrator verify and approve the uploaded documents."
        },
        {
          "question": "How can I pay for my NameTAG number subscription fee?",
          "answer": "After document approval, you must complete the payment through the telebirr within 24 hours to secure your reserved NameTAG number."
        },
        {
          "question": "When and how can I pay for my NameTAG number recurring fee?",
          "answer": "NameTAG service will deduct the recurring fees via the telebirr as per your selected billing cycle (monthly, quarterly, biannual, or yearly). The first recurring fee cycle will start from 30 days of service subscription."
        },
        {
          "question": "How can I dial calls to others using my NameTAG numbers?",
          "answer": "Once your NameTAG number is active, simply initiate outgoing calls through the NameTAG platform by dialing prefix # and B-Party NameTAG or Mobile number (#4343 or #097xxxxxxxx). The recipient will see your call coming from your #(NameTAG number), not your mobile number."
        },
        {
          "question": "How can I identify whether an incoming call is on my NameTAG number or my mobile number?",
          "answer": "When a call comes in via your NameTAG, it will show with a \"#\" prefix before the caller\u2019s mobile number (example: #0912345678), helping you distinguish between regular mobile calls and NameTAG calls."
        },
        {
          "question": "Can I make unlimited calls using my NameTAG number?",
          "answer": "Yes, you can make unlimited on-net calls (within the Ethio Telecom network) using your NameTAG. However, international calls and calls while roaming are not supported through the NameTAG service."
        },
        {
          "question": "How much will I be charged for outgoing calls from my NameTAG number?",
          "answer": "When you make an outgoing call using the NameTAG prefix (#), Ethio Telecom will charge you as per the package plan of your primary mobile number."
        },
        {
          "question": "Can I use my Voice Package plan for outgoing calls from my NameTAG number?",
          "answer": "Yes, your regular voice package plan can be used for outgoing calls from your NameTAG number. These calls will be charged from your airtime balance as per package plan."
        },
        {
          "question": "How can I manage my service and incoming calls?",
          "answer": "You can fully manage your service, including incoming call settings, blocking, unblocking, and scheduling, via the corporate web portal www.nametag.et."
        },
        {
          "question": "How can I schedule my NameTAG number to receive customer calls based on my business hours?",
          "answer": "Through the web portal, you can set call schedules for your NameTAG to only receive incoming calls during your preferred business hours. Outside of these hours, calls can be automatically blocked as per your settings."
        },
        {
          "question": "How can I block or unblock mobile numbers or other NameTAG numbers?",
          "answer": "You can easily block or unblock specific mobile numbers or NameTAG numbers through your NameTAG account manage Service settings in the web portal."
        },
        {
          "question": "How many NameTAG numbers can I register against my corporate account?",
          "answer": "You can register up to five (5) NameTAG numbers under a single corporate NameTAG account."
        },
        {
          "question": "How can I unsubscribe from the NameTAG service?",
          "answer": "You can unsubscribe from any NameTAG number through the web portal. Once unsubscribed, the recurring fee will no longer be charged. You have 7 days to re-subscribe to the same NameTAG before it becomes available for others to purchase. After this grace period, the NameTAG number will be released to the public and cannot be reclaimed."
        },
        {
          "question": "What are the call rules if I schedule my incoming calls?",
          "answer": "Scheduled call settings allow you to receive calls only during the selected timeframes. Outside your set hours, incoming calls to your NameTAG will be blocked, and callers will not be able to reach you until your schedule resumes."
        },
        {
          "question": "Can I change my existing NameTAG number?",
          "answer": "Yes, you can change your existing NameTAG number by using option available on the Corporate portal. By changing the new NameTAG number, you have to buy a new NameTAG number from the available list and select the package plan. Recurring fee will be applied as per the selected new NameTAG."
        },
        {
          "question": "Can I close my corporate account from NameTAG?",
          "answer": "Yes, you can request to close your corporate NameTAG account. First, you must unsubscribe from all active NameTAG numbers. After that, you can submit a closure request through the portal. The request will be reviewed and approved by the NameTAG service admin. Once approved, your company profile, associated NameTAGs, and all uploaded documents will be permanently removed from the NameTAG platform."
        }
      ]);

    }


  }, [locatiion?.state])

  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4 my-6 bg-white rounded-lg shadow-md">
        <BiArrowBack className=" text-3xl cursor-auto text-secondary font-bold"
          onClick={() => {
            navigate(-1)
          }}
        />

        <h1 className="text-2xl font-bold text-center mb-6 text-secondary">
          NameTAG FAQs
        </h1>


        <div className="mt-4">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {locatiion?.state?.isIndividual ? " Individual Customers FAQs" : "Corporate Customers FAQs"}
            </h2>
            {data.map((faq, index) => (
              <div key={index} className="mb-3 border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className={`flex justify-between items-center p-4 cursor-pointer ${expandedFaq === index ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  onClick={() => toggleFaq(index)}
                >
                  <Typography className="font-medium text-gray-800">
                    Q{index + 1}: {faq.question}
                  </Typography>
                  <span className="text-secondary">
                    {expandedFaq === index ? '−' : '+'}
                  </span>
                </div>

                {expandedFaq === index && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <Typography className="text-gray-700">{faq.answer}</Typography>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default FAQ;