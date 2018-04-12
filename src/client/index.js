import Client from './Client'
import Game from './Game';

let client = new Client(io());


let a = new Game();
a.start();
