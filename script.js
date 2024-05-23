document.addEventListener("DOMContentLoaded", function() {
  let navToggle = document.querySelector('.nav-toggle');
  let bars = document.querySelectorAll('.bar');
  const menuItems = document.querySelector('.menu-items');

  function toggleHamburger(e) {
      bars.forEach(bar => bar.classList.toggle('x'));
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      menuItems.setAttribute("aria-expanded", !isExpanded);
      menuItems.style.display = menuItems.style.display === 'flex' ? 'none' : 'flex';
  }

  navToggle.addEventListener('click', toggleHamburger);

  const element = document.getElementById('typing-effect');
  let phrases = [
      { text: "Search Engine Optimization specialist", font: "'Courier New', Courier, monospace" },
      { text: "Digital polymath", font: "'Times New Roman', Times, serif" },
      { text: "Aspiring developer", font: "'Arial', sans-serif" },
      { text: "SEO Wizard 🧙‍♂️", font: "'Courier New', Courier, monospace" },
      { text: "Content publisher", font: "'Times New Roman', Times, serif" },
      { text: "Cross-department wrangler", font: "'Arial', sans-serif" },
      { text: "Lover of pasta", font: "'Arial', sans-serif" }
  ];

  let phraseIndex = 0;
  let letterIndex = 0;
  let currentPhrase = [];
  let isDeleting = false;
  let isEnd = false;
  const holdTime = 1250; // Time to hold before starting to delete

  function shuffleArray(array) {
      let currentIndex = array.length, randomIndex;
      while (currentIndex > 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
  }

  function type() {
      isEnd = false;
      element.innerHTML = currentPhrase.join('');
      element.style.fontFamily = phrases[phraseIndex].font;

      if (!isDeleting && letterIndex <= phrases[phraseIndex].text.length) {
          currentPhrase.push(phrases[phraseIndex].text[letterIndex]);
          letterIndex++;
          element.innerHTML = currentPhrase.join('');
      }

      if (isDeleting && letterIndex <= phrases[phraseIndex].text.length) {
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
          phraseIndex++;
          if (phraseIndex >= phrases.length) {
              phraseIndex = 0;
              shuffleArray(phrases);
          }
      }

      const spedUp = Math.random() * (80 - 50) + 50;
      const normalSpeed = Math.random() * (150 - 100) + 50; // Adjusted typing speed
      const time = isEnd ? holdTime : isDeleting ? spedUp : normalSpeed;
      setTimeout(type, time);
  }

  type();
});
