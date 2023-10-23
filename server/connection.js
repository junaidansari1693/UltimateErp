const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/erpbackend";

const  connectToMongo = async()=>{
    try{
        await mongoose.connect(mongoURI)
        console.log("Connected to mongodb")
    }catch(err){
        console.log("error while connecting to mongo")
    }
}

module.exports = connectToMongo; 
