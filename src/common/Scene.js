export default class Scene {

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
         * @type {Set<GameObject>}
         * @private
         */
        this._gameObjects = new Set();
    }

    add(gameobj) {
        this._gameObjects.add(gameobj);
    }

    remove(gameobj) {
        this._gameObjects.delete(gameobj);
    }

    update(deltaTime) {
        for (let obj of this._gameObjects) {
            obj.update(deltaTime);
        }
    }
}