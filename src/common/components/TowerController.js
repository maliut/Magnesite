const Component = require('../Component');
const ENV_CLIENT = !(typeof window === 'undefined');

/**
 * 汉诺塔控制器
 */
@Component.serializedName('TowerController')
class TowerController extends Component {

    start() {
        this.cooldown = 0;
        this.simSteps = [];
        this.platePool = new PlatePool(this.gameObject.scene);
        this.state = { a: [3,2,1], b: [], c: [] };
        this.repaint();
        //this.move('a', 'b');
        //this.simMoveStart();
    }

    update() {
        if (!ENV_CLIENT && this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        if (!ENV_CLIENT && this.simSteps.length > 0) {
            let step = this.simSteps.shift();
            this.move(step[0], step[1]);
        }

        if (ENV_CLIENT && this.gameObject.peerState) {
            this.state = this.gameObject.peerState;
            this.repaint();
            this.gameObject.peerState = null;
        }
    }

    repaint() {
        if (!ENV_CLIENT) {
            // 服务端发送同步信息
            this.gameObject.serverState = this.state;
        }
        this.platePool.hideAll();
        for (let i = 0; i < this.state.a.length; i++) {
            let obj = this.platePool.obtain(this.state.a[i]);
            obj.position.set(-4, 0.25 + i*0.3, 0);
            obj.visible = true;
        }
        for (let i = 0; i < this.state.b.length; i++) {
            let obj = this.platePool.obtain(this.state.b[i]);
            obj.position.set(0, 0.25 + i*0.3, 0);
            obj.visible = true;
        }
        for (let i = 0; i < this.state.c.length; i++) {
            let obj = this.platePool.obtain(this.state.c[i]);
            obj.position.set(4, 0.25 + i*0.3, 0);
            obj.visible = true;
        }
    }

    // 不校验合法性
    // 如果有需要，保存之前的一份 state，出错进行回滚
    move(from, to) {
        if (this.cooldown > 0) return;
        this.cooldown += this.props.cooldown;

        let plate = this.state[from].pop();
        if (plate === undefined) return;
        this.state[to].push(plate);
        this.repaint();
    }

    setPlateCount(count) {
        let arr = [];
        while (count > 0) arr.push(count--);
        this.state = { a: arr, b: [], c: [] };
        this.repaint();
    }

    // 计算步数
    simMoveStart() {
        let count = 0, from, to, via;
        if (this.state.a.length > 0 && this.state.b.length === 0 && this.state.c.length === 0) {
            [count, from, to, via] = [this.state.a.length, 'a', 'b', 'c'];
        } else if (this.state.a.length === 0 && this.state.b.length > 0 && this.state.c.length === 0) {
            [count, from, to, via] = [this.state.b.length, 'b', 'c', 'a'];
        } else if (this.state.a.length === 0 && this.state.b.length === 0 && this.state.c.length > 0) {
            [count, from, to, via] = [this.state.c.length, 'c', 'a', 'b'];
        }
        if (count === 0) return;
        this.simSteps = [];
        this.simMoveAll(count, from, to, via);
    }

    simMoveAll(count, from, to, via) {
        if (count === 1) {
            this.simSteps.push([from, to]);
            return;
        }
        this.simMoveAll(count - 1, from, via, to);
        this.simSteps.push([from, to]);
        this.simMoveAll(count - 1, via, to, from);
    }

}

module.exports = TowerController;

class PlatePool {

    constructor(scene) {
        this.plateProto = require('../Resource').Prefab['plate'];
        this.plates = [];
        this.scene = scene;
    }

    // 1-5
    obtain(size) {
        if (!this.plates[size]) {
            let obj = this.plateProto.clone();
            //obj.position.set(0, this.plateProto.position.y + size*0.3, 0);
            obj.scale.set(0.2*size, 1, 0.2*size);
            this.plates[size] = obj;
            this.scene.add(obj);
        }
        return this.plates[size];
    }

    hideAll() {
        for (let i = 0; i < this.plates.length; i++) {
            if (!this.plates[i]) continue;
            this.plates[i].visible = false;
        }
    }
}