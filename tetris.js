const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

const reservedCanvas = document.querySelector('#reserved');
const reservedCtx = reservedCanvas.getContext('2d');
const reservedScale = 20;

let isRunning = false;

// Define audio files
let rotateSound = new Audio('audio/rotate.mp3');
let moveSound = new Audio('audio/move.mp3');
let rowCompleteSound = new Audio('audio/rowComplete.mp3');
let bgMusic = new Audio('audio/bgMusic.mp3');
bgMusic.volume = 0.2;  // 50% volume

function playSound(audio) {
    let sound = audio.cloneNode();
    sound.play();
}

let score = 0;

// Properly defined tetrominoes
const tetrominoes = [
    [0, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0,
        0, 0, 1, 0], // The I Tetromino
    [0, 1, 0, 0,
        0, 1, 0, 0,
        1, 1, 0, 0,
        0, 0, 0, 0], // The J Tetromino
    [1, 1, 0, 0,
        1, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0], // The 2x2 Tetromino
    [1, 0, 0, 0,
        1, 0, 0, 0,
        1, 1, 0, 0,
        0, 0, 0, 0], // The L Tetromino
    [1, 1, 1, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0], // The T Tetromino
    [0, 1, 1, 0,
        1, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0], // The Z Tetromino
    // Add other tetrominoes in similar 4x4 grid
];

const colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple'];


class Tetromino {
    constructor() {
        this.x = columns / 2 - 2;
        this.y = -2;
        this.shapeIndex = Math.floor(Math.random() * tetrominoes.length);
        this.shape = tetrominoes[this.shapeIndex];
        this.color = colors[this.shapeIndex];
    }

    draw() {
        ctx.fillStyle = this.color;
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (this.shape[y * 4 + x]) {
                    ctx.fillRect((this.x + x) * scale, (this.y + y) * scale, scale - 1, scale - 1);
                }
            }
        }
    }

    moveDown() {
        this.y++;
        if (this.hasCollision()) {
            this.y--;
            this.lock();
            // Create a new tetromino when the current one has stopped moving
            tetromino = new Tetromino();
        }
    }


    moveRight() {
        this.x++;
        if (this.hasCollision()) {
            this.x--;
        } else {
            playSound(moveSound);
        }
    }

    moveLeft() {
        this.x--;
        if (this.hasCollision()) {
            this.x++;
        } else {
            playSound(moveSound);
        }
    }

    rotate() {
        let originalShape = this.shape;
        let rotatedShape = [];
        for (let y = 0; y < 4; ++y) {
            for (let x = 0; x < 4; ++x) {
                rotatedShape[y * 4 + x] = originalShape[12 + y - x * 4];
            }
        }
        this.shape = rotatedShape;
        if (this.hasCollision()) {
            this.shape = originalShape;  // Revert back to the original shape if collision is detected
        } else {
            playSound(rotateSound);
        }
    }


    hasCollision() {
        let result = false;
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (this.shape[y * 4 + x]) {
                    let newX = this.x + x;
                    let newY = this.y + y;
                    if (newX < 0 || newX >= columns || newY >= rows) {
                        result = true;
                    }
                    if (newY < 0) {
                        continue;
                    }
                    if (playfield[newY] === undefined || playfield[newY][newX] !== undefined) {
                        result = true;
                    }
                }
            }
        }
        return result;
    }


    lock() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (this.shape[y * 4 + x]) {
                    if (this.y + y < 0) {
                        alert("Game Over");
                        cancelAnimationFrame(requestId);
                        break;
                    }
                    if (playfield[this.y + y]) {
                        playfield[this.y + y][this.x + x] = this.color;
                    } else {
                        console.error('Unable to access playfield at index:', this.y + y);
                    }

                }
            }
        }

        let rowCount = 0;
        for (let y = rows - 1; y >= 0; y--) {
            let rowFilled = true;
            for (let x = 0; x < columns; x++) {
                if (playfield[y][x] === undefined) {
                    rowFilled = false;
                    break;
                }
            }
            if (rowFilled) {
                rowCount++;
                // Here is the point where a row is filled and removed.
                // Play the row complete sound.
                playSound(rowCompleteSound);
                for (let y2 = y; y2 > 0; y2--) {
                    for (let x = 0; x < columns; x++) {
                        playfield[y2][x] = playfield[y2 - 1][x];
                    }
                }
                y++;
            }
        }

        if (rowCount > 0) {
            score += rowCount * rowCount;
            updateScore();
        }
    }

}

