'use strict';
//25x18
const game = document.getElementById('game');
const score = document.querySelector('.score');
const header = document.querySelector('h1');
const welcome = document.querySelector('#welcome');
const body = document.querySelector('body');
const eatingSound = new Audio('/sounds/sounds_waka.wav');
const gameOverSound = new Audio('/sounds/pacman_game_over.mp3');
const winSound = new Audio('/sounds/pacman-victory.mp3');
gameOverSound.volume = 0.3;

let round = 1
let allScore = 1
let currentScore, map, pacmanCoords, field;
let calculateChildNumber = (row, column) => map[row].length * row + column;
let redGhost, greenGhost, pinkGhost, orangeGhost;
let redStart, greenStart, pinkStart, orangeStart;

function drawMap() {
    game.innerHTML = '';
    for (let row = 0; row < map.length; row++) {
        for (let column = 0; column < map[row].length; column++) {
            switch (map[row][column]) {
                case 1:
                    game.innerHTML += "<div class='wall'></div";
                    break;
                case 2:
                    game.innerHTML += "<div class='pacman'></div";
                    break;
                case 3:
                    game.innerHTML += "<div class='food'></div";
                    break;
                case 4:
                    game.innerHTML += "<div class='path'></div";
                    break;
                case 5:
                    game.innerHTML += "<div class='red-ghost'></div";
                    break;
                case 6:
                    game.innerHTML += "<div class='green-ghost'></div";
                    break;
                case 7:
                    game.innerHTML += "<div class='pink-ghost'></div";
                    break;
                case 8:
                    game.innerHTML += "<div class='orange-ghost'></div";
                    break;
                case 9:
                    game.innerHTML += "<div class='power-pill'></div";
                    break;
            }
        }
    }
}

function clearOldPosition(coords, toRemove, food = false) {
    field = game.children[calculateChildNumber(coords.row, coords.column)];
    field.classList.remove(toRemove);
    field.style.transform = '';

    if (food) {
        field.classList.add('food');
    } else {
        field.classList.add('path');
    }
}

function setNewPosition(coords, toAdd) {
    score.textContent = `Score: ${currentScore} / 178 Overall Score: ${allScore} Round: ${round}`;
    field = game.children[calculateChildNumber(coords.row, coords.column)];

    if (toAdd === 'pacman') {
        field.classList.remove('path', 'food', 'power-pill');
    } else {
        field.classList.remove('path');
    }
    field.classList.add(toAdd);
}

function checkForFood(coords) {
    return game.children[
        calculateChildNumber(coords.row, coords.column)
    ].classList.contains('food');
}

function keyDown(e) {
    if (
        e.key === 'ArrowDown' &&
        map[pacmanCoords.row + 1][pacmanCoords.column] !== 1
    ) {
        movePlayerDown();
    } else if (
        e.key === 'ArrowUp' &&
        map[pacmanCoords.row - 1][pacmanCoords.column] !== 1
    ) {
        movePlayerUp();
    } else if (
        e.key === 'ArrowRight' &&
        map[pacmanCoords.row][pacmanCoords.column + 1] !== 1
    ) {
        movePlayerRight();
    } else if (
        e.key === 'ArrowLeft' &&
        map[pacmanCoords.row][pacmanCoords.column - 1] !== 1
    ) {
        movePlayerLeft();
    }
    checkWin();
}

function movePlayerDown() {
    clearOldPosition(pacmanCoords, 'pacman');
    pacmanCoords.row += 1;
    checkForFood(pacmanCoords) ? currentScore++ && allScore++ && eatingSound.play() : 'pass';
    setNewPosition(pacmanCoords, 'pacman');
    document.querySelector('.pacman').style.transform = 'rotate(90deg)';
}

function movePlayerUp() {
    clearOldPosition(pacmanCoords, 'pacman');
    pacmanCoords.row -= 1;
    checkForFood(pacmanCoords) ? currentScore++ && allScore++ && eatingSound.play() : 'pass';
    setNewPosition(pacmanCoords, 'pacman');
    document.querySelector('.pacman').style.transform = 'rotate(-90deg)';
}

function movePlayerRight() {
    clearOldPosition(pacmanCoords, 'pacman');
    pacmanCoords.column += 1;
    checkForFood(pacmanCoords) ? currentScore++ && allScore++ && eatingSound.play() : 'pass';
    setNewPosition(pacmanCoords, 'pacman');
    document.querySelector('.pacman').style.transform = '';
}

function movePlayerLeft() {
    clearOldPosition(pacmanCoords, 'pacman');
    pacmanCoords.column -= 1;
    checkForFood(pacmanCoords) ? currentScore++ && allScore++ && eatingSound.play() : 'pass';
    setNewPosition(pacmanCoords, 'pacman');
    document.querySelector('.pacman').style.transform = 'rotate(180deg)';
}

