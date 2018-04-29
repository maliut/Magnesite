const uuid = require('uuid/v1');
const Event = require('../common/Event');
const Game = require('./Game');
const Scene = require('../common/Scene');
const loadScene = require('../common/loadScene');

/**
 * 所有网络事件的处理器
 */
class RTI {

    /*
     * 一个 socket 对应了一个已经登录的玩家，自定义属性：
     * socket.room - socket 当前加入的房间
     *
     * room 对象的定义：
     * - id - 随机 id
     * - name - 房间名字
     * - password - 房间密码
     * - headcount - 当前人数
     * - game - 正在进行的游戏
     */

    constructor(io) {
        this.io = io;
        this.rooms = new Map();   // id => room
    }

    /**
     * 新增客户端
     * @param socket
     */
    addClient(socket) {
        // 客户端掉线，退出房间
        socket.on('disconnect', () => {
            console.log("socket disconnect:" + socket.id);
            this.leaveRoom(socket);   // 退出房间
        });
        // 客户端登出事件
        socket.on(Event.LOGOUT, () => {
            socket.disconnect(true);
        });
        // 获得所有房间列表
        socket.on(Event.LIST_ROOMS, () => {
            socket.emit(Event.LIST_ROOMS, this.listRooms());
        });
        // 创建房间
        socket.on(Event.CREATE_ROOM, (data) => {
            let room = this.createRoom(data);
            room.game = new Game();
            loadScene().then((arr) => {
                let scene = new Scene();
                for (let i = 0; i < arr.length; i++) {
                    scene.add(arr[i]);
                }
                //arr.forEach((obj) => {scene.add(obj)});
                room.game.scene = scene;
                room.game.start();
                socket.emit(Event.CREATE_ROOM, {
                    id: room.id,
                    name: room.name,
                    password: !!room.password
                });
            });
        });
        // 加入房间
        socket.on(Event.JOIN_ROOM, (data) => {
            socket.emit(Event.JOIN_ROOM, this.joinRoom(socket, data));
        });
        // 离开房间
        socket.on(Event.LEAVE_ROOM, () => {
            socket.emit(Event.LEAVE_ROOM, this.leaveRoom(socket));
        });
        // 订阅房间列表变动事件
        socket.join(Event.ROOMS_CHANGE);
        // debug show sockets
        console.log("socket:" + Object.keys(this.io.sockets.sockets));
    }

    /**
     * 获得所有房间
     * @returns {*[]} 房间数组
     */
    listRooms() {
        return [...this.rooms.values()].map((room) => {
            return {
                id: room.id,
                name: room.name,
                password: !!room.password
            };
        });
    }

    /**
     * 创建房间
     * @param data
     * @returns {{id: *, name, password: *|string, headcount: number}}
     */
    createRoom(data) {
        let id = uuid();
        let room = {
            id: id,
            name: data.name,
            password: data.password,
            headcount: 0
        };
        this.rooms.set(id, room);
        this.notifyRoomListChange();
        return room;
    }

    /**
     * 某个客户端加入房间
     * @param socket
     * @param data
     * @returns {number}
     */
    joinRoom(socket, data) {
        if (socket.room) return -3;    // already in roomId
        if (!this.rooms.has(data.id)) return -1;   // no this roomId
        let room = this.rooms.get(data.id);
        if (room.password && room.password !== data.password) return -2;   // password invalid

        socket.room = room;
        room.headcount++;
        socket.leave(Event.ROOMS_CHANGE); // 不再监听房间变动
        socket.join(data.id);    // 加入特定房间
        socket.join(data.id + '/chat');  // 订阅房间聊天
        return 0;
    }

    /**
     * 某个客户端离开房间
     * @param socket
     */
    leaveRoom(socket) {
        let room = socket.room;
        if (!room) return -1;   // no joined room

        socket.room = null;
        socket.leave(room.id);   // 退出房间
        socket.leave(room.id + '/chat'); // 退出房间聊天
        socket.join(Event.ROOMS_CHANGE);    // 监听房间变动

        // 房间没人时销毁房间
        if (--room.headcount <= 0) {
            this.rooms.delete(room.id);
            this.notifyRoomListChange();
        }
        return 0;
    }

    /**
     * 向客户端推送房间变动
     */
    notifyRoomListChange() {
        this.io.in(Event.ROOMS_CHANGE).emit(Event.ROOMS_CHANGE, this.listRooms());
    }

    syncGame(roomId, data) {
        this.io.in(roomId).emit(Event.SYNC_CLIENTS, data);
    }

}

module.exports = RTI;