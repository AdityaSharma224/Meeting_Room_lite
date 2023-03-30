
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const { v4: uuidV4} = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true
});

app.set('view engine','ejs');
app.use(express.static('public'));


app.use('/peer.js',peerServer);
app.get('/', (req,res)=>{
    res.redirect(`/${uuidV4()}`);
})

app.get('/:room',(req,res)=>{
    res.render('room',{ roomId:req.params.room });
})

io.on('connection', socket =>{
    socket.on('join-room',(roomId, userId)=>{
        socket.join(roomId);// to join with room id
        socket.broadcast.to(roomId).emit('user-connected',userId);// any other user connected with room
        socket.on('message',message=>{
            io.to(roomId).emit('createMessage',message)
        });
        socket.on('user-disconnected', userId => {
            if (peers[userId]) peers[userId].close()
          })
    })
})

server.listen(process.env.PORT||433); // local host server 433

