gsap.registerPlugin(Flip);

var catHolder;
function filterContent(category) {
    //resetContent();
    
    setTimeout(() => {
        const container = document.querySelector('.content-container');
        const items = Array.from(document.querySelectorAll('.content-item'));

        if (catHolder && catHolder != category) {
            document.getElementById(catHolder).classList.remove("special")
            document.getElementById(category).classList.add("special")
        } else {
            document.getElementById(category).classList.add("special")
        }
        catHolder = category;
        
        
        // Capture the initial state
        const state = Flip.getState(items);

        // Reorder the items based on the selected category
        const sortedItems = items.sort((a, b) => {
            const aInCategory = a.classList.contains(category);
            const bInCategory = b.classList.contains(category);
            return bInCategory - aInCategory; // Move items in the category to the front
        });

        // Append sorted items back to the container
        sortedItems.forEach(item => {
            container.appendChild(item);
        });

        // Animate to the new state
        Flip.from(state, {
            duration: 0.5,
            ease: 'easeOutElastic',
            absolute: true,
            stagger: 0.1,
            scale: false
        });

        items.forEach(item => {
            if (item.classList.contains(category)) {
                item.classList.add("special")
                item.classList.remove("not-special")
            } else {
                item.classList.remove("special")
                item.classList.add("not-special")
            }
        });
    }, 250);
}

function applySpecial(item) {
    item.classList.add("special");
}

function resetContent() {
    const items = Array.from(document.querySelectorAll('.content-item'));

    // Capture the initial state
    const state = Flip.getState(items);

    // Reset the items order to the initial order
    items.forEach(item => {
        item.style.display = 'flex';
    });

    // Animate to the new state
    Flip.from(state, {
        duration: 0.5,
        ease: 'power1.inOut',
        absolute: true,
        stagger: 0.1,
        scale: true
    });
}

// Event listener for category buttons
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        filterContent(category);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.content-item');
    
    items.forEach(item => {
        item.addEventListener('click', () => {
            showDetailedCard(item);
        });
    });
});

function showDetailedCard(item) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.addEventListener('click', closeDetailedCard);

    const card = document.createElement('div');
    card.className = 'detailed-card';
    
    // Get the detailed content from the hidden div
    const detailContent = item.querySelector('.detail-content').innerHTML;

    card.innerHTML = `
        <span class="detailed-card-close" onclick="closeDetailedCard()">X</span>
        <h2>${item.querySelector('h2').innerText}</h2>
        ${detailContent}
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(card);
}

function closeDetailedCard() {
    const card = document.querySelector('.detailed-card');
    const overlay = document.querySelector('.overlay');
    if (card) card.remove();
    if (overlay) overlay.remove();
}
