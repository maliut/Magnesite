const React = require('react');
const Dialog = require('material-ui/Dialog')['default'];
const FlatButton = require('material-ui/FlatButton')['default'];
const TextField = require('material-ui/TextField')['default'];

class LoginDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            username: "",
            password: ""
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleOpen() {
        this.setState((old) => {
            old.open = true;
            return old;
        });
    };

    handleClose() {
        this.setState((old) => {
            old.open = false;
            return old;
        });
    };

    handleUsername(_, value) {
        this.setState((old) => {
            old.username = value;
            return old;
        });
    }

    handlePassword(_, value) {
        this.setState((old) => {
            old.password = value;
            return old;
        });
    }

    handleSubmit() {
        console.log(this.state.username, this.state.password);
    }

    render() {
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onClick={this.handleClose}/>,
            <FlatButton
                label="登录"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleSubmit}/>,
        ];

        return (
            <div>
                <FlatButton label={'Login'} style={{color: 'white', marginTop: '7px'}} onClick={this.handleOpen} />
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    contentStyle={{width: '304px'}}>
                    <TextField
                        hintText="用户名"
                        floatingLabelText="用户名"
                        value={this.state.username}
                        onChange={this.handleUsername}
                    /><br />
                    <TextField
                        hintText="密码"
                        floatingLabelText="密码"
                        type="password"
                        value={this.state.password}
                        onChange={this.handlePassword}
                    /><br />
                </Dialog>
            </div>
        );
    }

}

module.exports = LoginDialog;