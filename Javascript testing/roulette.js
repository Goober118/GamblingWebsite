let spinCount = 0;
let wheel, result, offset, walletDisplay;
let walletAmount = 100;
let bets = [];
let wheelNumbers = []

function main() {
    wheel = document.getElementById("outer-bands");
    result = document.getElementById("result");
    offset = 360 / 37 / 2;
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
            e.dataTransfer.setData("value", chip.dataset.value);
            e.dataTransfer.setData("chipClass", chip.className);
        });
    });

    // drop chips
    document.querySelectorAll(".bet-option, .bet-button, .side-button").forEach(spot => {
        spot.addEventListener("dragover", e => {
            e.preventDefault();
        });
        spot.addEventListener("drop", e => {
            handleDrop(e, spot);
        })
    });
}
    


function handleDrop(e, spot) {
    e.preventDefault();

    const oldChip = spot.querySelector(".chip-on-board");
    if (oldChip) oldChip.remove();

    const amount = parseInt(e.dataTransfer.getData("value"), 10);
    const chipClass = e.dataTransfer.getData("chipClass").split(" ")[0];

    if (walletAmount >= amount) {
        walletAmount -= amount;
        walletDisplay.textContent = "Wallet: $" + walletAmount;
        let betType = (spot.id === "bet-odd" || spot.id === "bet-even") ? spot.id : "number";
        value = betType === "number" ? parseInt(spot.textContent, 10) : null;
        bets.push({ type: betType, value, amount });
        const chip = document.createElement("div");
        chip.className = chipClass + " chip-on-board";
        chip.textContent = amount;
        spot.appendChild(chip);
    } else {
        console.log("Insufficient funds to place bet");
    };
};


    



function initWheel() {
    
    // Array of wheel numbers offset by 1 counterclockwise to match the colour bands
    wheelNumbers = [
    26, 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
    8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
    28, 12, 35, 3];
    
    // Numbers container creation and positioning
    const numbersContainer = document.getElementById("numbers");
    const anglePerNumber = 360 / 37;

    wheelNumbers.forEach((num, i) => {

        const span = document.createElement("span"); // Create one span element for each number
        span.textContent = num; // Insert the number into the corresponding span position
        span.style.transform = `rotate(${i * anglePerNumber}deg) translateY(-137px)`; // position each span element by multiplying the band angle size by the index number, then translate it outwards to create a 140px radius
        numbersContainer.appendChild(span);
        
    });
}

function initBoard() {

    const grid = document.getElementById("betting-numbers");
    const columns = 12, rows = 3;
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
}

function spin() {

    const spinNumber = Math.floor(Math.random() * 37);
    const anglePerNumber = 360 / 37;
    spinCount++;
    let targetRotation = (360 * 5 * spinCount) + (360 - spinNumber * anglePerNumber) + offset; 
    wheel.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {

        const resultNumber = wheelNumbers[spinNumber];
        result.textContent = "Result: " + resultNumber;
        resolveBets(resultNumber);
        document.querySelectorAll(".chip-on-board").forEach(c => c.remove());

    }, 8000);
}

function resolveBets(resultNumber) {
    let totalWinnings = 0;
    let won = false;
    bets.forEach(bet => {
        let winnings = 0;

        if (bet.type === "number" && bet.value === resultNumber) {
            winnings = bet.amount * 36;
            won = true;

        } else if (bet.type === "bet-odd" && resultNumber % 2 !== 0 && resultNumber != 0) {
            winnings = bet.amount * 2;
            won = true;

        } else if (bet.type === "bet-even" && resultNumber % 2 === 0 && resultNumber != 0) {
            winnings = bet.amount * 2; 
            won = true;

        } else if (bet.type === "bet-0" && resultNumber === 0) {
            winnings = bet.amount * 36
            won = true;

        };
        totalWinnings += winnings;

    });
    walletAmount += totalWinnings;
    walletDisplay.textContent = "Wallet: $" + walletAmount;
    if (won) {
        document.getElementById("popup-message").textContent = `You won $${(totalWinnings)}!`;
        document.getElementById("win-popup").style.display = "block";
    };
    
    bets = [];
}

main()




