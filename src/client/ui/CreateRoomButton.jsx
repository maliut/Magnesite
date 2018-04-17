const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton')['default'];
const ContentAdd = require('material-ui/svg-icons/content/add')['default'];
const Client = require('../Client');

class CreateRoomButton extends React.Component {

    onClick() {
        console.log("click create room btn");
        Client.current.createRoom("test");
    }

    render() {
        return (
            <FloatingActionButton style={{position: 'fixed', bottom: '75px', right: '75px'}} onClick={this.onClick}>
                <ContentAdd />
            </FloatingActionButton>
        );
    }
}

module.exports = CreateRoomButton;