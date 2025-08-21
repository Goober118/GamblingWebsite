
let selectedBet = null;
let selectedAmount = null;
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
function spin() {
    const spinNumber = Math.floor(Math.random() * 37);
    const anglePerNumber = 360 / 37;

    spinCount++;
    let targetRotation = (360 * 5 * spinCount) + (360 - spinNumber * anglePerNumber) + offset; 
    wheel.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {
        const resultNumber = wheelNumbers[spinNumber];
        result.textContent = "Result: " + resultNumber;


            placeBet(selectedAmount, selectedBet, resultNumber);
        if (activeBet) activeBet.classList.remove("active");
        if (activeAmount) activeAmount.classList.remove("active");
        activeBet = null;
        activeAmount = null;
        selectedBet = null;
        selectedAmount = null;
    }, 4000);
}

// Betting grid creation
let activeBet = null;
const grid = document.getElementById("betting-grid");
const columns = 12;
const rows = 3;
const buttons = [];
for (let row = 0; row < rows; row++) {
    buttons[row] = [];
    for (let col = 0; col < columns; col++) {
        const number = col * rows + row + 1;
        if (number > 36) continue;
        buttons[row][col] = number;
    }
}
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const number = buttons[row][col];
        if (!number) continue; 
        const button = document.createElement("button");
        button.classList.add("bet-button");
        button.textContent = number;
        button.addEventListener("click", () => {
            if (activeBet) {
                activeBet.classList.remove("active");
            }

            selectedBet = number;
            button.classList.add("active");
            activeBet = button;
            console.log("Selected Bet:", selectedBet); 
    });
    grid.appendChild(button);
    }
    

}
// Place bet functionality
const walletDisplay = document.getElementById("wallet-amount");
const betAmount = document.getElementById("bet-amount");
let walletAmount = 100;
walletDisplay.textContent = "Wallet: $" + walletAmount;
let activeAmount = null;
const twoBet = document.getElementById("2-bet");
const fiveBet = document.getElementById("5-bet");
twoBet.addEventListener("click", () => {
    if (activeAmount) activeAmount.classList.remove("active"); // Remove active class from previously selected amount
    selectedAmount = 2;
    twoBet.classList.add("active");
    activeAmount = twoBet;
    console.log("Selected Amount:", selectedAmount);
});
fiveBet.addEventListener("click", () => {
    if (activeAmount) activeAmount.classList.remove("active"); // Remove active class from previously selected amount
    selectedAmount = 5;
    fiveBet.classList.add("active");
    activeAmount = fiveBet;
    console.log("Selected Amount:", selectedAmount);
})

function placeBet(selectedAmount, selectedBet, spinNumber) {
    if (!selectedAmount || !selectedBet) {
        console.log("You must select a bet amount");
        return;
    }
     walletAmount -= selectedAmount;
     if (selectedBet === spinNumber) {
        const winnings = selectedAmount * 36;
        walletAmount += winnings;
        console.log("Won $" + winnings);
        const popup = document.getElementById("win-popup");
        const popupMessage = document.getElementById("popup-message");
        setTimeout(() => {
            popupMessage.textContent = "You won $" + winnings;
            popup.style.display = "block";
        }, 1000);
        } else {
            console.log("you lose");
     }

     walletDisplay.textContent = "Wallet: $" + walletAmount;
     
}

document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("win-popup").style.display = "none";
});

