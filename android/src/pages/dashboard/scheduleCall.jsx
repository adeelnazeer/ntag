// import TagNames from "../pages/buytagname";
// import Dashboard from "../pages/dashboard";
// import TagDetails from "../pages/tagDetails";
// import ProceedPayment from "../pages/proceedPayment";
// import Paymentsuccessful from "../modals/paymentsuccessful";
// import Nametagdetails from "../pages/nametagdetails";
import Schedulecall from "./";
import Sidebar from "../../components/sideBar";

const ScheduleCall = () => {
  return (
    <>
      <div className="bg-secondary py-6">
        <h1 className="text-center text-[36px] text-white font-bold">
          Corporate NameTAG
        </h1>
      </div>
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-9 px-5">
  
          <Schedulecall />
        </div>
      </div>
    </>
  );
};

export default ScheduleCall;
