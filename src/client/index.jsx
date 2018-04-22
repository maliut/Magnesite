const THREE = require('three');
const React = require('react');
const ReactDOM = require('react-dom');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider')['default'];
const TitleBar = require('./ui/TitleBar.jsx');
const RoomList = require('./ui/RoomList.jsx');
const CreateRoomButton = require('./ui/CreateRoomButton.jsx');
const LoginPanel = require('./ui/LoginPanel.jsx');
const GamePanel = require('./ui/GamePanel.jsx');
const Client = require('./Client');
const Game = require('./Game');
const Scene = require('../common/Scene');
const GameObject = require('../common/GameObject');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: false,
            username: '',
            room: null
        };
        this.onLogin.bind(this);
        this.onLogout.bind(this);
    }

    onLogin(data) {
        Client.init(data.token);
        this.setState({login: true, username: data.username});
    }

    onLogout() {
        Client.current.logout();
        this.setState({login: false, username: '', room: null});
    }

    onJoinRoom(room) {
        //console.log("join room:" + JSON.stringify(room));

        this.game = new Game();
        this.game.scene = setUp(new Scene());
        this.game.start();

        this.setState({room: room});

        //document.addEventListener( 'keyup', requestFullscreen, false );
        //requestFullscreen();
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <TitleBar user={this.state} onLogout={this.onLogout.bind(this)}/>
                    { this.state.login ?
                        ( this.state.room ? <GamePanel game={this.game}/> : <RoomList onJoinRoom={this.onJoinRoom.bind(this)} /> )
                            : <LoginPanel onLogin={this.onLogin.bind(this)} /> }
                    { this.state.room ? null : <CreateRoomButton onJoinRoom={this.onJoinRoom.bind(this)} /> }
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App/>, document.body);

function setUp(scene) {
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight-64, 0.1, 1000 );
    camera.position.z = 5;
    scene.add(new GameObject(camera));

    //let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    //scene.add(new GameObject(light));

    var geometry = new THREE.BoxGeometry( 1, 1, 1);
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add(new GameObject(cube));
    return scene;
}