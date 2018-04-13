//import Renderer from 'Renderer';
const Renderer = require('./Renderer');

class Game {

    constructor() {
        /**
         * requestAnimationFrame 返回的 id
         * @type {number}
         * @private
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
         * loop() 上次调用的时间
         * @type {number}
         */
        this.lastFrameTime = 0;

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
         * 真实 fps （平均）
         * @type {number}
         */
        this.fps = 60;

        /**
         * 真实 fps （一秒内）
         * @type {number}
         */
        this.framesThisSecond = 0;

        /**
         * 上次更新 fps 的时间
         * @type {number}
         * @private
         */
        this.lastFPSUpdate = 0;

        /**
         * 游戏渲染器
         * @type {Renderer}
         */
        this.renderer = null;

        /**
         * 当前游戏场景
         * @type {Scene}
         */
        this.scene = null;
    }

    /**
     * start the main loop
     */
    start() {
        if (!this.scene) throw "Miss scene in game instance, are you forget to assign game.scene?";
        if (this.isRunning) throw "This game is already running!";
        this.isRunning = true;
        //const self = this;
        this.raf = requestAnimationFrame((timestamp) => {
            // 初始化变量
            this.lastFrameTime = timestamp;
            this.lastFPSUpdate = timestamp;
            this.framesThisSecond = 0;

            this.renderer = new Renderer();
            this.raf = requestAnimationFrame(this.loop.bind(this));
        });
    }

    /**
     * stop the main loop
     */
    stop() {
        cancelAnimationFrame(this.raf);
        this.isRunning = false;
    }

    /**
     * the game loop
     * @param timestamp 调用时刻时间戳
     */
    loop(timestamp) {
        // 在开始时立即设置下一次循环，这样可以在本次 update 中取消下一帧执行
        this.raf = requestAnimationFrame(this.loop.bind(this));

        // 控制帧率，不让循环过快调用
        // fps+1 :否则因为太过接近，导致虽然调用都是 16ms，但一半被扔掉了
        if (timestamp < this.lastFrameTime + 1000 / (this.maxFPS + 1)) {
            return;
        }

        // 计算尚未被模拟的时间
        this.delta += timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        if (timestamp > this.lastFPSUpdate + 1000) {
            // 计算 FPS
            this.fps = 0.25 * this.framesThisSecond + 0.75 * this.fps;
            this.lastFPSUpdate = timestamp;
            this.framesThisSecond = 0;
        }
        this.framesThisSecond++;

        // 根据尚未被模拟的时间，分次模拟游戏状态更新
        // 防止帧率低时单帧时间长，造成穿墙、浮点误差造成各端状态不一致等问题
        let updateTimes = 0;
        while (this.delta >= this.updateTimeStep) {
            this.update(this.updateTimeStep);
            this.delta -= this.updateTimeStep;
            // 记录单次循环调用 update() 的次数
            // 如果次数太大，说明单帧耗时过久，需要处理
            // 虽然，大多数时候掉帧会更早出现
            if (++updateTimes >= 240) {
                this.panic();
                break;
            }
        }

        this.render();
    }

    /**
     * update game state
     * @param deltaTime 一次更新的时间
     */
    update(deltaTime) {
        this.scene.update(deltaTime);
    }

    /**
     * render screen
     */
    render() {
        this.renderer.render(this.scene);
        document.getElementById("fps").innerText = this.fps.toFixed(2) + " FPS";
    }

    /**
     * on game run too slowly
     */
    panic() {
        console.warn("WARNING: panic!");
        // 丢弃未模拟的时间，等待下次权威服务器同步
        this.delta = 0;
    }
}

module.exports = Game;