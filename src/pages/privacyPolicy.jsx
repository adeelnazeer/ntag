import React from 'react';
import Header from "../components/header";
import { Typography } from "@material-tailwind/react";

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6 my-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-secondary pb-2 border-b">
          NameTAG Privacy Policy
        </h1>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Introduction</h2>
          <Typography className="text-gray-700 mb-4">
            At Ethio Telecom ("we", "us", "our"), your privacy matters. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use the NameTAG service and related platforms.
          </Typography>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Definitions</h2>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">Personal Information:</span> Any information that identifies, relates to, or can be used to identify an individual.
            </li>
            <li className="mb-2">
              <span className="font-medium">Service:</span> The NameTAG virtual number service, including associated websites, apps, and platforms.
            </li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Information We Collect</h2>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">Personal Information:</span> Such as your name, email address, mobile number, and other identifiers provided during registration.
            </li>
            <li className="mb-2">
              <span className="font-medium">Usage Data:</span> Information on how you interact with the Service, including browsing history, search queries, and communication patterns.
            </li>
            <li className="mb-2">
              <span className="font-medium">Device Information:</span> Details like your IP address, device type, operating system, and browser type.
            </li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">How We Collect Information</h2>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">Directly from you:</span> When you register, contact support, or interact with the Service.
            </li>
            <li className="mb-2">
              <span className="font-medium">Automatically:</span> Using cookies and tracking technologies as you use our Service.
            </li>
            <li className="mb-2">
              <span className="font-medium">From third parties:</span> Including our partners, affiliates, social media and publicly available sources.
            </li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">How We Use Information</h2>
          <Typography className="text-gray-700 mb-2">
            We use your information to:
          </Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">Provide, operate, and maintain the NameTAG Service.</li>
            <li className="mb-2">Improve and personalize your user experience.</li>
            <li className="mb-2">Communicate important information, updates, and promotional offers (with your consent).</li>
            <li className="mb-2">Fulfill legal and regulatory requirements.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Disclosure of Information</h2>
          <Typography className="text-gray-700 mb-2">
            We may share your Personal Information with:
          </Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">
              <span className="font-medium">Service Providers:</span> Who assist in delivering and improving our services.
            </li>
            <li className="mb-2">
              <span className="font-medium">Partners and Affiliates:</span> For service expansion and customer support.
            </li>
            <li className="mb-2">
              <span className="font-medium">Law Enforcement or Regulatory Authorities:</span> When required to comply with legal obligations or protect rights and safety.
            </li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Cookies and Tracking Technologies</h2>
          <Typography className="text-gray-700 mb-2">
            We use cookies and similar technologies to:
          </Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">Analyze and understand how our Service is used.</li>
            <li className="mb-2">Personalize your experience and content.</li>
            <li className="mb-2">Enhance Service functionality and security.</li>
          </ul>
          <Typography className="text-gray-700 mb-2">
            You can manage your cookie preferences through your device or browser settings.
          </Typography>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Your Rights</h2>
          <Typography className="text-gray-700 mb-2">
            You have the right to:
          </Typography>
          <ul className="list-disc pl-6 mb-3 text-gray-700">
            <li className="mb-2">Access and review your Personal Information.</li>
            <li className="mb-2">Request corrections or updates.</li>
            <li className="mb-2">Object to the processing of your information in certain circumstances.</li>
            <li className="mb-2">Request deletion of your Personal Information (subject to legal obligations).</li>
            <li className="mb-2">Opt out of receiving marketing communications at any time.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Security</h2>
          <Typography className="text-gray-700 mb-4">
            We implement appropriate technical and organizational security measures to protect your Personal Information from unauthorized access, disclosure, alteration, and destruction.
          </Typography>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Data Retention</h2>
          <Typography className="text-gray-700 mb-4">
            We retain your Personal Information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </Typography>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Changes to This Privacy Policy</h2>
          <Typography className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. Changes will be posted on our website, and we encourage you to review it periodically.
          </Typography>
        </section>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Acceptance of the Privacy Policy</h2>
          <Typography className="text-gray-700 mb-4">
            By using the NameTAG Service, you confirm that you have read, understood, and agreed to the terms of this Privacy Policy.
          </Typography>
        </section>
      </div>
    </>
  );
};

export default PrivacyPolicy;