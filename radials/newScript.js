// script.js
const actions = {
    "Attack": "The most common action to take in combat is the Attack action, whether you are swinging a sword, firing an arrow from a bow, or brawling with your fists.",
    "Cast a Spell": "Each spell has a casting time, which specifies whether the caster must use an action, a reaction, minutes, or even hours to cast the spell.",
    "Dash": "Doubles your total movement.",
    "Disengage": "Your movement doesn't provoke opportunity attacks for the rest of the turn.",
    "Dodge": "Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker.",
    "Help": "You can lend your aid to another creature in the completion of a task.",
    "Hide": "You make a stealth check in an attempt to hide.",
    "Ready": "You can prepare an action and trigger it with a perceived stimulus.",
    "Search": "You devote your attention to finding something.",
    "Use an Object": "You interact with an object as your action."
};

document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.radial-menu');
    const toggleButton = document.querySelector('.menu-toggle');
    const detailsContainer = document.querySelector('.action-details');
    const detailsTitle = detailsContainer.querySelector('h2');
    const detailsText = detailsContainer.querySelector('p');
    const cover = document.createElement('div');
    cover.className = 'cover';
    document.body.appendChild(cover);
    const radius = 120; // Radius of the circle
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
    };


    function populateMenu() {
        menu.innerHTML = ''; // Clear any existing items
        Object.entries(actions).forEach(([action, description], index) => {
            const angle = (360 / itemCount) * index;
            const radians = (angle * Math.PI) / 180;
            const x = Math.cos(radians) * radius - 30;
            const y = Math.sin(radians) * radius - 30;
            const item = document.createElement('div');
            item.textContent = action;
            item.style.backgroundColor = '#4CAF50'; // Default background color
            item.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            
            item.addEventListener('mouseup', handleSelect);
            item.addEventListener('touchend', handleSelect);

            item.addEventListener('touchmove', handleMove);
            item.addEventListener('mousemove', handleMove);
            
            menu.appendChild(item);
        });
    }

    function handleSelect(e) {
        //if (shouldIgnoreMouse(e)) return; // Check if mouse event should be ignored
        if (!isMenuVisible) return;
        //e.preventDefault();
        detailsTitle.textContent = e.currentTarget.textContent;
        detailsText.textContent = e.currentTarget.dataset.description;
        detailsContainer.style.display = 'block';
        cover.style.display = 'block';
        resetMenu();
    };


    function handleMove(e) {
        if (!isMenuVisible) return;
        if (e.type === 'touchmove') e.preventDefault();
        Array.from(menu.children).forEach(child => child.style.backgroundColor = '#4CAF50');
        e.currentTarget.style.backgroundColor = '#367c39'; // Highlight the current item
    }



});


document.addEventListener('DOMContentLoaded', () => {
    const testDiv = document.getElementById('test');

    function isTouchInsideDiv(touch, rect) {
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        return touchX >= rect.left && touchX <= rect.right &&
               touchY >= rect.top && touchY <= rect.bottom;
    }

    function handleTouchMove(event) {
        event.preventDefault();

        const rect = testDiv.getBoundingClientRect(); // Get the current position and size of the div
        let isTouchInside = false; // Flag to indicate if any touch is inside the div

        Array.from(event.touches).forEach(touch => {
            if (isTouchInsideDiv(touch, rect)) {
                isTouchInside = true; // Set flag to true if any touch is inside
            }
        });

        if (isTouchInside) {
            testDiv.style.backgroundColor = 'orange'; // Change background color when touch is inside
            play();
        } else {
            testDiv.style.backgroundColor = ''; // Reset background color when touch is outside
        }
    }


    
    function handleTouchEnd() {
        testDiv.style.backgroundColor = ''; // Ensure background color is reset when touches end
    }

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
});