function moveGhost(ghostDetails) {
    let moves = ghostDetails.moves;
    let move = moves[ghostDetails.moveNumber];

    if (move == 'R') {
        clearOldPosition(
            ghostDetails,
            ghostDetails.name,
            checkForFood(ghostDetails)
        );
        ghostDetails.column += 1;
        setNewPosition(ghostDetails, ghostDetails.name);
    }
    if (move == 'L') {
        clearOldPosition(
            ghostDetails,
            ghostDetails.name,
            checkForFood(ghostDetails)
        );
        ghostDetails.column -= 1;
        setNewPosition(ghostDetails, ghostDetails.name);
    }
    if (move == 'U') {
        clearOldPosition(
            ghostDetails,
            ghostDetails.name,
            checkForFood(ghostDetails)
        );
        ghostDetails.row -= 1;
        setNewPosition(ghostDetails, ghostDetails.name);
    }
    if (move == 'D') {
        clearOldPosition(
            ghostDetails,
            ghostDetails.name,
            checkForFood(ghostDetails)
        );
        ghostDetails.row += 1;
        setNewPosition(ghostDetails, ghostDetails.name);
    }

    if (ghostDetails.moveNumber == moves.length) {
        ghostDetails.moveNumber = ghostDetails.loopNumber;
    } else {
        ghostDetails.moveNumber += 1;
    }
}

function startGhostsMovement(time) {
    redStart = setInterval(function () {
        moveGhost(redGhost);
    }, time);
    greenStart = setInterval(function () {
        moveGhost(greenGhost);
    }, time);
    pinkStart = setInterval(function () {
        moveGhost(pinkGhost);
    }, time);
    orangeStart = setInterval(function () {
        moveGhost(orangeGhost);
    }, time);
}

function removeIntervals() {
    clearInterval(redStart);
    clearInterval(greenStart);
    clearInterval(pinkStart);
    clearInterval(orangeStart);
}

function initGhosts() {
    // prettier-ignore
    redGhost = {
        row: 8,
        column: 10,
        moves: ['R','R','U','U','L','L','L','L','L','L','L','L','L','L','L','U','U','U','U',
            'U','R','R','R','R','R','R','R','D','D','D','D','D','D','D','D','D','D','D','D','D',
            'D','D','L','L','L','L','L','L','L','U','U','U','U','U','R','R','U','U','U','R','R',
            'R','D','D','D','R','R','D','R','R','R','R','R','R','R','R','U','U','U','U','U','U',
            'L','L','L','L',
        ],
        name: 'red-ghost',
        moveNumber: 0,
        loopNumber: 4,
    };
    // prettier-ignore
    greenGhost = {
        row: 8,
        column: 14,
        moves: ['L','R','L','R','L','L','U','U','R','R','R','R','U','U','U','U','U','L','L',
            'L','D','D','D','D','D','R','R','R','R','R','R','R','R','R','R','D','D','D','D','D',
            'L','L','L','L','L','U','U','U','R','R','R','D','D','D','D','D','L','L','L','L','L',
            'U','U','U','U','U','U','U','U','U','U','U','U','R','R','R','R','R','R','R','D','D',
            'D','D','D','L','L','L','L','L','L','L',
        ],
        name: 'green-ghost',
        moveNumber: 0,
        loopNumber: 12,
    };
    // prettier-ignore
    pinkGhost = {
        row: 10,
        column: 10,
        moves: ['R','L','R','L','R','L','R','R','U','U','U','U','L','U','U','U','U','U','L',
            'L','L','D','D','D','D','D','L','L','L','L','L','D','D','D','D','D','D','D','R',
            'R','R','R','R','D','D','R','R','R','R','U','U','U','L','L','L','L','D','D','D',
            'D','L','L','L','L','L','L','L','U','U','U','U','U','U','U','U','U','U','R','R',
            'R','R','R','R','R','R','R','R',],
        name: 'pink-ghost',
        moveNumber: 0,
        loopNumber: 13,
    };
    // prettier-ignore
    orangeGhost = {
        row: 10,
        column: 14,
        moves: ['L','R','L','R','L','R','L','R','L','R','L','L','U','U','U','U','R','R','R',
            'R','D','D','D','D','D','D','D','D','D','L','L','L','L','U','U','U','L','L','L','L',
            'D','D','D','R','R','R','R','U','U','U','R','R','R','R','U','R','R','R','R','R','R',
            'R','D','D','D','D','D','L','L','L','L','L','L','L','U','U','U','R','R','R','R','R',
            'U','U','U','U','U','U','U','L','L','L','L','L',],
        name: 'orange-ghost',
        moveNumber: 0,
        loopNumber: 20,
    };
}

