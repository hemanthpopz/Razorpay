import React from 'react';
import { BrowserRouter as Router, Route, Switch,useNavigate} from 'react-router-dom';
import ServiceForm from './ServiceForm';
import { PaymentContext,NameContext,NumberContext,EmailContext,ServiceContext,ModeContext} from './App';

import axios from 'axios'
import { useContext } from 'react';
import TransactionConfirmation from './Confirmation/TransactionConfirmation'; // Import the confirmation page component


function Product() {
  const amount = 100;
  const currency = "INR";
  const receiptId = "qwsaq1";
  // const {value} = useContext(Context)

   
  
  const [paymentId,setPaymentId] = useContext(PaymentContext)


  const [name] = useContext(NameContext)

  const [number] = useContext(NumberContext)

  const [email] = useContext(EmailContext)

  const [service] = useContext(ServiceContext)


  const [mode] = useContext(ModeContext) 

  const date = new Date()

 const TimeOfPayment = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+'-'+date.getHours()+':'+date.getMinutes() 
  
  
  const navigate = useNavigate()




  const sendPaymentEmail = async () => {
    try {
      const emailData = { name, email };
      const emailResponse = await axios.post('http://localhost:5000/getData', emailData);
      console.log(emailResponse);
    } catch (error) {
      console.error('Error sending payment email:', error);
    }
  };
 
  
  const paymentHandler = async (e) => {


    await sendPaymentEmail()


    

    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    // console.log(order);
    var options = {
        key: "rzp_test_YevM2NUWc9LuLU", // Enter the Key ID generated from the Dashboard
        amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency,
        name: "Homaid", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response) {
          const body = {
            ...response,
          };
          
          const validateRes = await fetch(
            "http://localhost:5000/order/validate",
            {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const jsonRes = await validateRes.json();
          // console.log(jsonRes.paymentId);

          const PaymentID = jsonRes.paymentId

          if(jsonRes.msg === 'success'){

           

            setPaymentId(PaymentID)
            


            const toSendemailUrl = 'http://localhost:5000/getData'

            const toSendUserDetalsUrl  = 'http://localhost:5000/postData'

            const emailData = {
              name,email
            }


            const userData = {
              name,
              email,
              number,
              PaymentID,
              service,
              mode,
              TimeOfPayment
            }

            const emailResponse = await axios.post(toSendemailUrl,emailData)
            if(emailResponse.data === 'Success'){

              const sendUserData = await axios.post(toSendUserDetalsUrl,userData)
              if(sendUserData.data === 'success'){

                navigate('/success')

              }
            }



            
            
          }
        },
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          name: `${name}`, //your customer's name
          email: `${email}`,
          contact: `${number}`, //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
      e.preventDefault();
    
  };


  

  return (
    <div className="product">
      <h1 className="heading">Homaid's Pay</h1>
      <div className="service-form-container">
         <ServiceForm/>
         <button onClick={paymentHandler}>Pay</button>
      </div>
      
      <br />
      
    </div>
  );
}

export default Product;