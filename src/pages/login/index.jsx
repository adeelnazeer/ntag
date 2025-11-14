import Footer from "../../components/footer";
import LoginForm from "./components/form";
import Header from "../../components/header";

const Login = () => {
  return (
    <div className="flex flex-col h-screen overflow-auto">
      <Header />
      <LoginForm />
      <Footer />
    </div>
  );
};
export default Login;
