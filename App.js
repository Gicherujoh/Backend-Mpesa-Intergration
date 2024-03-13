const express = require('express');
const axios = require('axios')
const app = express();
app.use(express.json())
const GenerateToken = async (req, res, next) => {
    const consumerKey = ' l9evY3M5U1rizFVLCAg4eG2xkruJMNDA8rLu3jzO2Yxh28NM';
    const consumerSecret = 'dTqp2YGKwQ2CrrA9AUF9HucCFRAtsrzFI4Z5NrHHJXMUWvVw3nAVGAXHMF8EQXGx'
    const auth = new Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
    axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        headers: {
            authorization:`Basic ${auth}`
        }
    }).then((res) => {
        console.log(res.data)
        token = res.data.access_token
        next();
    }).catch((err) => {
        console.log(err)
    })
}
app.get('/token', (req, res) => {
    GenerateToken();
})
app.post('/stk',GenerateToken, async (req, res) => {
    const shortCode = 174379;
    const Phone= "0768795006"
  const phone = Phone.substring(1);
  const amount = 1;
  const passkey ="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
  const password = new Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );
    const data = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: `254${phone}`,
    PartyB: 174379,
    PhoneNumber: `254${phone}`,
    CallBackURL: "https://shiny-steaks-fetch.loca.lt/callback",
    AccountReference: "Mpesa Test",
    TransactionDesc: "Testing stk push",
  };

  await axios
    .post(url, data, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((data) => {
      
      res.status(200).json(data.data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err.message);
    });
})
app.post('/callback', async(req, res) => {
  const result = req.body;
  return res.json(result)
})

app.listen(3000,()=>console.log('Server running on port 3000'))