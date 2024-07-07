import Dashboardtable from "../components/dashboardtable";
import { useTagList } from "./hooks/useDashboard";

const DashboardPage = () => {
  const data = useTagList();
  return (
    <div>
      <Dashboardtable
        data={data?.data}
        pagination={data?.pagination}
        setPagination={data?.setPagination}
        metaData={data?.metaData}
        loading={data?.loading}
      />
    </div>
  );
};

export default DashboardPage;
