/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import Header from "../components/header";

import React from 'react';
import { termsData } from "../utilities/termAndCondition";

const TermOfUse = () => {


  const renderContent = (content) => {
    return content.map((item, idx) => {
      if (item.type === "paragraph") {
        return <p key={idx} className="mb-3 text-gray-700">{item.text}</p>;
      } else if (item.type === "subtitle") {
        return <h4 key={idx} className="text-base font-medium mb-2 mt-4 text-gray-800">{item.text}</h4>;
      } else if (item.type === "list") {
        return (
          <ul key={idx} className="list-disc pl-6 mb-3 text-gray-700">
            {item.items.map((listItem, listIdx) => (
              <li key={listIdx} className="mb-2">
                {listItem.title && <span className="font-medium">{listItem.title}: </span>}
                {listItem.description}
                {listItem.subItems && (
                  <ul className="list-disc pl-5 mt-1">
                    {listItem.subItems.map((subItem, subIdx) => (
                      <li key={subIdx} className="mt-1 text-gray-600">{subItem}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        );
      } else if (item.type === "definition") {
        return (
          <div key={idx} className="mb-3">
            <span className="font-semibold">{item.term}: </span>
            <span className="text-gray-700">{item.definition}</span>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4 my-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-secondary pb-2 border-b">
          {termsData.documentTitle}
        </h1>
        
        <div className="mb-6">
          {termsData.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <div className="bg-gray-100 py-2 px-4 rounded-t-lg ">
                <h3 className="text-lg font-medium text-gray-800">
                  {index + 1}. {section.title}
                </h3>
              </div>
              
              <div className="px-4 py-3 border border-gray-200 border-t-0 rounded-b-lg">
                {renderContent(section.content)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TermOfUse;