import { useState } from "react";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import Dashboardtable from "../components/dashboardtable";
import PremiumTagsTable from "../components/premiumTagsTable.jsx";
import { useTagList } from "./hooks/useDashboard";
import { useLocation } from "react-router-dom";

const DashboardPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("corporate");
  const isExchangeFlow = location.state?.isExchangeFlow || false;
  const currentTagData = location.state?.currentTagData || null;

  const {
    data,
    pagination,
    setPagination,
    metaData,
    loading,
    filters,
    searchMessage,
    subscriberTags,
    vipTags,
    suggestedNumbers,
    handleTagDetails,
    loadingPayment,
    Catfilters
  } = useTagList();

  return (
    <div className=" mx-auto">
      <div className=" flex md:gap-6 gap-1 mb-5 items-center">
        <div
          className={`py-3 text-sm md:text-base px-3 md:min-w-60 text-center cursor-pointer shadow-lg  text-white rounded-xl font-bolder ${activeTab === "corporate" ? "bg-secondary" : "bg-gray-500"}`}
          onClick={() => setActiveTab("corporate")}
        >
          Corporate NameTAG

        </div>
        {/* <div
          className={`py-3 text-sm md:text-base px-3 md:min-w-60 text-center cursor-pointer shadow-lg  text-white rounded-xl font-bolder ${activeTab === "premium" ? "bg-secondary" : "bg-gray-500"}`}
          onClick={() => setActiveTab("premium")}
        >
          Premium NameTAG

        </div> */}
      </div>


      {activeTab === "corporate" && (
        <Dashboardtable
          data={data}
          pagination={pagination}
          setPagination={setPagination}
          metaData={metaData}
          loading={loading}
          filters={filters}
          searchMessage={searchMessage}
          subscriberTags={subscriberTags}
          vipTags={vipTags}
          isExchangeFlow={isExchangeFlow}
          currentTagData={currentTagData}
          suggestedNumbers={suggestedNumbers}
          handleTagDetails={handleTagDetails}
          loadingPayment={loadingPayment}
          Catfilters={Catfilters}
        />
      )}

      {/* {activeTab === "premium" && (
        <PremiumTagsTable handleTagDetails={handleTagDetails}
          isExchangeFlow={isExchangeFlow}
          currentTagData={currentTagData}
        />
      )} */}
    </div>
  );
};

export default DashboardPage;