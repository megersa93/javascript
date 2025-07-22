// Game state variables
        let secretNumber;
        let guessesLeft;
        const maxGuesses = 10;

        // DOM elements
        const guessInput = document.getElementById('guessInput');
        const checkButton = document.getElementById('checkButton');
        const messageElement = document.getElementById('message');
        const remainingCountElement = document.getElementById('remainingCount');
        const newGameButton = document.getElementById('newGameButton');

        // --- Game Initialization ---
        function initializeGame() {
            secretNumber = Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
            guessesLeft = maxGuesses;

            messageElement.textContent = 'Start guessing!';
            messageElement.style.color = 'var(--text-color)'; // Reset message color
            remainingCountElement.textContent = guessesLeft;
            guessInput.value = ''; // Clear input field
            guessInput.disabled = false; // Enable input
            checkButton.disabled = false; // Enable check button
            newGameButton.style.display = 'none'; // Hide new game button
            console.log('New game started. Secret number:', secretNumber); // For debugging
        }

        // --- Event Handlers ---

        // Handle guess submission
        checkButton.addEventListener('click', checkGuess);
        guessInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                checkGuess();
            }
        });

        // Handle "Play Again" button click
        newGameButton.addEventListener('click', initializeGame);

        // --- Game Logic ---
        function checkGuess() {
            const userGuess = parseInt(guessInput.value);

            // Input validation
            if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
                messageElement.textContent = 'Please enter a valid number between 1 and 100.';
                messageElement.style.color = 'var(--accent-color)';
                return; // Stop function execution
            }

            guessesLeft--;
            remainingCountElement.textContent = guessesLeft;

            if (userGuess === secretNumber) {
                messageElement.textContent = `Congratulations! You guessed the number ${secretNumber}!`;
                messageElement.style.color = 'var(--secondary-color)';
                endGame(true);
            } else if (guessesLeft === 0) {
                messageElement.textContent = `Game Over! The secret number was ${secretNumber}.`;
                messageElement.style.color = 'var(--accent-color)';
                endGame(false);
            } else if (userGuess < secretNumber) {
                messageElement.textContent = 'Too low! Try again.';
                messageElement.style.color = 'var(--primary-color)';
            } else { // userGuess > secretNumber
                messageElement.textContent = 'Too high! Try again.';
                messageElement.style.color = 'var(--primary-color)';
            }

            guessInput.value = ''; // Clear input after each guess
            guessInput.focus(); // Keep focus on input for quick re-entry
        }

        // Function to end the game (win or lose)
        function endGame(won) {
            guessInput.disabled = true;
            checkButton.disabled = true;
            newGameButton.style.display = 'block'; // Show new game button
        }

        // Initialize the game when the page loads
        document.addEventListener('DOMContentLoaded', initializeGame);