function checkGhostCollision() {
    setInterval(function () {
        checkGameOver(redGhost);
        checkGameOver(greenGhost);
        checkGameOver(pinkGhost);
        checkGameOver(orangeGhost);
    }, 10);
}

function checkGameOver(ghostDetails) {
    if (
        ghostDetails.column == pacmanCoords.column &&
        ghostDetails.row == pacmanCoords.row
    ) {
        gameOver();
    }
}

function gameOver() {
    pacmanCoords.column = 0;
    setEndScreen();
    removeIntervals();
    addEventListener('click', initGame);
}

function checkWin() {
    if (currentScore == 178 && round == 7) {    // 178 points to win
        setWinGameScreen();
    }
    else if (currentScore == 178) {    // 40 zamienić na 178
        setWinScreen();
    }
}

function setupGame() {
    game.classList.remove('hidden');
    score.classList.remove('hidden');
    header.classList.remove('hidden');
    body.style.background = '';
    welcome.classList.add('hidden');

    // Starting Conditions
    currentScore = 0;
    score.textContent = 'Score:' + 0;

    //25x18
    // prettier-ignore
    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
        [1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1],
        [1, 3, 1, 4, 4, 4, 4, 1, 3, 1, 1, 3, 1, 3, 1, 1, 3, 1, 4, 4, 4, 4, 1, 3, 1],
        [1, 3, 1, 4, 4, 4, 4, 1, 3, 1, 1, 3, 1, 3, 1, 1, 3, 1, 4, 4, 4, 4, 1, 3, 1],
        [1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1],
        [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
        [1, 3, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 4, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 3, 1],
        [1, 3, 1, 3, 3, 3, 3, 1, 3, 1, 5, 4, 4, 4, 6, 1, 3, 1, 3, 3, 3, 3, 1, 3, 1],
        [1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 4, 4, 4, 4, 4, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1],
        [1, 3, 1, 3, 1, 1, 3, 1, 3, 1, 7, 4, 4, 4, 8, 1, 3, 1, 3, 1, 1, 3, 1, 3, 1],
        [1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1],
        [1, 3, 1, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 1, 3, 1],
        [1, 3, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 3, 1, 1, 1, 3, 3, 3, 3, 3, 3, 1, 3, 1],
        [1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1],
        [1, 3, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 3, 1],
        [1, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    pacmanCoords = {
        row: 1,
        column: 1,
    };

    initGhosts();
    drawMap();
    document.addEventListener('keydown', keyDown);
}

function setWinGameScreen() {
    welcome.classList.remove('hidden');
    welcome.innerHTML = `YOU WON GAME! <br><br><p>You scored ${allScore} points!
                 </p><br><p>CONGRATULATION!</p><br><br><p>Click to play again</p>`; // click to play again
    game.classList.add('hidden');
    score.classList.add('hidden');
    header.classList.add('hidden');
    body.style.background = '#000000';
    winSound.play();
    round ++
    addEventListener('click', initGame);
    removeIntervals()
}

function setWinScreen() {
    welcome.classList.remove('hidden');
    welcome.innerHTML = `YOU WON THE ROUND ${round}! <br><br><p>You scored all ${allScore} points!
                 </p><br><p>CONGRATULATION!</p><br><br><p>Click to play again</p>`; // click to play again
    game.classList.add('hidden');
    score.classList.add('hidden');
    header.classList.add('hidden');
    body.style.background = '#000000';
    winSound.play();
    round ++
    addEventListener('click', initGame);
    removeIntervals()
}

function setEndScreen() {
    welcome.classList.remove('hidden');
    welcome.innerHTML = `You lost! <p>Your score: ${allScore}<br>
                        Click to play again! </p>`;
    game.classList.add('hidden');
    score.classList.add('hidden');
    header.classList.add('hidden');
    body.style.background = '#000000';
    round = 1
    gameOverSound.play();
}

function setStartScreen() {
    game.classList.add('hidden');
    score.classList.add('hidden');
    header.classList.add('hidden');
    body.style.background = '#000000';
}

function setGhostSpeed() {
    switch (round) {
        case 1:
            return 700
        case 2:
            return 300
        case 3:
            return 450
        case 4:
            return 350
        case 5:
            return 290
        case 6:
            return 250
        case 7:
            return 220
    }
}

function initGame() {
    // Your game can start here, but define separate functions, don't write everything in here :)
    removeEventListener('click', initGame);
    setupGame();
    startGhostsMovement(setGhostSpeed());
    checkGhostCollision();
}

setStartScreen();
addEventListener('click', initGame);
