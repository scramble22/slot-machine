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

// Проверка выигрышей и подсветка клеток
function checkWin() {
    let winMultiplier = 0;
    const winningCells = [];

    // Проверка по горизонтали
    grid.forEach((row, rowIndex) => {
        if (row.every(symbol => symbol === row[0])) {
            winMultiplier += 1; // Увеличение коэффициента выигрыша
            row.forEach((_, colIndex) => winningCells.push([rowIndex, colIndex])); // Добавление клеток
        }
    });

    // Проверка по вертикали
    for (let j = 0; j < 5; j++) {
        if (grid[0][j] === grid[1][j] && grid[1][j] === grid[2][j]) {
            winMultiplier += 1; // Увеличение коэффициента выигрыша
            for (let i = 0; i < 3; i++) {
                winningCells.push([i, j]); // Добавление клеток
            }
        }
    }

    // Проверка по диагонали
    if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
        winMultiplier += 1; // Диагональ слева направо
        winningCells.push([0, 0], [1, 1], [2, 2]); // Добавление клеток
    }
    if (grid[0][4] === grid[1][3] && grid[1][3] === grid[2][2]) {
        winMultiplier += 1; // Диагональ справа налево
        winningCells.push([0, 4], [1, 3], [2, 2]); // Добавление клеток
    }

    return { winMultiplier, winningCells };
}

// Функция для обновления баланса
function updateBalance(winMultiplier, bet) {
    if (winMultiplier > 0) {
        const winnings = bet * (winMultiplier + 1); // Учитываем выигрыш
        balance += winnings;
        alert(`Вы выиграли ${winnings}!`);
    } else {
        balance -= bet;
        alert('Вы проиграли!');
    }
    balanceDisplay.textContent = `Баланс: ${balance}`;
}

// Подсветка выигрышных клеток
function highlightWinners(winningCells) {
    winningCells.forEach(([row, col]) => {
        const cell = slotMachine.children[row * 5 + col];
        cell.classList.add('winner'); // Подсветка клетки
    });
}

// Крутить слот-машину
function spinSlots() {
    const bet = parseInt(betAmountInput.value);

    if (bet > balance || bet <= 0) {
        alert('Недостаточно средств или неверная ставка!');
        return;
    }

    // Обновляем сетку и добавляем анимацию вращения
    updateGrid();
    slotMachine.classList.add('spin'); // Запускаем анимацию

    setTimeout(() => {
        const { winMultiplier, winningCells } = checkWin();
        highlightWinners(winningCells); // Подсветка выигрышных клеток
        setTimeout(() => { // Задержка перед обновлением баланса
            updateBalance(winMultiplier, bet);
            slotMachine.classList.remove('spin'); // Убираем анимацию
        }, 300); // Задержка перед обновлением баланса
    }, 500); // Задержка в 500мс для анимации
}

// Обработчик нажатия на кнопку
spinButton.addEventListener('click', spinSlots);

// Обработчик нажатия на пробел
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Предотвращаем прокрутку страницы
        spinSlots();
    }
});
