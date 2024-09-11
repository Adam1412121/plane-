const gameContainer = document.querySelector('.game-container');
const plane = document.querySelector('.plane');
const obstacle = document.querySelector('.obstacle');

let gameWidth = gameContainer.clientWidth;
let planePosition = gameWidth / 2 - 25; // Center the plane horizontally
let obstacleInterval;
let isAlive = true;

// Move plane left and right
document.addEventListener('keydown', (e) => {
    if (isAlive) {
        if (e.key === "ArrowLeft" && planePosition > 0) {
            planePosition -= 15; // Move left
        } else if (e.key === "ArrowRight" && planePosition < gameWidth - 50) {
            planePosition += 15; // Move right
        }
        plane.style.left = planePosition + 'px';
    }
});

// Touch events for mobile
let touchStartX = 0;

window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

window.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const diffX = touchX - touchStartX;
    if (isAlive) {
        if (diffX < -30 && planePosition > 0) {
            planePosition -= 15; // Move left
            touchStartX = touchX; // Reset the touch position
        } else if (diffX > 30 && planePosition < gameWidth - 50) {
            planePosition += 15; // Move right
            touchStartX = touchX; // Reset the touch position
        }
        plane.style.left = planePosition + 'px';
    }
});

// Generate obstacles
function startGame() {
    obstacleInterval = setInterval(() => {
        if (isAlive) {
            obstacle.style.left = Math.random() * (gameWidth - 30) + 'px';
            obstacle.style.top = '0px';
            moveObstacle();
        }
    }, 2000);
}

// Move obstacles
function moveObstacle() {
    const obstacleFall = setInterval(() => {
        if (isAlive) {
            const obstacleTop = parseInt(obstacle.style.top);
            if (obstacleTop < gameContainer.clientHeight) {
                obstacle.style.top = (obstacleTop + 5) + 'px';
            } else {
                clearInterval(obstacleFall);
            }

            // Check for collision
            if (collisionDetected()) {
                clearInterval(obstacleFall);
                endGame();
            }
        } else {
            clearInterval(obstacleFall);
        }
    }, 30);
}

function collisionDetected() {
    const planeRect = plane.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    
    return !(
        planeRect.top > obstacleRect.bottom ||
        planeRect.bottom < obstacleRect.top ||
        planeRect.right < obstacleRect.left ||
        planeRect.left > obstacleRect.right
    );
}

function endGame() {
    isAlive = false;
    clearInterval(obstacleInterval);
    alert('Game Over! Refresh to play again.');
}

startGame();