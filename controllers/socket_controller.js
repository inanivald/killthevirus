const users = {};
let players = [];
let player = {}
let io = null;
let rounds = 0;
const maxrounds = 10;

function getPlayerNames() {
	return players.map(player => player.name);
}

function getPlayerById(id) {
	return players.find(player => player.playerId === id);
}

function getRandomPositions() {
	return {
			x: 600 * Math.random(),
			y: 800 * Math.random(),
			randomDelay: Math.floor(Math.random() * 10),
	}
}

function getWinner() {
	const winner = players.reduce((a, b) => a.score > b.score ? a : b);
	const loser = players.reduce((a, b) => a.score < b.score ? a : b);
	const tie = players.reduce((a, b) => {
		if (a.score === b.score) {
			return true;
		} else {
			return false;
		}
	});

	io.to(winner.playerId).emit('winner', winner, tie);
	io.to(loser.playerId).emit('loser', loser, tie);
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
	
	const player = getPlayerById(this.id);

	this.broadcast.emit('player-disconnected', player)

	for (let i =0; i < players.length; i++) {
		if (players[i].playerId === this.id) {
			players.splice(i,1);
			break;
		}
	}

	io.emit('online-players', getPlayerNames());
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