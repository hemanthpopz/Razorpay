import React, { useContext } from 'react';
import { useParams,redirect} from 'react-router-dom';
import { PaymentContext } from '../App';
import { NameContext } from '../App';
import './index.css'
import { SiTicktick } from "react-icons/si";
import Logo from '../Images/Homaid-logo.webp'
const TransactionConfirmation = () => {
  // const { transactionId, name, address } = useParams();

  // const navigate = useNavigate()


  const [paymentId] = useContext(PaymentContext)


  const [name] = useContext(NameContext)

  // const [number] = useContext(Context)
  

  // console.log(name)

  return (
    <div className='confirmation-container'>
      {/* <div className='logo-container'>

        <img src={Logo} className='logo-image'/>
        <h1 className='logo-text'>Homaid</h1>

      </div> */}
      <SiTicktick className='right-tick'/>
      <h1 className='service-heading'>Service Booked Successfully !</h1>

      <h3 className='transaction-heading'>Transaction Details</h3>


      <div className='transaction-details-container'>

      <p>Name: {name} </p>
      {/* <p>NUmber: {number}</p> */}
      {/* <p>Name: {name}</p>
      <p>Address: {address}</p> */}
      {/* Display other transaction details */}
      </div>
    </div>
  );
};

export default TransactionConfirmation;
