const Component = require('../Component');
const THREE = require('three');
const ENV_CLIENT = !(typeof window === 'undefined');
const Client = ENV_CLIENT ? require('../../client/Client') : undefined;

/**
 * 挂在玩家对象身上，同步位置信息
 */
@Component.serializedName('Synchronizer')
class Synchronizer extends Component {

    constructor() {
        super();

        /**
         * 是否是本地玩家
         * 仅当客户端本地玩家时在 spawn 时设成 true
         * 如果是本地玩家，则需要周期性向服务器上报状态数据
         * 当同步服务端的数据时，也要判断是否在误差允许的范围内
         * @type {boolean}
         */
        this.isLocalPlayer = false;

        // 本机状态上报相关
        this.props.interval = 6;   // 几次循环触发一次同步
        this.cycle = 0; // 当前周期循环次数

        // 非本机，插值相关
        this.velocity = new THREE.Vector3();
    }

    start() {
        this.lastCyclePosition = this.gameObject.position.clone();
    }

    update(deltaTime) {
        if (this.gameObject.peerState) {
            this.syncStateFromPeer();
            this.gameObject.peerState = null;   // consume it
        }

        if (ENV_CLIENT && this.isLocalPlayer && ++this.cycle >= this.props.interval) {
            // 本机，定期向服务器上报自身状态
            Client.current.sendState(this.collectState(deltaTime));
            this.cycle = 0;
            this.lastCyclePosition = this.gameObject.position.clone();
        } else {
            // 插值使运动流畅
            //this.gameObject.position.add(this.velocity.clone().multiplyScalar(deltaTime));
            if (!ENV_CLIENT) {
                // 服务端调用，收集自身数据，供游戏同步循环提供给客户端
                this.gameObject.serverState = {
                    position: {x: this.gameObject.position.x, y: this.gameObject.position.y, z: this.gameObject.position.z},
                    velocity: {x: this.velocity.x, y: this.velocity.y, z: this.velocity.z},
                    timestamp: Date.now()
                };
            }
        }
    }

    /**
     * 自身状态数据
     */
    collectState(deltaTime) {
        let position = this.gameObject.position.clone();
        let velocity = new THREE.Vector3();
        velocity.subVectors(position, this.lastCyclePosition).divideScalar(deltaTime);
        //let rotation = this.gameObject.rotation;
        //console.log(position, velocity);
        return {
            position: {x: position.x, y: position.y, z: position.z},
            velocity: {x: velocity.x, y: velocity.y, z: velocity.z},
            timestamp: Date.now()
        };
    }

    /**
     * 从另一端数据更新自己
     */
    syncStateFromPeer() {
        // 根据网络延迟，做位置插值
        let po = this.gameObject.peerState.position;
        let position = new THREE.Vector3(po.x, po.y, po.z);
        //let vo = this.gameObject.peerState.velocity;
        //this.velocity.set(vo.x, vo.y, vo.z);
        //let timeDelta = Date.now() - this.gameObject.peerState.timestamp;   // 网络传输延迟
        //position.add(this.velocity.clone().multiplyScalar(timeDelta));

        if (ENV_CLIENT && this.isLocalPlayer) {
            //console.log(po, position, this.gameObject.position);
            // todo
        } else {
            this.gameObject.position.set(position.x, position.y, position.z);
        }
    }
}

module.exports = Synchronizer;