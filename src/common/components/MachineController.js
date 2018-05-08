const Component = require('../Component');
//const Resource = require('../Resource');
//const GameObject = require('../GameObject');
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
        this.state = { content: 'eeeeeeeeeeeeeee', pointer: 7, state: 'start' };

        // initial state
        this.charPool = new CharPool(this.gameObject);
        this.children = [];
        for (let i = -7; i <= 7; i++) {
            let bit = this.charPool.obtain('e');
            bit.position.x = i;
            bit.visible = true;
            this.children[i+7] = bit;
        }

        // 是否在自动播放状态
        this.isAuto = false;
        this.program = null;  // 执行的程序
        this.commands = null;   // 当前指令数组
        this.pc = 1;  // 当前状态匹配到的指令数组的计数器
    }

    update() {
        if (!ENV_CLIENT && this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        if (!ENV_CLIENT && this.isAuto) {
            this.isAuto = this.execStep();
            if (!this.isAuto) { // 结束后处理
                this.props.cooldown = 10;
            }
        }

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

    // 图灵机内部某个时刻所处的状态
    setMachineState(state) {
        if (this.cooldown > 0) return;
        this.cooldown += this.props.cooldown;

        this.state.state = state;
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
                this.charPool.recycle(this.children[i]);
                this.children[i] = this.charPool.obtain(char);
                this.children[i].position.x = i - 7;
                this.children[i].visible = true;
            }
        }
    }

    // 模拟执行一段程序
    exec(program) {
        this.program = program;
        this.isAuto = true;
        // 设置初始状态
        this.state.state = 'start';
        this.props.cooldown = 20;
        //new LogicPanel(program);
    }

    /**
     * 模拟执行一步
     * @returns {boolean} 是否继续执行
     */
    execStep() {
        if (!(this.isAuto && this.program)) {
            console.warn("execStep failed. isAuto:" + this.isAuto + ", program:" + !!this.program);
            return false;
        }
        // 是否要切换状态
        if (!this.commands || this.pc === this.commands.length) {
            //console.log(this.program, this.program.commands);
            let currentState = this.program.commands[this.state.state];
            if (!currentState) return false;    // 加载新状态
            this.commands = currentState[this.state.content.charAt(this.state.pointer)];
            //console.log("执行指令：" + JSON.stringify(this.commands));
            if (!this.commands) return false;  // 得到了新状态下的指令数组
            this.setMachineState(this.commands[0]);
            //console.log("设置状态:" + this.commands[0]);
            this.pc = 1;
        } else {
            let command = this.commands[this.pc++];
            if (command === '<') {
                //console.log("左移");
                this.moveLeft();
            } else if (command === '>') {
                //console.log("右移");
                this.moveRight();
            } else {
                //console.log("设置为" + command);
                this.setChar(command);
            }
        }
        return true;
    }
}

module.exports = MachineController;

/*class LogicPanel {

    constructor(program) {
        this.program = program;
        this.text = [];
        this.text.push(program.title, program.description);
        Reflect.ownKeys(program.commands).forEach((value) => {
           this.text.push(value);
            ['0', '1', 'e'].forEach((c) => {
                console.log(value, c);
                if (program.commands[value][c]) {
                    this.text.push('--' + c);
                    console.log(program.commands[value]['0']);
                    program.commands[value][c].forEach((command) => {
                        this.text.push('----' + command);
                    });
                }
            });
        });
        console.log(this.text);
        //this.dom = document
    }

    show() {

    }

    hide() {

    }

    jumpTo() {

    }

    next() {

    }
}*/

/**
 * 方块对象池
 */
class CharPool {

    constructor(container) {
        this.char0 = [];
        this.char1 = [];
        this.chare = [];
        this.container = container;
    }

    obtain(char) {
        let pool = this['char' + char];
        for (let i = 0, len = pool.length; i < len; i++) {
            if (!pool[i].visible) {
                return pool[i];
            }
        }
        return this.createNew(char);
    }

    createNew(char) {
        let gameObj = require('../Resource').Prefab['char_' + char].clone();
        gameObj.visible = false;
        this['char' + char].push(gameObj);
        this.container.add(gameObj);
        return gameObj;
    }

    recycle(gameObj) {
        gameObj.visible = false;
    }

}
