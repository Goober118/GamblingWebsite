let spinCount = 0;
let wheel, result, offset, walletDisplay;
let walletAmount = 100;
let bets = [];
let wheelNumbers = []
let isSpinning = false;
const spinAudio = new Audio('sfx/spin.mp3');
const loseAudio = new Audio('sfx/lose.mp3');
const winAudio = new Audio('sfx/win.mp3');


function main() {
    wheel = document.getElementById("outer-bands");
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
    document.querySelectorAll(".bet-option, .bet-button, .side-button, .extra-button, .zero-button").forEach(spot => {
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

    if (spot.querySelector('.chip-on-board')) return;
    if (isSpinning) return;

    const oldChip = spot.querySelector(".chip-on-board");
    if (oldChip) oldChip.remove();

    const amount = parseInt(e.dataTransfer.getData("value"), 10);
    const chipClass = e.dataTransfer.getData("chipClass").split(" ")[0];

    let betType, value;
    if (spot.id === "bet-1st12") {
        betType = "dozen";
        value = 1;
    } else if (spot.id === "bet-2nd12") {
        betType = "dozen";
        value = 2;
    } else if (spot.id === "bet-3rd12") {
        betType = "dozen";
        value = 3;
    } else if (spot.id === "bet-odd") {
        betType = spot.id;
        value = null;
    } else if (spot.id === "bet-even") {
        betType = spot.id;
        value = null;
    } else if (spot.id === "bet-row1") {
        betType = "row";
        value = 1;
    } else if (spot.id === "bet-row2") {
        betType = "row";
        value = 2;
    } else if (spot.id === "bet-row3") {
        betType = "row";
        value = 3;
    } else if (spot.id === "bet-red") {
        betType = "colour";
        value = 1;
    } else if (spot.id === "bet-black") {
        betType = "colour";
        value = 2;
    } else if (spot.id === "bet-1to18") {
        betType = "range";
        value = 1;
    } else if (spot.id === "bet-19to36") {
        betType = "range";
        value = 2;
    } else if (spot.id === "bet-red") {
        betType = "colour";
        value = 1;
    } else if (spot.id === "bet-zero") {
        betType = "bet-zero";
        value = 0;
    }
    else {
        betType = "number";
        value = parseInt(spot.textContent, 10);
    }

    if (walletAmount >= amount) {
        walletAmount -= amount;
        walletDisplay.textContent = "Wallet: $" + walletAmount;
        bets.push({ type: betType, value, amount });
        const chip = document.createElement("div");
        chip.className = chipClass + " chip-on-board";
        chip.dataset.amount = amount;
        chip.style.cursor = "pointer";
        chip.addEventListener("click", function(e) {
            e.stopPropagation();
            chip.remove();
            walletAmount += parseInt(chip.dataset.amount, 10);
            walletDisplay.textContent = "Wallet: $" + walletAmount;
            bets = bets.filter(bet => {
                if (bet.type === "number") {
                    return !(bet.value === parseInt(spot.textContent, 10) && bet.amount === parseInt(chip.dataset.amount, 10));
                }
                if (bet.type === "dozen") {
                    return !(bet.value === value && bet.amount === parseInt(chip.dataset.amount, 10));
                }
                return !(bet.type === spot.id && bet.amount === parseInt(chip.dataset.amount, 10));
            });
        });
        spot.appendChild(chip);
        chip.setAttribute("draggable", "false");
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
        span.style.transform = `rotate(${i * anglePerNumber}deg) translateY(-170px)`; // position each span element by multiplying the band angle size by the index number, then translate it outwards to create a 140px radius
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
                button.classList.add("black");
                button.textContent = number;
                } else {
                button.classList.add("red");
                button.textContent = number;
                }    
            } else if (9 < number && number < 20) {
                if (number % 2 === 0) {
                button.classList.add("red");
                button.textContent = number;
                } else {
                button.classList.add("black");
                button.textContent = number;
                }
            } else if (19 < number && number < 28) {
                if (number % 2 === 0) {
                button.classList.add("black");
                button.textContent = number;
                } else {
                button.classList.add("red");
                button.textContent = number;
                }
            } else if (27 < number && number < 37) {
                if (number % 2 === 0) {
                button.classList.add("red");
                button.textContent = number;
                } else {
                button.classList.add("black");
                button.textContent = number;
                }
            };

        grid.appendChild(button);

        }
    }
}

function spin() {
    if (isSpinning) return;
    spinAudio.play();
    isSpinning = true;
    const spinNumber = Math.floor(Math.random() * 37);
    const anglePerNumber = 360 / 37;
    spinCount++;
    let targetRotation = (360 * 5 * spinCount) + (360 - spinNumber * anglePerNumber) + offset; 
    wheel.style.transform = `rotate(${targetRotation}deg)`;
    setTimeout(() => {
        const resultNumber = wheelNumbers[spinNumber];
        resolveBets(resultNumber);
        document.querySelectorAll(".chip-on-board").forEach(c => c.remove());
        isSpinning = false;
    }, 5500);
    
}

function resolveBets(resultNumber) {
    let totalWinnings = 0;
    let won = false;
    const body = document.getElementById("body");
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
        } else if (bet.type === "dozen") {
            if (
                (bet.value === 1 && resultNumber >= 1 && resultNumber <= 12) ||
                (bet.value === 2 && resultNumber >= 13 && resultNumber <= 24) ||
                (bet.value === 3 && resultNumber >= 25 && resultNumber <= 36)
            ) {
                winnings = bet.amount * 3;
                won = true;
            }
        } else if (bet.type === "row") {
            if (
                (bet.value === 1 && [1,4,7,10,13,16,19,22,25,28,31,34].includes(resultNumber)) ||
                (bet.value === 2 && [2,5,8,11,14,17,20,23,26,29,32,35].includes(resultNumber)) ||
                (bet.value === 3 && [3,6,9,12,15,18,21,24,27,30,33,36].includes(resultNumber))
            ) {
                winnings = bet.amount * 3;
                won = true;
            }
        } else if (bet.type === "range") {
            if (
                (bet.value === 1 && resultNumber >= 1 && resultNumber <= 18) ||
                (bet.value === 2 && resultNumber >= 19 && resultNumber <= 36)
            ) {
                winnings = bet.amount * 2;
                won = true;
            }
        } else if (bet.type === "colour") {
            if (
                (bet.value === 1 && [1,3,5,7,9,10,12,14,16,18,21,23,25,27,28,30,32,34,36].includes(resultNumber)) ||
                (bet.value === 2 && [2,4,6,8,11,13,15,17,19,21,23,25,27,29,31,33,35].includes(resultNumber))
            ) {
                winnings = bet.amount * 2;
                won = true;
            }
        } else if (bet.type === "bet-zero" && resultNumber === 0) {
            winnings = bet.amount * 36;
            won = true;
        }
        totalWinnings += winnings;
    });
    walletAmount += totalWinnings;
    walletDisplay.textContent = "Wallet: $" + walletAmount;
    if (won) {
        winAudio.play();
        document.getElementById("popup-message").textContent = `You won $${(totalWinnings)}!`;
        document.getElementById("win-popup").style.display = "block";
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
    
    bets = [];
}

main()




