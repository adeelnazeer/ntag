/* eslint-disable react/prop-types */
import { useLocation } from "react-router-dom";
import Header from "../components/header";
import TermAndCondition from '../utilities/termAndCondition.json'
import PrivacyPolicy from '../utilities/privacyPolicy.json'


const DocumentRenderer = ({ data }) => {
    return (
      <div className="p-6 max-w-4xl mx-auto">
         <p className=" text-base font-bold text-center mb-8">
         {data.documentTitle}
                        </p>
         {data.sections.map((section, index) => (
          <div key={index} className="mb-6 text-[#232323]">
            <h2 className="text-base font-medium mb-4 pt-2">{section.title}</h2>
            {section.content.map((content, idx) => {
              switch (content.type) {
                case 'paragraph':
                  return (
                    <p key={idx} className="text-sm mb-4 ">
                      {content.text}
                    </p>
                  );
  
                case 'definition':
                  return (
                    <div key={idx} className="mb-4">
                      <strong className="text-gray-800 text-sm">{content.term}: </strong>
                      <span className="text-sm">{content.definition}</span>
                    </div>
                  );
  
                case 'list':
                  return (
                    <ul key={idx} className="list-disc list-inside space-y-2 ml-6 text-sm mb-4">
                      {content.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          {/* Check if the item has title and description for complex lists */}
                          {item.title && <strong className="font-medium">{item.title}: </strong>}
                          {item.description && <span>{item.description}</span>}
                          
                          {/* If item is a simple string, render directly */}
                          {typeof item === 'string' && item}
                          
                          {/* Render sub-items if they exist */}
                          {item.subItems && (
                            <ul className="list-decimal list-inside ml-4 mt-1">
                              {item.subItems.map((subItem, subIdx) => (
                                <li key={subIdx}>{subItem}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  );
  
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>
    );
  };
  

const TermOfUse = () => {
    const location = useLocation()
    return (
        <div className=" flex flex-col">
            <Header />
            <div className="p-3 flex-1">
                <div className="w-full h-full  max-w-5xl mx-auto  bg-[#fff] rounded-[24px] shadow-sm">
                    <div className="p-4 pb-8">
                        <DocumentRenderer data={location?.pathname=="/term-of-use"?TermAndCondition:PrivacyPolicy}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TermOfUse;
