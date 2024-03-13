const express = require('express');
const axios = require('axios')
const app = express();

//GenerateToken
const createToken = async (req, res, next) => {
  const secret = " rYV3OD1MUPPKRZgtAQMbGl1I4GglgGBjUSgoLMytGADpwbRF";
  const consumer = "F3AGawTmg3cOOqlahGcGZZeU8jbWY0TCalFvxdlfdfPYGg8tWkmGSKFrL4BGsCxS";
  const auth = new Buffer.from(`${consumer}:${secret}`).toString("base64");
  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    )
    .then((data) => {
      token = data.data.access_token;
      console.log(data.data);
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
};
app.get('/token', (req, res) => {
    createToken();
})
app.post('/stk',GenerateToken, async(req, res) => {
    const amount = req.body.amount
    const phone = req.body.phone.substring(1)

    ///Password:Is a combination of (shortcode+passkey+timestamp)
     //https://github.com/victornjenga/mpesa-youtube
    /*
      PartyA = the Person making the Transaction
      PartYB = the organization recieving the payment
      AccountReference = It can be your Phone Number
    
    */
    const shortCode = 174379;
    const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'
    const date = new Date();
    const timestamp = date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0"+date.getSeconds()).slice(-2)
    
    const password = new Buffer.from(shortCode+passkey+timestamp).toString("base64")
    await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
           BusinessShortCode: shortCode,    
   Password: password,    
   Timestamp:timestamp,    
   TransactionType: "CustomerPayBillOnline",    
   Amount: amount,    
   PartyA:`254${phone}`,    
   PartyB:shortCode,    
   PhoneNumber:`254${phone}`,    
   CallBackURL: "https://mydomain.com/pat",    
   AccountReference:`254${phone}`,    
   TransactionDesc:"Test"
    }, {
        headers: {
            Authorization:`Bearer ${token}`
        }
    }).then((data) => {
        return res.json(data)
    }).catch((err)=>console.log(err.message))
})