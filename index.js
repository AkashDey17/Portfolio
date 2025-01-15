
if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable TLS verification only in development
}


const express = require("express");
const app = express();
const nodeMailer = require("nodemailer");
const path = require("path");
const port = 8080;




app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));


// app.get("/blog", (req, res) => {
//   res.render("blog.ejs");
// });

app.get("/",(req,res) => {
  res.render("index.ejs");
})

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/send-email", async (req, res) => {
 
  const { name, email, text } = req.body;

  let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  let mailOptions = {
    from:  process.env.EMAIL,
    to:  process.env.SENDER,
    subject: "Someone wanted to reach out to you from your Portfolio",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${text}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.redirect("/");
    
    
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send email");
  }
});


app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});