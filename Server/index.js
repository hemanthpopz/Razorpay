const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");


const bodyParser = require('body-parser')


const {v4:uuidv4} = require('uuid')

const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cors());


const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "customer.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
   
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hemanthjyothula1@gmail.com",
    pass: "izkwfpxdraphymco ",
  },
});

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    redirectingUrl: "http://localhost:3000/success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});


const razorpay = new Razorpay({

  key_id:'rzp_test_YevM2NUWc9LuLU',
  key_secret:'0CbqnGxL3YDMSotFgHZq4rqi'
})

app.post("/getData", async (req, res) => {

    const { email, name } = req.body;
  try {

    const orderOptions = {
      amount:1000,
      currency:'INR',
      receipt:uuidv4(),
      payment_capture:1
    };


    const order = await razorpay.orders.create(orderOptions)

    const paymentLink = `https://api.razorpay.com/v1/checkout?order_id=${order.id}`
    

    const mailOptions = {
      from: 'hemanthjyothula1@gmail.com',
      to: email,
      subject: 'Payment Link for Homaid Services',
      html: `
        <div>
          <h1>Hi ${name},</h1>
          <p>Click the following link to proceed with your payment:</p>
          <a href="${paymentLink}">Proceed to Payment</a>
          <p>If you have any questions, feel free to contact us.</p>
          <p>Thank you for choosing Homaid Services!</p>
        </div>
      `
    };

    
    
    
    
    await transporter.sendMail(mailOptions);

    // sendResetPasswordEmail(email, name);
    // res.send('Success')

    // res.status(200).json({ message: 'Payment link sent successfully.' });

    
  } catch (error) {

    console.error('Error sending payment email:', error);
    // res.status(500).json({ error: 'Internal server error.' });

    
  }
});

// const sendResetPasswordEmail = async (email, name) => {
//   try {
//     const mailOptions = {
//       from: "hemanthjyothula1@gmail.com", //enter your mail address
//       to: email,
//       subject: "Regarding Successfull Sevice Booking",
//       html: `<div>
//         <h1>Hi ${name},</h1>
//         <h4>
//         We’re so happy you had a great experience with company website. Our team works hard to create top-of-the-line solutions, and we’re ecstatic to hear that our service has been a good fit for your need.
//         </h2>
//         <h3>Thank you,</h2>
//         <h2>Homaid Service </h1>
//       </div>`,
//     };
//     await transporter.sendMail(mailOptions);
  
//   } catch (error) {
   
//   }
// };

app.post("/postData", async (req, res) => {
  const { name, email,number, PaymentID, service, mode, TimeOfPayment } = req.body;

  const post_query = `INSERT INTO customer_details(name,email,payment_id,service,mode,time_of_payment,number) VALUES(
  '${name}',
  '${email}',
  '${PaymentID}',
  '${service}',
  '${mode}',
  '${TimeOfPayment}',
  ${number}
  );
  `;


  const response = await db.run(post_query)

  res.send('success')



});



app.get('/allCustomersDetails',async(req,res) =>{


  const get_query = `SELECT * FROM customer_details;`;
  
  
  const response = await db.all(get_query)

  res.send(response)



})



app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
