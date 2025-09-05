// Initialise global variables
let spinCount = 0;
let wheel, offset, walletDisplay;
let walletAmount = 100;
let bets = [];
let wheelNumbers = [];
let isSpinning = false;
let message = "";
let currentRotation = 0;
const redNumbers = [1,3,5,7,9,12,14,16,18,21,23,25,27,28,30,32,34,36];
const spinAudio = new Audio('sfx/spin.mp3');
const loseAudio = new Audio('sfx/lose.mp3');
loseAudio.volume = 0.7;
const winAudio = new Audio('sfx/win.mp3');
const singleChip = new Audio('sfx/chip.mp3');
const multipleChips = new Audio('sfx/multiplechips.mp3');
const betMappings = {
    "bet-1st12": {type: "dozen", value: 1},
    "bet-2nd12": {type: "dozen", value: 2},
    "bet-3rd12": {type: "dozen", value: 3},
    "bet-odd": {type: "odd", value: null},
    "bet-even": {type: "even", value: null},
    "bet-row1": {type: "row", value: 1},
    "bet-row2": {type: "row", value: 2},
    "bet-row3": {type: "row", value: 3},
    "bet-red": {type: "colour", value: 1},
    "bet-black": {type: "colour", value: 2},
    "bet-1to18": {type: "range", value: 1},
    "bet-19to36": {type: "range", value: 2},
    "bet-zero": {type: "number", value: 0}
};

// Load audio files to ensure they are cached and ready to play
function loadAudio() {
    winAudio.load();
    loseAudio.load();
    spinAudio.load();
    singleChip.load();
    multipleChips.load();
}

function showErrorPopup(message) {
    const popup = document.getElementById("error-message");
    popup.textContent = message;
    if (popup.classList.contains("shake")) return;
    popup.style.display = "block";
    popup.classList.add("shake");
    setTimeout(() => {
        popup.classList.remove("shake");
        popup.style.display = "none";
    }, 2000);
}

function main() {
    loadAudio();

    // Define wheel and offset
    wheel = document.getElementById("outer-bands");
    offset = 360 / 37 / 2; // Align the wheel correctly
    walletDisplay = document.getElementById("wallet-amount");
    walletDisplay.textContent = "Wallet: $" + walletAmount;

    initWheel();
    initBoard();

    // close popup
    document.getElementById("close-popup").addEventListener("click", () => {
        document.getElementById("win-popup").style.display = "none"; 
    });

    // draggable chips
    document.querySelectorAll(".two-chip, .five-chip, .ten-chip, .twenty-chip, .fifty-chip").forEach(chip => {
        chip.addEventListener("dragstart", e => {
            // store chip class and value upon dragstart
            e.dataTransfer.setData("text/plain", chip.dataset.value);
            e.dataTransfer.setData("chipClass", chip.className);
        });
    });

    // drop chips
    document.querySelectorAll(".bet-option, .bet-button, .side-button, .extra-button, .zero-button").forEach(spot => {
        spot.addEventListener("dragover", chip => {
            chip.preventDefault(); // allow the chip to be dropped
        });

        // detect drop, and call the handleDrop function
        spot.addEventListener("drop", e => {
            handleDrop(e, spot);
        })
    });
}

