/* eslint-disable react/prop-types */
import Sidebar from "../components/sideBar";
import Header from "../components/header";
import Footer from "../components/footer";

const DashboardLayout = ({ children }) => {
  return (
    <div className=" h-screen flex flex-col">
      <Header />
      <div className=" flex-1 overflow-auto">
        <div className="bg-secondary py-6">
          <h1 className="text-center text-[36px] text-white font-bold">
            Corporate Name TAG
          </h1>
        </div>
        <div className="grid grid-cols-12 ">
          <div className="col-span-3">
            <Sidebar />
          </div>
          <div className="col-span-9 px-5 pt-4">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
