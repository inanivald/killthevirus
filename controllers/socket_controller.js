const users = {};
let io = null;
let time = null;

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
			const time = Date.now()
			io.emit('virus-positions', randomY, randomX, time)
			console.log('time', time)
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

function handleClick(clickedTimeByUsers) {
	
	console.log(clickedTimeByUsers)
	// function findHighestScore() {
	// 	let highScoreSoFar = 0;
	// 	let result;
	// 	for (let i = 0; i < players.length; i++) {
	// 		if (players[i].score > highScoreSoFar) {
	// 			result = players[i];
	// 			highScoreSoFar = players[i].score;
	// 		}
	// 	}
	// 	return result;
	// }
	// winner = findHighestScore()
	this.emit('reaction-time', clickedTimeByUsers)
	// console.log('winner:', winner.username)
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
	
	socket.on('clicked-time', handleClick)
   
}

