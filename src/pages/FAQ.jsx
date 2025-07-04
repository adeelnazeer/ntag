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
          question: "How do I register for the NameTAG service and obtain my NameTAG number?",
          answer: "You can register for the NameTAG service via USSD by dialing *883#, or through our web portal or mobile app. After selecting your NameTAG, complete your registration and activate your service."
        },
        {
          question: "How can I pay for my NameTAG number subscription fee and recurring fee?",
          answer: "For regular NameTAGs (registered via USSD), you can pay using your airtime balance. For premium NameTAGs (registered via the web portal and mobile app), payments must be completed via the telebirr app."

        },
        {
          question: "How can I dial calls to others using my NameTAG number?",
          answer: "After subscribing, you can initiate calls through the NameTAG platform by dialing the B-party's mobile number or NameTAG with the prefix #. Calls made from your NameTAG will display your NameTAG to the receiving party. Alternatively, you can download the NameTAG mobile app and dial calls from your NameTAG."
        },
        {
          question: "How can I identify whether an incoming call is on my NameTAG number or my mobile number?",
          answer: "Incoming calls to your NameTAG will appear with a # prefix before the caller's NameTAG or mobile number (example: #0912345678), allowing you to differentiate them from regular calls."
        },
        {
          question: "Can I reserve a NameTAG number without payment?",
          answer: "Yes, you can reserve a NameTAG number and pay the subscription fee within 24 hours. If payment is not completed within this timeframe, the reservation will be canceled, and the NameTAG will become available to others."
        },
        {
          question: "How can I manage my NameTAG service and incoming calls?",
          answer: "You can manage your NameTAG service, including call blocking, scheduling, and profile updates, through USSD (*883#), the web portal, or the mobile app."
        },
        {
          question: "How can I TurnOff or Turn On my NameTAG number to receive calls based on my personal requirements?",
          answer: "You can set incoming calls ON of OFF through the web portal, mobile app, or USSD menu, allowing you to accept calls to your NameTAG."
        },
        {
          question: "How can I block or unblock mobile numbers or other NameTAG numbers?",
          answer: "You can easily block or unblock unwanted numbers via the Manage NameTAG menu using USSD,web portal or mobile app."
        },
        {
          question: "How many NameTAG numbers can I register against my account?",
          answer: "As an individual customer, you can register only one (1) NameTAG number for your primary mobile number at any time."
        },
        {
          question: "How can I unsubscribe from the NameTAG service?",
          answer: "You can unsubscribe NameTAG service using web portal, mobile App or USSD. After unsubscribing, your TAG number details will be removed. You can subscribe with new TAG number."
        },
        {
          question: "Can I change my existing NameTAG number to a new NameTAG number?",
          answer: "Yes, you can change your NameTAG up to five (5) times. Each new NameTAG will require you to pay the applicable subscription fee based on the new NameTAG's category. Monthly service recurring fee will be applicable accordingly."
        },
        {
          question: "What are the call rules if I turn off my incoming calls?",
          answer: "If you deactivate incoming calls on your NameTAG, it will remain blocked for a maximum of 15 days. After 15 days, the incoming call service will be automatically restored."
        },
        {
          question: "What are the call charges for P2P calls from NameTAG?",
          answer: "P2P call charges will apply as per your existing package plan."
        }
      ])
    } else {
      setData([
        {
          question: "How do I register with the NameTAG service and get a NameTAG number for my business number?",
          answer: "You can register by visiting www.nametag.et. Create a corporate account using your valid company details and upload the required company documents. After document approval, you can reserve and purchase your preferred NameTAG number. You will receive SMS notification once NameTAG service administrator verify and approve the uploaded documents."
        },
        {
          question: "How can I pay for my NameTAG number subscription fee?",
          answer: "After document approval, you must complete the payment through the telebirr App within 24 hours to secure your reserved NameTAG number."
        },
        {
          question: "When and how can I pay for my NameTAG number recurring fee?",
          answer: "The NameTAG service will deduct recurring fees via the telebirr app as per your selected billing cycle (monthly, quarterly, bi-annual, or yearly). The first recurring fee cycle will start 30 days after service subscription."
        },
        {
          question: "How can I dial calls to others using my NameTAG NameTAG number?",
          answer: "Once your NameTAG is active, simply initiate outgoing calls through the NameTAG platform by dialing prefix # and B-Party NameTAG or Mobile number (#4343 or #97xxxxxxxx). The recipient will see your call coming from your NameTAG, not your mobile number."
        },
        {
          question: "How can I identify whether an incoming call is on my NameTAG number or my mobile number?",
          answer: `When a call comes in via your NameTAG, it will show with a "#" prefix before the caller's mobile number (example: #0912345678), helping you distinguish between regular mobile calls and NameTAG calls.`
        },
        {
          question: "Can I make unlimited calls using my NameTAG number?",
          answer: "Yes, you can make unlimited on-net calls (within the Ethio Telecom network) using your NameTAG. However, international calls and calls while roaming are not supported through the NameTAG service."
        },
        {
          question: "How much will I be charged for outgoing calls from my NameTAG number?",
          answer: "When you make an outgoing call using the NameTAG prefix (#), Ethio Telecom will charge you 0.50 ETB + tax per minute for the call."
        },
        {
          question: "Can I use my Voice Package plan for outgoing calls from my NameTAG number?",
          answer: "No, your regular voice package plan cannot be used for outgoing calls from your NameTAG number. These calls will be charged from your airtime balance, not from your free minutes."
        },
        {
          question: "How can I manage my service and incoming calls?",
          answer: "You can fully manage your service, including call settings, blocking, unblocking, and scheduling, via the corporate web portal www.nametag.et."
        },
        {
          question: "How can I schedule my NameTAG number to receive customer calls based on my business hours?",
          answer: "Through the web portal, you can set call schedules for your NameTAG to only receive incoming calls during your preferred business hours. Outside of these hours, calls can be automatically blocked as per your settings."
        },
        {
          question: "How can I block or unblock mobile numbers or other NameTAG numbers?",
          answer: "You can easily block or unblock specific mobile numbers or NameTAG numbers through your NameTAG account Manage Service settings in the web portal."
        },
        {
          question: "How many NameTAG numbers can I register against my corporate account?",
          answer: "You can register up to five (5) NameTAG numbers under a single corporate NameTAG account."
        },
        {
          question: "How can I unsubscribe from the NameTAG service?",
          answer: "You can unsubscribe from any NameTAG number via the web portal. After unsubscribing, you have 7 days to re-subscribe to the same NameTAG before it becomes available to others."
        },
        {
          question: "What are the call rules if I schedule my incoming calls?",
          answer: "Scheduled call settings allow you to receive calls only during the selected timeframes. Outside your set hours, incoming calls to your NameTAG will be blocked, and callers will not be able to reach you until your schedule resumes."
        }
      ])
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