const validate = require("../utils/validator") ;
const User = require("../model/user") ;

const bookDemo = async(req,res)=>{

    try{
        console.log(req.body) ;
        // Validate for valid emailId and password using validator
        validate(req.body) ;
      
        // creating new document in DB
        let user = await User.create(req.body) ;

        
        console.log("Ok") ;
        
        res.status(200).json({
            user: user ,
            status: 200 ,
            message: "Registered Successfully"
        })

    }
    catch(err){
        res.status(400).send("Error: " + err) ;
    }
}

module.exports = bookDemo ;