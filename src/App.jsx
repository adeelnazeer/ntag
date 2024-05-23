import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/header";
import BuyNametag from "./components/buyNametag";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Header /> */}
      <BuyNametag/>
    </>
  );
}

export default App;
