const express = require('express');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const Filter = require('bad-words');
const path = require('path');
const http = require('http');
const userRouter = require('./routers/user');
const betRouter = require('./routers/bet');
const chatRouter = require('./routers/chat');
const adminRouter = require('./routers/admin');
const chatAuth = require('./middleware/chatAuth');
const generateMessage = require('./utils/chat');
require('./db/mongoose');

//setting up socket
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(userRouter);
app.use(betRouter);
app.use(chatRouter);
app.use(adminRouter);
app.use(express.static(path.join(__dirname, '../public')));

//Chat setup - Socket.io
io.on('connection', socket => {    
    socket.on('messageReceived', async({message, username}, callback) => {
        const user = await chatAuth(socket);
        if (!user) return callback('authentication');

        const filter = new Filter();
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed');
        }
        io.emit('message', generateMessage(username, message));
        callback();
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
});
