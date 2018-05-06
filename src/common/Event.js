// HLA Interface
module.exports = {
    // client 主动发起
    CLIENT_LOGOUT: 'logout',

    CLIENT_CREATE_ROOM: 'createRoom',
    CLIENT_JOIN_ROOM: 'joinRoom',
    CLIENT_LEAVE_ROOM: 'leaveRoom',
    //DESTROY_ROOM: 'destroyLobby',
    CLIENT_LIST_ROOMS: 'listRooms',

    ROOMS_CHANGE: 'lobbiesChange',

    //SYNC_CLIENTS: 'syncClients',
    //REPORT_INPUT: 'reportInput',
    CLIENT_SEND_STATE: 'clientState',

    // server 发起
    SERVER_SPAWN: 'spawn',
    SERVER_SEND_STATE: 'serverState',
    SERVER_DESTROY: 'destroy',

    CHAT_MESSAGE: 'chatMessage'

};
// create roomId
// join roomId
// exit roomId
// destroy roomId

// sync clients

/*
每个 client 和一个 server 作为一个成员，
server 发布游戏状态对象， client 订阅之
反之，client 发布 input
 */

/*
RPC ? attributes period update？
 */