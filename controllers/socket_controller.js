const users = {};
let players = [];
let io = null;
let savedClickedTime = {};
let score = 0;
let playerClicked = 0;
let rounds = 0;
const maxrounds = 10;

function getOnlinePlayers() {
	return Object.values(users);
}

function getRandomPositions() {
	return {
			x: 600 * Math.random(),
			y: 800 * Math.random(),
	};
}

function handleRegisterUser(username, callback) {

	const randomPositions = getRandomPositions();
	users[this.id] = username;
	
	callback({
		joinGame: true,
		onlineUsers: getOnlinePlayers(),
	});

	this.broadcast.emit('online-players', getOnlinePlayers());
	io.emit('start-game', randomPositions)
}

function handleUserDisconnect() {
	if (users[this.id]) {
		this.broadcast.emit('user-disconnected', users[this.id]);
	}
	delete users[this.id];

    this.broadcast.emit('online-players', getOnlinePlayers());
}

function handleClick(playerData) {
	const randomPositions = getRandomPositions();
	rounds++
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
	if (rounds < maxrounds) {
		io.emit('new-round', randomPositions);

}
}

module.exports = function(socket) {

	io = this;
	socket.on('disconnect', handleUserDisconnect);

    socket.on('register-player', handleRegisterUser);
	
	socket.on('clicked-time', handleClick)

   
	}

