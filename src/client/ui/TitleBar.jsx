const React = require('react');
const AppBar = require('material-ui/AppBar')['default'];
const FlatButton = require('material-ui/FlatButton')['default'];

class TitleBar extends React.Component {

    render() {
        return (
            <AppBar
                title={'title'}
                showMenuIconButton={false}
                iconElementRight={<Info user={this.props.user} onLogout={this.props.onLogout}/>}
            />
        );
    }
}

class Info extends React.Component {

    render() {
        if (!this.props.user.login) return null;
        return (
            <div style={{display: 'flex'}}>
                <p style={{color: 'white', marginRight: '7px'}}>Hello,&nbsp;{this.props.user.username}!</p>
                <FlatButton label={'登出'} style={{color: 'white', marginTop: '7px'}} onClick={this.props.onLogout}/>
            </div>
        );
    }
}

module.exports = TitleBar;