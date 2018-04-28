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
const Resource = require('./Resource');
const MouseControlRotation = require('../common/components/MouseControlRotation');
const FirstPersonController = require('../common/components/FirstPersonController');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            login: false,
            username: '',
            room: null,
            progress: 100   // 加载进度
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
        //this.game.scene = setUp(new Scene());
        //this.game.start();
        loadScene().then((arr) => {
            let scene = new Scene();
            for (let i = 0; i < arr.length; i++) {
                scene.add(arr[i]);
            }
            this.game.scene = scene;
            this.game.start();

            this.setState({room: room});
        });

        //this.setState({room: room});
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <TitleBar user={this.state} onLogout={this.onLogout.bind(this)}/>
                    {this.state.login ?
                        (this.state.room ? <GamePanel game={this.game} progress={this.state.progress}/> :
                            <RoomList onJoinRoom={this.onJoinRoom.bind(this)}/>)
                        : <LoginPanel onLogin={this.onLogin.bind(this)}/>}
                    {this.state.room ? null : <CreateRoomButton onJoinRoom={this.onJoinRoom.bind(this)}/>}
                </div>
            </MuiThemeProvider>
        );
    }
}

ReactDOM.render(<App/>, document.body);

function loadScene() {
    let ambientLight = new Promise(function (resolve) {
        let ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        resolve(new GameObject(ambientLight));
    });

    let container = new Promise(function (resolve) {
        let container = new GameObject(new THREE.Object3D());
        Resource.loadOBJ('char_0').then((obj) => {
            obj.scale.x = 0.1;
            obj.scale.y = 0.1;
            obj.scale.z = 0.1;
            obj.position.y = 0.5;
            obj.rotation.y -= Math.PI / 2;
            obj.rotation.z -= Math.PI / 3;

            for (let i = -6; i <= 6; i++) {
                let o2 = obj.clone();
                o2.position.x = i;
                container.add(new GameObject(o2));
            }

            resolve(container);
        });
    });

    let floor = new Promise(function (resolve) {
        Resource.loadJSON('floor').then((cube) => {
            cube.position.y = -0.1;
            //console.log(cube);
            resolve(new GameObject(cube));
        });
    });

    let arrow = new Promise(function (resolve) {
        Resource.loadOBJ('arrow').then((arrow) => {
            arrow.scale.x = 0.1;
            arrow.scale.y = 0.1;
            arrow.scale.z = 0.1;
            arrow.position.y = 0.1;
            arrow.position.z = 1;
            arrow.rotation.y -= Math.PI / 2;
            resolve(new GameObject(arrow));
        });
    });

    let btn0 = new Promise(function (resolve) {
        Resource.loadOBJ('btn_0').then((obj) => {
            obj.scale.x = 0.1;
            obj.scale.y = 0.1;
            obj.scale.z = 0.1;
            obj.position.y = 0.1;
            obj.position.z = 2;
            obj.position.x = 0.5;
            obj.rotation.y -= Math.PI / 2;
            resolve(new GameObject(obj));
        });
    });

    let btn1 = new Promise(function (resolve) {
        Resource.loadOBJ('btn_1').then((obj) => {
            obj.scale.x = 0.1;
            obj.scale.y = 0.1;
            obj.scale.z = 0.1;
            obj.position.y = 0.1;
            obj.position.z = 2;
            obj.position.x = 1.5;
            obj.rotation.y -= Math.PI / 2;
            resolve(new GameObject(obj));
        });
    });

    let moveLeft = new Promise(function (resolve) {
        Resource.loadOBJ('move').then((obj) => {
            obj.scale.x = 0.1;
            obj.scale.y = 0.1;
            obj.scale.z = 0.1;
            obj.position.y = 0.1;
            obj.position.z = 2;

            let left = obj;
            left.position.x = -1.5;
            left.rotation.y -= Math.PI / 2;
            resolve(new GameObject(left));

        });
    });

    let moveRight = new Promise(function (resolve) {
        Resource.loadOBJ('move').then((obj) => {
            obj.scale.x = 0.1;
            obj.scale.y = 0.1;
            obj.scale.z = 0.1;
            obj.position.y = 0.1;
            obj.position.z = 2;

            let right = obj;
            right.position.x = -0.5;
            right.rotation.y += Math.PI / 2;
            resolve(new GameObject(right));
        });
    });

    let player = new Promise(function (resolve) {
        Resource.loadJSON('player').then((obj) => {
            obj.children[1].position.y = 0.8;
            obj.position.y = 0.5;
            obj.position.z = 3;
            obj.name = 'player';
            //console.log(obj);
            let player = new GameObject(obj);
            player.add(createMouseControlCamera());
            player.addComponent(new FirstPersonController());
            resolve(player);
        });
    });

    return Promise.all([ambientLight, container, floor, arrow, btn0, btn1, moveLeft, moveRight, player]);
}

function createSpriteText(){
    //先用画布将文字画出
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.font = "Bold 50px Arial";
    ctx.lineWidth = 2;
    ctx.fillText("ABCdddddddDRE",4,104);
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    //使用Sprite显示文字
    let material = new THREE.SpriteMaterial({map:texture});
    let textObj = new THREE.Sprite(material);
    //textObj.scale.set(0.5 * 100, 0.25 * 100, 0.75 * 100);
    textObj.position.y = 1.4;
    console.log(textObj);
    return textObj;
}

function createMouseControlCamera() {
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight - 64, 0.1, 1000);
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