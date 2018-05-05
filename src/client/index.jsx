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
const Synchronizer = require('../common/components/Synchronizer');
const FirstPersonController = require('../common/components/FirstPersonController');
const MouseControlRotation = require('../common/components/MouseControlRotation');
const THREE = require('three');
const GameObject = require('../common/GameObject');
const loadScene = require('../common/loadScene');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: false,
            username: '',
            room: null,
            progress: 0   // 加载进度
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
        this.game = new Game();
        this.setState({room: room, progress: 0});
        // fixme index 里面嵌了太多 game 的逻辑
        // 要重构加载 scene 的逻辑
        loadScene().then((arr) => {
            let scene = new Scene();
            // 场景静态物体
            arr.forEach((obj) => {scene.add(obj)});
            // 生成自身
            createSelfPlayer(scene);
            // 其余玩家
            room.existPlayers.forEach((id) => scene.spawn('player').networkId = id);
            this.game.scene = scene;
            this.game.start();
            this.setState({progress: 100});
        });
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <TitleBar user={this.state} onLogout={this.onLogout.bind(this)}/>
                    { this.state.login ?
                        ( this.state.room ?
                            ( this.state.progress < 100 ? <p>loading</p>
                                : <GamePanel game={this.game} /> )
                            : <RoomList onJoinRoom={this.onJoinRoom.bind(this)} /> )
                        : <LoginPanel onLogin={this.onLogin.bind(this)}/> }
                    { this.state.room ? null : <CreateRoomButton onJoinRoom={this.onJoinRoom.bind(this)}/> }
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App/>, document.body);

function createSelfPlayer(scene) {
    let me = scene.spawn('player');
    me.networkId = Client.current.socket.id;
    me.getComponent(Synchronizer).isLocalPlayer = true;
    me.addComponent(new FirstPersonController());
    me.add(createMouseControlCamera());

    const StepTrigger = require('../common/components/StepTrigger');
    scene.getObjectByName('btn0').getComponent(StepTrigger).authPlayers.push(me);
    scene.getObjectByName('btn1').getComponent(StepTrigger).authPlayers.push(me);
    scene.getObjectByName('moveLeft').getComponent(StepTrigger).authPlayers.push(me);
    scene.getObjectByName('moveRight').getComponent(StepTrigger).authPlayers.push(me);
}

function createMouseControlCamera() {
    let camera = new THREE.PerspectiveCamera(75, /*window.innerWidth / window.innerHeight - 64*/1, 0.1, 1000);
    camera.position.y = 2.5;
    camera.position.z = 8;
    var pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    camera.name = 'camera';
    //camera.lookAt(0, 0, -4);
    let pitch = new GameObject(new THREE.Object3D());
    pitch.add(new GameObject(camera));
    let yaw = new GameObject(new THREE.Object3D());
    yaw.name = 'yaw';
    pitch.name = 'pitch';
    yaw.add(pitch);

    let mouseControlObj = yaw;
    mouseControlObj.addComponent(new MouseControlRotation());
    return mouseControlObj;
}