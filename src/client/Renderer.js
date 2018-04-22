const THREE = require('three');

/**
 * 封装了 three.js 的 Renderer
 * 将渲染器与 three.js 耦合的具体逻辑与 Game 类的抽象逻辑分离
 */
class Renderer {

    constructor() {
        /**
         * three.js 的渲染器
         * @type {THREE.WebGLRenderer}
         * @private
         */
        this._renderer = new THREE.WebGLRenderer({antialias: true});
        //this._renderer.setSize(window.innerWidth, window.innerHeight);
        //document.body.appendChild(this._renderer.domElement);
        Object.defineProperty(this, 'domElement', {
            value: this._renderer.domElement
        });
    }

    onWindowResize(width, height) {
        this._renderer.setSize(width, height);
    }

    /**
     * 渲染画面
     * @param scene
     */
    render(scene) {
        this._renderer.render(scene._scene, scene._camera);
    }

}

module.exports = Renderer;