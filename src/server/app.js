//import path from 'path';
//import express from 'express';
import RTI from 'RTI';

const path = require('path');
const express = require('express');
const app = express();

// express server
app.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

app.get('/*' , (req, res) => {
    const file = req.params[0];
    console.log('\t :: Express :: file requested : ' + file);
    res.sendFile(path.resolve('public/' + file));
});

const server = app.listen(3000, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

// socket.io server
const io = require('socket.io')(server);
const rti = new RTI(io);
io.on('connection', (socket) => {
    rti.addClient(socket);
});