const images = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'];
let balance = parseInt(localStorage.getItem('balance')) || 1000;

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
  [0, 1, 2, 3],
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [6, 7, 8, 9],
  [10, 11, 12],
  [11, 12, 13],
  [12, 13, 14],
  [0, 1, 2],
  [1, 2, 3],
  [2, 3, 4],
  [5, 6, 7],
  [6, 7, 8],
  [7, 8, 9],
  [10, 11, 13],
  [11, 12, 13, 14],
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
  '0_1_2_3': 2,
  '1_2_3_4': 2,
  '5_6_7_8': 2,
  '6_7_8_9': 2,
  '10_11_12': 2,
  '11_12_13': 2,
  '12_13_14': 2,
  '0_1_2': 2,
  '1_2_3': 2,
  '2_3_4': 2,
  '5_6_7': 2,
  '6_7_8': 2,
  '7_8_9': 2,
  '10_11_13': 2,
  '11_12_13_14': 4,
  '0_5_10': 2,
  '1_6_11': 2,
  '2_7_12': 2,
  '3_8_13': 2,
  '4_9_14': 2,
  '0_6_12': 2,
  '4_8_12': 2,
  '4_5_9_10_14': 10,
  '0_1_3_4_5': 8,
  '2_6_8_10_12': 12,
};

document.getElementById('bet-input').addEventListener('input', function() {
  var maxLength = 5;
  if(this.value.length > maxLength) {
    this.value = this.value.substring(0, maxLength);
  }
});

document.getElementById('bet-input').addEventListener('input', function() {
  this.value = this.value.replace(/[^0-9]/g, '');
});

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
  const multiplier = multipliers[combinationKey] || 1;
  return multiplier * (betAmount || 1);
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

  // Limit history to the last 22 entries
  if (history.length >= 22) {
    history.shift(); // Remove the first entry
  }

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
  if (betAmount === 0) {
    showNotification("ты чё ишак? как ты 0 поставишь то", 'red');
    return;
  }

  if (isNaN(betAmount)) {
    showNotification("ты чё ишак?", 'red');
    return;
  }

  // Сохраните текущую ставку в localStorage
  localStorage.setItem('lastBetAmount', betAmount);

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

const themeSelect = document.getElementById("theme-select");
themeSelect.addEventListener("change", changeTheme);

function changeTheme() {
  const selectedTheme = themeSelect.value;
  updateSlotImages(selectedTheme);
  // Сохраните текущую тему в localStorage
  localStorage.setItem('selectedTheme', selectedTheme);
}

function updateSlotImages(theme) {
  // Здесь вам нужно определить новые изображения для выбранной темы
  // Например, создайте объект с изображениями для каждой темы
  const themes = {
    theme1: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'],
    theme2: ['image1_2.jpg', 'image2_2.jpg', 'image3_2.jpg', 'image4_2.jpg', 'image5_2.jpg'],
    // Добавьте дополнительные темы и их изображения по мере необходимости
  };

  // Обновите массив изображений в соответствии с выбранной темой
  images.length = 0;
  images.push(...themes[theme]);

  // Обновите изображения на странице, если они уже отображаются
  for (let i = 0; i < slotImgs.length; i++) {
    slotImgs[i].src = getRandomImage();
  }
}

// Восстановление темы из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    themeSelect.value = savedTheme;
    updateSlotImages(savedTheme);
  }
});

// Восстановление последней ставки из localStorage при загрузке страницы
/*document.addEventListener('DOMContentLoaded', () => {
  const savedLastBetAmount = localStorage.getItem('lastBetAmount');
  if (savedLastBetAmount) {
    betInput.value = savedLastBetAmount;
    betAmount = parseInt(savedLastBetAmount);
  }
});*/

//история

const historyButton = document.querySelector('.history-button');
const historyModal = document.querySelector('.history-modal');
const closeHistoryBtn = document.querySelector('.close-history');

historyButton.addEventListener('click', () => {
  historyList.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('history')) || [];
  history.forEach((entry) => {
    const listItem = document.createElement('li');
    listItem.textContent = entry;
    historyList.appendChild(listItem);
  });
  historyModal.style.display = 'block';
});

closeHistoryBtn.addEventListener('click', () => {
  historyModal.style.display = 'none';
});

//история


//профиль
const profileLink = document.querySelector('.profile-link');
const profileModal = document.querySelector('.profile-modal');
const closeProfileBtn = document.querySelector('.close-profile');
const depositModalBtn = document.querySelector('.deposit-button');
const profileBalance = document.querySelector('.profile-balance');
const profileWins = document.querySelector('.profile-wins');
const profileLosses = document.querySelector('.profile-losses');

profileLink.addEventListener('click', (event) => {
  event.preventDefault();
  profileBalance.textContent = balance;
  profileWins.textContent = localStorage.getItem('wins') || '0';
  profileLosses.textContent = localStorage.getItem('losses') || '0';
  profileModal.style.display = 'block';
});

closeProfileBtn.addEventListener('click', () => {
  profileModal.style.display = 'none';
});

depositModalBtn.addEventListener('click', () => {
  const depositAmount = parseInt(document.querySelector('.deposit-input').value);
  if (!isNaN(depositAmount) && depositAmount > 0) {
    balance += depositAmount;
    balanceValue.textContent = balance;
    updateBalanceLocalStorage();
    profileBalance.textContent = balance;
    document.querySelector('.deposit-input').value = '';
  } else {
    alert('впиши правильна всё пж');
  }
});


//секрет

function placeSecretButton() {
  const maxX = window.innerWidth - 50;
  const maxY = window.innerHeight - 50;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  secretDepositButton.style.left = `${randomX}px`;
  secretDepositButton.style.top = `${randomY}px`;
  secretDepositButton.style.display = 'block';
}

placeSecretButton();

secretDepositButton.addEventListener('click', () => {
  const depositAmount = parseInt(prompt('Enter deposit amount:'));
  if (!isNaN(depositAmount) && depositAmount > 0) {
    balance += depositAmount;
    balanceValue.textContent = balance;
    updateBalanceLocalStorage();
    profileBalance.textContent = balance;

    // Добавление записи в историю
    addToHistory(`Deposited: +${depositAmount}`, 'green');
  } else {
    alert('Please enter a valid deposit amount.');
  }
});

// Перемещение секретной кнопки при изменении размера окна
window.addEventListener('resize', placeSecretButton);



// Добавьте следующий код, чтобы закрыть профиль, если кликнуто вне модального окна
window.addEventListener('click', (event) => {
  if (event.target === profileModal) {
    profileModal.style.display = 'none';
  }
});

//профиль