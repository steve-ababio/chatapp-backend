const socketio = require("socket.io")
var uid = require('uniqid');
const wsevents =  require("../utils/events/wsevents"); 

const onlineusers = [];
const peerIDs = [];

const websocketconn = (server,options)=>
{
    const io = socketio(server,options);
    io.use(async(socket,next) =>{
        const username = socket.handshake.auth.username;
        socket.username = username;
        next();
    });

    io.on(wsevents.CONNECTION,(socket)=>{
        socket.join(socket.username);

        socket.on(wsevents.USER_ONLINE,(username,peerID)=>{
            console.log(peerID);
            const socketidexists =  onlineusers.every((username_)=> username !== username_);
            if(socketidexists)
            {
                onlineusers.push(username);
                peerIDs.push(peerID);
            }
            console.log("ids: ",peerIDs)
            socket.broadcast.emit(wsevents.USER_ONLINE,{onlineusers,peerIDs,peerID:peerID});
        });
       socket.on(wsevents.PRIVATE_MESSAGE,({from,to,content})=>{
            socket.to(to).emit(wsevents.PRIVATE_MESSAGE,{
                from:from,
                to:to,
                content:content   
            })
        })
        //user typing event listener
        socket.on(wsevents.USER_TYPING,(username,targetusername)=>{
            socket.to(targetusername).emit(wsevents.USER_TYPING,username);
        })      
        socket.on(wsevents.REMOVE_TYPING,username=>{
            socket.to(username).emit(wsevents.REMOVE_TYPING);
        })  
        socket.on(wsevents.PEER_CONNECTED,peerusername=>{
            socket.to(peerusername).emit(wsevents.PEER_JOINED);
        })
        socket.on("disconnect",()=>{
            socket.broadcast.emit(wsevents.USER_OFFLINE,{username:socket.username,lastseen: new Date().toLocaleTimeString()});
        })
    })
}
module.exports = websocketconn;