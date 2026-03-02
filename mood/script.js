const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const realCardsCount = 9;
let currentIndex = 1; // Start at first real card after prepended clone

const cardData = [
  { title: "Sad", description: "blue, depressed, down, unhappy", color: "blue" },
  { title: "Anxious", description: "worried, panicky, nervous, frightened", color: "yellow" },
  { title: "Guilty", description: "remorseful, bad, ashamed", color: "white" },
  { title: "Inferior", description: "worthless, inadequate, defective, incompetent", color: "green" },
  { title: "Lonely", description: "unloved, unwanted, rejected, alone, abandoned", color: "black" },
  { title: "Embarrassed", description: "foolish, humiliated, self-conscious", color: "pink" },
  { title: "Hopeless", description: "discouraged, pessimistic, despairing", color: "purple" },
  { title: "Frustrated", description: "stuck, thwarted, defeated", color: "orange" },
  { title: "Angry", description: "mad, resentful, annoyed, irritated, upset, furious", color: "red" }
];

// Create cards
cardData.forEach(({ title, description, color }) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.backgroundColor = color;

  const titleEl = document.createElement("h2");
  titleEl.className = "card-title";
  titleEl.textContent = title;

  const descEl = document.createElement("p");
  descEl.className = "card-description";
  descEl.textContent = description;

  const number = document.createElement("div");
  number.className = "card-number";
  number.textContent = "0";

  card.appendChild(titleEl);
  card.appendChild(descEl);
  card.appendChild(number);
  carousel.appendChild(card);
});

// Clone last card and prepend
const cards = carousel.children;
const lastClone = cards[realCardsCount - 1].cloneNode(true);
carousel.insertBefore(lastClone, cards[0]);

// Clone first card and append
const firstClone = cards[1].cloneNode(true);
carousel.appendChild(firstClone);

const totalCards = carousel.children.length; // 11 cards now

// Get card width + margin-right dynamically
const cardStyle = getComputedStyle(cards[0]);
const cardWidth = cards[0].offsetWidth + parseInt(cardStyle.marginRight);
const wrapper = document.querySelector(".carousel-wrapper");
const wrapperStyle = getComputedStyle(wrapper);
const paddingLeft = parseInt(wrapperStyle.paddingLeft);

function updatePosition(animate = true) {
  if (animate) {
    carousel.style.transition = "transform 0.4s ease";
  } else {
    carousel.style.transition = "none";
  }
  carousel.style.transform = `translateX(${-cardWidth * currentIndex + paddingLeft}px)`;
}

// Initialize position to first real card
updatePosition(false);

function next() {
  if (currentIndex >= totalCards - 1) return;
  currentIndex++;
  updatePosition(true);
}

function prev() {
  if (currentIndex <= 0) return;
  currentIndex--;
  updatePosition(true);
}

carousel.addEventListener("transitionend", () => {
  if (currentIndex === 0) {
    currentIndex = realCardsCount;
    updatePosition(false);
  } else if (currentIndex === totalCards - 1) {
    currentIndex = 1;
    updatePosition(false);
  }
});

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

/* ----- SWIPE SUPPORT ----- */
let startX = 0;
let isDragging = false;

carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
  carousel.style.transition = "none";
});

carousel.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const currentX = e.touches[0].clientX;
  const deltaX = currentX - startX;
  carousel.style.transform = `translateX(${ -cardWidth * currentIndex + deltaX }px)`;
});

carousel.addEventListener("touchend", (e) => {
  if (!isDragging) return;
  isDragging = false;

  const endX = e.changedTouches[0].clientX;
  const deltaX = endX - startX;
  const swipeThreshold = cardWidth / 4;

  if (deltaX > swipeThreshold) {
    prev();
  } else if (deltaX < -swipeThreshold) {
    next();
  } else {
    updatePosition(true);
  }
});

/* ----- TAP TO INCREMENT/DECREMENT NUMBER ----- */
const allCards = document.querySelectorAll(".card");

allCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    const rect = card.getBoundingClientRect();
    const numberEl = card.querySelector(".card-number");
    let value = parseInt(numberEl.textContent);

    if (e.clientX - rect.left < rect.width / 2) {
      // Left half = decrement
      if (value > 0) value--;
    } else {
      // Right half = increment
      if (value < 10) value++;
    }

    numberEl.textContent = value;
  });
});
