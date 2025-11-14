import Footer from "../../components/footer";
import Header from "../../components/header";
import { MultiStepForm } from "./components/stepper";

const RegisterPage = () => {
  return (
    <div className="flex flex-col h-screen overflow-auto">
      <Header />
      <MultiStepForm />
      <Footer />
    </div>
  );
};
export default RegisterPage;
