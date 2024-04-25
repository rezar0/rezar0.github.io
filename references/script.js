// script.js
let testimonials = {};
let currentTestimonialIndex = 0;
let keys = [];
let autoChangeTimer = null;
let touchStartX = 0;
let touchEndX = 0;
let currentTestimonialHeight = 0;


function fetchTestimonials() {
    fetch('references.json')
        .then(response => response.json())
        .then(data => {
            testimonials = data;
            keys = Object.keys(testimonials);
            keys.forEach((key, index) => {
                createTestimonialElement(testimonials[key], index);
            });
            startAutoChange();
        })
        .catch(error => console.error('Error loading the testimonials:', error));
}

function createTestimonialElement(testimonial, index) {
    const wrapper = document.getElementById('testimonialsWrapper');
    const div = document.createElement('div');
    div.className = 'testimonial';
    div.innerHTML = `
        <p style="text-align: justify; line-height:1rem">${testimonial.text}</p>
        <div style="display:flex; text-align: left">
        <img src="/references/images/${testimonial.img}" alt="${testimonial.fullName}" style="width:100px; height:100px; border-radius:50%; padding-right: 15px;">
        <h4>${testimonial.fullName}<br/><a href="${testimonial.url}" target="_blank">${testimonial.title}</a><br/>${testimonial.company}</h4></div>
    `;
    wrapper.appendChild(div);
    changeTestimonialHeight(0);
}

function changeTestimonialHeight(n) {
    var allClasses = document.getElementsByClassName("testimonial");
    var elements = document.querySelectorAll('.testimonial');
    var currentItem = allClasses[n];
    var totalHeight = 50;
    for (let i = 0; i < currentItem.children.length; i++) {
        totalHeight += currentItem.children[i].clientHeight;
    }
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.height = totalHeight + 'px';
    }
}

function changeTestimonial(n) {
    currentTestimonialIndex = (currentTestimonialIndex + n + keys.length) % keys.length;
    const wrapper = document.getElementById('testimonialsWrapper');
    const offset = -currentTestimonialIndex * 100;  // 100% width per testimonial
    wrapper.style.transform = `translateX(${offset}%)`;
    changeTestimonialHeight(currentTestimonialIndex);
}

function startAutoChange() {
    if (autoChangeTimer !== null) {
        clearInterval(autoChangeTimer);
    }
    autoChangeTimer = setInterval(() => {
        changeTestimonial(1);
    }, 15000);
}

function userInteracted() {
    clearInterval(autoChangeTimer);

    setTimeout(() => {
        if (autoChangeTimer === null) {
            startAutoChange();
        }
    }, 5000);
}


function handleTouchStart(evt) {
    touchStartX = evt.touches[0].clientX;
}

function handleTouchMove(evt) {
    touchEndX = evt.touches[0].clientX;
}

function handleTouchEnd() {
    if (touchStartX - touchEndX > 50) {
        // Swipe left
        changeTestimonial(1);
        userInteracted();
    } else if (touchStartX - touchEndX < -50) {
        // Swipe right
        changeTestimonial(-1);
        userInteracted();
    }
}

document.addEventListener('DOMContentLoaded', fetchTestimonials);

// Adding event listeners to the navigation arrows to pause the auto-change on interaction
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.prev').addEventListener('click', () => {
        changeTestimonial(-1);
        userInteracted(); // Reset the timer if the user clicks a navigation button
    });
    document.querySelector('.next').addEventListener('click', () => {
        changeTestimonial(1);
        userInteracted(); // Reset the timer if the user clicks a navigation button
    });

    
    const testimonialsWrapper = document.getElementById('testimonialsWrapper');
    testimonialsWrapper.addEventListener('touchstart', handleTouchStart, false);
    testimonialsWrapper.addEventListener('touchmove', handleTouchMove, false);
    testimonialsWrapper.addEventListener('touchend', handleTouchEnd, false);
});


// PARAGRAPH ROTATION CODE
document.addEventListener('DOMContentLoaded', function() {
    fetch('list.json')
      .then(response => response.json())
      .then(data => initializeRotation(Object.values(data)))  // Extract the values from the JSON object
      .catch(error => console.error('Error loading the JSON', error));
  });
  
function initializeRotation (versions) {
const container = document.getElementById('text-container');

// Create paragraph elements for each version
versions.forEach((version, index) => {
    const div = document.createElement('div');
    div.textContent = version;
    div.classList.add('version');
    if (index === 0) div.classList.add('visible');  // Make the first version visible initially
    container.appendChild(div);
});

let currentVersionIndex = 0;
let versionElements = document.querySelectorAll(".version");

function rotateVersion() {
    let currentVersion = versionElements[currentVersionIndex];
    currentVersion.classList.remove('visible');

    currentVersionIndex = (currentVersionIndex + 1) % versionElements.length;
    let nextVersion = versionElements[currentVersionIndex];
    nextVersion.classList.add('visible');
}

setInterval(rotateVersion, 1000);
}

function initializeRotation(versions) {
    const container = document.getElementById('text-container');
    versions.forEach((version, index) => {
      const div = document.createElement('div');
      div.innerHTML = highlightQuotes(version);  // Process text to highlight quotes
      div.classList.add('version');
      if (index === 0) div.classList.add('visible');
      container.appendChild(div);
    });
  
    let currentVersionIndex = 0;
    let versionElements = document.querySelectorAll(".version");

  
    function rotateVersion() {
        let currentVersion = versionElements[currentVersionIndex];
        currentVersion.classList.remove('visible');
    
        currentVersionIndex = (currentVersionIndex + 1) % versionElements.length;
        let nextVersion = versionElements[currentVersionIndex];
        nextVersion.classList.add('visible');
    }
  
    setInterval(rotateVersion, 3000);
  }
  
  function highlightQuotes(text) {
    return text.replace(/'([^']*)'/g, "<span class='highlight'>$1</span>");
  }
  

// MAKES SWIPE IMAGE VANISH
document.getElementById('swipeImage').addEventListener('touchstart', function() {
    this.style.opacity = '0';
    setTimeout(() => { this.remove(); }, 500);
});
