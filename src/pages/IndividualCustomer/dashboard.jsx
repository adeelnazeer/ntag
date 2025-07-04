import { useState } from "react";
import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import Dashboardtable from "../../components/dashboardtable";
import PremiumTagsTable from "../../components/premiumTagsTable.jsx";
import { useTagListCustomer } from "../hooks/useDashboardCustomer.js";
import { useLocation } from "react-router-dom";

const DashboardPageCustomer = () => {
    const location = useLocation();
    const isExchangeFlow = location.state?.isExchangeFlow || false;
    const currentTagData = location.state?.currentTagData || null;
    const [activeTab, setActiveTab] = useState("corporate");
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
        loadingPayment
    } = useTagListCustomer();

    return (
        <div className=" mx-auto">
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
                suggestedNumbers={suggestedNumbers}
                handleTagDetails={handleTagDetails}
                loadingPayment={loadingPayment}
                isCustomer={true}
                isExchangeFlow={isExchangeFlow}
                currentTagData={currentTagData}
            />
        </div>
    );
};

export default DashboardPageCustomer;