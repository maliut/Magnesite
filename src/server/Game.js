export default class Game {

    constructor() {
        /**
         * server setImmediate 返回的 id
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
         * 我们希望调用 update() 的时间间隔
         * 此处应与客户端保持一致
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
         * 我们希望同步所有客户端的时间间隔
         * @type {number}
         */
        this.syncTimeStep = 100;

        /**
         * 在服务端模拟 requestAnimationFrame 方法
         * 每隔 100ms 执行 callback
         * @param callback
         * @returns {number | Number}
         */
        //const self = this;
        this.tick = (callback) => {
            return setImmediate(() => {
                callback(this.syncTimeStep);
            }, this.syncTimeStep);
        };

        /**
         * 上次执行 loop 函数的时间
         * @type {number}
         */
        this.lastFrameTime = 0;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        //this.raf = this.tick(this.loop.bind(this));
        //const self = this;
        this.raf = this.tick(() => {
            this.lastFrameTime = Date.now();
            this.raf = this.tick(this.loop.bind(this));
        })
    }

    stop() {
        clearImmediate(this.raf);
        this.isRunning = false;
    }

    loop(deltaTime) {
        this.raf = this.tick(this.loop.bind(this));

        this.delta += deltaTime;

        while (this.delta >= this.updateTimeStep) {
            this.update(this.updateTimeStep);
            this.delta -= this.updateTimeStep;
        }

        // todo sync all clients

        let nowTime = Date.now();
        if (nowTime - this.lastFrameTime > this.syncTimeStep) {
            this.panic(nowTime - this.lastFrameTime);
        }
        this.lastFrameTime = nowTime;
    }

    update(deltaTime) {

    }

    panic(frameTime) {
        console.warn("update costs too long(" + frameTime + "ms)!");
    }
}