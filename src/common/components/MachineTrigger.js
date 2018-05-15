const Component = require('../Component');
const MachineController = require('./MachineController');
const ENV_CLIENT = !(typeof window === 'undefined');

@Component.serializedName("MachineTrigger")
class MachineTrigger extends Component {

    constructor() {
        super();

        this.props.triggerType = 0;
    }

    start() {
        this.machineController = this.gameObject.scene.getObjectByName('TuringMachine').getComponent(MachineController);
    }

    onReceive(sender, ...args) {
        this[args[0]]();
    }

    onTriggerEnter() {
        if (ENV_CLIENT) {
            if (this.props.triggerType === 5) {
                MachineTrigger.getClientIntro().innerText = xorIntro;
                MachineTrigger.getClientIntro().style.display = 'block';
            }
        } else {
            // server
            if (this.machineController.isAuto) return;
            switch (this.props.triggerType) {
                case 0:
                    this.machineController.setChar('0');
                    break;
                case 1:
                    this.machineController.setChar('1');
                    break;
                case 2:
                    this.machineController.moveLeft();
                    break;
                case 3:
                    this.machineController.moveRight();
                    break;
                case 4:
                    this.machineController.setChar('e');
                    //this.machineController.exec(xorProgram);
                    break;
                case 5:
                    this.machineController.exec(xorProgram);
                    break;
            }
        }
    }

    onTriggerExit() {
        if (ENV_CLIENT) {
            MachineTrigger.getClientIntro().style.display = 'none';
        }
    }

    static getClientIntro() {
        if (!MachineTrigger.clientIntro) {
            MachineTrigger.clientIntro = document.createElement('div');
            MachineTrigger.clientIntro.style.position = 'absolute';
            MachineTrigger.clientIntro.style.top = '10px';
            MachineTrigger.clientIntro.style.left = '10px';
            MachineTrigger.clientIntro.style.width = '200px';
            MachineTrigger.clientIntro.style.color = 'white';
            MachineTrigger.clientIntro.style.display = 'none';
            document.getElementById('gamePanel').appendChild(MachineTrigger.clientIntro);
        }
        return MachineTrigger.clientIntro;
    }
}

module.exports = MachineTrigger;

const xorProgram = {
    "title": "按位取反",
    "description": "二进制数按位取反。请把指针头指向最右边的数字。",
    "commands": {
        "start": {
            "0": ["start", "1", "<"],
            "1": ["start", "0", "<"]
        }
    }
};

const xorIntro = "【按位取反】\n" +
    "二进制数按位取反。请把指针头指向最右边的数字。\n" +
    "\n" +
    "状态为 start 且读到 0 ：\n" +
    "写入 1 ，左移，设置状态为 start\n" +
    "\n" +
    "状态为 start 且读到 1 ：\n" +
    "写入 0 ，左移，设置状态为 start";

