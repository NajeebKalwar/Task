const mongoose = require('mongoose');
const uuid = require('uuid');
const bcryptjs = require("bcryptjs");


var userSchema = new mongoose.Schema({
    id:{
        type:String,
        unique:true,
        index:true,
    },   
    name:{
        type:String,
        required:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
   
    password:{
        type:String,
        required:true,

    },
    usertype:{
        type:String,
        required:true,
    }, 
},);

userSchema.pre("save",function(next){//save ke time kiya hoga
        this.id=uuid.v1();        
        this.password=bcryptjs.hashSync(this.password,8);
        next();
});


userSchema.pre(['update','findOneAndUpdate','updateOne'],function(next){
const update= this.getUpdate();
    delete update._id;
    delete update.id;
    // delete this.password;
    next();
});

const UserModel =mongoose.model('User', userSchema);//users collection

//Export the model
module.exports = UserModel;