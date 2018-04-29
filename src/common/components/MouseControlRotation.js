const Component = require('../Component');
const PI_2 = Math.PI / 2;

/**
 * 鼠标移动相机控制视角转换
 */
@Component.clientOnly
@Component.serializedName('MouseControlRotation')
class MouseControlRotation extends Component {

    start() {
        this.yaw = this.gameObject._obj3d;
        this.pitch = this.yaw.children[0];
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }

    destroy() {
        document.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
    }

    onMouseMove(event) {
        if (getPointerLockElement() !== document.body) return;
        let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        this.yaw.rotation.y -= movementX * 1 / 1000;
        this.pitch.rotation.x -= movementY * 1 / 1000;
        this.pitch.rotation.x = Math.max(-PI_2, Math.min(PI_2, this.pitch.rotation.x));
    }
}

module.exports = MouseControlRotation;