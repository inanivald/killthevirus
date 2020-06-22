const socket = io();

const startEl = document.querySelector('#start');
const playagainEl = document.querySelector('#playagain');
const gameWrapperEl = document.querySelector('#game-wrapper');
const usernameForm = document.querySelector('#username-form');
const play = document.querySelector('#play');
const gameboard = document.querySelector('#gameboard');
const score = document.querySelector('#score');
const x = 600;
const y = 400;
const virus = document.createElement('img');
let points = 0;
let username = null;
let rounds = 0;
let clicks = 0;
const maxrounds = 10;


const updateOnlinePlayers = (users) => {
    document.querySelector('#online-players').innerHTML = users.map(user => `<li class="user">${user}</li>`).join("") ;
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

const playGame = (randomY, randomX, time) => {
    console.log('Random positions:', randomY, randomX)

    virus.src = "https://fed19.thehiveresistance.com/wp-content/uploads/2020/06/a.svg";
    virus.style.position = "absolute";
    virus.style.top = randomY + 'px';
    virus.style.left = randomX + 'px';
    gameboard.appendChild(virus);

    virus.addEventListener('click', () => {
        rounds += 1;
        clicks += 1;
       
        const playerData = {
            clickedTime: Date.now() - time,
            username: document.querySelector('#username').value,
            id: socket.id,
            rounds,
            clicks,
        }

        socket.emit('clicked-time', playerData)
        gameboard.removeChild(virus);
      
    })  
}
const endgame = () => {
	playagainEl.classList.remove('hide');
	gameWrapperEl.classList.add('hide');
}


socket.on('virus-positions', (randomY, randomX, time) => {
    playGame(randomY, randomX, time)
})

socket.on('online-players', (users) => {
    updateOnlinePlayers(users);
    
    socket.emit('positions', y, x)
});

socket.on('reaction-time', (playerData) => {
    addTime(playerData)
    
})

socket.on('show-score', (players) => {
    addScore(players)
})