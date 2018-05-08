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

        //this.authPlayers = [];  // gameobjs // 暂时
    }

    start() {
        this.isTrigger = false;
        //this.authPlayers = [];  // gameobjs
    }

    update() {
        for (let i = 0, len = this.gameObject.scene.onlinePlayers.length; i < len; i++) {
            let pp = this.gameObject.scene.onlinePlayers[i].position;  // player position
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
            //if (!ENV_CLIENT) this.onTrigger();
            this.broadcast("onTriggerEnter");
        } else {
            this.gameObject.position.y += this.props.selfHeight;
            this.broadcast("onTriggerExit");
        }
    }

}

module.exports = StepTrigger;