const images = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'];
let balance = parseInt(localStorage.getItem('balance')) || 1000;
let betAmount = parseInt(document.querySelector('.bet-input').value);
const slotContainer = document.querySelector(".slots");
const slotImgs = Array.from(slotContainer.querySelectorAll("img"));
const spinButton = document.querySelector(".spin-button");
const balanceValue = document.querySelector(".balance-value");
const betInput = document.querySelector(".bet-input");
const digit = document.querySelector('.digit');
const historyList = document.querySelector('.history-list');
const secretDepositButton = document.querySelector('.secret-deposit-button');
const notification = document.querySelector('.notification');

// Update balance display
balanceValue.textContent = balance;

const winCombinations = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [0, 5, 10],
  [1, 6, 11],
  [2, 7, 12],
  [3, 8, 13],
  [4, 9, 14],
  [0, 6, 12],
  [4, 8, 12],
  [4, 5, 9, 10, 14], // Комбинация 1
  [0, 1, 3, 4, 5],    // Комбинация 2
  [2, 6, 8, 10, 12],  // Комбинация 3
];

const multipliers = {
  '0_1_2_3_4': 5,
  '5_6_7_8_9': 5,
  '10_11_12_13_14': 6,
  '0_5_10': 2,
  '1_6_11': 2,
  '2_7_12': 2,
  '3_8_13': 2,
  '4_9_14': 2,
  '0_6_12': 2,            // Множитель для [0, 6, 12]
  '4_8_12': 2,            // Множитель для [4, 8, 12]
  '4_5_9_10_14': 10,       // Множитель для Комбинации 1
  '0_1_3_4_5': 8,          // Множитель для Комбинации 2
  '2_6_8_10_12': 12,       // Множитель для Комбинации 3
};


function calculateOutcome(uniqueImgs) {
  let totalPrizeAmount = 0;

  for (const combination of winCombinations) {
    const imagesInCombination = combination.map(index => slotImgs[index].src);
    const uniqueImagesInCombination = new Set(imagesInCombination);

    if (uniqueImagesInCombination.size === 1) {
      const prizeAmount = calculatePrizeAmount(combination);
      totalPrizeAmount += prizeAmount;

      // Highlight winning combination
      highlightWinningCombination(combination);
    }
  }

  if (totalPrizeAmount > 0) {
    balance += totalPrizeAmount;
    flipNumber(totalPrizeAmount);

    // Update balance display
    balanceValue.textContent = balance;
    updateBalanceLocalStorage();

    // Add entry to history
    addToHistory(`Won: +${totalPrizeAmount}`, 'green');

    // Show notification and enable spin button
    showNotification(`You won: +${totalPrizeAmount}`, 'green');
    spinButton.disabled = false;

    return 'win';
  }

  // Update balance display
  balanceValue.textContent = balance;
  updateBalanceLocalStorage();

  // Add entry to history
  addToHistory(`Lost: -${betAmount}`, 'red');

  return 'lose';
}

function calculatePrizeAmount(combination) {
  const combinationKey = getCombinationKey(combination);
  const multiplier = multipliers[combinationKey] || 1; // Используем множитель или значение по умолчанию
  return multiplier * (betAmount || 1); // Умножаем на размер ставки, учитывая случай, когда betAmount неопределен или равен нулю
}

function getCombinationKey(combination) {
  if (Array.isArray(combination)) {
    return combination.join('_');
  } else {
    return combination.toString(); // Преобразуйте в строку, чтобы использовать числовые ключи
  }
}

function addToHistory(entry, color) {
  // Update history in the DOM
  const listItem = document.createElement('li');
  listItem.textContent = entry;
  listItem.style.color = color;
  historyList.appendChild(listItem);

  // Update history in localStorage
  const history = JSON.parse(localStorage.getItem('history')) || [];
  history.push(entry);
  localStorage.setItem('history', JSON.stringify(history));
}

function getRandomImage() {
  const randomIndex = Math.round(Math.random() * (images.length - 1));
  return images[randomIndex];
}

function flipNumber(number) {
  const difference = Math.abs(parseInt(digit.innerText) - number);
  let delay = 20;
  let speed = 500 / difference;
  if (speed < 1) { speed = 1 };
  for (let i = 1; i <= difference; i++) {
    setTimeout(() => {
      const value = parseInt(digit.innerText);
      if (value < number) {
        digit.innerText = value + 1;
      } else {
        digit.innerText = value - 1;
      }
      delay = delay / speed;
    }, i * delay);
  }
}

function updateBalanceLocalStorage() {
  localStorage.setItem('balance', balance.toString());
}

function placeSecretButton() {
  // Logic for placing the secret button (not provided)
}

// Обновленная функция showNotification
function showNotification(message, color) {
  notification.textContent = message;
  notification.style.color = color;

  // Добавим класс "show" для отображения уведомления
  notification.classList.add("show");

  // Установим таймер для удаления класса "show" через 2 секунды
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

function highlightWinningCombination(combination) {
  clearWinningHighlights();
  for (const index of combination) {
    slotImgs[index].classList.add("winning");
  }
}

function clearWinningHighlights() {
  for (const img of slotImgs) {
    img.classList.remove("winning");
  }
}

function spinHandler() {
  // Проверим, достаточно ли средств для ставки
  if (balance < betAmount) {
    showNotification("Not enough balance to play.", 'red');
    return;
  }

  // Вычтем средства перед спином
  balance -= betAmount;
  // Обновим отображение баланса
  balanceValue.textContent = balance;
  updateBalanceLocalStorage();

  spinButton.disabled = true;
  clearWinningHighlights(); // Очистим подсветку перед началом нового спина

  const spinInterval = setInterval(() => {
    for (let i = 0; i < slotImgs.length; i++) {
      const img = slotImgs[i];
      img.classList.remove("hidden");
      img.src = getRandomImage();
    }
  }, 100);

  setTimeout(() => {
    clearInterval(spinInterval);

    const uniqueImgs = new Set(slotImgs.map((img) => img.src));
    const outcome = calculateOutcome(uniqueImgs);

    if (outcome === 'lose') {
      // Обработаем сценарий проигрыша
      spinButton.disabled = false; // Включим кнопку спина, если результат не выигрышный
    }

  }, 3000);
}


// Add click handler for the Spin button
spinButton.addEventListener("click", spinHandler);

// Add change handler for the bet input
betInput.addEventListener("change", (event) => {
  betAmount = parseInt(event.target.value);
});

// Add click handler for the secret deposit button
secretDepositButton.addEventListener('click', () => {
  const depositAmount = parseInt(prompt('Enter deposit amount:'));
  if (!isNaN(depositAmount) && depositAmount > 0) {
    balance += depositAmount;
    balanceValue.textContent = balance;
    updateBalanceLocalStorage();

    // Add entry to history
    addToHistory(`Deposited: +${depositAmount}`, 'green');
  } else {
    alert('Please enter a valid deposit amount.');
  }
});

// Move the secret button when the window is resized
window.addEventListener('resize', placeSecretButton);

// Initialization
placeSecretButton();

// Add keypress handler for Enter key
document.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    spinHandler();
  }
});

