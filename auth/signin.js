const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usermodel = require('../model/model').usermodel
const TOKEN_SECRET = "WJEJ&*#*#()@)sn<>s>>.?//MS";

const comparepasswords = async(password,hashedpassword)=>{
   const result = await bcrypt.compare(password,hashedpassword);
   return result;
}
const createtoken = (payload)=>{
    const token = jwt.sign({username:payload},TOKEN_SECRET,{expiresIn:"120h"});
    return token
}
const finduser = async(username)=>
{
    return await usermodel.findOne({username:username})
}
router.post("/signin",async(req,res)=>{
    const {username,password} = req.body;
    const result = await finduser(username);
    console.log(result)
    if(result === null)
        return res.status(401).json({isauth:false}); 
    const passwordresult = await comparepasswords(password,result.password);;
    if(!passwordresult){
        return res.status(401).json({isauth:false});      
    }
    const token = createtoken(username);
    return res.status(200).json({userID:result._id,username:username,token:token,isauth:true});
})

module.exports = router;