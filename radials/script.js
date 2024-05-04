// script.js


var spellData = {};
var actions = {};

function fetchJson(jsonData, jsonReference) {
    fetch(jsonReference)
        .then(response => response.json())
        .then(data => {
            Object.assign(jsonData, data);  // Copies all properties from data to jsonData
        })
        .catch(error => console.error('Error loading the testimonials:', error));
};

fetchJson(spellData, 'spellData.json');
fetchJson(actions, 'spellData.json');



document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.radial-menu');
    const toggleButton = document.querySelector('.menu-toggle');
    const detailsContainer = document.querySelector('.action-details');
    const detailsTitle = detailsContainer.querySelector('h2');
    const detailsText = detailsContainer.querySelector('p');
    const cover = document.createElement('div');
    cover.className = 'cover';
    document.body.appendChild(cover);
    const screenWidth = window.screen.width;
    const radius = Math.min(screenWidth / 2.7, 230); // Radius of the circle
    const itemCount = Object.keys(actions).length;
    let isMenuVisible = false;
    let lastTouchEndTime = 0; // To store the timestamp of the last touch event

    function toggleMenu(event) {
        if (shouldIgnoreMouse(event)) return; // Ignore mouse events that follow touch events too closely
        event.preventDefault();
        menu.classList.toggle('expanded');
        isMenuVisible = menu.classList.contains('expanded');
        if (isMenuVisible) {
            populateMenu();
        } else {
            resetMenu();
        }
    }

    let currentPage = 0;
    const itemsPerPage = 9;
    
    function populateMenu() {
        menu.innerHTML = ''; // Clear any existing items
    
        // Calculate starting index of the items based on currentPage
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = Object.entries(actions).slice(start, end).map(entry => entry[1]);
    
        paginatedItems.forEach((action, index) => {
            const angle = (360 / itemsPerPage) * index - 90; // Adjust angle for fewer items
            const radians = (angle * Math.PI) / 180;
            const x = Math.cos(radians) * radius - 20;
            const y = Math.sin(radians) * radius - 20;
    
            const item = document.createElement('div');
            item.id = `radialId${start + index}`; // Adjust ID to be unique across pages
            item.textContent = action.Name;
            item.style.backgroundColor = '#4CAF50';
            item.style.transform = `translate(${x}px, ${y}px) scale(2.2)`;
    
            // Calculate font size based on text length, setting it in pixels
            const textLength = item.textContent.length;
            console.log(textLength)
            const baseSize = 14; // Base size in pixels
            const reductionFactor = 0.6; // Reduction factor per character
            const minSize = 7; // Minimum font size in pixels
            let fontSize = Math.max(minSize, baseSize - reductionFactor * textLength);
            item.style.fontSize = `${fontSize}px`;
            item.style.textAlign = `center`;
            item.style.overflowWrap = `anywhere`;
            item.style.padding = `1px`;
            item.className = `highlight-on-hover`;
            item.addEventListener('mouseup', (e) => handleSelect(e, action)); // Pass the action object to the handler
            item.addEventListener('touchend', (e) => handleSelect(e, action));
            item.addEventListener('touchmove', handleMove);
            item.addEventListener('mousemove', handleMove);
    
            menu.appendChild(item);
        });
    
        updateNavigationControls();
    }
    
    
    
    function updateNavigationControls() {
        // Check if navigation controls exist, if not, create them
        let navControls = document.querySelector('.navigation-controls');
        if (!navControls) {
            navControls = document.createElement('div');
            navControls.className = 'navigation-controls';
            const menuNew = document.querySelector('.radial-menu-container');
            menuNew.appendChild(navControls);  // Ensure 'menu' is the correct parent
    
            const leftArrow = document.createElement('button');
            leftArrow.textContent = '<';
            leftArrow.classList.add('navButtonLeft')
            leftArrow.onclick = () => {
                if (currentPage > 0) {
                    currentPage--;
                    populateMenu();
                }
            };
    
            const rightArrow = document.createElement('button');
            rightArrow.textContent = '>';
            rightArrow.classList.add('navButtonRight')
            rightArrow.onclick = () => {
                if ((currentPage + 1) * itemsPerPage < Object.keys(actions).length) {
                    currentPage++;
                    populateMenu();
                }
            };
    
            navControls.appendChild(leftArrow);
            navControls.appendChild(rightArrow);
        }
    }
    

    function handleSelect(e, action) {
        if (shouldIgnoreMouse(e)) return; // Check if mouse event should be ignored
        if (!isMenuVisible) return;
        e.preventDefault();
        
        detailsTitle.textContent = action.Name;
        detailsText.classList.add("cardParagraph");
        detailsText.textContent = action.Description;

        
        detailsContainer.style.display = 'block';
        cover.style.display = 'block';
        //resetMenu();
    }

    function handleMove(e) {
        if (!isMenuVisible) return;
        if (e.type === 'touchmove') e.preventDefault();
        Array.from(menu.children).forEach(child => child.style.backgroundColor = '#4CAF50');
        e.currentTarget.style.backgroundColor = '#367c39'; // Highlight the current item
    }

    function resetMenu() {
        isMenuVisible = false;
        menu.classList.remove('expanded');
        Array.from(menu.children).forEach(item => {
            item.style.transform = `translate(-50%, -50%) scale(0)`;
            item.style.backgroundColor = '#4CAF50';
        });
        detailsContainer.style.display = 'none';
        cover.style.display = 'none';
    }

    function shouldIgnoreMouse(e) {
        return e.type === 'mousedown' && Date.now() - lastTouchEndTime < 300;
    }

    toggleButton.addEventListener('mousedown', toggleMenu);
    toggleButton.addEventListener('touchstart', (e) => {
        lastTouchEndTime = Date.now();
        toggleMenu(e);
    });

    //document.addEventListener('mouseup', resetMenu);
    /*
    document.addEventListener('touchend', (e) => {
        console.log(e.target.classList)
        lastTouchEndTime = Date.now();
        if (e.target.classList.contains('highlight-on-hover')) {
            handleSelect(e);
            console.log('touchend handled')
        }
    });
    */
    document.addEventListener('touchend', (e) => {
        lastTouchEndTime = Date.now();
    
        // Get the touch location from the changedTouches of the event
        if (e.changedTouches && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            const elementAtTouchEnd = document.elementFromPoint(touch.clientX, touch.clientY);
    
            // Check if the element at the touch end point is one of the menu items
            if (elementAtTouchEnd && elementAtTouchEnd.classList.contains('highlight-on-hover')) {
                handleSelect({currentTarget: elementAtTouchEnd, preventDefault: e.preventDefault.bind(e)});
            }
        }
    });
    

    cover.addEventListener('click', resetMenu);
});



