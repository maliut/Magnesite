const Event = require('../common/Event');

/**
 * 客户端 socket 的封装类
 * 将 socket 通信封装成规范接口，以方便调用
 */
class Client {

    constructor(socket) {
        this.socket = socket;
        this.roomId = null;
        // todo 订阅事件
        //this.socket.on(Event.ROOMS_CHANGE, this.onRoomChange);

        //this.socket.on(Event.SYNC_CLIENTS, this.onSync);

        this.EMPTY = () => {};
    }

    logout() {
        this.socket.emit(Event.CLIENT_LOGOUT);
        Client.current = null;
        Client._inited = false;
    }

    /**
     * 获取房间列表
     * @param callback 获取后回调
     */
    listRooms(callback = this.EMPTY) {
        this.socket.emit(Event.CLIENT_LIST_ROOMS);
        this.socket.on(Event.CLIENT_LIST_ROOMS, callback);
    }

    /**
     * 请求创建房间
     * @param name 房间名
     * @param password 密码。null 为不需要密码
     * @param callback 创建后回调
     */
    createRoom(name, password = null, callback = this.EMPTY) {
        this.socket.emit(Event.CLIENT_CREATE_ROOM, {
            name: name,
            password: password
        });
        this.socket.on(Event.CLIENT_CREATE_ROOM, callback);
    }

    /**
     * 请求加入房间
     * @param id 房间 id
     * @param password 密码
     * @param callback 加入后回调
     */
    joinRoom(id, password = null, callback = this.EMPTY) {
        // return if already in roomId
        if (this.roomId != null) return;

        this.socket.emit(Event.CLIENT_JOIN_ROOM, {
            id: id,
            password: password
        });
        this.socket.on(Event.CLIENT_JOIN_ROOM, (data) => {
            this.roomId = data.roomId;
            callback(data);
        });
    }

    /**
     * 请求离开房间
     * @param callback 离开后回调
     */
    leaveRoom(callback = this.EMPTY) {
        if (!this.roomId) return;

        this.socket.emit(Event.CLIENT_LEAVE_ROOM);
        this.socket.on(Event.CLIENT_LEAVE_ROOM, (data) => {
            this.roomId = null;
            callback(data);
        });
    }

    /**
     * 发送位置同步数据
     * @param state
     */
    sendState(state) {
        if (!this.roomId) return;
        //console.log(state);
        this.socket.emit(Event.CLIENT_SEND_STATE, state);
    }

    subscribe(event, callback) {
        this.socket.on(event, callback);
    }

    sendChatMessage() {
        // todo
    }

    onSync(data) {
        // 同步游戏状态
    }
}

Client._inited = false;

Client.init = function(token) {
    if (Client._inited) {
        console.warn("Client is already initialized!");
        return;
    }

    let socket = io.connect('', {query: 'token=' + token});
    Client.current = new Client(socket);
    Client._inited = true;
};

module.exports = Client;