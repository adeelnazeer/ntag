import "react-responsive-carousel/lib/styles/carousel.min.css";
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

function App() {
  return (
    <>
      <Routes>
        <Route path={ConstentRoutes.home} element={<HomePage />} />
        <Route path={ConstentRoutes.login} element={<Login />} />
        <Route path={ConstentRoutes.register} element={<RegisterPage />} />
        <Route
          path={ConstentRoutes.dashboard}
          element={
            <DashboardLayout>
              <DashboardPage />
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
              <TagNames />
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
      </Routes>
    </>
  );
}

export default App;
