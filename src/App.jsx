import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/header";
import Layout from "./layout/layout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Header /> */}
    <Layout/>
    </>
  );
}

export default App;