function handleDrop(e, spot) {
    e.preventDefault();

    // return if a chip is already placed
    if (spot.querySelector('.chip-on-board')) {
        message = "A chip is already placed here.";
        showErrorPopup(message);
        return;
    }
    // return if the wheel is currently spinning
    if (isSpinning) {
        message = "The wheel is currently spinning.";
        showErrorPopup(message);
        return; 
    }
    // remove existing chip from the spot if present
    const oldChip = spot.querySelector(".chip-on-board");
    if (oldChip) oldChip.remove();

    // retrieve chip class and value
    const amount = parseInt(e.dataTransfer.getData("text/plain"), 10);
    console.log("Dropped chip amount:", amount);
    const chipClass = e.dataTransfer.getData("chipClass").split(" ")[0];

    // determine bet type
    let betType, value;

    if (betMappings[spot.id]) {
        ({type: betType, value} = betMappings[spot.id]);
    } else {
        betType = "number";
        value = parseInt(spot.textContent, 10);
    }

    console.log("Wallet amount:", walletAmount);
    if (walletAmount >= amount) { // only allow a bet to be placed if the player's wallet has enough funds
        singleChip.play();
        // deduct the bet amount from the wallet and update the display
        walletAmount -= amount;
        walletDisplay.textContent = "Wallet: $" + walletAmount;

        bets.push({ type: betType, value, amount }); // Add the bet to bets array
        
        // create a chip element on the board
        const chip = document.createElement("div");
        chip.className = chipClass + " chip-on-board";
        chip.dataset.amount = amount;
        chip.dataset.type = betType;
        chip.dataset.value = value;
        chip.style.cursor = "pointer";

        // functionality to remove chips
        chip.addEventListener("click", function(e) {
            if (isSpinning) {
                message = "The wheel is currently spinning"
                showErrorPopup(message);
                return;
            }
            singleChip.play();
            e.stopPropagation();
            chip.remove();

            // refund the chip amount back to the wallet
            walletAmount += parseInt(chip.dataset.amount, 10);
            walletDisplay.textContent = "Wallet: $" + walletAmount;
            

            // remove the corresponding bet from the bets array
            bets = bets.filter(bet => {
                return !(bet.type === betType && bet.value === value && bet.amount === parseInt(chip.dataset.amount, 10));
            });
        });
        spot.appendChild(chip);
        chip.setAttribute("draggable", "false");
    } else {
        message = "Insufficient funds to place bet";
        showErrorPopup(message);
        return;
    };
};

// initialise the roulette wheel numbers visually
function initWheel() {
    
    // Array of wheel numbers offset by 1 counterclockwise to match the colour bands
    wheelNumbers = [
    26, 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
    8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
    28, 12, 35, 3];
    
    // Numbers container creation and positioning
    const numbersContainer = document.getElementById("numbers");
    const anglePerNumber = 360 / 37;

    // create a span element for each number's position on the board
    wheelNumbers.forEach((num, i) => {
        const span = document.createElement("span");
        span.textContent = num;
        span.style.transform = `rotate(${i * anglePerNumber}deg) translateY(-170px)`; // position each span element by multiplying the band angle size by the index number, then translate it outwards to create a 140px radius
        numbersContainer.appendChild(span);
    });
}

// Initialise the betting board with number buttons
function initBoard() {

    const grid = document.getElementById("betting-numbers"); // Fetch the html grid element where the number buttons are to be placed
    const columns = 12, rows = 3; // Set the number of columns and rows for the betting grid
    const buttons = []; // Create an array to store numbers for each seperate button

    // Fill the buttons array with numbers
    for (let row = 0; row < rows; row++) {
        buttons[row] = [];
        for (let col = 0; col < columns; col++) {
            // calculate the button number based on its row and column position
            const number = col * rows + row + 1;
            // end the process if the number is greater than 36
            if (number > 36) continue;
            buttons[row][col] = number;
        }
    }

    // create buttons for each row and column
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const number = buttons[row][col];
            if (!number) continue; // safeguard against empty grid spots
            // create a button elemnt for the number
            const button = document.createElement("button");
            button.classList.add("bet-button");
            // add the appropriate color class to the button
            if (redNumbers.includes(number)) {
                button.classList.add("red");
            } else {
                button.classList.add("black");
            }
            button.textContent = number; // Set the button's text to the number
        grid.appendChild(button); // add the button to the grid

        }
    }
}

// Spin the wheel
function spin() {

    // Disable the wheel and display a message if already spinning
    if (isSpinning) {
        message = "Spin in progress";
        showErrorPopup(message);
        return;
    }

    // Disable the wheel and display a message if no bets are placed
    if (bets.length === 0) {
        message = "Place a bet first";
        showErrorPopup(message);
        return;
    }
    spinAudio.play(); 
    isSpinning = true;
    const spinNumber = Math.floor(Math.random() * 37); // Randomly generate a number
    const anglePerNumber = 360 / 37; // Define the angle of each number section
    const rotationsPerSpin = 5;
   // Increase spincount with each spin
    const targetRotation = currentRotation + (360 * rotationsPerSpin) + (360 - spinNumber * anglePerNumber) + offset; 
    wheel.style.transform = `rotate(${targetRotation}deg)`; // Move the wheel to match the generated number
    currentRotation = targetRotation;
    setTimeout(() => {
        const resultNumber = wheelNumbers[spinNumber]; // Get the result number based on the randomly generated spin number
        resolveBets(resultNumber);
        isSpinning = false;
        removeChips();   

    }, 5500); // Wait 5.5 seconds to allow the animation to play before resolving bets
    
}

