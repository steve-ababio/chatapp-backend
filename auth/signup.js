const router = require('express').Router();
const bcrypt = require('bcrypt');
const usermodel = require('../model/model').usermodel

const SALTROUNDS = 10; 
const hashpassword = async(password)=>{
    return await bcrypt.hash(password,SALTROUNDS)
}
const saveusertodb = async(user) =>{
    return await user.save();
}
const checkusernameduplicate = async(username)=>{
    return await usermodel.findOne({username:username});

}
router.post("/signup",async(req,res)=>{
    const {username,password} = req.body;
    console.log(username.toLowerCase())
    const duplicateresult = await checkusernameduplicate(username.toLowerCase());
    console.log("duplicate",duplicateresult)
    if(duplicateresult === null)
    {
        const hashedpassword =  await hashpassword(password);
        const user = new usermodel({username:username.toLowerCase(),password:hashedpassword});
        const result =  await saveusertodb(user);    
        return res.status(200).json({inserted:true,msg:'signup successful'});        
    }
    return res.status(401).json({inserted:false,msg:'username is not available'})
})

module.exports = router;