// Этап 1: Создаем массив парных чисел
let count = 8; // Количество уникальных чисел
let flippedCards = []; // Массив для хранения открытых карточек
let canFlip = true; // Флаг, разрешающий или запрещающий переворот карточек
let matchedPairs = 0; // Счетчик угаданных пар
let timer;
let timeRemaining = 60; // Время в секундах (1 минута)
let gameOver = false; // Флаг, указывающий на завершение игры



function createArr() {
  let arr = [];

  // Заполняем массив уникальными числами
  for (let i = 1; i <= count; i++) {
    arr.push(i);
  }

  return arr;
}

// Этап 2: Создаем перемешанный массив
function createShuffleArr(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Создание карточки
function createCard(value) {
  let card = document.createElement("div");
  card.classList.add("card", "col-3"); // Добавляем класс для стилизации
  card.textContent = "?"; // Устанавливаем текст на рубашке
  card.dataset.value = value; // Задаем уникальное значение карточки
  card.addEventListener("click", flippedCard); // Добавляем обработчик события на клик
  return card;
}

// Создание контейнера для карточек
function displayCards() {
  let cardsContainer = document.getElementById("cards-container");
  cardsContainer.classList.add("wrapper", "row"); // Добавляем класс для стилизации
  let shuffledArr = createShuffleArr(createArr().concat(createArr())); // Создаем парный массив уникальных чисел 

  // Создаем и добавляем карточки в контейнер
  shuffledArr.forEach((value) => {
    let card = createCard(value);
    cardsContainer.appendChild(card);
  });

  startTimer();
}

// Переворот карточки
function flippedCard() {
  if (gameOver || !canFlip || this.classList.contains('animate__flipInY')) return;

  this.textContent = this.dataset.value; // Показываем значение карточки
  this.classList.add('animate__animated', 'animate__flipInY');
  flippedCards.push(this); // Добавляем открытую карточку в массив

  // Добавляем обработчик события 'animationend'
  this.addEventListener('animationend', onAnimationEnd);

  if (flippedCards.length === 2) {
    canFlip = false;
    setTimeout(checkMatch, 1000); // Проверяем совпадение через 1 секунду
  }
}

// Обработчик события 'animationend'
function onAnimationEnd() {
  this.classList.remove('animate__animated', 'animate__flipInY'); // Удаляем классы анимации
  this.removeEventListener('animationend', onAnimationEnd); // Удаляем обработчик события
}

// Проверка совпадения карточек
function checkMatch() {
  let [card1, card2] = flippedCards;

  if (card1.dataset.value === card2.dataset.value) {
    card1.removeEventListener("click", flippedCard);
    card2.removeEventListener("click", flippedCard);
    card1.classList.add("matched", 'animate__animated', "animate__pulse"); // Добавляем класс для выделения
    card2.classList.add("matched", 'animate__animated', "animate__pulse"); // Добавляем класс для выделения
    matchedPairs++;

    if (matchedPairs === count) {
      gameOver = true; // Устанавливаем флаг, что игра завершена
      alert("You won!");
      showResetButton(); // Показать кнопку "Сыграть ещё раз"
    }
  } else {
    setTimeout(() => {
      card1.textContent = "?"; // Скрываем значение карточки
      card2.textContent = "?"; // Скрываем значение карточки
      card1.classList.remove('animate__animated', "animate__pulse"); // Удаляем классы анимации
      card2.classList.remove('animate__animated', "animate__pulse"); // Удаляем классы анимации
    }, 500);
  }

  flippedCards = [];
  canFlip = true;
}

// Функция показа кнопки "Сыграть ещё раз"
function showResetButton() {
  let resetButton = document.getElementById("reset-btn");
  resetButton.style.display = "block";
  
}

// Добавление обработчика события для кнопки "Сыграть ещё раз"
document.getElementById('reset-btn').addEventListener('click', resetGame);

// Обработчик события для кнопки "Сыграть ещё раз"
function resetGame() {
  let cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = "";

  clearInterval(timer); // Сбрасываем таймер
  timeRemaining = 60; // Сбрасываем время
  gameOver = false; // Сбрасываем флаг завершения игры

  flippedCards = [];
  canFlip = true;
  matchedPairs = 0;

  // Скрыть кнопку "Сыграть ещё раз"
  document.getElementById('reset-btn').style.display = 'none';

  // Отображение карточек на странице
  displayCards();
}

//  Функция startTimer()
function startTimer() {
  timer = setInterval(function () {
    timeRemaining--;

     // Форматирование времени в формат ММ:СС
     let minutes = Math.floor(timeRemaining / 60);
     let seconds = timeRemaining % 60;
     let formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
 
     // Вывод времени в таймер
     document.getElementById('timer').textContent = formattedTime;

    if (timeRemaining <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000); // Таймер обновляется каждую секунду (1000 миллисекунд)
}

//  Функция endGame()
function endGame() {
  gameOver = true; // Устанавливаем флаг, что игра завершена
  alert("Game over! Time is up.");
  showResetButton();
}