function gameOver() {
    for (let x = 0; x < columns; x++) {
        if (playfield[0][x] !== undefined) {
            return true;
        }
    }
    return false;
}

let playfield = [];

for (let y = 0; y < rows; y++) {
    playfield[y] = [];
    for (let x = 0; x < columns; x++) {
        playfield[y][x] = undefined;
    }
}

document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 37: //left arrow
            tetromino.moveLeft();
            break;
        case 39: //right arrow
            tetromino.moveRight();
            break;
        case 40: //down arrow
            tetromino.moveDown();
            break;
        case 38: //up arrow
            tetromino.rotate();
            break;
        case 32: //spacebar
            swapTetromino();
            break;
    }
});

function updatePlayfield() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            if (playfield[y][x] !== undefined) {
                ctx.fillStyle = playfield[y][x];
                ctx.fillRect(x * scale, y * scale, scale - 1, scale - 1);
            }
        }
    }
}

function updateScore() {
    document.querySelector('#score').innerText = score;
}

function swapTetromino() {
    if (reservedTetromino === null) {
        reservedTetromino = tetromino;
        tetromino = new Tetromino();
    } else {
        let temp = tetromino;
        tetromino = reservedTetromino;
        reservedTetromino = temp;
    }
    tetromino.x = columns / 2 - 2;
    tetromino.y = -2;
    drawReservedTetromino();
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;
let requestId;
function animate(now = 0) {
    const deltaTime = now - lastTime;
    lastTime = now;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        tetromino.moveDown();
        dropCounter = 0;
    }
    updatePlayfield();
    tetromino.draw();
    drawReservedTetromino();

    if (gameOver()) {
        cancelAnimationFrame(requestId);
        alert("Game Over");
    } else {
        requestId = requestAnimationFrame(animate);
    }
}


let tetromino = new Tetromino();
let reservedTetromino = null;


function drawReservedTetromino() {
    reservedCtx.clearRect(0, 0, reservedCanvas.width, reservedCanvas.height);
    if (reservedTetromino !== null) {
        reservedCtx.fillStyle = reservedTetromino.color;
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (reservedTetromino.shape[y * 4 + x]) {
                    reservedCtx.fillRect(x * reservedScale, y * reservedScale, reservedScale - 1, reservedScale - 1);
                }
            }
        }
    }
}

// Event listeners for control buttons
document.getElementById('left-button').addEventListener('click', function () {
    tetromino.moveLeft();
    moveSound.play();
});
document.getElementById('right-button').addEventListener('click', function () {
    tetromino.moveRight();
    moveSound.play();
});
document.getElementById('down-button').addEventListener('click', function () {
    tetromino.moveDown();
});
document.getElementById('rotate-button').addEventListener('click', function () {
    tetromino.rotate();
    rotateSound.play();
});
document.getElementById('swap-button').addEventListener('click', function () {
    swapTetromino();
});

document.getElementById('start-button').addEventListener('click', function () {
    if (!isRunning) {  // Check if the game is already running
        animate();
        bgMusic.play();
        isRunning = true;
    }
});

document.getElementById('pause-button').addEventListener('click', function () {
    cancelAnimationFrame(requestId);
});

document.getElementById('restart-button').addEventListener('click', function () {
    location.reload();
});