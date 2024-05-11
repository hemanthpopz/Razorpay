import React, { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  PaymentContext,
  NameContext,
  NumberContext,
  EmailContext,
  ServiceContext,
  ModeContext,
} from "../App";

import "./index.css";
import { SiTicktick } from "react-icons/si";

import axios from "axios";
import { useEffect } from "react";

import { FaLongArrowAltLeft } from "react-icons/fa";
import Logo from "../Images/Homaid-logo.webp";
const TransactionConfirmation = () => {
  // const { transactionId, name, address } = useParams();

  // const navigate = useNavigate()

  const [customerDetals, setCustomerDetails] = useState([]);

  const [paymentId] = useContext(PaymentContext);

  const [name] = useContext(NameContext);

  const [number] = useContext(NumberContext);

  const [email] = useContext(EmailContext);

  const [service] = useContext(ServiceContext);

  const [mode] = useContext(ModeContext);

  const date = new Date();

  const TimeOfPayment =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    "-" +
    date.getHours() +
    ":" +
    date.getMinutes();

  useEffect(() => {
    toGetCustomerDetails();
  }, [customerDetals]);

  const toGetCustomerDetails = async () => {
    const url = "http://localhost:5000/allCustomersDetails";
    const response = await axios.get(url);

    setCustomerDetails(response.data);
  };

  if (paymentId === "") {
    return <Navigate to="/" />;
  }

  return (
    <div className="confirmation-container">
      {/* <div className='logo-container'>

        <img src={Logo} className='logo-image'/>
        <h1 className='logo-text'>Homaid</h1>

      </div> */}
      <SiTicktick className="right-tick" />
      <h1 className="service-heading">Service Booked Successfully !</h1>

      <div className="main-transaction-container">

      

      {customerDetals.map((eachCustomer) => {
        return (
          <div className="each-transaction-container">
            <h3 className="transaction-heading">
              <span>{eachCustomer.name}</span>
            </h3>

            <div className="transaction-details-container">
              <p>
                Transaction Id : <span>{eachCustomer.payment_id}</span>{" "}
              </p>
              <p>
                Number : <span>{eachCustomer.number}</span>
              </p>
              <p>
                Email : <span>{eachCustomer.email}</span>
              </p>
              <p>
                Service Type : <span>{eachCustomer.service}</span>
              </p>
              <p>
                Time Of Payment : <span>{eachCustomer.time_of_payment}</span>{" "}
                <span></span>
              </p>
              <p>
                Payment Method : <span>{eachCustomer.mode}</span>
              </p>
            </div>
          </div>
        );
      })}


</div>

      <div className="redirect-container">
        <Link className="link" to="/">
          <div className="arrow-container">
            <FaLongArrowAltLeft className="arrow-icon" />

            <p>Home Page</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TransactionConfirmation;
