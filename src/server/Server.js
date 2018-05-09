const uuid = require('uuid/v1');
const Event = require('../common/Event');
const Game = require('./Game');
//const Scene = require('../common/Scene');
const Resource = require('../common/Resource');
//const loadScene = require('../common/loadScene');

/**
 * 所有网络事件的处理器
 */
class Server {

    /*
     * 一个 socket 对应了一个已经登录的玩家，自定义属性：
     * socket.room - socket 当前加入的房间
     * socket.username - 对应的用户名（启用 nickname 可以替换成 user 对象）
     *
     * room 对象的定义：
     * - id - 随机 id
     * - name - 房间名字
     * - type - 房间类型
     * - password - 房间密码
     * - players - 玩家 socket 数组
     * - game - 正在进行的游戏
     */

    constructor(io) {
        this.io = io;
        this.rooms = new Map();   // id => room
        this.onlineUsers = new Set();
    }

    /**
     * 新增客户端
     * @param socket
     */
    addClient(socket) {
        this.onlineUsers.add(socket.username);
        // 客户端掉线，退出房间
        socket.on('disconnect', () => {
            console.log("socket disconnect:" + socket.id);
            this.leaveRoom(socket);   // 退出房间
            this.onlineUsers.delete(socket.username);
        });
        // 客户端登出事件
        socket.on(Event.CLIENT_LOGOUT, () => {
            socket.disconnect(true);
        });
        // 获得所有房间列表
        socket.on(Event.CLIENT_LIST_ROOMS, () => {
            socket.emit(Event.CLIENT_LIST_ROOMS, this.listRooms());
        });
        // 创建房间
        socket.on(Event.CLIENT_CREATE_ROOM, (data) => {
            let room = this.createRoom(data);
            room.game = new Game();
            room.game.syncMethod = this.updateRoom(room.id);
            // 根据游戏类型 load 不同的 scene
            let sceneName = '';
            if (room.type === 1) {
                sceneName = 'turingmachine';
            } else if (room.type === 2) {
                sceneName = 'hanoi';
            }
            Resource.loadScene(sceneName).then(scene => {
                room.game.scene = scene;
                room.game.start();
                socket.emit(Event.CLIENT_CREATE_ROOM, {
                    id: room.id,
                    name: room.name,
                    type: room.type,
                    password: !!room.password
                });
            });
        });
        // 加入房间
        socket.on(Event.CLIENT_JOIN_ROOM, (data) => {
            let retdata = {ret: this.joinRoom(socket, data)};
            if (retdata.ret === 0) {    // 返回现有玩家
                retdata.roomId = socket.room.id;
                retdata.existPlayers = socket.room.players.map((s) => {
                    return s.id === socket.id ? undefined : ({
                        networkId: s.id,
                        name: s.username
                    });
                });
                retdata.existPlayers.remove(undefined);

                // 接收客户端状态
                socket.on(Event.CLIENT_SEND_STATE, (data) => {
                    socket.room.game.onPlayerState(socket, data);
                });

                // 聊天
                socket.on(Event.CHAT_MESSAGE, (data) => {
                    this.io.in(socket.room.id).emit(Event.CHAT_MESSAGE, {
                        name: socket.username,
                        message: data.message
                    });
                });
            }
            socket.emit(Event.CLIENT_JOIN_ROOM, retdata);
        });
        // 离开房间
        socket.on(Event.CLIENT_LEAVE_ROOM, () => {
            socket.emit(Event.CLIENT_LEAVE_ROOM, this.leaveRoom(socket));
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
     * @returns {{}}
     */
    createRoom(data) {
        let id = uuid();
        let room = {
            id: id,
            name: data.name,
            type: data.type,
            password: data.password,
            players: []
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
        socket.leave(Event.ROOMS_CHANGE); // 不再监听房间变动
        socket.join(data.id);    // 加入特定房间
        socket.join(data.id + '/chat');  // 订阅房间聊天

        room.players.push(socket);
        // 通知所有玩家，加入新玩家
        let player = room.game.scene.spawn('player');
        player.networkId = socket.id;
        //const StepTrigger = require('../common/components/StepTrigger');
        /*room.game.scene.getObjectByName('btn0').getComponent(StepTrigger).authPlayers.push(player);
        room.game.scene.getObjectByName('btn1').getComponent(StepTrigger).authPlayers.push(player);
        room.game.scene.getObjectByName('moveLeft').getComponent(StepTrigger).authPlayers.push(player);
        room.game.scene.getObjectByName('moveRight').getComponent(StepTrigger).authPlayers.push(player);
        room.game.scene.getObjectByName('btne').getComponent(StepTrigger).authPlayers.push(player);*/
        room.game.scene.onlinePlayers.push(player);
        this.io.in(room.id).emit(Event.SERVER_SPAWN, {
            id: socket.id,
            ext2: socket.username,
            prefab: 'player'
        });
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
        room.players.remove(socket);
        if (room.players.length <= 0) {
            this.rooms.delete(room.id);
            this.notifyRoomListChange();
        } else {
            let playerObj = room.game.scene.getObjectByProperty('networkId', socket.id);
            room.game.scene.remove(playerObj);
            this.io.in(room.id).emit(Event.SERVER_DESTROY, {
                networkId: socket.id,
            });
        }

        return 0;
    }

    /**
     * 更新房间内游戏状态
     * 返回闭包，供 Game 对象的更新方法使用
     * @param roomId
     * @returns {Function}
     */
    updateRoom(roomId) {
        return (data) => {
            this.io.in(roomId).emit(Event.SERVER_SEND_STATE, JSON.stringify(data));
        }
    }

    /**
     * 向客户端推送房间变动
     */
    notifyRoomListChange() {
        this.io.in(Event.ROOMS_CHANGE).emit(Event.ROOMS_CHANGE, this.listRooms());
    }

}

module.exports = Server;