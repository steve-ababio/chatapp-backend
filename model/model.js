const mongoose = require('mongoose');

const userschema = mongoose.Schema({
    username:String,
    password:String,
});
const socketsessionschema = mongoose.Schema({
    sessionID:String,
    username:String,
    userID:String
})
const usermodel = mongoose.model("users",userschema);
const socketsessionsmodel = mongoose.model("socketsessions",socketsessionschema);

module.exports = {usermodel,socketsessionsmodel};
