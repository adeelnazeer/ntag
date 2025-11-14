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
import CreateOrder from "./pages/createOrder";
import BlockUnblock from "./pages/blockUnblock.jsx";
import Unsubscribe from "./pages/unsubscribe.jsx";
import RegisterPageNormalUser from "./pages/registerNormalUser/register";
import TagNamesIndividual from "./pages/IndividualCustomer/buyNameTag";
import DashboardLayoutCustomer from "./layout/customerLayout";
import DashboardPageCustomer from "./pages/IndividualCustomer/dashboard";
import TagDetailsCustomer from "./pages/IndividualCustomer/tagDetail";
import ProfilePageCustomer from "./pages/IndividualCustomer/profilPage";

import SchedulecallCustomer from "./pages/IndividualCustomer/schedulecall.jsx";
import BlockUnblockCustomer from "./pages/IndividualCustomer/blockUnblock.jsx";
import UnsubscribeCustomer from "./pages/IndividualCustomer/unsubscribe.jsx";
import ChangeMyTAG from "./pages/IndividualCustomer/changeMyTag.jsx";
import FAQ from "./pages/FAQ.jsx";
import PrivacyPolicy from "./pages/privacyPolicy.jsx";
import ContactUs from "./pages/contactUs.jsx";
import ContactUsPublic from "./pages/contactUsPublic.jsx";
import ContactUsIndividual from "./pages/IndividualCustomer/contactUs.jsx";
import ChangePassword from "./pages/changePassword/index.jsx";
import CloseAccount from "./pages/closeAccount.jsx";
import ChangeMyTag from "./pages/changeMyTag.jsx";
import CloseAccountCustomer from "./pages/IndividualCustomer/closeAccount.jsx";
import ChangeNumber from "./pages/changeNumber.jsx";
import ChangeNumberDetailPage from "./pages/changeNumberDetailPage.jsx";
import CallPinPage from "./pages/callPin.jsx";
import CallPinPageIndividual from "./pages/IndividualCustomer/callPinIndividual.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path={ConstentRoutes.home} element={<HomePage />} />
        <Route path={ConstentRoutes.login} element={<Login />} />
        <Route path={ConstentRoutes.register} element={<RegisterPage />} />
        <Route path={ConstentRoutes.forgetPassword} element={<ForgetPassword />} />

        <Route path={ConstentRoutes.changePassword} element={
          <DashboardLayout>
            <ChangePassword isCustomer={false} />
          </DashboardLayout>
        }
        />


        {/* Normal User Registration Route */}
        <Route path={ConstentRoutes.registerNormalUser} element={<RegisterPageNormalUser />} />
        <Route path={ConstentRoutes.changePasswordCustomer} element={
          <DashboardLayoutCustomer >
            <ChangePassword isCustomer={true} />
          </DashboardLayoutCustomer>
        }
        />
        <Route
          path={ConstentRoutes.dashboardCustomer}
          element={
            <DashboardLayoutCustomer>
              <TagNamesIndividual />
            </DashboardLayoutCustomer>
          }
        />
        <Route
          path={ConstentRoutes.buyTagCustomer}
          element={
            <DashboardLayoutCustomer>
              <DashboardPageCustomer />
            </DashboardLayoutCustomer>
          }
        />

        <Route
          path={ConstentRoutes.tagDetailCustomer}
          element={
            <DashboardLayoutCustomer>
              <TagDetailsCustomer />
            </DashboardLayoutCustomer>
          }
        />

        <Route
          path={ConstentRoutes.profilePageCustomer}
          element={
            <DashboardLayoutCustomer>
              <ProfilePageCustomer />
            </DashboardLayoutCustomer>
          }
        />

        {/* New Customer Manage NameTAG Routes */}
        <Route
          path={ConstentRoutes.manageTagNameCustomer}
          element={
            <DashboardLayoutCustomer>
              <SchedulecallCustomer />
            </DashboardLayoutCustomer>
          }
        />
        <Route
          path={ConstentRoutes.changeMyTAG}
          element={
            <DashboardLayoutCustomer>
              <ChangeMyTAG />
            </DashboardLayoutCustomer>
          }
        />
        <Route
          path={ConstentRoutes.incomingCallPin}
          element={
            <DashboardLayoutCustomer>
              <CallPinPageIndividual />
            </DashboardLayoutCustomer>
          }
        />
        <Route
          path={ConstentRoutes.blockUnblockTagCustomer}
          element={
            <DashboardLayoutCustomer>
              <BlockUnblockCustomer />
            </DashboardLayoutCustomer>
          }
        />
        <Route
          path={ConstentRoutes.unsubTagCustomer}
          element={
            <DashboardLayoutCustomer>
              <UnsubscribeCustomer />
            </DashboardLayoutCustomer>
          }
        />

        <Route
          path={ConstentRoutes.closeAccountCustomer}
          element={
            <DashboardLayoutCustomer>
              <CloseAccountCustomer />
            </DashboardLayoutCustomer>
          }
        />

        <Route
          path={"individual/contact"}
          element={
            <DashboardLayoutCustomer>
              <ContactUsIndividual />
            </DashboardLayoutCustomer>

          }
        />
        {/* End of Customer Manage NameTAG Routes */}

        {/* Normal User Registration Route End */}

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
          path={ConstentRoutes.blockUnblockTag}
          element={
            <DashboardLayout>
              <BlockUnblock />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.corporateCallPin}
          element={
            <DashboardLayout>
              <CallPinPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.changeNumber}
          element={
            <DashboardLayout>
              <ChangeNumber />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.changeNumberDetailPage}
          element={
            <DashboardLayout>
              <ChangeNumberDetailPage />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.UnSUBblockTag}
          element={
            <DashboardLayout>
              <Unsubscribe />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.changeMyTAGCorporate}
          element={
            <DashboardLayout>
              <ChangeMyTag />
            </DashboardLayout>
          }
        />
        <Route
          path={ConstentRoutes.closeAccount}
          element={
            <DashboardLayout>
              <CloseAccount />
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
          path={ConstentRoutes.FrequentlyAskedQuestions}
          element={
            <FAQ />
          }
        />

        <Route
          path={"/contact"}
          element={
            <DashboardLayout>
              <ContactUs />
            </DashboardLayout>

          }
        />
        <Route
          path={"/contact-us"}
          element={
            <ContactUsPublic />

          }
        />

        <Route
          path={'/confirm-order'}
          element={
            <DashboardLayout>
              <CreateOrder />
            </DashboardLayout>
          }
        />

        <Route
          path={ConstentRoutes.privacyPolicy}
          element={
            <PrivacyPolicy />
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={9000}
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