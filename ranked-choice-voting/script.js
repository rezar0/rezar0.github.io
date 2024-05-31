// script.js
let currentVoter = 1;
let totalVoters;
let candidates = [];
let votes = [];

function setupVoting() {
    totalVoters = document.getElementById('numVoters').value;
    candidates = document.getElementById('candidates').value.split(',').map(s => s.trim());
    document.getElementById('setup').style.display = 'none';
    document.getElementById('voting').style.display = 'block';
    createVotingGrid();
}

function resetCurrentVoter() {
    console.log("Resetting votes for voter #" + currentVoter);

    // Clear the current voter's votes
    votes[currentVoter - 1] = Array(candidates.length).fill(null);

    // Update the voting grid to reflect the reset
    const rows = document.getElementById('votingGrid').children;
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < candidates.length; j++) {
            const button = rows[i].children[j];
            button.disabled = false;  // Enable all buttons
            button.textContent = j + 1;  // Reset button labels to show rank numbers
        }
    }
}


function createVotingGrid() {
    const grid = document.getElementById('votingGrid');
    grid.innerHTML = '';  // Clear the grid for the next voter
    candidates.forEach((candidate, index) => {
        const row = document.createElement('div');
        row.classList.add('candidate-row')
        row.textContent = candidate + ': ';
        //var para = document.createElement("p");
        //var node = document.createTextNode(candidate + ': ');
        //para.appendChild(node);
        //para.classList.add('candidate-name')
        //row.appendChild(para)

        for (let i = 0; i < candidates.length; i++) {
            const button = document.createElement('button');
            button.textContent = i + 1;
            button.disabled = false; // Make sure all options are enabled initially
            button.onclick = () => assignRank(candidate, i);
            row.appendChild(button);
        }
        grid.appendChild(row);
    });
    votes[currentVoter - 1] = Array(candidates.length).fill(null); // Initialize or reset the current voter's votes
}

function assignRank(candidate, rank) {
    console.log(`Assigning rank ${rank} to candidate ${candidate} for voter #${currentVoter}`);

    // Clear previous assignment of this rank
    const rows = document.getElementById('votingGrid').children;
    for (let i = 0; i < rows.length; i++) {
        const btn = rows[i].children[rank];
        btn.disabled = false;
        if (votes[currentVoter - 1][rank] === candidates[i]) {
            btn.textContent = rank + 1;
            votes[currentVoter - 1][rank] = null;
        }
    }

    // Assign new rank
    const candidateIndex = candidates.indexOf(candidate);
    rows[candidateIndex].children[rank].textContent = 'X';
    rows[candidateIndex].children[rank].disabled = true;
    votes[currentVoter - 1][rank] = candidate;

    // Update button states to prevent duplicate candidate selection
    updateButtonStates(candidateIndex, rank);
}

function updateButtonStates(candidateIndex, rank) {
    const rows = document.getElementById('votingGrid').children;
    for (let i = 0; i < candidates.length; i++) {
        for (let j = 0; j < candidates.length; j++) {
            const button = rows[i].children[j];
            if (i === candidateIndex) {
                // Disable all other buttons for this candidate
                if (j !== rank) button.disabled = true;
            } else {
                // Disable this rank for all other candidates
                if (j === rank) button.disabled = true;
            }
        }
    }
}

function collectVotes() {
    // Automatically assign '0' for unassigned ranks
    votes[currentVoter - 1] = votes[currentVoter - 1].map(vote => vote || '');

    if (currentVoter < totalVoters) {
        currentVoter++;
        document.getElementById('voterIndex').textContent = currentVoter;
        createVotingGrid(); // Reset grid for next voter
    } else {
        document.getElementById('voting').style.display = 'none';
        calculateWinner();
    }
}


function calculateWinner() {
    let round = 0;
    let activeCandidates = new Set(candidates);
    let detailedResults = [];  // Ensure this is correctly initialized as an array

    while (true) {
        round++;
        let counts = {};
        votes.forEach(vote => {
            vote.forEach((candidate, index) => {
                if (candidate !== '' && activeCandidates.has(candidate)) {
                    counts[candidate] = (counts[candidate] || 0) + (candidates.length - index);
                }
            });
        });

        let totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
        let maxVotes = 0;
        let winners = [];

        for (let candidate in counts) {
            if (counts[candidate] > maxVotes) {
                maxVotes = counts[candidate];
                winners = [candidate];
            } else if (counts[candidate] === maxVotes) {
                winners.push(candidate);
            }
        }

        detailedResults.push(`Round ${round}: ${JSON.stringify(counts)}`);

        if (maxVotes > totalVotes / 2 && winners.length === 1) {
            document.getElementById('result').textContent = `Winner: ${winners[0]} in round ${round}`;
            populateResultsDropdown(detailedResults);
            return;
        }

        let minVotes = Number.MAX_SAFE_INTEGER;
        let candidateToRemove = null;

        for (let candidate in counts) {
            if (counts[candidate] < minVotes) {
                minVotes = counts[candidate];
                candidateToRemove = candidate;
            }
        }

        activeCandidates.delete(candidateToRemove);

        if (activeCandidates.size <= 1 || (winners.length > 1 && maxVotes === minVotes)) {
            document.getElementById('result').textContent = `Tie between: ${winners.join(', ')} in round ${round}`;
            populateResultsDropdown(detailedResults);
            return;
        }
    }
}

function populateResultsDropdown(results) {
    const dropdown = document.getElementById('detailedResults');
    dropdown.innerHTML = '';  // Clear previous entries
    results.forEach(result => {
        const option = new Option(result, result);
        dropdown.appendChild(option);
    });
}


function toggleResults() {
    const results = document.getElementById('detailedResults');
    if (results.style.display === 'none') {
        results.style.display = 'block';
    } else {
        results.style.display = 'none';
    }
}
