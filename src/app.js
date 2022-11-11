import express from 'express';
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import {Server, Socket  } from "socket.io";
import viewsRouter from "./routes/views.router.js";

const app = express();

app.use(express.json());
app.use(express.static(__dirname+'/public'))

//! handlebars
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use('/',viewsRouter);

const server = app.listen(8080,()=>{
    console.log('listen');
});

const io = new Server(server);

const messages= [];

io.on('connection',socket =>{
        socket.emit('logs',messages);
        socket.on('message',data =>{
        messages.push(data);
        io.emit('logs',messages);

        // socket.emit('logs', messages);//! envia unicamente al socket osea solo yo puedo ver mis mensajes con io.emit pueden ver todos los que se conecten al socket
    });
    socket.on('authenticated',data =>{
        socket.broadcast.emit('newUserConnected',data);
    })
});