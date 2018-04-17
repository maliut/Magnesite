const React = require('react');
const AppBar = require('material-ui/AppBar')['default'];
const LoginDialog = require('./LoginDialog.jsx');

class TitleBar extends React.Component {

    render() {
        return (
            <AppBar
                title={'title'}
                iconElementRight={<LoginDialog />}
                showMenuIconButton={false}
            />
        );
    }
}

module.exports = TitleBar;