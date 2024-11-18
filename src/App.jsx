import "react-responsive-carousel/lib/styles/carousel.min.css";
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
 import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/home";
import { ConstentRoutes } from "./utilities/routesConst";
import Login from "./pages/login";
import RegisterPage from "./pages/register";
import DashboardLayout from "./layout/layout";
import Schedulecall from "./pages/schedulecall";
import DashboardPage from "./pages/dashboard";
import TagNames from "./pages/buytagname";
import TagDetails from "./pages/tagDetails";
import ProceedPayment from "./pages/proceedPayment";
import Nametagdetails from "./pages/nametagdetails";
import ProfilePage from "./pages/profile";
import { ToastContainer } from "react-toastify";
import Voicemail from "./pages/voicemail";
import TermOfUse from "./pages/termOfUser";
import ForgetPassword from "./pages/forgetPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path={ConstentRoutes.home} element={<HomePage />} />
        <Route path={ConstentRoutes.login} element={<Login />} />
        <Route path={ConstentRoutes.register} element={<RegisterPage />} />
        <Route path={ConstentRoutes.forgetPassword} element={<ForgetPassword />} />

        <Route
          path={ConstentRoutes.dashboard}
          element={
            <DashboardLayout>
              <TagNames />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.manageTagName}
          element={
            <DashboardLayout>
              <Schedulecall />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.buyTag}
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.tagDetail}
          element={
            <DashboardLayout>
              <TagDetails />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.processPayment}
          element={
            <DashboardLayout>
              <ProceedPayment />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.nameTagDetail}
          element={
            <DashboardLayout>
              <Nametagdetails />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.profilePage}
          element={
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.voiceMail}
          element={
            <DashboardLayout>
              <Voicemail />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.termofuse}
          element={
            <TermOfUse />
          }
        />
        <Route
          path={ConstentRoutes.privacyPolicy}
          element={
            <TermOfUse />
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        zIndex={50}
      />
    </>
  );
}

export default App;
