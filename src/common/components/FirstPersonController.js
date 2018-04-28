const Component = require('../Component');
const THREE = require('three');
//const PI_2 = Math.PI / 2;

/**
 * 控制玩家第一人称行走
 */
class FirstPersonController extends Component {

    start() {
        this.yaw = new THREE.Object3D();
        this.gameObject._obj3d.add(this.yaw);
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);

        this.keyboard = new THREEx.KeyboardState();
        this.tempPos = new THREE.Vector3();

        this.props.speed = 0.1;
    }

    destroy() {
        document.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
        this.keyboard.destroy();
    }

    update() {
        //console.log("update");
        if (this.keyboard.pressed('W')) {
            this.yaw.translateZ(-this.props.speed);
        } else if (this.keyboard.pressed('S')) {
            this.yaw.translateZ(this.props.speed);
        } else if (this.keyboard.pressed('A')) {
            this.yaw.translateX(-this.props.speed);
        } else if (this.keyboard.pressed('D')) {
            this.yaw.translateX(this.props.speed);
        }

        this.yaw.getWorldPosition(this.tempPos);
        this.gameObject.position.x = this.tempPos.x;
        this.gameObject.position.z = this.tempPos.z;
        this.yaw.position.set(0, 0, 0);
    }

    onMouseMove(event) {
        if (getPointerLockElement() !== document.body) return;
        let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        //let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        this.yaw.rotation.y -= movementX * 1 / 1000;
    }
}

module.exports = FirstPersonController;