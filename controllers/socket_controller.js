const users = {};
let players = [];
let player = {}
let io = null;
let rounds = 0;
const maxrounds = 10;

function getOnlinePlayers() {
	return Object.values(users);
}

function getRandomPositions() {
	return {
			x: 600 * Math.random(),
			y: 800 * Math.random(),
			randomDelay: Math.floor(Math.random() * 10),
	}
}

function handleRegisterUser(username, callback) {
	const randomPositions = getRandomPositions();
	let onlinePlayers = getOnlinePlayers()
	users[this.id] = username;

	player = {
		playerId: this.id,
		name: username,
		score: 0,
		reactionTime: "",
	}
	
	callback({
		joinGame: true,
		onlineUsers: getOnlinePlayers(),
	});

	this.broadcast.emit('online-players', getOnlinePlayers());
	if (onlinePlayers.length === 1) {
		this.emit('start-game', randomPositions)
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
	const randomPositions = getRandomPositions();
	rounds++
	const playerIndex = players.findIndex((player => player.playerId === this.id));
	players[playerIndex].name = playerData.username;
	players[playerIndex].score = playerData.score;
	players[playerIndex].clickedTime = playerData.clickedTime;
	this.emit('reaction-time', playerData)

	const gameData = {
		players,
		rounds,
	}
	console.log('gamedata', gameData)
	if (rounds < maxrounds) {
		io.emit('new-round', randomPositions, gameData);
	} else if (rounds === maxrounds) {
		getWinner();
		rounds = 0;
	}
}

module.exports = function(socket) {

	io = this;
	socket.on('disconnect', handleUserDisconnect);

    socket.on('register-player', handleRegisterUser);
	
	socket.on('clicked-time', handleClick)

	}