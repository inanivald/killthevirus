const users = {};
let players = [];
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
	};
}

const getScore = function() {
	return players.map(player => player.score);
}

function handleRegisterUser(username, callback) {
	const randomPositions = getRandomPositions();
	users[this.id] = username;
	
	callback({
		joinGame: true,
		onlineUsers: getOnlinePlayers(),
	});

	this.broadcast.emit('online-players', getOnlinePlayers());
	this.emit('start-game', randomPositions)
	
}

// function handleStartGame() {
// 	let onlinePlayers = getOnlinePlayers();
// 	console.log('onlinePlayers', onlinePlayers)
// 	const randomPositions = getRandomPositions();
// 	if (onlinePlayers.length === 2){
	
// 	}
// }


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
	console.log('players', players)
	// compare the two players reaction time
	if (players.length === 2) {
	const time = players[0].clickedTime - players[1].clickedTime;

	// give the one with the shortest time the point
	if(time < 0) {
		players[0].score += 1;
		
	} else {
		players[1].score += 1;
	}
	}
	const scoreResult = getScore();
	
		this.emit('show-score', players, scoreResult)
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

