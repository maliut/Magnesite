const THREE = require('three');

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
    }

    /**
     * add a game object to scene
     * @param gameobj GameObject
     */
    add(gameobj) {
        if (this._gameObjects.indexOf(gameobj) === -1) {
            this._gameObjects.push(gameobj);
            //if (gameobj._obj3d.isCamera) {
            //    this._camera = gameobj._obj3d;
            //}
            this._scene.add(gameobj._obj3d);
        }
        gameobj.onStart(this);
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
        let obj3d = this._scene.getObjectByProperty(name, value);
        return obj3d ? obj3d._gameObject : null;
    }

    /**
     * update scene by delta time
     * should only used in Game#update
     * @param deltaTime
     * @private
     */
    update(deltaTime) {
        for (let obj of this._gameObjects) {
            obj.update(deltaTime);
        }
    }

    spawn(gameObject, position = gameObject.position, rotation = gameObject.rotation) {
        let newObj = gameObject.clone();
        newObj.position = position;
        newObj.rotation = rotation;
        this.add(newObj);
    }
}

module.exports = Scene;