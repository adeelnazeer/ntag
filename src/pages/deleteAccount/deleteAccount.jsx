import Footer from "../../components/footer";
import DeleteAccountForm from "../login/components/form";
import SimpleHeader from "./components/Header";

const DeleteAccount = () => {
    return (
        <div className="flex flex-col h-screen overflow-auto">
            <SimpleHeader />
            <DeleteAccountForm isDeleteAccount={true} />
            <Footer />
        </div>
    );
};
export default DeleteAccount;
