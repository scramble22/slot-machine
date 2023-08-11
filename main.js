const images = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg'];
let balance = 1000;
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
    if (uniqueImgs.size === 1) {
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
      balanceValue.textContent = balance;

      // Hide slot images
      setTimeout(() => {
        for (let i = 0; i < slotImgs.length; i++) {
          slotImgs[i].classList.add("hidden");
        }
      }, 1000);
    } else if (uniqueImgs.size === 2) {
      // Two identical images, player wins half the bet back
      balance += Math.ceil(betAmount / 2);
      balanceValue.textContent = balance;
    } else {
      balance -= betAmount;
      balanceValue.textContent = balance;
    }

    spinButton.disabled = false;
  }, 3000);
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

depositButton.addEventListener("click", (event) => {
  event.preventDefault();
  const depositAmount = parseInt(depositInput.value);
  if (isNaN(depositAmount) || depositAmount <= 0) {
    alert("Please enter a valid deposit amount.");
    return;
  }
  balance += depositAmount;
  balanceValue.textContent = balance;
  depositInput.value = "0";
});

// nav

const userPhoto = document.querySelector('.user-photo');
const userOptions = document.querySelector('.user-options');

userPhoto.addEventListener('mouseenter', (event) => {
  userOptions.style.opacity = '1';
});

userPhoto.addEventListener('mouseleave', (event) => {
  userOptions.style.opacity = '0';
});

