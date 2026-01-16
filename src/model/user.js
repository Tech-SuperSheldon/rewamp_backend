const mongoose = require("mongoose") ;
const {Schema} = mongoose ;

const userSchema = new Schema({
    fullName: {
        type:String,
        required: true,
        minLength: 3 ,
        maxLength: 20
    } ,
    email: {
        type: String ,
        required: true ,
        trim: true ,
        lowercase: true ,
        immutable: true
    },
    mobile:{
        type : Number ,
        required: true ,
        immutable: true 
    } ,
    grade:{
        type : String ,
        required: true ,
        minLength: 1 ,
        maxLength: 8 
    } ,
    subject: {
        type : String ,
        required: true ,
        minLength: 3 ,
        maxLength: 15
    }
},{
    timestamps: true
})

const User = mongoose.model("user" , userSchema) ;

module.exports = User ; 