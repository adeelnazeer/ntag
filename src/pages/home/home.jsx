import { Button } from "@headlessui/react";
import Carusal from "./components/carusal";
import Services from "./components/services";
import Footer from "../../components/footer";
import Header from "../../components/header";

const HomePage = () => {
  return (
    <>
      <Header />
      <div className=" md:px-6 px-2">
        <Carusal />
        <Services />
        <div className=" py-8 max-w-sm mx-auto">
          <Button className="w-full md:px-4 px-2 py-2 bg-secondary text-white text-[22px] font-semibold">
            BUY HASH TAG
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default HomePage;
