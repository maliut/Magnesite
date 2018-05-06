const Component = require('../Component');
const THREE = require('three');
const Input = require('../../client/Input');

/**
 * 控制玩家第一人称行走
 */
@Component.clientOnly
@Component.serializedName('FirstPersonController')
class FirstPersonController extends Component {

    constructor() {
        super();
        this.props.speed = 6;
        this.props.mapBorder = {xMax: 8, xMin: -8, zMax: 8, zMin: -8};
    }

    start() {
        this.yaw = new THREE.Object3D();
        let p = this.gameObject.position;
        this.yaw.position.set(p.x, p.y, p.z);
        this.gameObject._obj3d.add(this.yaw);

        document.addEventListener('mousemove', this._onMouseMove.bind(this), false);

        this.tempPos = new THREE.Vector3();
        this.chatInputDomElement = document.getElementById('chatInput');
    }

    destroy() {
        //this.input.destroy();
        document.removeEventListener('mousemove', this._onMouseMove.bind(this), false);
    }

    update(deltaTime) {
        if (getPointerLockElement() === undefined) return;
        if (document.hasFocus() && document.activeElement === this.chatInputDomElement) return;

        if (Input.getKey('W')) {
            this.yaw.translateZ(-this.props.speed * deltaTime / 1000);
        } else if (Input.getKey('S')) {
            this.yaw.translateZ(this.props.speed * deltaTime / 1000);
        } else if (Input.getKey('A')) {
            this.yaw.translateX(-this.props.speed * deltaTime / 1000);
        } else if (Input.getKey('D')) {
            this.yaw.translateX(this.props.speed * deltaTime / 1000);
        }

        this.yaw.getWorldPosition(this.tempPos);
        this.gameObject.position.x = Math.clamp(this.tempPos.x, this.props.mapBorder.xMin, this.props.mapBorder.xMax);
        this.gameObject.position.z = Math.clamp(this.tempPos.z, this.props.mapBorder.zMin, this.props.mapBorder.zMax);
        this.yaw.position.set(0, 0, 0);
    }


    _onMouseMove(event) {
        if (getPointerLockElement() !== document.body) return;
        let x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        //let y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        this.yaw.rotation.y -= x * 1 / 1000;
    }
}

module.exports = FirstPersonController;