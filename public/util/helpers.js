// 各种有用的 helper

/* **********************************************
 * DOM 事件
 * **********************************************/
/**
 * 请求进入全屏
 */
function requestFullscreen() {
    document.documentElement.requestFullscreen =
        document.documentElement.requestFullscreen || document.documentElement.mozRequestFullScreen ||
        document.documentElement.webkitRequestFullScreen || document.documentElement.msRequestFullscreen;
    document.documentElement.requestFullscreen();
    //requestPointerLock();
}

/**
 * 退出全屏
 */
function exitFullscreen() {
    document.exitFullscreen =
        document.exitFullscreen || document.mozCancelFullScreen ||
        document.webkitCancelFullScreen || document.msExitFullscreen;
    document.exitFullscreen();
}

function requestPointerLock() {
    document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock;
    document.body.requestPointerLock();
}

function getPointerLockElement() {
    return document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement;
}

function addWindowResizeListener(listener) {
    window.addEventListener('resize', listener, false);
}

function removeWindowResizeListener(listener) {
    window.removeEventListener('resize', listener, false);
}

/* *********************************************
 * JavaScript 语法扩充
 * *********************************************/
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

Math.clamp = function (value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// meta.js es6 ployfill
Object.defineProperty(Object.prototype, "class", {
    get: function() {
        return Object.getPrototypeOf(this).constructor;
    }
});