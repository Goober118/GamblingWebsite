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

// Spin function and betting logic
let spinCount = 0;
let selectedBet = null;
let selectedAmount = null;
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
const grid = document.getElementById("betting-numbers");
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

        if (number < 10) {

            if (number % 2 === 0) {

            button.classList.add("bet-button-black");
            button.textContent = number;

            } else {

            button.classList.add("bet-button-red");
            button.textContent = number;

            }    
        } else if (9 < number && number < 20) {

            if (number % 2 === 0) {

            button.classList.add("bet-button-red");
            button.textContent = number;

            } else {

            button.classList.add("bet-button-black");
            button.textContent = number;

            }
        } else if (19 < number && number < 28) {

            if (number % 2 === 0) {

            button.classList.add("bet-button-black");
            button.textContent = number;

            } else {

            button.classList.add("bet-button-red");
            button.textContent = number;

            }
        } else if (27 < number && number < 37) {

            if (number % 2 === 0) {

            button.classList.add("bet-button-red");
            button.textContent = number;
            
            } else {

            button.classList.add("bet-button-black");
            button.textContent = number;

            }
        };

        
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
const tenBet = document.getElementById("10-bet");
const twentyBet = document.getElementById("20-bet");
const fiftyBet = document.getElementById("50-bet");

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
});

tenBet.addEventListener("click", () => {
    if (activeAmount) activeAmount.classList.remove("active"); // Remove active class from previously selected amount
    selectedAmount = 10;
    tenBet.classList.add("active");
    activeAmount = tenBet;
    console.log("Selected Amount:", selectedAmount);
});

twentyBet.addEventListener("click", () => {
    if (activeAmount) activeAmount.classList.remove("active"); // Remove active class from previously selected amount
    selectedAmount = 20;
    twentyBet.classList.add("active");
    activeAmount = twentyBet;
    console.log("Selected Amount:", selectedAmount);
});

fiftyBet.addEventListener("click", () => {
    if (activeAmount) activeAmount.classList.remove("active"); // Remove active class from previously selected amount
    selectedAmount = 50;
    selectedBetType = "num"
    fiftyBet.classList.add("active");
    activeAmount = fiftyBet;
    console.log("Selected Amount:", selectedAmount);
});

const betOdd = document.getElementById("bet-odd");
const betEven = document.getElementById("bet-even");
const bet0 = document.getElementById("bet-0");

betOdd.addEventListener("click", () => {
    if (activeBet) activeBet.classList.remove("active"); 
    if (activeAmount) activeAmount.classList.remove("active"); // Remove active class from previously selected amount
    betOdd.classList.add("active");
    selectedBet = "odd";
    activeBet = betOdd;
    console.log("Selected Bet: Odd");
});

betEven.addEventListener("click", () => {
    if (activeBet) activeBet.classList.remove("active"); 
    if (activeAmount) activeAmount.classList.remove("active"); // Remove active class from previously selected amount
    betEven.classList.add("active");
    selectedBet = "even";
    activeBet = betEven;
    console.log("Selected Bet: Even");
});

bet0.addEventListener("click", () => {
    if (activeBet) activeBet.classList.remove("active"); 
    if (activeAmount) activeAmount.classList.remove("active"); // Remove active class from previously selected amount
    bet0.classList.add("active");
    selectedBet = 0;
    activeBet = bet0;
    console.log("Selected Bet: 0");
});

function placeBet(selectedAmount, selectedBet, spinNumber) {
    if (selectedAmount == null || selectedBet == null) {
        console.log("You must select a bet amount");
        return;
    }
    walletAmount -= selectedAmount;
    let won = false;
    let winnings = 0;
    if (typeof selectedBet === "number") {
        if (selectedBet === spinNumber) {
            winnings = selectedAmount * 36;
            won = true;
        }
    } else if (selectedBet === "odd") {
        if (spinNumber % 2 !== 0) {
            winnings = selectedAmount * 2;
            won = true;
        }    
    } else if (selectedBet === "even") {
        if (spinNumber % 2 === 0) {
            winnings = selectedAmount * 2;
            won = true;
        }
    } 
    if (won) {
        walletAmount += winnings;
        console.log("Won $" + winnings);
        const popup = document.getElementById("win-popup");
        const popupMessage = document.getElementById("popup-message");
        setTimeout(() => {
            popupMessage.textContent = "You won $" + (winnings - selectedAmount);
            popup.style.display = "block";
        }, 200);
    } else {
        console.log("you lose");
    }

    walletDisplay.textContent = "Wallet: $" + walletAmount;
};

document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("win-popup").style.display = "none";
});

