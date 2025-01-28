const mongoose= require('mongoose');

mongoose.connect(process.env.MONGOOSE_STR);

const db= mongoose.connection;

db.on("connected",()=>{
 console.log("database connection successful")
})
db.on("error",()=>{
    console.log("error while connecting to database")
})

module.exports=db;