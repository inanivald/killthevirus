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
const virus = document.createElement('img');
let rounds = 0;
let username = null;
const maxrounds = 10;
let virusShown = null;


const updateOnlinePlayers = (users) => {
    onlinePlayersEl.innerHTML = users.map(user => `<li class="user">${user}</li>`).join("") ;
}

const addMessage = (data) => {
	messageEl.innerHTML = "";
	const message = document.createElement('li');

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
		score.innerHTML = `<li>${player.name}: ${player.score}</li>`
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


const startGame = (randomPositions) => {
    
        addMessage("Starting game...");
    
        setTimeout(() => {
            messageEl.innerHTML = "";
            playGame(randomPositions);
        }, 3000);     
}

const handleWinner = (player, tie) => {
	if (tie) {
		winner.innerHTML = `<h3>It's a tie!</h3>`
	} else { winner.innerHTML =`<h3>You are the winner ${player.name}!</h3>
        <p>Your score was ${player.score}/${maxrounds}</p>
	`
	}
	winner.classList.remove("hide");
    face.classList.add("hide");
	playersEL.classList.add("hide");

	setTimeout(() => {
		playAgain()
	}, 5000);
}

const handleLoser = (player, tie) => {
	if (tie) {
		loser.innertext = `<h3>It's a tie!</h3>`
	} else { loser.innerHTML = `<h3>Sorry, ${player.name}, you lost!</h3>
		<p>Your score was ${player.score}/${maxrounds}</p>
	`
	}
	loser.classList.remove("hide");
    face.classList.add("hide");
	playersEL.classList.add("hide");
	
	setTimeout(() => {
		playAgain()
	}, 5000);
    
}
const virusPositions = (randomPositions) => {
    virus.style.position = "absolute";
    virus.style.display = "inline";
    virus.style.left = randomPositions.x + "px";
    virus.style.top = randomPositions.y + "px";
}

const playGame = (randomPositions) => {
    virus.style.display = "none";

	setTimeout(() => {
		virusPositions(randomPositions);
        virusShown = Date.now();;
	}, randomPositions.randomDelay);
}

virus.addEventListener('click', () => {
    score++;
    const playerData = {
        clickedTime: Date.now() - virusShown,
        username: document.querySelector('#username').value,
        score,
    }
    console.log('playerData:', playerData)
    socket.emit('clicked-time', playerData)
    
})  

const playAgain = () => {
	playagainEl.classList.remove('hide');
    gameWrapperEl.classList.add('hide');

    usernameForm.addEventListener('submit', e => {
        e.preventDefault();
    
        const username = document.querySelector('#username').value;
        socket.emit('register-player', username, (status) => {
            if (status.joinGame) {
                playagainEl.classList.add('hide');
                gameWrapperEl.classList.remove('hide');
    
                updateOnlinePlayers(status.onlineUsers);
            }
        })
    });
    
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
    playGame(randomPositions)
})

socket.on('winner', (winner, tie) => {
	handleWinner(winner, tie);
});

socket.on('loser', (loser, tie) => {
	handleLoser(loser, tie)
});