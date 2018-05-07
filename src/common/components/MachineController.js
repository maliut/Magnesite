const Component = require('../Component');
//const Resource = require('../Resource');
const GameObject = require('../GameObject');
const ENV_CLIENT = !(typeof window === 'undefined');

@Component.serializedName('MachineController')
class MachineController extends Component {

    constructor() {
        super();

        this.props.cooldown = 10;   // 按钮冷却帧数
    }

    start() {
        // move 相关
        this.cooldown = 0;

        // 描述当前状态的变量
        this.state = { content: 'eeeeeeeeeeeeeee', pointer: 7 };

        // initial state
        CharPool.init(this.gameObject);
        this.children = [];
        for (let i = -7; i <= 7; i++) {
            let bit = CharPool.obtain('e');
            bit.position.x = i;
            bit.visible = true;
            this.children[i+7] = bit;
        }
    }

    update() {
        if (this.cooldown > 0) this.cooldown--;
        if (ENV_CLIENT && this.gameObject.peerState) {
            this.state = this.gameObject.peerState;
            this.repaint();
            this.gameObject.peerState = null;
        }
    }


    moveLeft() {
        if (this.cooldown > 0) return;
        this.cooldown += this.props.cooldown;

        if (this.state.pointer > 0) {
            this.state.pointer--;
        } else {
            this.state.content = 'e' + this.state.content;
        }
        this.repaint();

    }

    moveRight() {
        if (this.cooldown > 0) return;
        this.cooldown += this.props.cooldown;

        if (this.state.pointer < this.state.content.length - 1) {
            this.state.pointer++;
        } else {
            this.state.content = this.state.content + 'e';
        }
        this.repaint();
    }

    setChar(char) {
        if (this.cooldown > 0) return;
        this.cooldown += this.props.cooldown;

        let current = this.state.content.charAt(this.state.pointer);
        if (current === char) return;
        let c = this.state.content;
        this.state.content = c.substring(0, this.state.pointer) + char + c.substring(this.state.pointer + 1, c.length);
        this.repaint();
    }

    repaint() {
        if (!ENV_CLIENT) {
            // 服务端发送同步信息
            this.gameObject.serverState = this.state;
        }
        for (let i = 0; i < 15; i++) {
            let index = this.state.pointer - (7 - i);
            let char = 'e';
            if (index >= 0 && index < this.state.content.length) {
                char = this.state.content.charAt(index);
            }
            if (this.children[i].name !== 'char' + char) {
                CharPool.recycle(this.children[i]);
                this.children[i] = CharPool.obtain(char);
                this.children[i].position.x = i - 7;
                this.children[i].visible = true;
            }
        }
    }
}

module.exports = MachineController;

const CharPool = {
    char0 : [],
    char1 : [],
    chare : [],
    container: null,

    init: (container) => {
        CharPool.container = container;
        CharPool.Resource = require('../Resource');
    },

    obtain: (char) => {
        let pool = CharPool['char' + char];
        for (let i = 0, len = pool.length; i < len; i++) {
            if (!pool[i].visible) {
                return pool[i];
            }
        }
        return CharPool.createNew(char);
    },

    createNew: (char) => {
        let obj = CharPool.Resource.Model['char_' + char].clone();
        obj.scale.x = 0.1;
        obj.scale.y = 0.1;
        obj.scale.z = 0.1;
        obj.position.y = 0.5;
        obj.rotation.y -= Math.PI / 2;
        obj.rotation.z -= Math.PI / 3;
        obj.visible = false;
        let go = new GameObject(obj);
        go.name = 'char' + char;
        CharPool['char' + char].push(go);
        CharPool.container.add(go);
        return go;
    },

    recycle: (gameObj) => {
        gameObj.visible = false;
    }
};