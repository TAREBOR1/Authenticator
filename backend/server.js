const dotenv= require('dotenv');
dotenv.config({path:"./config.env"});
const DB= require('./config/dbconfig')
const PORT=process.env.PORT_NUMBER
const app= require('./app')


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})
