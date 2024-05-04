var lookup = {};
var result = [];
var filtered = {};
var tag = 'Utility';

spellData.forEach(item => {
  // Split the school names by comma and trim any whitespace
  var names = item.Tags.split(',').map(name => name.trim());
  
  // Iterate over each name from the split result
  names.forEach(name => {
    if (!lookup[name]) {  // Check if `name` has not been processed
      lookup[name] = true;  // Mark `name` as processed
      if (name != '') {
          result.push(name);  // Only push `name` if it was not previously processed
      }
    }
  });
});

filteredSpells = {}
 let key = 0; // Start the key numbering at 1
            spellData.filter(row => row['Tags'].includes(tag))
                .forEach(row => {
                    filteredSpells[key++] = { // Use the key and then increment it for the next iteration
                        value: row['Name'],
                        level: row['Level'],
                        details: row['Details']
                    };
                });



                
/*
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

    toggleButton.addEventListener('mousedown', (event) => {
        event.preventDefault(); // Prevent default text selection etc.
        menu.classList.add('expanded');
        isMenuVisible = true;
        Object.entries(actions).forEach(([action, description], index) => {
            const angle = (360 / itemCount) * index;
            const radians = (angle * Math.PI) / 180;
            const x = Math.cos(radians) * radius - 30;
            const y = Math.sin(radians) * radius - 30;
            const item = menu.children[index];
            item.style.transform = `translate(${x}px, ${y}px) scale(1)`;
        });
    });

    document.addEventListener('mouseup', () => {
        isMenuVisible = false;
        menu.classList.remove('expanded');
        Array.from(menu.children).forEach(item => {
            item.style.transform = `translate(-50%, -50%) scale(0)`;
            item.style.backgroundColor = '#4CAF50'; // Reset background color
        });
    });

    // Ensure elements are added before attaching event listeners
    Object.entries(actions).forEach(([action, description], index) => {
        const item = document.createElement('div');
        item.textContent = action;
        item.style.backgroundColor = '#4CAF50'; // Default background color
        item.addEventListener('mouseup', () => {
            if (!isMenuVisible) return; // Ignore if menu is not active
            detailsTitle.textContent = action;
            detailsText.textContent = description;
            detailsContainer.style.display = 'block';
            cover.style.display = 'block';
            isMenuVisible = false;
            menu.classList.remove('expanded');
        });
        item.addEventListener('mousemove', () => {
            if (!isMenuVisible) return; // Only highlight if the menu is visible
            Array.from(menu.children).forEach(child => child.style.backgroundColor = '#4CAF50'); // Reset all first
            item.style.backgroundColor = '#367c39'; // Highlight the current item
        });
        menu.appendChild(item);
    });

    cover.addEventListener('click', () => {
        detailsContainer.style.display = 'none';
        cover.style.display = 'none';
    });
});
*/