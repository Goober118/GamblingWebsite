
// Array of wheel numbers offset by 1 counterclockwise to match the colour bands
const wheelNumbers = [
    26, 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
    8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
    28, 12, 35, 3
]

// Numbers creation and positioning
const numbersContainer = document.getElementById("numbers");
const anglePerNumber = 360 / 37;

wheelNumbers.forEach((num, i) => {

    const span = document.createElement("span"); // Create one span element for each number
    span.textContent = num; // Insert the number into the corresponding span position
    span.style.transform = `rotate(${i * anglePerNumber}deg) translateY(-137px)`; // position each span element by multiplying the band angle size by the index number, then translate it outwards to create a 140px radius
    numbersContainer.appendChild(span);
});

// Spin function and result display
let spinCount = 0;
const wheel = document.getElementById("outer-bands");
const result = document.getElementById("result");
const offset = 360 / 37 / 2;
function spin(selectedBet) {
    const spinNumber = Math.floor(Math.random() * 37);
    const anglePerNumber = 360 / 37;

    spinCount++;
    let targetRotation = (360 * 5 * spinCount) + (360 - spinNumber * anglePerNumber) + offset; 

    if (activeButton) {
        activeButton.classList.remove("active"); // Remove active class from previously selected bet
        activeButton = null; // Reset active button
    }
    wheel.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {
        const resultNumber = wheelNumbers[spinNumber];
        result.textContent = "Result: " + wheelNumbers[spinNumber];
        if (selectedBet === resultNumber) {
        console.log("you win");
    }

    else {
        console.log("you lose");
    }
    selectedBet = null; // Reset selected bet after spin
    }, 4000);

    
}

// Betting grid creation
let activeButton = null;
const grid = document.getElementById("betting-grid");
for (let i = 1; i <= 36; i++) {
    const button = document.createElement("button");
    button.classList.add("bet-button");
    button.textContent = i;
    button.addEventListener("click", () => {
        if (activeButton) {
            activeButton.classList.remove("active");
        }

        selectedBet = i;
        button.classList.add("active");
        activeButton = button;

        // Log the selected bet
        console.log("Selected Bet:", selectedBet);
    });
    grid.appendChild(button);

}
// Place bet functionality
const wallet = document.getElementById("wallet");
const betAmount = document.getElementById("bet-amount");
let currentBet = 0;
function placeBet() {
    
}

