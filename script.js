const element = document.getElementById('typing-effect');
const phrases = [
  { text: "Search Engine Optimization Specialist", font: "'Courier New', Courier, monospace" },
  { text: "Digital polymath", font: "'Times New Roman', Times, serif" },
  { text: "Aspiring developer", font: "'Arial', sans-serif" },
  { text: "SEO Wizard", font: "'Courier New', Courier, monospace" },
  { text: "Digital content publisher", font: "'Times New Roman', Times, serif" },
  { text: "Cross-department wrangler", font: "'Arial', sans-serif" },
  { text: "Lover of pasta", font: "'Arial', sans-serif" }
];

let phraseIndex = 0;
let letterIndex = 0;
let currentPhrase = [];
let isDeleting = false;
let isEnd = false;
const holdTime = 3000; // Time to hold before starting to delete

function type() {
  isEnd = false;
  element.innerHTML = currentPhrase.join('');
  element.style.fontFamily = phrases[phraseIndex].font;

  if (!isDeleting && letterIndex <= phrases[phraseIndex].text.length) {
    currentPhrase.push(phrases[phraseIndex].text[letterIndex]);
    letterIndex++;
    element.innerHTML = currentPhrase.join('');
  }

  if(isDeleting && letterIndex <= phrases[phraseIndex].text.length) {
    currentPhrase.pop(phrases[phraseIndex].text[letterIndex]);
    letterIndex--;
  }

  if (letterIndex == phrases[phraseIndex].text.length) {
    isEnd = true;
    isDeleting = true;
  }

  if (isDeleting && letterIndex === 0) {
    currentPhrase = [];
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  const spedUp = Math.random() * (80 - 50) + 50;
  const normalSpeed = Math.random() * (150 - 100) + 100; // Increased typing speed
  const time = isEnd ? holdTime : isDeleting ? spedUp : normalSpeed;
  setTimeout(type, time);
}

type();
