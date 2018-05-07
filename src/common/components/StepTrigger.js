const Component = require('../Component');
const MachineController = require('./MachineController');
const ENV_CLIENT = !(typeof window === 'undefined');

/**
 * 按钮触发器
 * 服务端权威判断按钮是否被触发
 * 客户端同步状态
 */
@Component.serializedName('StepTrigger')
class StepTrigger extends Component {

    constructor() {
        super();
        this.props.triggerRadius = 0.3;
        this.props.selfHeight = 0.08;
        this.props.triggerType = 0;

        this.authPlayers = [];  // gameobjs // 暂时
    }

    start() {
        this.isTrigger = false;
        //this.authPlayers = [];  // gameobjs

        this.machineController = this.gameObject.scene.getObjectByName('TuringMachine').getComponent(MachineController);
    }

    update() {
        for (let i = 0, len = this.authPlayers.length; i < len; i++) {
            let pp = this.authPlayers[i].position;  // player position
            if (Math.abs(pp.x - this.gameObject.position.x) <= this.props.triggerRadius &&
                Math.abs(pp.z - this.gameObject.position.z) <= this.props.triggerRadius) {
                this.setTrigger(true);
                return;
            }
        }
        this.setTrigger(false);
    }

    setTrigger(isTrigger) {
        if (isTrigger === this.isTrigger) return;
        this.isTrigger = isTrigger;
        if (isTrigger) {
            this.gameObject.position.y -= this.props.selfHeight;
            if (!ENV_CLIENT) this.onTrigger();
        } else {
            this.gameObject.position.y += this.props.selfHeight;
        }
    }

    onTrigger() {
        // 因为比较简单，所以用 switch case
        // 否则可以子类实现
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
                break;
        }
    }

}

module.exports = StepTrigger;