// HLA Interface
module.exports = {
    // client 主动发起
    CLIENT_LOGOUT: 'logout',

    CLIENT_CREATE_ROOM: 'createRoom',
    CLIENT_JOIN_ROOM: 'joinRoom',
    CLIENT_LEAVE_ROOM: 'leaveRoom',

    CLIENT_LIST_ROOMS: 'listRooms',

    ROOMS_CHANGE: 'lobbiesChange',

    CLIENT_SEND_STATE: 'clientState',

    // server 发起
    SERVER_SPAWN: 'spawn',
    SERVER_SEND_STATE: 'serverState',
    SERVER_DESTROY: 'destroy',

    CHAT_MESSAGE: 'chatMessage'

};
