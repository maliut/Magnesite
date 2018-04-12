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

function setWindowResizeListener(listener) {
    window.addEventListener('resize', listener, false);
}

function removeWindowResizeListener(listener) {
    window.removeEventListener('resize', listener, false);
}