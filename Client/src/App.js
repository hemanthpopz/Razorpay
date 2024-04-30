import logo from "./logo.svg";
import "./App.css";
import Product from "./Product";
import { Route, Routes } from "react-router-dom";
import TransactionConfirmation from "./Confirmation/TransactionConfirmation";
import React, { useState } from "react";

export const PaymentContext = React.createContext();
export const NameContext = React.createContext();

export const NumberContext = React.createContext();


export const EmailContext = React.createContext()

export const ServiceContext = React.createContext()


export const ModeContext = React.createContext()

export function App() {
  const [paymentId, setPaymentId] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const [email, setEmail] = useState("");

  const [service, setService] = useState("");

  // const [time, setTime] = useState("");

  const [mode, setMode] = useState("");

  return (
    <PaymentContext.Provider value={[paymentId, setPaymentId]}>
      <NameContext.Provider value={[name, setName]}>

        <NumberContext.Provider value = {[number, setNumber]}>
          <EmailContext.Provider value={[email,setEmail]}>
            <ServiceContext.Provider value={[service,setService]}>

              <ModeContext.Provider value={[mode,setMode]}>

              

            

         
        
        <div className="App">
          <Routes>
            <Route path="/" element={<Product />} />
            <Route path="/success" element={<TransactionConfirmation />} />
          </Routes>
        </div>

        </ModeContext.Provider>
        </ServiceContext.Provider>
        </EmailContext.Provider>

        </NumberContext.Provider>
      </NameContext.Provider>
    </PaymentContext.Provider>
  );
}

export default App;
