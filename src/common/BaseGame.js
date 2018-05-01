/**
 * 游戏对象的基类
 * 客户端和服务端需要继承之，分别实现相应的逻辑
 */
class BaseGame {

    constructor() {
        /**
         * requestAnimationFrame 返回的 id
         * @type {number}
         */
        this.raf = null;

        /**
         * 游戏正在进行吗？
         * @type {boolean}
         */
        this.isRunning = false;

        /**
         * 最大 FPS
         * @type {number}
         */
        this.maxFPS = 60;

        /**
         * 我们希望调用 update() 的时间间隔
         * @type {number}
         */
        this.updateTimeStep = 1000 / 60;

        /**
         * 尚未调用 update() 的时间量
         * @type {number}
         * @private
         */
        this.delta = 0;

        /**
         * 上次执行 loop 函数的时间
         * @type {number}
         */
        this.lastFrameTime = 0;

        /**
         * 当前游戏场景
         * @type {Scene}
         */
        this.scene = null;
    }

    /**
     * 游戏开始
     * 设置游戏开始标志，两端需 override 实现具体逻辑
     */
    start() {
        if (!this.scene) throw "Miss scene in game instance, are you forget to assign game.scene?";
        if (this.isRunning) throw "This game is already running!";
        this.isRunning = true;
    }

    /**
     * 游戏停止
     * 设置游戏停止标志，两端需 override 实现具体逻辑
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * 游戏循环
     */
    loop() {

    }

    /**
     * 游戏循环更新
     * @param deltaTime 一次更新的时间
     */
    update(deltaTime) {
        this.scene.update(deltaTime);
    }

}

module.exports = BaseGame;