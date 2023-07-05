var mongoose = require("mongoose")
require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
})
.then((res)=>{
    console.log("Database Connected Succesfully")
})
.catch((err)=>{
    console.log("database connection failed"+err.message)
})

global.Promise;

