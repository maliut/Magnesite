const ENV_CLIENT = !(typeof window === 'undefined');

class Input {

    constructor() {
        if (ENV_CLIENT) {
            this._keyboard = new THREEx.KeyboardState();
            this._yaw = null;
            document.addEventListener('mousemove', this._onMouseMove.bind(this), false);
        } else {
            this._currentKey = null;
            this._currentOrientation = 0;
        }
    }

    getKey(key) {
        if (ENV_CLIENT) {
            return this._keyboard.pressed(key);
        } else {
            return key === this._currentKey;
        }
    }

    getOrientation() {
        if (ENV_CLIENT) {
            return this._yaw.rotation.y;
        } else {
            return this._currentOrientation;
        }
    }

    destroy() {
        if (ENV_CLIENT) {
            this._keyboard.destroy();
            document.removeEventListener('mousemove', this._onMouseMove.bind(this), false);
        }
    }

    _onMouseMove(event) {
        if (getPointerLockElement() !== document.body) return;
        let x = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        //let y = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
        this._yaw.rotation.y -= x * 1 / 1000;
    }
}

module.exports = Input;
