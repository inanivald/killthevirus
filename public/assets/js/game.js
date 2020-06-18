const socket = io();

const startEl = document.querySelector('#start');
const playagainEl = document.querySelector('#playagain');
const gameWrapperEl = document.querySelector('#game-wrapper');
const usernameForm = document.querySelector('#username-form');
const play = document.querySelector('#play');
const gameboard = document.querySelector('#gameboard');
const x = 600;
const y = 400;
const virus = document.createElement('img');
let points = 0;
let username = null;
let rounds = 0;
const maxrounds = 10;


const updateOnlinePlayers = (users) => {
    document.querySelector('#online-players').innerHTML = users.map(user => `<li class="user">${user}</li>`).join("") ;
}

const addTime = (clickedTimeByUsers) => {
    if (clickedTimeByUsers.username === document.querySelector('#username').value) {
        document.querySelector('#time').innerHTML = `<p>Time: ${clickedTimeByUsers.clickedTime / 1000} seconds</p>`
    }

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
        const clickedTimeByUsers = {
            clickedTime: Date.now() - time,
            username: document.querySelector('#username').value
        }
    
        console.log('clickedTime', clickedTimeByUsers)
        socket.emit('clicked-time', clickedTimeByUsers)
        gameboard.removeChild(virus);
        rounds += 1
        socket.emit('positions', y, x, rounds)
        
        console.log('rounds:', rounds)
        if (rounds === maxrounds) {
            endgame()
        }
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

socket.on('reaction-time', (clickedTimeByUsers) => {
    addTime(clickedTimeByUsers)
    
})