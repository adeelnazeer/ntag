import Footer from "../../components/footer";
import Header from "../../components/header";
import HeaderNew from "../home2/components/HeaderNew";
import { MultiStepForm } from "./components/stepper";

const RegisterPage = () => {
  return (
    <div className="flex flex-col h-screen overflow-auto">
      <HeaderNew />
      <MultiStepForm />
      <Footer />
    </div>
  );
};
export default RegisterPage;
