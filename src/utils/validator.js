const validator = require("validator") ;

const validate = (data)=>{

    // Checking if there is any missing field 
    const maindatoryField = ['fullName' , 'email' , 'mobile' , 'grade' , 'subject'] ;

    const isAllowed = maindatoryField.every((key)=> Object.keys(data).includes(key)) ;

    if(!isAllowed)
        throw new Error("Some Field is missing") ;

    // checking for valid emailId
    if(!validator.isEmail(data.email))
        throw new Error("Invalid Credentials") ;

    

}

module.exports = validate ;