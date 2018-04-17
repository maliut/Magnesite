// HLA Interface
module.exports = {
    LOGOUT: 'logout',

    CREATE_ROOM: 'createRoom',
    JOIN_ROOM: 'joinRoom',
    LEAVE_ROOM: 'exitLobby',
    DESTROY_ROOM: 'destroyLobby',
    LIST_ROOMS: 'listRooms',

    ROOMS_CHANGE: 'lobbiesChange',

    SYNC_CLIENTS: 'syncClients',
    REPORT_INPUT: 'reportInput',

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