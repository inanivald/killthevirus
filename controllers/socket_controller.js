const users = {};
let io = null;


function getOnlinePlayers() {
	return Object.values(users);
}

function randomPositions(y, x) {
	
	let onlinePlayers = getOnlinePlayers();
	console.log('onlinePlayers', onlinePlayers)
	
	if (onlinePlayers.length === 2){
		const randomY = y * Math.random()
		const randomX = x * Math.random()
		const seconds = Math.floor(Math.random() * 10)
		console.log(seconds)
		setTimeout(function () {
			io.emit('virus-positions', randomY, randomX)
		}, seconds * 1000); ;
	}

}

function handleUserDisconnect() {
	if (users[this.id]) {
		this.broadcast.emit('user-disconnected', users[this.id]);
	}
	delete users[this.id];

    this.broadcast.emit('online-players', getOnlinePlayers());
}

function handleRegisterUser(username, callback) {
	users[this.id] = username;
	callback({
		joinGame: true,
		usernameInUse: false,
		onlineUsers: getOnlinePlayers(),
	});

	this.broadcast.emit('online-players', getOnlinePlayers());
}

module.exports = function(socket) {

	io = this;
	socket.on('disconnect', handleUserDisconnect);

    socket.on('register-player', handleRegisterUser);

    socket.on('positions', randomPositions)
   
}

