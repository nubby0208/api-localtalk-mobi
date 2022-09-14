const SocketIO = require('socket.io');

/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */

function initSocket(socket) {

    socket.on("goOnline", id => {
        console.log("id========>", id)
        io.onlineUsers[id] = true;
        const keys = Object.keys(io.onlineUsers);
        console.log(`there are ${id} go online`);
        io.of("/api/chatRoomList").emit('onOnlineUserListUpdate', keys);
        socket.on("disconnect", () => {
            delete io.onlineUsers[id];
            const keys = Object.keys(io.onlineUsers);
            io.of("/api/chatRoomList").emit('onOnlineUserListUpdate', keys);
            console.log(`there are ${id} go offline`);
        });
    })

}

module.exports = (server) => {

    // const io = SocketIO({ path: '/bridge', serveClient: false, transports: ['websocket', 'polling'] })
    //     .listen(server, { log: true });

    const io = SocketIO(server); 

    io.on('connection', (socket) => { initSocket(socket, (response) => { console.log(response) }) }, server)

    io.onlineUsers = {};

    //require("./sokets/init.socket")(io);
    require("./convs.socket")(io);
    require("./message.socket")(io);
    require("./publicRoomsSocket")(io);
};
