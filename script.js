const element = document.getElementById('typing-effect');
const phrases = ["Hello, world!", "Welcome to our site!", "Enjoy your stay!"];

let phraseIndex = 0;
let letterIndex = 0;
let currentPhrase = [];
let isDeleting = false;
let isEnd = false;

function type() {
  isEnd = false;
  element.innerHTML = currentPhrase.join('');

  if (!isDeleting && letterIndex <= phrases[phraseIndex].length) {
    currentPhrase.push(phrases[phraseIndex][letterIndex]);
    letterIndex++;
    element.innerHTML = currentPhrase.join('');
  }

  if(isDeleting && letterIndex <= phrases[phraseIndex].length) {
    currentPhrase.pop(phrases[phraseIndex][letterIndex]);
    letterIndex--;
  }

  if (letterIndex == phrases[phraseIndex].length) {
    isEnd = true;
    isDeleting = true;
  }

  if (isDeleting && letterIndex === 0) {
    currentPhrase = [];
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  const spedUp = Math.random() * (80 - 50) + 50;
  const normalSpeed = Math.random() * (300 - 200) + 200;
  const time = isEnd ? 2000 : isDeleting ? spedUp : normalSpeed;
  setTimeout(type, time);
}

type();
