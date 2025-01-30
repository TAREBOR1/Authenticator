const express= require('express');
const app= express();
const authroute= require('./routes/auth')
const userRoute= require('./routes/user')
const cookieParser=require("cookie-parser")
const cors= require("cors")
app.use(express.json())
app.use(cookieParser())
app.use(cors({ 
  origin: "https://authenticator7.netlify.app",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.options("*", cors()); // ✅ Allow preflight requests

app.use('/api/auth',authroute)
app.use('/api/user',userRoute)

module.exports=app
