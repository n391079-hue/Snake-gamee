const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;

let snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
];

let direction = "RIGHT";

let apple = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

let score = 0;
let gameRunning = true;


// Keyboard controls
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {

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
}


// Draw battlefield
function drawBoard() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid blocks
    for (let x = 0; x < canvas.width; x += box) {

        for (let y = 0; y < canvas.height; y += box) {

            ctx.strokeStyle = "rgba(0,0,0,0.15)";
            ctx.strokeRect(x, y, box, box);

        }
    }

    // Draw snake
    snake.forEach((part, index) => {

        ctx.fillStyle = index === 0 ? "darkgreen" : "green";

        ctx.fillRect(
            part.x,
            part.y,
            box,
            box
        );

        ctx.strokeStyle = "black";
        ctx.strokeRect(
            part.x,
            part.y,
            box,
            box
        );
    });


    // Draw apple
    ctx.fillStyle = "red";

    ctx.beginPath();

    ctx.arc(
        apple.x + box / 2,
        apple.y + box / 2,
        box / 2 - 2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Move snake
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


    // Check wall collision
    if (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height
    ) {

        endGame();
        return;
    }


    // Check self collision
    for (let part of snake) {

        if (
            head.x === part.x &&
            head.y === part.y
        ) {

            endGame();
            return;
        }
    }


    // Add new head
    snake.unshift(head);


    // Apple eaten
    if (
        head.x === apple.x &&
        head.y === apple.y
    ) {

        score++;

        document.getElementById("score").textContent = score;

        createApple();

    } else {

        snake.pop();

    }
}


// Create new apple
function createApple() {

    apple.x =
        Math.floor(Math.random() * 20) * box;

    apple.y =
        Math.floor(Math.random() * 20) * box;


    // Make sure apple is not inside snake
    for (let part of snake) {

        if (
            apple.x === part.x &&
            apple.y === part.y
        ) {

            createApple();
            return;
        }
    }
}


// Game over
function endGame() {

    gameRunning = false;

    document.getElementById("gameOver").style.display = "block";
}


// Restart game
function restartGame() {

    snake = [
        { x: 200, y: 200 },
        { x: 180, y: 200 },
        { x: 160, y: 200 }
    ];

    direction = "RIGHT";

    score = 0;

    document.getElementById("score").textContent = score;

    document.getElementById("gameOver").style.display = "none";

    createApple();

    gameRunning = true;
}


// Game loop
setInterval(() => {

    if (gameRunning) {
        drawBoard();
    }

}, 200); 
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
