document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitWord');
    const wordInput = document.getElementById('wordInput');
    const vineContainer = document.getElementById('vineContainer');
    const scoreDisplay = document.getElementById('score').querySelector('span');
    const usedWordsDisplay = document.getElementById('usedWords');

    let timerStarted = false; // To check if the timer has started
    let timer; // To store the timer

    let score = 0;
    let usedWordsList = [];
    let gridSize = 20; // Initial grid size
    let grid = createGrid(gridSize);
    let lastWordInfo = null;
    let cache = {}; // Cache for storing loaded word lists


    function createGrid(size) {
        return Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
    }


    // Function to start a 60-second timer
    function startTimer() {
        let timeRemaining = 60; // 60 seconds

        // Update the UI to show the timer, replace 'timerDisplay' with your actual timer element's ID
        const timerDisplay = document.getElementById('timerDisplay');
        timerDisplay.textContent = `Time Remaining: ${timeRemaining}s`;

        timer = setInterval(() => {
            timeRemaining--;
            timerDisplay.textContent = `Time Remaining: ${timeRemaining}s`;

            if (timeRemaining <= 0) {
                clearInterval(timer);
                // Disable word submission, show a message, etc.
                submitButton.disabled = true; // Disable the submit button
                alert('Time is up!'); // Notify the user
            }
        }, 1000); // Update every second
    }


    function updateDisplayGrid() {
        vineContainer.innerHTML = '';
        vineContainer.style.display = 'grid';
        vineContainer.style.gridTemplateColumns = `repeat(${gridSize}, 20px)`;
        vineContainer.style.gridAutoRows = '20px';

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.id = `cell-${row}-${col}`;
                cell.textContent = grid[row][col];
                vineContainer.appendChild(cell);
            }
        }
    }

    function expandGrid() {
        const oldSize = gridSize;
        gridSize += 6; // Increase grid size by adding 10 rows and columns to the bottom and right
    
        // Create a new grid with the increased size
        const newGrid = createGrid(gridSize);
    
        // Copy the contents of the old grid into the new grid starting from the top-left corner (0,0)
        for (let row = 0; row < oldSize; row++) {
            for (let col = 0; col < oldSize; col++) {
                newGrid[row][col] = grid[row][col];
            }
        }
    
        grid = newGrid; // Update the reference to the new grid
        updateDisplayGrid(); // Reflect the changes in the DOM

        // Automatically scroll to the bottom right of the gridWrapper
        const gridWrapper = document.getElementById('gridWrapper');
        gridWrapper.scrollTop = gridWrapper.scrollHeight; // Scroll to the bottom
        gridWrapper.scrollLeft = gridWrapper.scrollWidth; // Scroll to the right
    }
    

    function checkAndExpandGrid(position) {
        const { row, col, direction, length } = position;
        let edgeRow, edgeCol;
    
        if (direction === 'horizontal') {
            edgeRow = row;
            edgeCol = col + length; // Calculate the ending column of the word
        } else { // 'vertical'
            edgeRow = row + length; // Calculate the ending row of the word
            edgeCol = col;
        }
    
        // Check if the word is close to any edge of the grid
        const expansionThreshold = 2; // Define how close to the edge a word must be to trigger expansion
        if (edgeRow >= gridSize - expansionThreshold || edgeCol >= gridSize - expansionThreshold ||
            row <= expansionThreshold || col <= expansionThreshold) {
            expandGrid();
            return true; // Grid was expanded
        }
    
        return false; // No expansion needed
    }
    

    function addWordToGrid(word, position) {
        const { row, col, direction } = position;
        if (direction === 'horizontal') {
            for (let i = 0; i < word.length; i++) {
                grid[row][col + i] = word[i];
                document.getElementById(`cell-${row}-${col + i}`).textContent = word[i];
            }
        } else { // 'vertical'
            for (let i = 0; i < word.length; i++) {
                grid[row + i][col] = word[i];
                document.getElementById(`cell-${row + i}-${col}`).textContent = word[i];
            }
        }
        
        lastWordInfo = { row, col, direction, length: word.length };
    }

    function findPositionForWord(word) {
        if (!lastWordInfo) {
            // Place the first word in the middle of the grid
            return { row: 3, col: 3, direction: 'horizontal' };
        }

        // Check around the last word for a suitable position
        const { row, col, direction, length } = lastWordInfo;
        if (direction === 'horizontal') {
            for (let i = 1; i < lastWordInfo.length + 1; i++) {
                if (word[0] === grid[row][col + i]) {
                    // For a horizontal last word, the new vertical word starts from the same column
                    const position = { row: row, col: col + i, direction: 'vertical', length };
                    checkAndExpandGrid(position)
                    if (!checkAndExpandGrid(position)) {
                        return position;
                    }
                }
            }
        } else { // 'vertical'
            for (let i = 1; i < lastWordInfo.length + 1; i++) {
                if (word[0] === grid[row + i][col]) {
                    // For a vertical last word, the new horizontal word starts from the same row
                    const position = { row: row + i, col: col, direction: 'horizontal', length };
                    checkAndExpandGrid(position)
                    if (!checkAndExpandGrid(position)) {
                        return position;
                    }
                }
            }
        }
    
        return null; // No suitable position found
    } 

    // Listen for the Enter key in the word input field
wordInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action to avoid submitting the form if it's part of one
        submitWord(); // Call the function that handles the word submission
    }
});

// Refactor the submission logic into a separate function
async function submitWord() {

    if (!timerStarted) {
        startTimer(); // Start the timer on the first word submission
        timerStarted = true; // Set the flag so the timer won't start again
    }

    const newWord = wordInput.value.trim().toLowerCase();
    if (newWord && !usedWordsList.includes(newWord)) {
        const isValid = await handleWordValidation(newWord);
        if (isValid) {
            const position = findPositionForWord(newWord);
            if (position) {
                addWordToGrid(newWord, position);
                usedWordsList.push(newWord);
                usedWordsDisplay.textContent = usedWordsList.join(', ');

                score += computeWordScore(newWord);
                scoreDisplay.textContent = score;
                console.log(score)
                console.log('cleared')
                wordInput.value = ''; // Clear input field
                document.getElementById('vineContainer').scroll({
                    top: 10000,
                    left: 10000,
                    behavior: "smooth",
                  });
                console.log("scrolled")
            } else {
                alert('No valid position for this word!');
            }
        } else {
            alert('Invalid word!');
        }
    } else {
        alert('Word already used or empty input!');
    }
}

function computeWordScore(word) {
    // Define the point value for each letter
    const letterScores = {
        A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, T: 1, R: 1,
        D: 2, G: 2,
        B: 3, C: 3, M: 3, P: 3,
        F: 4, H: 4, V: 4, W: 4, Y: 4,
        K: 5,
        J: 8, X: 8,
        Q: 10, Z: 10
    };

    // Initialize the score
    let score = 0;

    // Convert the word to uppercase to match the letterScores keys
    word = word.toUpperCase();

    // Iterate through each letter in the word
    for (let letter of word) {
        // Add the letter's score to the total score, defaulting to 0 if the letter isn't found
        score += letterScores[letter] || 0;
    }

    // Return the total score for the word
    return score;
}


// Update the original click event listener to use the new submitWord function
submitButton.addEventListener('click', async () => {
    submitWord(); // Use the new function for handling submissions
});

async function handleWordValidation(newWord) {
    const firstLetter = newWord[0];
    const wordList = await loadWordList(firstLetter);
    return wordList && wordList.includes(newWord);
}

async function loadWordList(letter) {
    if (cache[letter]) {
        return cache[letter]; // Return from cache if available
    }

    const fileName = `${letter}_group.json`;
    const filePath = `words/${fileName}`;
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const wordList = await response.json();
        cache[letter] = wordList; // Cache the loaded list
        return wordList;
    } catch (error) {
        console.error(`Failed to load word list for ${letter}:`, error);
        return null;
    }
}

    updateDisplayGrid(); // Initialize the grid on page load
});