function play() {
    var audio = new Audio('/sounds/click.wav');
    audio.play();
  }

function highlightOnTouch() {
    const touchDivs = document.querySelectorAll('.highlight-on-hover'); // Select all divs with class 'highlight-on-hover'

    function isTouchInsideDiv(touch, rect) {
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        return touchX >= rect.left && touchX <= rect.right &&
               touchY >= rect.top && touchY <= rect.bottom;
    }

    function handleTouchMove(event) {
        event.preventDefault();
        
        touchDivs.forEach(div => {
            let rect = div.getBoundingClientRect(); // Get the current position and size of each div
            let isTouchInside = false; // Flag to indicate if any touch is inside the div

            Array.from(event.touches).forEach(touch => {
                if (isTouchInsideDiv(touch, rect)) {
                    isTouchInside = true; // Set flag to true if any touch is inside this div
                }
            });

            if (isTouchInside) {
                if (div.style.backgroundColor != 'orange') {
                    play(div);
                }
                div.style.backgroundColor = 'orange'; // Change background color when touch is inside
                
            } else {
                div.style.backgroundColor = ''; // Reset background color when touch is outside
            }
        });
    }

    function handleTouchEnd() {
        touchDivs.forEach(div => {
            div.style.backgroundColor = ''; // Ensure background color is reset when touches end for all divs
        });
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
};







