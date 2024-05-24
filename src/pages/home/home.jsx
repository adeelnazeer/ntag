import { Button } from "@headlessui/react";
import Carusal from "./components/carusal";
import Services from "./components/services";
import Footer from "../../components/footer";

const HomePage = () => {
  return (
    <>
      <div className=" px-6">
        <Carusal />
        <Services />
        <div className=" py-8 max-w-sm mx-auto">
          <Button className="w-full px-4 py-2 bg-secondary text-white text-[22px] font-semibold">
            BUY HASH TAG
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default HomePage;
