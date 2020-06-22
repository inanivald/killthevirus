const socket = io();

const startEl = document.querySelector('#start');
const playagainEl = document.querySelector('#playagain');
const gameWrapperEl = document.querySelector('#game-wrapper');
const usernameForm = document.querySelector('#username-form');
const play = document.querySelector('#play');
const gameboard = document.querySelector('#gameboard');
const messageEl = document.querySelector('#info');
const score = document.querySelector('#score');
const onlinePlayersEl = document.querySelector('#online-players')
const x = 600;
const y = 800;
const virus = document.createElement('img');
let points = 0;
let username = null;
let rounds = 0;
let clicks = 0;
const maxrounds = 10;
let virusShown = null;


const updateOnlinePlayers = (users) => {
    onlinePlayersEl.innerHTML = users.map(user => `<li class="user">${user}</li>`).join("") ;
}

const addMessage = (data) => {
	messageEl.innerHTML = "";
	const message = document.createElement('li');

	// notification.classList.add('notification');
	message.innerHTML = data;

	messageEl.appendChild(message);
}

const addTime = (playerData) => {
    if (playerData.username === document.querySelector('#username').value) {
        document.querySelector('#time').innerHTML = `<p>Time: ${playerData.clickedTime / 1000} seconds</p>`
    }
}

const addScore = (players) => {
    players.forEach(player => {
		score.innerHTML += `<li>${player.name}: ${player.score}</li>`
	})
}

usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	const username = document.querySelector('#username').value;
	socket.emit('register-player', username, (status) => {
        if (status.joinGame) {
            startEl.classList.add('hide');
            gameWrapperEl.classList.remove('hide');

            updateOnlinePlayers(status.onlineUsers);
        }
    })
});

const imgCoordinates = (target) => {
	virus.style.display = "inline";
	virus.style.left = target.x + "px";
	virus.style.top = target.y + "px";
}

const startGame = (randomPositions) => {
    addMessage("Starting game...");

	setTimeout(() => {
		messageEl.innerHTML = "";
		playGame(randomPositions);
    }, 3000);
    
}

const playGame = (randomPositions) => {
    console.log('Random positions:', randomPositions)
    virus.src = "https://fed19.thehiveresistance.com/wp-content/uploads/2020/06/a.svg";
    virus.style.position = "absolute";
    virus.style.top = y + 'px';
    virus.style.left = x + 'px';
    console.log('randomPositions:', randomPositions)

    setTimeout(function () {
        gameboard.appendChild(virus)
        virusShown = Date.now();
    }, Math.floor(Math.random() * 10) * 1000)
   
}

virus.addEventListener('click', () => {
    rounds += 1;
    clicks += 1;
   
    const playerData = {
        clickedTime: Date.now() - virusShown,
        username: document.querySelector('#username').value,
        id: socket.id,
        rounds,
        clicks,
    }
    socket.emit('clicked-time', playerData)
    gameboard.removeChild(virus);
})  

const endgame = () => {
	playagainEl.classList.remove('hide');
	gameWrapperEl.classList.add('hide');
}


socket.on('start-game', (randomPositions) => {
    startGame(randomPositions)
})

socket.on('online-players', (users) => {
    updateOnlinePlayers(users);

});

socket.on('reaction-time', (playerData) => {
    addTime(playerData)

    
})

socket.on('show-score', (players) => {
    addScore(players)
})

socket.on('new-round', (randomPositions) => {
    startGame(randomPositions)
})