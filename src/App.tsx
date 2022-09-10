import React from "react";
import "./App.css";
import Airdrop from "./components/Airdrop";
import Connect2Phantom from "./components/Connect2Phantom";

function App() {
  interface Mat {
    calc: (a: number, b: number) => number;
  }

  const Result: Mat = {
    calc: (a, b) => a * b,
  };

  return (
    <div className="">
      <p>Hello, there</p>
      <Connect2Phantom />

      <p>{Result.calc(2, 5)}</p>
    </div>
  );
}

export default App;
