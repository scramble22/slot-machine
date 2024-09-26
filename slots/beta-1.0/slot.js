const slotMachine = document.getElementById('slot-machine');
const balanceDisplay = document.getElementById('balance');
const spinButton = document.getElementById('spin-button');
const betAmountInput = document.getElementById('bet-amount');

// Символы для слот-машины
const symbols = ['🍒', '🍋', '🍉', '⭐', '🔔', '💎'];

let balance = 1000; // Начальный баланс
let grid = [];

// Функция для генерации случайного символа
function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
}

// Обновление сетки
function updateGrid() {
    grid = [];
    slotMachine.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        let row = [];
        for (let j = 0; j < 5; j++) {
            const symbol = getRandomSymbol();
            const cell = document.createElement('div');
            cell.classList.add('slot-cell');
            cell.textContent = symbol;
            slotMachine.appendChild(cell);
            row.push(symbol);
        }
        grid.push(row);
    }
}

// Проверка выигрышей
function checkWin() {
    // Пример простого правила: 3 одинаковых символа в любом ряду по горизонтали
    let winMultiplier = 0;

    grid.forEach(row => {
        if (row.every(symbol => symbol === row[0])) {
            winMultiplier += 1; // Увеличение коэффициента выигрыша
        }
    });

    return winMultiplier;
}

// Функция для обновления баланса
function updateBalance(winMultiplier, bet) {
    if (winMultiplier > 0) {
        const winnings = bet * winMultiplier;
        balance += winnings;
        alert(`Вы выиграли ${winnings}!`);
    } else {
        balance -= bet;
        alert('Вы проиграли!');
    }
    balanceDisplay.textContent = `Баланс: ${balance}`;
}

// Крутить слот-машину
spinButton.addEventListener('click', () => {
    const bet = parseInt(betAmountInput.value);

    if (bet > balance || bet <= 0) {
        alert('Недостаточно средств или неверная ставка!');
        return;
    }

    updateGrid();

    const winMultiplier = checkWin();
    updateBalance(winMultiplier, bet);
});
