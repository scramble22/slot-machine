const images = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'];
let balance = parseInt(localStorage.getItem('balance')) || 1000; // Загрузка баланса из localStorage
let betAmount = parseInt(document.querySelector('.bet-input').value);
const slotContainer = document.querySelector(".slots");
const slotImgs = Array.from(slotContainer.querySelectorAll("img"));
const uniqueImgs = new Set(slotImgs.map((img) => img.src));
const spinButton = document.querySelector(".spin-button");
const balanceValue = document.querySelector(".balance-value");
const prizeModal = document.querySelector(".prize");
const prizeImg = document.querySelector(".prize img");
const prizeValue = document.querySelector(".prize h2");
const betInput = document.querySelector(".bet-input");
const depositButton = document.querySelector(".deposit-button");
const depositInput = document.querySelector(".deposit-input");
const digit = document.querySelector('.digit');

// Update balance display
balanceValue.textContent = balance;

//история
const historyButton = document.querySelector('.history-button');
const historyModal = document.querySelector('.history-modal');
const closeHistoryBtn = document.querySelector('.close-history');
const historyList = document.querySelector('.history-list');

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
const secretDepositButton = document.querySelector('.secret-deposit-button');

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

function getRandomImage() {
  const randomIndex = Math.round(Math.random() * (images.length - 1));
  return images[randomIndex];
}

// красивые циферки
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

function spin() {
  if (balance < betAmount) {
    alert("You don't have enough balance to play.");
    return;
  }

  spinButton.disabled = true;

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
    if (uniqueImgs.size === 1) {// Обновление статистики в localStorage
        
      profileWins.textContent = parseInt(profileWins.textContent) + 1;
      setLocalStorageItem('wins', profileWins.textContent);
      addToHistory(`Won: +${prizeAmount}`, 'green');

      const prizeAmount = Math.round(Math.random() * ((betAmount * 50) - betAmount)) + betAmount;
      balance += prizeAmount;
      if (digit.innerText < 100) {
        prizeValue.textContent = `You won!`;
      } else if (digit.innerText >= 100 && prizeAmount < 300) {
        prizeValue.textContent = `You won a lot of money!`;
      } else if (digit.innerText >= 300 && prizeAmount < 500) {
        prizeValue.textContent = `Big win!`;
      } else if (digit.innerText >= 500) {
        prizeValue.textContent = `Mega big win!!!`;
      }
      setInterval(() => {
        if (digit.innerText < 100) {
          prizeValue.textContent = `You won!`;
        } else if (digit.innerText >= 100 && digit.innerText < 300) {
          prizeValue.textContent = `You won, MORE pls!`;
        } else if (digit.innerText >= 300 && digit.innerText < 500) {
          prizeValue.textContent = `BIG WIN`;
        } else if (digit.innerText >= 500 && digit.innerText < 700) {
          prizeValue.textContent = `MEGA BIG WIN!!!`;
        } else if (digit.innerText >= 700) {
          prizeValue.textContent = `SUPER MEGA BIG WIN!!!`;
        }
      }, 200);
      flipNumber(prizeAmount)
      prizeImg.src = uniqueImgs.values().next().value;
      prizeModal.style.display = "block";
      // Сохранение баланса в localStorage при изменении
      balanceValue.textContent = balance;
      updateBalanceLocalStorage();

      // Hide slot images
      setTimeout(() => {
        for (let i = 0; i < slotImgs.length; i++) {
          slotImgs[i].classList.add("hidden");
        }
      }, 1000);
    } else if (uniqueImgs.size === 2) {
      // Two identical images, player wins half the bet back
      // Обновление статистики в localStorage
      profileWins.textContent = parseInt(profileWins.textContent) + 1;
      setLocalStorageItem('wins', profileWins.textContent);
      
      balance += Math.ceil(betAmount / 2);
      addToHistory(`Won: +${Math.ceil(betAmount / 2)}`, 'green');
      // Сохранение баланса в localStorage при изменении
      balanceValue.textContent = balance;
      updateBalanceLocalStorage();
    } else {
      addToHistory(`Lost: -${betAmount}`, 'red');
      profileLosses.textContent = parseInt(profileLosses.textContent) + 1;
      setLocalStorageItem('losses', profileLosses.textContent);
      balance -= betAmount;
      // Сохранение баланса в localStorage при изменении
      balanceValue.textContent = balance;
      updateBalanceLocalStorage();
    }

    spinButton.disabled = false;
  }, 3000);

}

function addToHistory(entry, color) {
  // Обновление истории в DOM
  const listItem = document.createElement('li');
  listItem.textContent = entry;
  listItem.style.color = color;
  historyList.appendChild(listItem);

  // Обновление истории в localStorage
  const history = JSON.parse(localStorage.getItem('history')) || [];
  history.push(entry);
  localStorage.setItem('history', JSON.stringify(history));
}

// Функция для установки значения в localStorage
function setLocalStorageItem(name, value) {
  localStorage.setItem(name, value);
}

// Обновление значения баланса в localStorage
function updateBalanceLocalStorage() {
  setLocalStorageItem('balance', balance.toString());
}

prizeModal.addEventListener("click", () => {
  prizeModal.style.display = "none";
  digit.innerText = `0`;
  clearInterval()
});

spinButton.addEventListener("click", spin);

betInput.addEventListener("change", (event) => {
  betAmount = parseInt(event.target.value);
});

//deposit



// nav

const userPhoto = document.querySelector('.user-photo');
const userOptions = document.querySelector('.user-options');

userPhoto.addEventListener('mouseenter', (event) => {
  userOptions.style.opacity = '1';
});

userPhoto.addEventListener('mouseleave', (event) => {
  userOptions.style.opacity = '0';
});

