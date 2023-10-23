const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstname :{
        type : String,
        required: true
    },
    AdmissionYear:{
        type: String,
        required: true
    },
   Branch:{
        type: String,
        required: true
        
    },
    email:{
        type: String,
        required: true
        
    },
    password:{
        type: String,
        required: true
    },
    
    mcaprn:{
        type: String,
        default: function () {
            //return this.name + "MCA"+Math.floor(Math.random() * 100);
            return "REG"+this.AdmissionYear+"-"+this.firstname+new Date().getSeconds();
          },
    },
    typeUser:{
        type: String,
        default: function () {
            //return this.name + "MCA"+Math.floor(Math.random() * 100);
            return "User";
          }
    }

});

const User = mongoose.model('user', UserSchema);

module.exports = User