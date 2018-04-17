//import Client from './Client'
//import Game from './Game';
/*
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
}*/

const React = require('react');
const ReactDOM = require('react-dom');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider')['default'];
const TitleBar = require('./ui/TitleBar.jsx');
const LobbyList = require('./ui/LobbyList.jsx');
const CreateRoomButton = require('./ui/CreateRoomButton.jsx');
const LoginDialog = require('./ui/LoginDialog.jsx');
const Client = require('./Client');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: false,
            username: ''
        };
        this.onLogin.bind(this);
        this.onLogout.bind(this);
    }

    onLogin(data) {
        Client.init(data.token);
        this.setState({
            login: true,
            username: data.username
        });
    }

    onLogout() {
        Client.current.logout();
        this.setState({
           login: false,
           username: ''
        });
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <TitleBar user={this.state} onLogout={this.onLogout.bind(this)} />
                    {this.state.login ? <LobbyList/> : <LoginDialog onLogin={this.onLogin.bind(this)} />}
                    <CreateRoomButton/>
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);