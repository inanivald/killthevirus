const socket = io();

const startEl = document.querySelector('#start');
const gameWrapperEl = document.querySelector('#game-wrapper');
const usernameForm = document.querySelector('#username-form');

let username = null;

// get username from form and emit `register-user`-event to server
usernameForm.addEventListener('submit', e => {
	e.preventDefault();

	username = document.querySelector('#username').value;
	socket.emit('player-connected', username) 


	startEl.classList.add('hide');
	gameWrapperEl.classList.remove('hide');


});