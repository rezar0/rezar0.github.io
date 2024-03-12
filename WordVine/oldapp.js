document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submitWord');
    const wordInput = document.getElementById('wordInput');
    const vineContainer = document.getElementById('vineContainer');
    const scoreDisplay = document.getElementById('score').querySelector('span');
    const usedWordsDisplay = document.getElementById('usedWords');

    let score = 0;
    let usedWordsList = [];
    let lastWord = '';
    let direction = 'horizontal'; // Alternates between 'horizontal' and 'vertical'
    let lastWordEnd = { x: 50, y: 50 }; // Starting position for the first word
    let cache = {}; // Cache for storing loaded word lists

    const approximateLetterWidth = 10; // Adjust based on your font and styling
    const approximateLetterHeight = 20; // Adjust based on your font and styling

    submitButton.addEventListener('click', async () => {
        const newWord = wordInput.value.trim().toLowerCase();
        if (newWord && !usedWordsList.includes(newWord)) {
            const isValid = await handleWordValidation(newWord);
            if (isValid) {
                addWordToVine(newWord);
                updateGameStatus(newWord);
            } else {
                alert('Invalid word!');
            }
        } else {
            alert('Word already used or empty input!');
        }
    });

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

    async function handleWordValidation(newWord) {
        const firstLetter = newWord[0];
        const wordList = await loadWordList(firstLetter);
        return wordList && wordList.includes(newWord);
    }

    function addWordToVine(newWord) {
        const sharedLetter = lastWord ? lastWord.split('').find(letter => newWord.includes(letter)) : null;
        const newWordElement = document.createElement('div');
        newWordElement.textContent = newWord;
        newWordElement.style.position = 'absolute';

        if (direction === 'horizontal') {
            newWordElement.style.left = `${lastWordEnd.x}px`;
            newWordElement.style.top = `${lastWordEnd.y}px`;
            lastWordEnd.x += newWord.length * approximateLetterWidth; // Move right for the next word
            direction = 'vertical'; // Change direction for the next word
        } else {
            if (sharedLetter) {
                const sharedIndexNewWord = newWord.indexOf(sharedLetter);
                newWordElement.style.left = `${lastWordEnd.x}px`;
                newWordElement.style.top = `${lastWordEnd.y - sharedIndexNewWord * approximateLetterHeight}px`;
                lastWordEnd.y += approximateLetterHeight; // Move down for the next word
            }
            direction = 'horizontal'; // Change direction for the next word
        }

        vineContainer.appendChild(newWordElement);
        lastWord = newWord; // Update lastWord for the next iteration
    }

    function updateGameStatus(newWord) {
        usedWordsList.push(newWord);
        usedWordsDisplay.textContent = usedWordsList.join(', ');
        score += newWord.length;
        scoreDisplay.textContent = score;
        wordInput.value = ''; // Clear input field
    }
});