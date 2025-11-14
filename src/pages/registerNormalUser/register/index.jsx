import Footer from "../../../components/footer";
import Header from "../../../components/header";
import UserForm from "./form";

const RegisterPageNormalUser = () => {
    return (
        <div className="flex flex-col h-screen overflow-auto">
            <Header />
            <UserForm />
            <Footer />
        </div>
    );
};
export default RegisterPageNormalUser;
