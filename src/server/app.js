//import path from 'path';
//import express from 'express';
//import RTI from 'RTI';
const RTI = require('./RTI');
const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

const JWT_SECRET = 'logthecatfish';
const app = express();

// express server
// send static files
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

app.get('/*' , (req, res) => {
    const file = req.params[0];
    console.log('\t :: Express :: file requested : ' + file);
    res.sendFile(path.resolve('public/' + file));
});

// user login
app.use(require('body-parser').json());
app.post('/login', (req, res) => {
    let {username, password} = req.body;
    // todo 判断重复登录
    if (username === 'admin' && password === '123456') {
        let token = jwt.sign(req.body, JWT_SECRET, { expiresIn: '5h' });
        res.json({ code: 0, token: token, username: username });
    } else {
        res.json({ code: 1, message: "用户名与密码不匹配！"});
    }
});

const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

// socket.io server
const io = require('socket.io')(server);

io.set('authorization', socketioJwt.authorize({
    secret: JWT_SECRET,
    handshake: true
}));

const rti = new RTI(io);
io.on('connection', (socket) => {
    rti.addClient(socket);
});

// meta.js es6 ployfill
Object.defineProperty(Object.prototype, "class", {
    get: function() {
        return Object.getPrototypeOf(this).constructor;
    }
});