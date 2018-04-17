const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton')['default'];
const ContentAdd = require('material-ui/svg-icons/content/add')['default'];
const Dialog = require('material-ui/Dialog')['default'];
const FlatButton = require('material-ui/FlatButton')['default'];
const TextField = require('material-ui/TextField')['default'];
const SelectField = require('material-ui/SelectField')['default'];
const MenuItem = require('material-ui/MenuItem')['default'];
const Client = require('../Client');

class CreateRoomButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            roomName: '无标题房间',
            roomPassword: ''
        };

        this.handleClose.bind(this);
        this.handleOpen.bind(this);
        this.handleRoomName.bind(this);
        this.handleRoomPassword.bind(this);
        this.handleCreateRoom.bind(this);
    }

    handleClose() {
        this.setState({open: false});
    }

    handleOpen() {
        this.setState({open: true});
    }

    handleRoomName(_, value) {
        this.setState({roomName: value});
    }

    handleRoomPassword(_, value) {
        this.setState({roomPassword: value});
    }

    handleCreateRoom() {
        let hasPw = this.state.roomPassword.trim().length > 0;
        Client.current.createRoom(this.state.roomName, hasPw ? this.state.roomPassword : null, () => {
           // todo
        });
    }

    render() {
        const actions = [
            <FlatButton
                label="提交"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleCreateRoom.bind(this)}/>
        ];

        return (
            <FloatingActionButton style={{position: 'fixed', bottom: '75px', right: '75px'}} onClick={this.handleOpen.bind(this)}>
                <ContentAdd />
                <Dialog
                    title={'创建房间'}
                    actions={actions}
                    model={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose.bind(this)}
                    contentStyle={{width: '304px'}}>
                    <TextField
                        floatingLabelText={'房间名'}
                        floatingLabelFixed={true}
                        value={this.state.roomName}
                        onChange={this.handleRoomName.bind(this)}/>
                    <br/>
                    <TextField
                        hintText={'留空以不设密码'}
                        floatingLabelText={'房间密码'}
                        floatingLabelFixed={true}
                        value={this.state.roomPassword}
                        onChange={this.handleRoomPassword.bind(this)}/>
                    <br/>
                    <SelectField
                        floatingLabelText="类型"
                        value={1}>
                        <MenuItem value={1} primaryText="图灵机" />
                    </SelectField>
                </Dialog>
            </FloatingActionButton>
        );
    }
}

module.exports = CreateRoomButton;