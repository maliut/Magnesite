//import Client from './Client'
//import Game from './Game';
const Client = require('./Client');
const Game = require('./Game');
const Scene = require('../common/Scene');

let client = new Client(io());

//console.log(Game);
let a = new Game();
a.scene = scene1();
a.start();

function scene1() {
    let scene = new Scene();
    return scene;
}