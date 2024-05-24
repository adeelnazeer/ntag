import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./App.css";
import Header from "./components/header";
import BuyNametag from "./components/buyNametag";
import HomePage from "./pages/home/home";
import Login from "./pages/login";
import Footer from "./components/footer";
import { StepperWithContent } from "./pages/register/components/stepper";

function App() {
  return (
    <div className=" h-screen overflow-auto flex flex-col">
      <Header />
      {/* <HomePage /> */}
      <StepperWithContent />
      {/* <Login /> */}
      <Footer />
      {/* <BuyNametag/> */}
    </div>
  );
}

export default App;
