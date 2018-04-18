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
        console.log("join room:" + JSON.stringify(room));

        this.game = new Game();
        this.game.scene = setUp(new Scene());
        this.game.start();

        this.setState({room: room});

        document.addEventListener( 'keyup', requestFullscreen, false );
        //requestFullscreen();
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <TitleBar user={this.state} onLogout={this.onLogout.bind(this)}/>
                    { this.state.login ?
                        ( this.state.room ? <GamePanel renderer={this.game.renderer} height={window.innerHeight-68}/> : <RoomList onJoinRoom={this.onJoinRoom.bind(this)} /> )
                            : <LoginPanel onLogin={this.onLogin.bind(this)} /> }
                    { this.state.room ? null : <CreateRoomButton onJoinRoom={this.onJoinRoom.bind(this)} /> }
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

function setUp(scene) {
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    scene.add(new GameObject(camera));

    let light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
    scene.add(new GameObject(light));

    let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    floorGeometry.rotateX( - Math.PI / 2 );
    for ( let i = 0, l = floorGeometry.vertices.length; i < l; i ++ ) {
        let vertex = floorGeometry.vertices[ i ];
        vertex.x += Math.random() * 20 - 10;
        vertex.y += Math.random() * 2;
        vertex.z += Math.random() * 20 - 10;
    }
    for ( let i = 0, l = floorGeometry.faces.length; i < l; i ++ ) {
        let face = floorGeometry.faces[ i ];
        face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
        face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
    }
    let floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
    let floor = new THREE.Mesh( floorGeometry, floorMaterial );
    scene.add(new GameObject(floor));
    return scene;
}