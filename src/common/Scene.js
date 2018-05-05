const THREE = require('three');
const Resource = require('./Resource');

/**
 * Scene of a game, a wrapper for THREE.Scene
 */
class Scene {

    constructor() {
        /**
         * three.js 的 scene 对象
         * @type {THREE.Scene}
         * @private
         */
        this._scene = new THREE.Scene();

        /**
         * three.js 的 camera 对象
         * @type {THREE.Camera}
         * @private
         */
        this._camera = null;

        /**
         * 场景中所有对象
         * @type {Array<GameObject>}
         * @private
         */
        this._gameObjects = [];

        /**
         * 临时保存另一端传来的数据，用于同步
         * @type {networkId: data}
         */
        this.clientState = {};
        this.serverState = {};
    }

    /**
     * add a game object to scene
     * @param gameobj GameObject
     */
    add(gameobj) {
        if (this._gameObjects.indexOf(gameobj) === -1) {
            this._gameObjects.push(gameobj);
            this._scene.add(gameobj._obj3d);
            gameobj.onAddToScene(this);
            // 事件循环结束时调用，确保所有对象已经加入场景
            Promise.resolve().then(() => {
                gameobj.onStart();
            });
        }
    }

    /**
     * remove game object
     * @param gameobj GameObject
     */
    remove(gameobj) {
        gameobj.onRemove();
        this._gameObjects.remove(gameobj);
        this._scene.remove(gameobj._obj3d);
    }

    /**
     * get game object of id
     * @param id
     * @returns {GameObject}
     */
    getObjectById(id) {
        let obj3d = this._scene.getObjectById(id);
        return obj3d ? obj3d._gameObject : null;
    }

    /**
     * get game object of name
     * @param name
     * @returns {GameObject}
     */
    getObjectByName(name) {
        let obj3d = this._scene.getObjectByName(name);
        return obj3d ? obj3d._gameObject : null;
    }

    /**
     * get game object of property
     * @param name
     * @param value
     * @returns {GameObject}
     */
    getObjectByProperty(name, value) {
        // gameObject 上的属性，暴力查找
        if (name === 'networkId') {
            for (let i = 0; i < this._gameObjects.length; i++) {
                if (this._gameObjects[i][name] === value) {
                    return this._gameObjects[i];
                }
            }
            return null;
        } else {    // proxy THREE.Object3D 上的属性
            let obj3d = this._scene.getObjectByProperty(name, value);
            return obj3d ? obj3d._gameObject : null;
        }
    }

    /**
     * update scene by delta time
     * should only used in Game#update
     * @param deltaTime
     */
    update(deltaTime) {
        for (let obj of this._gameObjects) {
            obj.update(deltaTime);
        }
    }

    spawn(prefabName, position, rotation) {
        let newObj = Resource.Prefab[prefabName].clone();
        if (position) newObj.position.set(position.x, position.y, position.z);
        if (rotation) newObj.rotation.set(rotation.x, rotation.y, rotation.z);
        this.add(newObj);
        //console.log(newObj);
        return newObj;
    }
}

module.exports = Scene;