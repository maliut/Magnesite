const React = require('react');
const Dialog = require('material-ui/Dialog')['default'];
const FlatButton = require('material-ui/FlatButton')['default'];
const TextField = require('material-ui/TextField')['default'];
const $ = require('superagent');
const CryptoJS = require("crypto-js");

class LoginPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            usernameError: false,
            passwordError: false,
            errmsg: ''
        };
        //this.handleOpen = this.handleOpen.bind(this);
        //this.handleClose = this.handleClose.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    /*handleOpen() {
        this.setState((old) => {
            old.open = true;
            return old;
        });
    };

    handleClose() {
        this.setState({open: false});
    };*/

    handleUsername(_, value) {
        this.setState({
            username: value,
            usernameError: value.length === 0
        });
    }

    handlePassword(_, value) {
        this.setState({
            password: value,
            passwordError: value.length === 0
        });
    }

    handleSubmit() {
        if (this.state.username.length === 0) {
            this.setState({usernameError: true});
            return;
        }
        if (this.state.password.length === 0) {
            this.setState({passwordError: true});
            return;
        }
        let xxx = CryptoJS.AES.encrypt(JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            timestamp: Date.now()
        }), 'logthecatfish').toString();
        $.post('/login').send({data: xxx}).then(res => {
            let data = res.body;
            if (data.code === 0) {
                // 登录成功
                //this.setState({open: false});
                this.props.onLogin(data);
            } else {
                // 登录失败
                this.setState({errmsg: data.message});
            }
        });
    }

    handleRegister() {
        if (this.state.username.length === 0) {
            this.setState({usernameError: true});
            return;
        }
        if (this.state.password.length === 0) {
            this.setState({passwordError: true});
            return;
        }
        let xxx = CryptoJS.AES.encrypt(JSON.stringify({
            username: this.state.username,
            password: this.state.password
        }), 'logthecatfish').toString();
        $.post('/register').send({data: xxx}).then(res => {
            let data = res.body;
            if (data.code === 0) {
                // 登录成功
                this.props.onLogin(data);
            } else {
                // 注册失败
                this.setState({errmsg: data.message});
            }
        });
    }

    render() {
        const actions = [
            <FlatButton
                label="注册"
                primary={true}
                onClick={this.handleRegister}/>,
            <FlatButton
                label="登录"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleSubmit}/>
        ];

        return (
            <Dialog
                title={'注册或登录以继续'}
                actions={actions}
                modal={true}
                open={true}
                contentStyle={{width: '304px'}}>
                <p style={{color: 'red', fontSize: '12px', margin: 0}}>{this.state.errmsg}</p>
                <TextField
                    hintText="用户名"
                    floatingLabelText="用户名"
                    errorText={this.state.usernameError ? "用户名不能为空" : ""}
                    value={this.state.username}
                    onChange={this.handleUsername}/>
                <TextField
                    hintText="密码"
                    floatingLabelText="密码"
                    errorText={this.state.passwordError ? "密码不能为空" : ""}
                    type="password"
                    value={this.state.password}
                    onChange={this.handlePassword}/>
            </Dialog>
        );
    }

}

module.exports = LoginPanel;