const express = require('express');
const cors = require('cors')
const websocketconn = require('./websocket/websocket')
const db = require('./database/db');
const signin = require("./auth/signin");
const signup = require('./auth/signup');

const app = express(); 

const port = 8009;

app.use(cors({origin:"*"}))

app.use(express.json());
app.use(signin);
app.use(signup);

const server = app.listen(port,()=>{
  console.log("app is running on port:",port);
})

websocketconn(server,{
  cors:{
    origin:'*'
  }
});