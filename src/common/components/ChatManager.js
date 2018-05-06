const Component = require('../Component');
const Input = require('../../client/Input');
const Client = require('../../client/Client');
const Event = require('../Event');

@Component.clientOnly
@Component.serializedName('ChatManager')
class ChatManager extends Component {

    constructor() {
        super();
        this.props.cooldown = 10;
        this.props.messageLife = 5000; // 5s
    }

    start() {
        this.chatInputDomElement = document.getElementById('chatInput');
        this.chatPanel = document.getElementById('chatPanel');
        Client.current.subscribe(Event.CHAT_MESSAGE, this.onChatMessage.bind(this));

        this.existMessagesTimestamp = [];
        this.cooldown = 0;
    }

    update() {
        // 处理已经存在的消息
        if (this.existMessagesTimestamp.length > 0 && Date.now() - this.existMessagesTimestamp[0] > this.props.messageLife) {
            this.existMessagesTimestamp.splice(0, 1);
            this.chatPanel.removeChild(this.chatPanel.lastChild);
        }

        // 处理发消息
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }
        if (!Input.getKey('enter')) return;
        if (!document.hasFocus()) return;
        if (document.activeElement === this.chatInputDomElement) {
            if (this.chatInputDomElement.value !== '') {
                this.sendChatMessage();
                this.chatInputDomElement.value = '';
            }
            this.chatInputDomElement.blur();
            this.cooldown = this.props.cooldown;
        } else {
            this.chatInputDomElement.focus();
            this.cooldown = this.props.cooldown;
        }
    }

    sendChatMessage() {
        Client.current.sendChatMessage(this.chatInputDomElement.value);
    }

    onChatMessage(data) {
        let message = document.createElement("p");
        message.innerText = data.name + "：" + data.message;
        message.style.color = 'white';
        message.style.margin = '0';
        message.style.fontSize = '14px';
        if (this.chatPanel.firstChild) {
            this.chatPanel.insertBefore(message, this.chatPanel.firstChild);
        } else {
            this.chatPanel.appendChild(message);
        }
        this.existMessagesTimestamp.push(Date.now());
    }

}

module.exports = ChatManager;