// Remove all existing chips on the board, playing a sound effect
function removeChips() {
        document.querySelectorAll(".chip-on-board").forEach(c => c.remove());
        multipleChips.play();
}

// Calculate win conditions and winnings
function resolveBets(resultNumber) {
    let totalWinnings = 0;
    let won = false;
    const body = document.getElementById("body");

    // for each bet chip on the board, calculate if it is a winner
    bets.forEach(bet => { 
        let winnings = 0;

        // If the bet type is a number
        if (bet.type === "number" && bet.value === resultNumber) {
            winnings = bet.amount * 36;
            won = true;
        
        // if the bet type is parity
        } else if (bet.type === "bet-odd" && resultNumber % 2 !== 0 && resultNumber != 0) {
            winnings = bet.amount * 2;
            won = true;
        } else if (bet.type === "bet-even" && resultNumber % 2 === 0 && resultNumber != 0) {
            winnings = bet.amount * 2; 
            won = true;

        // if the bet type is dozens
        } else if (bet.type === "dozen") {
            if (
                (bet.value === 1 && resultNumber >= 1 && resultNumber <= 12) ||
                (bet.value === 2 && resultNumber >= 13 && resultNumber <= 24) ||
                (bet.value === 3 && resultNumber >= 25 && resultNumber <= 36)
            ) {
                winnings = bet.amount * 3;
                won = true;
            }
        
        // if the bet type is "2 to 1"
        } else if (bet.type === "row") {
            if (
                (bet.value === 1 && [1,4,7,10,13,16,19,22,25,28,31,34].includes(resultNumber)) ||
                (bet.value === 2 && [2,5,8,11,14,17,20,23,26,29,32,35].includes(resultNumber)) ||
                (bet.value === 3 && [3,6,9,12,15,18,21,24,27,30,33,36].includes(resultNumber))
            ) {
                winnings = bet.amount * 3;
                won = true;
            }

        // if the bet type is "1 to 18" or "19 to 36"
        } else if (bet.type === "range") {
            if (
                (bet.value === 1 && resultNumber >= 1 && resultNumber <= 18) ||
                (bet.value === 2 && resultNumber >= 19 && resultNumber <= 36)
            ) {
                winnings = bet.amount * 2;
                won = true;
            }

        // if the bet type is red or black
        } else if (bet.type === "colour") {
            if (
                (bet.value === 1 && redNumbers.includes(resultNumber)) ||
                (bet.value === 2 && !redNumbers.includes(resultNumber))
            ) {
                winnings = bet.amount * 2;
                won = true;
            }

        // if the bet type is 0
        } else if (bet.type === "bet-zero" && resultNumber === 0) {
            winnings = bet.amount * 36;
            won = true;
        }

        totalWinnings += winnings; // add the winnings of each bet to the total amount of winnings for the spin
    });

    // add the total spin winnings to the wallet, and update the display
    walletAmount += totalWinnings; 
    walletDisplay.textContent = "Wallet: $" + walletAmount;

    // Perform win popup execution and sound effects.
    if (won) {
        winAudio.play();
        document.getElementById("win-popup-message").textContent = `You won $${(totalWinnings)}!`;
        document.getElementById("win-popup").style.display = "block";

    // Perform lose animation and sound effects
    } else if (won === false) {
        loseAudio.play();
        body.classList.add("lose");
        setTimeout(() => {
            body.classList.remove("lose");
            setTimeout(() => {
                body.classList.add("lose");
                setTimeout(() => {
                    body.classList.remove("lose");
                }, 100);
            }, 100);
        }, 100);
    };
    
    bets = []; // Clear the bets array
}

// Reset the wallet amount
function reset() {
    if (isSpinning) {
        message = "Spin in progress";
        showErrorPopup(message);
        return; // Prevent reset if wheel is spinning
    }
    removeChips(); // Reset the board
    walletAmount = 100; 
    bets = [];
    walletDisplay.textContent = "Wallet: $" + walletAmount;
}

main()
