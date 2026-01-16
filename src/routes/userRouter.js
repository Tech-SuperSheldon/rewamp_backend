const express = require("express") ;
const userRouter = express.Router() ;

const bookDemo = require("../controller/userRegister") ;

userRouter.post("/bookDemo" , bookDemo) ;

module.exports = userRouter ;