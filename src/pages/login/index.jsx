import Footer from "../../components/footer";
import LoginForm from "./components/form";
import Header from "../../components/header";
import HeaderNew from "../home2/components/HeaderNew";

const Login = () => {
  return (
    <div className="flex flex-col h-screen overflow-auto">
      <HeaderNew />
      <LoginForm />
      <Footer />
    </div>
  );
};
export default Login;
