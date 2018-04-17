const uuid = require('uuid/v1');
const Event = require('../common/Event');
//import {Event} from "../common/Event";

/**
 * 所有网络事件的处理器
 */
class RTI {

    constructor(io) {
        this.io = io;
        this.rooms = new Map();   // id => room
        //this.lobbyMembers = new Map();   // id => set<client>
        //this.subscribers = new Map();   // event => set<client>
    }

    /**
     * 新增客户端
     * @param socket
     */
    addClient(socket) {
        //socket.extra = {};
        socket.on(Event.LIST_ROOMS, () => {
            socket.emit(Event.LIST_ROOMS, this.listRooms());
        });
        socket.on(Event.CREATE_ROOM, (data) => {
            socket.emit(Event.CREATE_ROOM, this.createRoom(data));
            socket.to(Event.ROOMS_CHANGE).emit(Event.ROOMS_CHANGE, this.listRooms());
        });
        socket.on(Event.JOIN_ROOM, (data) => {
            socket.emit(Event.JOIN_ROOM, this.joinRoom(socket, data));
        });
        socket.on(Event.LEAVE_ROOM, (data) => {
            let ret = this.leaveRoom(socket, data);
            socket.emit(Event.LEAVE_ROOM, ret);
            if (ret === -10) {
                socket.to(Event.ROOMS_CHANGE).emit(Event.ROOMS_CHANGE, this.listRooms());
            }
        });
        socket.join(Event.ROOMS_CHANGE);
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
        //this.lobbyMembers.set(id, new Set());
        return room;
    }

    /**
     * 某个客户端加入房间
     * @param socket
     * @param data
     * @returns {number}
     */
    joinRoom(socket, data) {
        //if (socket.extra.lobbyId) return -3;    // already in roomId
        if (!this.rooms.has(data.id)) return -1;   // no this roomId
        let room = this.rooms.get(data.id);
        if (room.password && room.password !== data.password) return -2;   // password invalid

        //this.lobbyMembers.get(id).add(socket);
        //socket.extra.lobbyId = id;
        room.headcount++;
        socket.leave(Event.ROOMS_CHANGE); // 不再监听房间变动
        socket.join(data.id);    // 加入特定房间
        socket.join(data.id + '/chat');  // 订阅房间聊天
        return 0;
    }

    /**
     * 某个客户端离开房间
     * @param socket
     * @param data
     */
    leaveRoom(socket, data) {
        if (!this.rooms.has(data.id)) return -1;   // no this roomId

        socket.leave(data.id);   // 退出房间
        socket.leave(data.id + '/chat'); // 退出房间聊天
        socket.join(Event.ROOMS_CHANGE);    // 监听房间变动

        // 房间没人时销毁房间
        let room = this.rooms.get(data.id);
        if (--room.headcount <= 0) {
            this.rooms.delete(data.id);
            return -10; // destroy room
        }
        return 0;
    }

    syncGame(roomId, data) {
        this.io.in(roomId).emit(Event.SYNC_CLIENTS, data);
    }

}

module.exports = RTI;