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

          "question": "What is NameTAG service and what is the benefit for an individual customer?",
          "answer": "NameTAG is a subscription-based Ethio Telecom service that allows individuals to purchase short and catchy numbers of their choice (e.g., #David → #32843, #Scorpio → #7267746) for incoming and outgoing calls. With NameTAG, you can manage incoming call rules according to your preferences."
        },
        {
          "question": "How do I register with the NameTAG service and get my NameTAG number?",
          "answer": "You can register via USSD by dialing *883#, or through the web portal or mobile app. After selecting your NameTAG, you can complete your registration and activate your service."
        },
        {
          "question": "How can I get a new NameTAG and link it to my mobile number?",
          "answer": "You can subscribe to the NameTAG service and purchase a NameTAG number of your choice. The new NameTAG will be automatically linked to your primary mobile number. Callers can reach you by dialing your NameTAG (e.g., #32843), and you will receive incoming calls with the prefix #<caller number>. When you call back using the prefix #<09xxxxxxxx>, the recipient will see the call coming from your NameTAG (e.g., #32843)."

        },
        {
          "question": "How can I pay for my NameTAG number subscription fee and recurring fee?",
          "answer": "For regular NameTAGs (registered via USSD), you can pay using your airtime balance. If you will select Web or App channel to registered with NameTAG service, payments must be completed via the telebirr."
        },
        {
          "question": "How can I reserve a NameTAG of my choice and buy it later using my telebirr account?",
          "answer": "You can create an account at nametag.et and select and reserve a NameTAG number of your choice. You must complete the payment via your telebirr account within 24 hours to purchase the NameTAG. If the payment is not made within 24 hours, the reserved NameTAG will be released and made available for others to buy."
        },
        {
          "question": "Can I cancel my reserved NameTAG?",
          "answer": "Yes, you can cancel your reserved NameTAG number from your account and choose another NameTAG number to purchase."
        },
        {
          "question": "Can I reserve a NameTAG using the USSD channel?",
          "answer": "No, the USSD channel does not support reserving a NameTAG. However, you can search for an available NameTAG number and purchase it directly using your mobile airtime balance."

        },
        {
          "question": "What is the telebirr Mandate and how can I accept it to process the recurring fee?",
          "answer": "The telebirr Mandate is a process that authorizes NameTAG to automatically deduct the recurring fee from your telebirr account. After subscribing to the NameTAG service and making the initial payment, you will receive a request to approve the telebirr Mandate, which you must verify using your telebirr PIN code once receive Pop-Up request on your number."
        },
        {
          "question": "What if I do not accept the telebirr Mandate request or do not authorize NameTAG?",
          "answer": "If you do not accept the telebirr Mandate request and do not authorize NameTAG, the recurring fee cannot be automatically deducted from your telebirr account. As a result, your NameTAG service will be suspended 30 days after the next recurring fee due date."
        },
        {
          "question": "How can I accept the telebirr Mandate request if I failed to authorize NameTAG earlier?",
          "answer": "If you failed to accept the telebirr Mandate request earlier, you can log in to the NameTAG web portal. On the dashboard, you will find an option to authorize recurring payments via telebirr by clicking the 'Accept' button. After clicking, you will receive a pop-up notification on your registered mobile number. Confirm the request by entering your telebirr PIN. Once verified, your mandate will be activated and recurring fee cycle will be processed on the due date."
        },

        {
          "question": "Can I pay for my individual NameTAG number's initial subscription fee using any telebirr account?",
          "answer": "Yes, you can pay the initial NameTAG fee (subscription fee + first recurring fee) using any telebirr account. After successful payment, your NameTAG will be linked to the provided mobile number."
        },
        {
          "question": "Can I pay the recurring fee for my individual NameTAG number from a different mobile number than the one linked to it?",
          "answer": "No, if you chose telebirr as a payment method using NameTAG Web portal or Mobile App,the recurring fee for your corporate NameTAG can only be paid using the telebirr account of the mobile number linked to the NameTAG. Additionally, the linked mobile number must accept and authorize the telebirr mandate to enable automatic recurring fee payments."
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
          "answer": "If you choose to turn off incoming calls, they will remain off for a maximum of 10 days. After that period, the NameTAG platform will automatically turn incoming calls back ON."
        },
        {
          "question": "How can I block or unblock mobile numbers or other NameTAG numbers?",
          "answer": "You can easily block or unblock unwanted numbers via the NameTAG management menu in USSD, the app, or the web portal."
        },
        {
          "question": "How can I set PIN code and protect my NameTAG number from unwanted incoming calls?",
          "answer": "You can enable the Incoming Call PIN feature to protect your NameTAG number. Set a single-digit PIN and share it with trusted contacts. Only callers who enter the correct PIN will be able to connect to your NameTAG number."

        },
        {
          "question": "Is setting a PIN for incoming calls optional or mandatory?",
          "answer": "Setting a PIN for incoming calls is optional. By default, your NameTAG number is open and anyone can call you according to your defined schedule. If you want to restrict incoming calls and only allow callers who enter a PIN, you can enable the PIN feature."
        },
        {
          "question": "How can my friends and family call my NameTAG number without entering the Incoming Call PIN?",
          "answer": "You can add your friends and family to the whitelist in the Incoming Call PIN section. Callers on the whitelist can connect to your NameTAG number without entering the PIN code."
        },
        {
          "question": "Can I remove the PIN for incoming calls?",
          "answer": "Yes, you can remove the PIN for incoming calls at any time through the management portal or USSD."
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
          "question": "When I change my existing NameTAG to a new one, will the old NameTAG remain linked to my number?",
          "answer": "No. Once you change your existing NameTAG and complete the payment, the old NameTAG will be released. You must select a new NameTAG from the available list and choose a package plan. The subscription fee and recurring fee will apply based on the selected new NameTAG."
        },
        {
          "question": "If my recurring fee for the existing NameTAG is pending, can I change my NameTAG?",
          "answer": "Yes, but you must first pay the outstanding recurring fee of existing NameTAG along with the subscription and recurring fees for the new NameTAG."
        },
        {
          "question": "What happens if I do not pay the recurring fee for my NameTAG number?",
          "answer": "Paying the recurring fee is mandatory to maintain your NameTAG service. If the recurring fee payment fails on your seelcted payment method( telebirr account or Ethio Airtime) on your mobile number , the service will be suspended and your NameTAG will be released from your mobile number."
        },
        {
          "question": "How can I unsubscribe from the NameTAG service?",
          "answer": "You can unsubscribe from any NameTAG number through the USSD, web portal or Mobile App. Once unsubscribed, the recurring fee will no longer be charged. Your NameTAG number will be removed from your number and NameTAG number will be released to the public and cannot be reclaimed."
        }
      ]);

    } else {
      setData([

        {
          "question": "What is the NameTAG service and what are the benefits for corporates and brands?",
          "answer": "NameTAG is a subscription-based Ethio Telecom service that allows corporates and brands to purchase short, branded numbers (e.g., #Ethio → #38446, #Brand → #27263) for incoming and outgoing calls with customers. Your NameTAG acts as your brand identity and provides an easy-to-remember contact number for your callers."

        },

        {
          "question": "How do I register with the NameTAG service and get a NameTAG number for my business number?",
          "answer": "You can register by visiting www.nametag.et. Create a corporate account using your valid company details and upload the required company documents. After document approval by Ethio Admin, you can reserve and purchase your preferred NameTAG number. You will receive SMS notification once NameTAG service administrator verify and approve the uploaded documents."
        },
        {
          "question": "Which documents are required to open a NameTAG account?",
          "answer": "To open a corporate NameTAG account, you must upload the following three valid documents: 1) Application Letter, 2) Registration License, and 3) Trade License."
        },
        {
          "question": "What is the estimated time to review and approve the documents?",
          "answer": "The estimated time to review and approve the documents is 24–48 hours. You will receive an SMS notification on your registered primary mobile number once the documents are approved or rejected by the Admin."
        },
        {
          "question": "Can I re-upload the company documents if they are rejected by the Admin or if I receive new documents from the government?",
          "answer": "Yes, you can re-upload the documents if they are rejected by the Admin or if you receive updated documents from government departments."

        },
        {
          "question": "How can I pay for my NameTAG number subscription fee?",
          "answer": "After documents approval, you must complete the payment through the telebirr within 24 hours to secure your reserved NameTAG number."
        },
        {
          "question": "How can I reserve a NameTAG of my choice and buy it later using my telebirr account?",
          "answer": "You can create an account at nametag.et and select and reserve a NameTAG number of your choice. You must complete the payment via your telebirr account within 24 hours to purchase the NameTAG. If the payment is not made within 24 hours, the reserved NameTAG will be released and made available for others to buy."
        },
        {
          "question": "When and how can I pay for my NameTAG number recurring fee?",
          "answer": "NameTAG service will deduct the recurring fees via the telebirr as per your selected billing cycle (monthly, quarterly, biannual, or yearly). The recurring fee cycle will start from service subscription date."
        },
        {
          "question": "Can I pay for my corporate NameTAG number's initial subscription fee using any telebirr account?",
          "answer": "Yes, you can pay the initial NameTAG fee (subscription fee + first recurring fee) using any telebirr account. After successful payment, your NameTAG will be linked to the provided mobile number."
        },
        {
          "question": "Can I pay the recurring fee for my corporate NameTAG number from a different mobile number than the one linked to it?",
          "answer": "No, the recurring fee for your corporate NameTAG can only be paid using the telebirr account of the mobile number linked to the NameTAG. Additionally, the linked mobile number must accept and authorize the telebirr mandate to enable automatic recurring fee payments."
        },
        {
          "question": "Can I pay the NameTAG number recurring fee using other payment methods like a bank account or mobile airtime?",
          "answer": "No, for corporate NameTAG accounts, the subscription and recurring fees can only be paid using an telebirr account."
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
          "question": "How can I set PIN code and protect my NameTAG number from unwanted incoming calls?",
          "answer": "You can enable the Incoming Call PIN feature to protect your NameTAG number. Set a single-digit PIN and share it with trusted contacts. Only callers who enter the correct PIN will be able to connect to your NameTAG number."

        },
        {
          "question": "Is setting a PIN for incoming calls optional or mandatory?",
          "answer": "Setting a PIN for incoming calls is optional. By default, your NameTAG number is open and anyone can call you according to your defined schedule. If you want to restrict incoming calls and only allow callers who enter a PIN, you can enable the PIN feature."
        },
        {
          "question": "How can my friends and family call my NameTAG number without entering the Incoming Call PIN?",
          "answer": "You can add your friends and family to the whitelist in the Incoming Call PIN section. Callers on the whitelist can connect to your NameTAG number without entering the PIN code."
        },
        {
          "question": "Can I remove the PIN for incoming calls?",
          "answer": "Yes, you can remove the PIN for incoming calls at any time through the management portal or USSD."
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

          "question": "When I change my existing NameTAG to a new one, will the old NameTAG remain linked to my number?",
          "answer": "No. Once you change your existing NameTAG and complete the payment, the old NameTAG will be released. You must select a new NameTAG from the available list and choose a package plan. The subscription fee and recurring fee will apply based on the selected new NameTAG."
        },
        {
          "question": "What is the telebirr Mandate and how can I accept it to process the recurring fee?",
          "answer": "The telebirr Mandate is a process that authorizes NameTAG to automatically deduct the recurring fee from your telebirr account. After subscribing to the NameTAG service and making the initial payment, you will receive a request to approve the telebirr Mandate, which you must verify using your telebirr PIN code once receive Pop-Up request on your number."

        },
        {
          "question": "What if I do not accept the telebirr Mandate request or do not authorize NameTAG?",
          "answer": "If you do not accept the telebirr Mandate request and do not authorize NameTAG, the recurring fee cannot be automatically deducted from your telebirr account. As a result, your NameTAG service will be suspended 30 days after the next recurring fee due date."
        },
        {
          "question": "How can I accept the telebirr Mandate request if I failed to authorize NameTAG earlier?",
          "answer": "If you failed to accept the telebirr Mandate request earlier, you can log in to the NameTAG web portal. On the dashboard, you will find an option to authorize recurring payments via telebirr by clicking the 'Accept' button. After clicking, you will receive a pop-up notification on your registered mobile number. Confirm the request by entering your telebirr PIN. Once verified, your mandate will be activated and recurring fee cycle will be processed on the due date."

        },
        {
          "question": "If my recurring fee for the existing NameTAG is pending, can I change my NameTAG?",
          "answer": "Yes, but you must first pay the outstanding recurring fee of existing NameTAG along with the subscription and recurring fees for the new NameTAG."

        },
        {
          "question": "Can I change my mobile number linked with my corporate NameTAG?",
          "answer": "Yes, you can change your mobile number that is linked with  your existing NameTAG. But you have to pay the outstandign recurring fee if any against existig Mobile number."

        },
        {
          "question": "What if I forget the password of my corporate NameTAG account?",
          "answer": "You can reset your password using the 'Forgot Password' option on the portal. To do so, you must have access to your registered mobile number and username. A OTP will be sent to your mobile number to complete the password reset process."
        },
        {
          "question": "What happens if I do not pay the recurring fee for my NameTAG number?",
          "answer": "Paying the recurring fee is mandatory to maintain your NameTAG service. If the recurring fee payment fails on your telebirr account, your NameTAG service will be suspended after 30 days of non-payment."

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