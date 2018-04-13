//import Client from './Client'
//import Game from './Game';
const Client = require('./Client');
const Game = require('./Game');

let client = new Client(io());


let a = new Game();
a.start();
