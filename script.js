const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const gridSize = 20;

let snake;
let direction;
let apple;
let score;
let level;
let gameRunning;

let snakeColor = "green";
let difficulty = "easy";

let highScore = localStorage.getItem("snakeHighScore") || 0;

document.getElementById("highScore").textContent = highScore;


// --------------------
// START GAME
// --------------------

function startGame() {

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "RIGHT";

    score = 0;
    level = 1;

    gameRunning = true;

    document.getElementById("score").textContent = score;
    document.getElementById("level").textContent = level;
    document.getElementById("gameOver").style.display = "none";

    createApple();

    gameLoop();
}


// --------------------
// DIFFICULTY
// --------------------

function changeDifficulty() {

    difficulty = document.getElementById("difficulty").value;

    restartGame();
}


// --------------------
// SNAKE COLOR
// --------------------

function changeSnakeColor() {

    snakeColor = document.getElementById("snakeColor").value;

    drawGame();
}


// --------------------
// MOBILE CONTROLS
// --------------------

function changeDirectionMobile(newDirection) {

    if (newDirection === "UP" && direction !== "DOWN") {
        direction = "UP";
    }

    if (newDirection === "DOWN" && direction !== "UP") {
        direction = "DOWN";
    }

    if (newDirection === "LEFT" && direction !== "RIGHT") {
        direction = "LEFT";
    }

    if (newDirection === "RIGHT" && direction !== "LEFT") {
        direction = "RIGHT";
    }
}


// --------------------
// KEYBOARD CONTROLS
// --------------------

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    }

    if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    }

    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    }

    if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }

});


// --------------------
// APPLE
// --------------------

function createApple() {

    apple = {
        x: Math.floor(Math.random() * gridSize) * box,
        y: Math.floor(Math.random() * gridSize) * box
    };

    // Apple should not appear inside snake
    for (let part of snake) {

        if (apple.x === part.x && apple.y === part.y) {

            createApple();
            return;

        }
    }
}


// --------------------
// MOVE SNAKE
// --------------------

function moveSnake() {

    let head = {
        x: snake[0].x,
        y: snake[0].y
    };


    if (direction === "UP") {
        head.y -= box;
    }

    if (direction === "DOWN") {
        head.y += box;
    }

    if (direction === "LEFT") {
        head.x -= box;
    }

    if (direction === "RIGHT") {
        head.x += box;
    }


    // Wall collision

    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {

        endGame();
        return;

    }


    // Self collision

    for (let part of snake) {

        if (
            head.x === part.x &&
            head.y === part.y
        ) {

            endGame();
            return;

        }

    }


    snake.unshift(head);


    // Apple eaten

    if (
        head.x === apple.x &&
        head.y === apple.y
    ) {

        score++;

        document.getElementById("score").textContent = score;


        // High Score

        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                "snakeHighScore",
                highScore
            );

            document.getElementById(
                "highScore"
            ).textContent = highScore;

        }


        // Level up every 5 apples

        let newLevel = Math.floor(score / 5) + 1;

        if (newLevel !== level) {

            level = newLevel;

            document.getElementById(
                "level"
            ).textContent = level;

        }


        createApple();

    } else {

        snake.pop();

    }

}


// --------------------
// DRAW GAME
// --------------------

function drawGame() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Battlefield

    ctx.fillStyle = "#3fa34d";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Grid

    ctx.strokeStyle = "rgba(0,0,0,0.12)";

    for (let x = 0; x <= canvas.width; x += box) {

        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        ctx.stroke();

    }

    for (let y = 0; y <= canvas.height; y += box) {

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);

        ctx.stroke();

    }


    // Snake

    snake.forEach((part, index) => {

        ctx.fillStyle =
            index === 0
                ? "darkgreen"
                : snakeColor;

        ctx.fillRect(
            part.x + 1,
            part.y + 1,
            box - 2,
            box - 2
        );


        // Snake eyes

        if (index === 0) {

            ctx.fillStyle = "white";

            ctx.beginPath();

            ctx.arc(
                part.x + 6,
                part.y + 6,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.beginPath();

            ctx.arc(
                part.x + 14,
                part.y + 6,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

    });


    // Apple

    ctx.fillStyle = "red";

    ctx.beginPath();

    ctx.arc(
        apple.x + box / 2,
        apple.y + box / 2,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Apple leaf

    ctx.fillStyle = "darkgreen";

    ctx.fillRect(
        apple.x + 11,
        apple.y + 2,
        5,
        5
    );

}


// --------------------
// GAME LOOP
// --------------------

let lastTime = 0;

function gameLoop(time) {

    if (!gameRunning) {
        return;
    }


    let speed;


    if (difficulty === "easy") {
        speed = 220;
    }

    if (difficulty === "medium") {
        speed = 160;
    }

    if (difficulty === "hard") {
        speed = 110;
    }


    // Higher levels = faster

    speed -= (level - 1) * 10;

    if (speed < 60) {
        speed = 60;
    }


    if (time - lastTime > speed) {

        lastTime = time;

        moveSnake();

        drawGame();

    }


    requestAnimationFrame(gameLoop);

}


// --------------------
// GAME OVER
// --------------------

function endGame() {

    gameRunning = false;

    document.getElementById(
        "gameOver"
    ).style.display = "block";

}


// --------------------
// RESTART
// --------------------

function restartGame() {

    startGame();

}


// START

startGame();
