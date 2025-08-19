
const wheel = document.getElementById("outer-bands");
const offset = 360 / 37 / 2;
const wheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
    8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
    28, 12, 35, 3, 26
]
const numbersContainer = document.getElementById("numbers");
const anglePerNumber = 360 / 37;
wheelNumbers.forEach((num, i) => {
    const span = document.createElement("span");
    span.textContent = num;
    span.style.transform = `rotate(${i * anglePerNumber}deg) translateY(-140px)`;
    numbersContainer.appendChild(span);
});
