const users = {};
let players = [];
let io = null;
let savedClickedTime = {};
let score = 0;
let playerClicked = 0;

function getOnlinePlayers() {
	return Object.values(users);
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

function randomPositions(y, x) {
	
	let onlinePlayers = getOnlinePlayers();
	
	if (onlinePlayers.length === 2){
		const randomY = y * Math.random()
		const randomX = x * Math.random()
		const seconds = Math.floor(Math.random() * 10)
		setTimeout(function () {
			const time = Date.now()
			io.emit('virus-positions', randomY, randomX, time)
		}, seconds * 1000);
	}

}

function handleUserDisconnect() {
	if (users[this.id]) {
		this.broadcast.emit('user-disconnected', users[this.id]);
	}
	delete users[this.id];

    this.broadcast.emit('online-players', getOnlinePlayers());
}

function handleClick(playerData) {

	let player = {
		name: playerData.username,
		id: playerData.id,
		clickedTime: playerData.clickedTime,
		rounds: playerData.rounds,
		clicks: playerData.clicks,
	}
	this.emit('reaction-time', playerData)
	
	players.push(player);
	savedClickedTime[this.id] = player.clickedTime;


	if (players.length === 2) {
		let fastPlayerId = Object.keys(savedClickedTime).reduce((a, b) => savedClickedTime[a] < savedClickedTime[b] ? a : b);
		let slowPlayerId = Object.keys(savedClickedTime).reduce((a, b) => savedClickedTime[a] > savedClickedTime[b] ? a : b);
		console.log('fastPlayerId', fastPlayerId)

		playerClicked = playerClicked + player.clicks;

		players.forEach(player => {
			if (player.id === fastPlayerId) {
				player.score = score++;
				console.log('player.score:', player.score)
			}
			if (player.id === slowPlayerId) {
				player.score = score + 0;
				console.log('player.score:', player.score)
			}
		})
	
		this.emit('show-score', players)
	}

}

module.exports = function(socket) {

	io = this;
	socket.on('disconnect', handleUserDisconnect);

    socket.on('register-player', handleRegisterUser);

	socket.on('positions', randomPositions)
	
	socket.on('clicked-time', handleClick)

   
	}

