const Component = require('../Component');
const THREE = require('three');
const Input = require('../Input');
const ENV_CLIENT = !(typeof window === 'undefined');

/**
 * 控制玩家第一人称行走
 */
@Component.serializedName('FirstPersonController')
class FirstPersonController extends Component {

    start() {
        this.yaw = new THREE.Object3D();
        this.gameObject._obj3d.add(this.yaw);

        this.input = new Input();
        this.input._yaw = this.yaw;

        this.tempPos = new THREE.Vector3();

        this.props.speed = 0.1;
    }

    destroy() {
        this.input.destroy();
    }

    update() {
        this.yaw.rotation.y = this.input.getOrientation();

        if (this.input.getKey('W')) {
            this.yaw.translateZ(-this.props.speed);
        } else if (this.input.getKey('S')) {
            this.yaw.translateZ(this.props.speed);
        } else if (this.input.getKey('A')) {
            this.yaw.translateX(-this.props.speed);
        } else if (this.input.getKey('D')) {
            this.yaw.translateX(this.props.speed);
        }

        this.yaw.getWorldPosition(this.tempPos);
        this.gameObject.position.x = this.tempPos.x;
        this.gameObject.position.z = this.tempPos.z;
        this.yaw.position.set(0, 0, 0);
    }

}

module.exports = FirstPersonController;