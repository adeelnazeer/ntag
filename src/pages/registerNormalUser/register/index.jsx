import Footer from "../../../components/footer";
import HeaderNew from "../../home2/components/HeaderNew";
import UserForm from "./form";

const RegisterPageNormalUser = () => {
    return (
        <div className="flex flex-col h-screen overflow-auto">
            <HeaderNew />
            <UserForm />
            <Footer />
        </div>
    );
};
export default RegisterPageNormalUser;
