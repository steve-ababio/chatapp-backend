const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/users",{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.connection.once('open',()=>{
    console.log("database connected");
}).on("error",(err)=>{
    console.log(err)
})