const users = {};

function getOnlineUsers() {
	return Object.values(users);
}

function handleUserDisconnect() {
    
	// broadcast to all connected sockets that this user has left the chat
	if (users[this.id]) {
		this.broadcast.emit('user-disconnected', users[this.id]);
	}

	// remove user from list of connected users
    delete users[this.id];

    this.broadcast.emit('online-players', getOnlineUsers());
}

function handleRegisterUser(username, callback) {
	users[this.id] = username;
	callback({
		joinChat: true,
		usernameInUse: false,
		onlineUsers: getOnlineUsers(),
	});

	this.emit('online-players', getOnlineUsers());
}

module.exports = function(socket) {

	socket.on('disconnect', handleUserDisconnect);

    socket.on('register-player', handleRegisterUser);
}