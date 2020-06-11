const socket = io();

const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#game-wrapper');
const usernameForm = document.querySelector('#username-form');

let username = null;

const updateOnlinePlayers = (users) => {
    document.querySelector('#online-players').innerHTML = users.map(user => `<li class="user">${user}</li>`).join("");
}

usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	username = document.querySelector('#username').value;
	socket.emit('register-player', username, (status) => {
        if (status.joinChat) {
            startEl.classList.add('hide');
            gameWrapperEl.classList.remove('hide');
        }
    })
});

socket.on('online-players', (users) => {
	updateOnlinePlayers(users);
});
