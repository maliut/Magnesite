const React = require('react');
const GridList = require('material-ui/GridList')['default'];
const GridTile = require('material-ui/GridList')['GridTile'];
const FlatButton = require('material-ui/FlatButton')['default'];
const Dialog = require('material-ui/Dialog')['default'];
const Client = require('../Client');
const Event = require('../../common/Event');

class RoomList extends React.Component {

    constructor(prop) {
        super(prop);
        this.state = {
            rooms: [],
            roomForPassword: null,
            errmsg: ''
        };
    }

    componentDidMount() {
        Client.current.listRooms((data) => {
            console.log(data);
            this.setState({rooms: data});
        });
        Client.current.subscribe(Event.ROOMS_CHANGE, (data) => {
            this.setState({rooms: data});
        });
    }

    onClickJoinRoom(room) {
        if (room.password) {
            this.setState({roomForPassword: room});
        } else {
            Client.current.joinRoom(room.id, null, (ret) => {
                if (ret === 0) {
                    this.setState({roomForPassword: null});
                    this.props.onJoinRoom(room);
                }
            });
        }
    }

    onSubmit(room, password) {
        Client.current.joinRoom(room.id, password, (ret) => {
            if (ret === -2) {
                this.setState({errmsg: '密码错误'})
            } else if (ret === 0) {
                this.setState({roomForPassword: null, errmsg: ''});
                this.props.onJoinRoom(room);
            }
        });
    }

    render() {
        return (
            <div style={{position: 'absolute', bottom: 0, top: '64px', left: 0, right: 0}}>
                {
                    this.state.rooms.length === 0 ?
                        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center'}}>
                            <p style={{margin: 0, textAlign: 'center', width: '100%'}}>暂无可以加入的房间</p>
                        </div>
                     :
                    <GridList
                        cellHeight={180}
                        padding={10}
                        style={{width: '100%', margin: 0}}
                        cols={4}>
                        {this.state.rooms.map((tile) => (
                            <GridTile
                                key={tile.id}
                                title={tile.name}
                                actionIcon={<FlatButton
                                    label={'join'} style={{color: 'white', marginRight: '7px'}}
                                    onClick={this.onClickJoinRoom.bind(this, tile)}/>}>
                                <img
                                    src={'http://www.material-ui.com/images/grid-list/morning-819362_640.jpg'}
                                    style={{height: '100%', width: 'auto', minHeight: '100%', minWidth: '100%'}} />
                            </GridTile>
                        ))}
                    </GridList>
                }
                { this.state.roomForPassword && <PwDialog
                    room={this.state.roomForPassword} onSubmit={this.onSubmit.bind(this)} errmsg={this.state.errmsg}/>}
            </div>
        );
    }

}

class PwDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
        };

        this.handlePassword = this.handlePassword.bind(this);
    }

    handlePassword(_, value) {
        this.setState({password: value});
    }

    render() {
        const actions = [
            <FlatButton
                label="提交"
                primary={true}
                keyboardFocused={true}
                onClick={this.props.onSubmit(this.props.room, this.state.password)}/>
        ];

        return (
            <Dialog
                title={'请输入密码'}
                actions={actions}
                open={true}
                contentStyle={{width: '304px'}}>
                <p style={{color: 'red', fontSize: '12px', margin: 0}}>{this.props.errmsg}</p>
                <TextField
                    hintText="密码"
                    floatingLabelText="密码"
                    value={this.state.password}
                    onChange={this.handlePassword}/>
            </Dialog>
        );
    }
}

module.exports = RoomList;