const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require('nodemailer')
require("dotenv").config();


const app = express();
app.use(cors())
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

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
    user: 'hemanthjyothula1@gmail.com',
    pass: 'izkwfpxdraphymco '
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
    redirectingUrl:'http://localhost:3000/success',
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});




app.post('/getData',(req,res) =>{

  const {email,name} = req.body 
  
   sendResetPasswordEmail(email,name)
})



const sendResetPasswordEmail = async (email,name) => {
  try {
    const mailOptions = {
      from: 'hemanthjyothula1@gmail.com', //enter your mail address
      to:email ,
      subject: 'Regarding Successfull Sevice Booking',
      html: `<div>
        <h1>Hi ${name},</h1>
        <h4>
        We’re so happy you had a great experience with company website. Our team works hard to create top-of-the-line solutions, and we’re ecstatic to hear that our service has been a good fit for your need.
        </h2>
        <h3>Thank you,</h2>
        <h2>Homaid Service </h1>
      </div>`
    };
    await transporter.sendMail(mailOptions);
    // console.log(`Reset password email sent to ${email} with token: ${token}`);
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
};

  
app.listen(PORT, () => {
    console.log("Listening on port", PORT);
  });