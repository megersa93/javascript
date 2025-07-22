const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Get score and game over elements
        const scoreDisplay = document.getElementById('score');
        const gameOverMessage = document.getElementById('gameOverMessage');
        const startButton = document.getElementById('startButton');

        // Game configuration
        const gridSize = 20; // Size of each square (snake segment, food)
        const canvasSize = canvas.width; // Canvas is square, width = height
        let tileCount = canvasSize / gridSize; // Number of tiles in a row/column

        // Game state variables
        let snake = [{ x: 10, y: 10 }]; // Initial snake position (array of segments)
        let food = {}; // Food position
        let dx = 0; // Direction x-coordinate (0 for no horizontal movement)
        let dy = 0; // Direction y-coordinate (0 for no vertical movement)
        let score = 0;
        let gameInterval; // Stores the interval ID for the game loop
        let gameSpeed = 150; // Initial game speed (milliseconds per frame)
        let isGameOver = false;
        let isGameRunning = false; // To prevent starting multiple games

        /**
         * Generates a random position for food within the canvas grid.
         * Ensures food does not spawn on the snake's body.
         */
        function generateFood() {
            let newFoodX, newFoodY;
            let collisionWithSnake;

            do {
                // Generate random coordinates within the grid
                newFoodX = Math.floor(Math.random() * tileCount);
                newFoodY = Math.floor(Math.random() * tileCount); 

                collisionWithSnake = false;
                // Check if the new food position collides with any part of the snake
                for (let i = 0; i < snake.length; i++) {
                    if (snake[i].x === newFoodX && snake[i].y === newFoodY) {
                        collisionWithSnake = true;
                        break;
                    }
                }
            } while (collisionWithSnake); // Keep generating until no collision

            food = { x: newFoodX, y: newFoodY };
        }

        /**
         * Draws a single square (for snake segments or food) on the canvas.
         * @param {number} x - X-coordinate of the square (in grid units).
         * @param {number} y - Y-coordinate of the square (in grid units).
         * @param {string} color - Color of the square.
         */
        function drawSquare(x, y, color) {
            ctx.fillStyle = color;
            // Draw the rectangle, adding a small offset and reducing size for a "pixel art" gap effect
            ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
        }

        /**
         * Draws the entire game state: background, food, and snake.
         */
        function drawGame() {
            // Clear the entire canvas for the new frame
            ctx.clearRect(0, 0, canvasSize, canvasSize);

            // Draw food
            drawSquare(food.x, food.y, '#e74c3c'); // Red color for food

            // Draw snake segments
            for (let i = 0; i < snake.length; i++) {
                // Head is green, body is a slightly darker green
                drawSquare(snake[i].x, snake[i].y, i === 0 ? '#2ecc71' : '#27ae60');
            }
        }

        /**
         * Updates the game state: moves snake, checks for collisions, handles food consumption.
         */
        function updateGame() {
            if (isGameOver) return; // Stop updating if game is over

            // Calculate the new head position based on current direction
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };

            // Add the new head to the beginning of the snake array
            snake.unshift(head);

            // Check for collision with food
            const didEatFood = head.x === food.x && head.y === food.y;

            if (didEatFood) {
                score += 10; // Increase score
                scoreDisplay.textContent = score; // Update score display
                generateFood(); // Generate new food
                // Increase speed slightly after eating food
                gameSpeed = Math.max(50, gameSpeed - 5); // Minimum speed of 50ms
                clearInterval(gameInterval); // Clear old interval
                gameInterval = setInterval(gameLoop, gameSpeed); // Set new faster interval
            } else {
                // If no food eaten, remove the tail segment to simulate movement
                snake.pop();
            }

            // Check for collisions (walls or self)
            if (checkCollision()) {
                endGame();
                return;
            }

            drawGame(); // Redraw the game after updating state
        }

        /**
         * Checks if the snake has collided with walls or itself.
         * @returns {boolean} True if a collision occurred, false otherwise.
         */
        function checkCollision() {
            const head = snake[0];

            // Check wall collision
            const hitLeftWall = head.x < 0;
            const hitRightWall = head.x >= tileCount;
            const hitTopWall = head.y < 0;
            const hitBottomWall = head.y >= tileCount;

            if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
                return true;
            }

            // Check self-collision (head hitting any part of the body)
            // Start from the 4th segment to avoid immediate collision with neck
            for (let i = 4; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    return true;
                }
            }

            return false;
        }

        /**
         * The main game loop, called repeatedly by setInterval.
         */
        function gameLoop() {
            updateGame();
        }

        /**
         * Handles keyboard input to change snake direction.
         * Prevents reversing direction immediately.
         * @param {KeyboardEvent} event - The keyboard event object.
         */
        function changeDirection(event) {
            const keyPressed = event.keyCode;

            // Key codes: Left: 37, Up: 38, Right: 39, Down: 40
            const goingUp = dy === -1;
            const goingDown = dy === 1;
            const goingLeft = dx === -1;
            const goingRight = dx === 1;

            if (keyPressed === 37 && !goingRight) { // Left arrow
                dx = -1;
                dy = 0;
            } else if (keyPressed === 38 && !goingDown) { // Up arrow
                dx = 0;
                dy = -1;
            } else if (keyPressed === 39 && !goingLeft) { // Right arrow
                dx = 1;
                dy = 0;
            } else if (keyPressed === 40 && !goingUp) { // Down arrow
                dx = 0;
                dy = 1;
            }
        }

        /**
         * Initializes or resets the game state.
         */
        function initializeGame() {
            snake = [{ x: 10, y: 10 }]; // Reset snake to initial position
            dx = 0; // Reset direction
            dy = 0;
            score = 0; // Reset score
            scoreDisplay.textContent = score; // Update score display
            gameSpeed = 150; // Reset game speed
            isGameOver = false;
            gameOverMessage.style.display = 'none'; // Hide game over message
            startButton.textContent = 'Restart Game'; // Change button text
            generateFood(); // Generate initial food
            drawGame(); // Draw initial game state
        }

        /**
         * Starts the game loop.
         */
        function startGame() {
            if (isGameRunning) {
                // If game is already running, clear existing interval to restart
                clearInterval(gameInterval);
            }
            initializeGame(); // Set up initial game state
            gameInterval = setInterval(gameLoop, gameSpeed); // Start the game loop
            isGameRunning = true;
        }

        /**
         * Ends the game, stops the loop, and displays game over message.
         */
        function endGame() {
            isGameOver = true;
            isGameRunning = false;
            clearInterval(gameInterval); // Stop the game loop
            gameOverMessage.style.display = 'block'; // Show game over message
            startButton.textContent = 'Play Again'; // Change button text
        }

        // Event listeners
        document.addEventListener('keydown', changeDirection);
        startButton.addEventListener('click', startGame);

        // Initial setup when the page loads
        window.onload = function() {
            initializeGame(); // Prepare the game board
            // The game will start when the user clicks the "Start Game" button
        };