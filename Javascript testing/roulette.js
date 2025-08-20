
const wheel = document.getElementById("outer-bands");
const result = document.getElementById("result");
const offset = 360 / 37 / 2;
// Array of wheel numbers offset by 1 counterclockwise to match the colour bands
const wheelNumbers = [
    26, 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
    8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
    28, 12, 35, 3
]
const numbersContainer = document.getElementById("numbers");


const anglePerNumber = 360 / 37;

wheelNumbers.forEach((num, i) => {

    const span = document.createElement("span"); // Create one span element for each number
    span.textContent = num; // Insert the number into the corresponding span position
    span.style.transform = `rotate(${i * anglePerNumber}deg) translateY(-137px)`; // position each span element by multiplying the band angle size by the index number, then translate it outwards to create a 140px radius
    numbersContainer.appendChild(span);
});

let spinCount = 0;

function spin() {
    const spinNumber = Math.floor(Math.random() * 37);
    const anglePerNumber = 360 / 37;

    spinCount++;
    let targetRotation = (360 * 5 * spinCount) + (360 - spinNumber * anglePerNumber) + offset; 

    wheel.style.transform = `rotate(${targetRotation}deg)`;

    setTimeout(() => {
        result.textContent = "Result: " + wheelNumbers[spinNumber];
    }, 4000);
}

