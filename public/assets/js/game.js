const socket = io();

const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#game-wrapper');
const usernameForm = document.querySelector('#username-form');
const play = document.querySelector('#play');
const gameboard = document.querySelector('#gameboard');
const x = 600;
const y = 400;
const virus = document.createElement('img');

let username = null;

const updateOnlinePlayers = (users) => {
    document.querySelector('#online-players').innerHTML = users.map(user => `<li class="user">${user}</li>`).join("");

}

usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	username = document.querySelector('#username').value;
	socket.emit('register-player', username, (status) => {
        if (status.joinGame) {
            startEl.classList.add('hide');
            gameWrapperEl.classList.remove('hide');

            updateOnlinePlayers(status.onlineUsers);
        }
    })
});

const playGame = (randomY, randomX) => {
    console.log('Random positions:', randomY, randomX)

    virus.src = "https://fed19.thehiveresistance.com/wp-content/uploads/2020/06/a.svg";
    virus.style.position = "absolute";
    virus.style.top = randomY + 'px';
    virus.style.left = randomX + 'px';
    gameboard.appendChild(virus);  
}

socket.on('virus-positions', (randomY, randomX) => {
    playGame(randomY, randomX)
})

socket.on('online-players', (users) => {
    updateOnlinePlayers(users);
    
        socket.emit('positions', y, x)
        
});
