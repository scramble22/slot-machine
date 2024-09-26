const slotMachine = document.getElementById('slot-machine');
const balanceDisplay = document.getElementById('balance');
const spinButton = document.getElementById('spin-button');
const betAmountInput = document.getElementById('bet-amount');

// Символы для слот-машины
const symbols = ['🍒', '🍋', '🍉', '⭐', '🔔', '💎'];

let balance = parseInt(localStorage.getItem('slotBalance')) || 1000; // Начальный баланс
let grid = [];

// Функция для генерации случайного символа
function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
}

// Функция для обновления сетки
function updateGrid() {
    grid = [];
    slotMachine.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        let row = [];
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('slot-cell');
            cell.textContent = '❓'; // Начальное значение
            slotMachine.appendChild(cell);
            row.push('❓');
        }
        grid.push(row);
    }
}

// Функция для проверки выигрышей
function checkWin() {
    let winMultiplier = 0;
    const winningCells = [];

    // Проверка по горизонтали
    grid.forEach((row, rowIndex) => {
        if (row.every(symbol => symbol === row[0] && symbol !== '❓')) { // Проверка, чтобы символ не был "?" (начальное значение)
            winMultiplier += 1; // Увеличение коэффициента выигрыша
            row.forEach((_, colIndex) => winningCells.push([rowIndex, colIndex])); // Добавление клеток
        }
    });

    // Проверка по вертикали
    for (let j = 0; j < 5; j++) {
        if (grid[0][j] === grid[1][j] && grid[1][j] === grid[2][j] && grid[0][j] !== '❓') {
            winMultiplier += 1; // Увеличение коэффициента выигрыша
            for (let i = 0; i < 3; i++) {
                winningCells.push([i, j]); // Добавление клеток
            }
        }
    }

    // Проверка по диагонали
    if (grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2] && grid[0][0] !== '❓') {
        winMultiplier += 1; // Диагональ слева направо
        winningCells.push([0, 0], [1, 1], [2, 2]); // Добавление клеток
    }
    if (grid[0][4] === grid[1][3] && grid[1][3] === grid[2][2] && grid[0][4] !== '❓') {
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
    } else {
        balance -= bet;
    }
    balanceDisplay.textContent = `Баланс: ${balance}`;
    localStorage.setItem('slotBalance', balance); // Сохранение баланса в localStorage
}

// Подсветка выигрышных клеток
function highlightWinners(winningCells) {
    winningCells.forEach(([row, col]) => {
        const cell = slotMachine.children[row * 5 + col];
        cell.classList.add('winner'); // Подсветка клетки
    });
}

// Анимация вращения колонок
function animateColumns() {
    const spinDuration = 5000; // Общее время анимации в миллисекундах
    const columnDuration = spinDuration / 5; // Время для каждой колонки
    const promises = [];

    for (let j = 0; j < 5; j++) {
        promises.push(new Promise((resolve) => {
            let columnSymbols = []; // Массив для хранения символов текущей колонки
            let counter = 0;
            const interval = setInterval(() => {
                const randomSymbol = getRandomSymbol();
                const cellIndex = counter % 3; // Обновляем только ячейки в текущем столбце
                const cell = slotMachine.children[cellIndex * 5 + j];
                cell.textContent = randomSymbol;

                columnSymbols[cellIndex] = randomSymbol; // Сохраняем символы для проверки
                counter++;
                if (counter >= 10) { // После 10 обновлений останавливаем колонку
                    clearInterval(interval);
                    // Сохраняем финальные символы в сетке
                    for (let i = 0; i < 3; i++) {
                        const finalCell = slotMachine.children[i * 5 + j];
                        finalCell.textContent = columnSymbols[i]; // Используем символы из колонки
                        grid[i][j] = columnSymbols[i]; // Обновляем сетку
                    }
                    resolve();
                }
            }, columnDuration / 10); // Обновляем ячейки 10 раз за время колонны
        }));
    }

    return Promise.all(promises);
}

// Крутить слот-машину
async function spinSlots() {
    const bet = parseInt(betAmountInput.value);

    if (bet > balance || bet <= 0) {
        alert('Недостаточно средств или неверная ставка!');
        return;
    }

    updateGrid();
    
    await animateColumns(); // Анимация вращения колонок

    // Тайм-аут перед проверкой выигрышей
    await new Promise(resolve => setTimeout(resolve, 500)); // Задержка 500 мс

    const { winMultiplier, winningCells } = checkWin();
    highlightWinners(winningCells); // Подсветка выигрышных клеток

    // Уведомление о выигрыше или проигрыше
    setTimeout(() => {
        if (winMultiplier > 0) {
            alert(`Вы выиграли ${bet * (winMultiplier + 1)}!`);
        } else {
            alert('Вы проиграли!');
        }
    }, 300); // Уведомление через 100 мс после подсветки
    updateBalance(winMultiplier, bet);
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

// Обновление отображения баланса
balanceDisplay.textContent = `Баланс: ${balance}`;
