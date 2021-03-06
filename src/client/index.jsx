const React = require('react');
const ReactDOM = require('react-dom');
const MuiThemeProvider = require('material-ui/styles/MuiThemeProvider')['default'];
const TitleBar = require('./ui/TitleBar.js');
const RoomList = require('./ui/RoomList.js');
const CreateRoomButton = require('./ui/CreateRoomButton.js');
const LoginPanel = require('./ui/LoginPanel.js');
const GamePanel = require('./ui/GamePanel.js');
const Client = require('./Client');
const Game = require('./Game');
const SceneHelper = require('./SceneHelper');
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
        let sceneName = '';
        if (room.type === 1) {
            sceneName = 'turingmachine';
        } else if (room.type === 2) {
            sceneName = 'hanoi';
        }
        require('../common/Resource').loadScene(sceneName).then(scene => {

            //loadScene().then(arr => {
                //arr.forEach(obj => scene.add(obj));

                SceneHelper.createSkyBox(scene, ['images/galaxy+X.jpg', 'images/galaxy-X.jpg', 'images/galaxy+Y.jpg',
                    'images/galaxy-Y.jpg', 'images/galaxy-Z.jpg', 'images/galaxy+Z.jpg'], 75);
                // 生成自身
                SceneHelper.createSelfPlayer(scene);
                // 其余玩家
                room.existPlayers.forEach((data) => SceneHelper.createOtherPlayer(scene, data.networkId, data.name));
                this.game.scene = scene;
                this.game.start();
                this.setState({progress: 100});

            //});

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
