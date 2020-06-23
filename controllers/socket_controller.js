
let io = null;
const users = {};
let players = [];
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
	let onlinePlayers = getOnlinePlayers()
	users[this.id] = username;
	
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
	let player = {
		name: playerData.username,
		id: playerData.id,
		clickedTime: playerData.clickedTime,
		rounds: playerData.rounds,
		score: playerData.score
	}
	this.emit('reaction-time', playerData)

	players.push(player);


	if (players.length === 2) {
		const time = players[0].clickedTime - players[1].clickedTime;

		if(time < 0) {
			players[0].score += 1;
			
		} else {
			players[1].score += 1;
		}
	}
		this.emit('show-score', players)
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

