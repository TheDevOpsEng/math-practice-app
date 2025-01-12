let score = 0;
let totalQuestions = 10; // Questions per level
let questionCount = 1;
let level = 1; // Start from basic level
let currentQuestion = {};
let userInput = "";
let selectedOperators = ['+', '-']; // Start with basic operators

// Save progress
function saveProgress() {
  const progressData = {
    score,
    level,
    questionCount,
  };
  localStorage.setItem('mathAppProgress', JSON.stringify(progressData));
}

// Load progress
function loadProgress() {
  const savedProgress = localStorage.getItem('mathAppProgress');
  if (savedProgress) {
    const progressData = JSON.parse(savedProgress);
    score = progressData.score;
    level = progressData.level;
    questionCount = progressData.questionCount;
    updateScore();
  } else {
    resetProgress();
  }
}

// Reset progress
function resetProgress() {
  score = 0;
  level = 1;
  questionCount = 1;
  selectedOperators = ['+', '-']; // Reset to basic operators
  localStorage.removeItem('mathAppProgress');
  alert('Progress has been reset!');
  updateScore();
  generateQuestion();
}

// Apply settings
function applySettings() {
  selectedOperators = [];
  if (document.getElementById('addition').checked) selectedOperators.push('+');
  if (document.getElementById('subtraction').checked) selectedOperators.push('-');
  if (document.getElementById('multiplication').checked) selectedOperators.push('x');
  if (document.getElementById('division').checked) selectedOperators.push('÷');

  alert('Settings applied!');
  generateQuestion();
}

// Generate a question based on level
function generateQuestion() {
  let num1, num2, operator, answer;

  switch (level) {
    case 1: // Basic Level: Addition and Subtraction
      num1 = getRandomInt(1, 10);
      num2 = getRandomInt(1, 10);
      operator = getRandomOperator(['+', '-']);
      break;

    case 2: // Intermediate Level: Add Multiplication
      num1 = getRandomInt(5, 20);
      num2 = getRandomInt(5, 20);
      operator = getRandomOperator(['+', '-', 'x']);
      break;

    case 3: // Advanced Level: Include Division
      num1 = getRandomInt(10, 50);
      num2 = getRandomInt(2, 10); // Smaller divisors for division
      operator = getRandomOperator(['+', '-', 'x', '÷']);
      break;
  }

  if (operator === '÷') {
    num1 = num2 * getRandomInt(1, 10); // Ensure num1 is divisible by num2
  }

  answer = calculateAnswer(num1, num2, operator);
  currentQuestion = { num1, num2, operator, answer };
  displayQuestion();
}

// Display the question
function displayQuestion() {
  document.getElementById('question').textContent = `${currentQuestion.num1} ${currentQuestion.operator} ${currentQuestion.num2}`;
  userInput = "";
  updateDisplay();
}

// Calculate the answer
function calculateAnswer(num1, num2, operator) {
  switch (operator) {
    case '+': return num1 + num2;
    case '-': return num1 - num2;
    case 'x': return num1 * num2;
    case '÷': return Math.floor(num1 / num2);
  }
}

// Check the user's answer
function checkAnswer() {
  const emoji = document.getElementById('emoji');
  const resultMessage = document.getElementById('user-input');
  const audio = new Audio();

  if (parseInt(userInput) === currentQuestion.answer) {
    score++;
    resultMessage.textContent = 'Correct!';
    resultMessage.style.color = 'green';
    emoji.textContent = '😄';
    audio.src = './sounds/right.wav';
  } else {
    resultMessage.textContent = 'Wrong!';
    resultMessage.style.color = 'red';
    emoji.textContent = '😢';
    audio.src = './sounds/wrong.wav';
  }

  audio.play().catch(error => console.error("Audio playback error:", error));
  saveProgress();
  setTimeout(nextQuestion, 2000);
}

// Move to the next question
function nextQuestion() {
  if (questionCount >= totalQuestions) {
    checkLevelProgress();
  } else {
    questionCount++;
    generateQuestion();
    updateScore();
    document.getElementById('emoji').textContent = '🙂';
  }
}

// Check if user can level up
function checkLevelProgress() {
  const passRate = (score / totalQuestions) * 100;

  if (passRate >= 70) { // User needs 70% or more to advance
    level++;
    alert(`Great job! You've advanced to Level ${level}!`);
    questionCount = 1; // Reset question count for the new level
    updateSelectedOperators();
  } else {
    alert('You need more practice to advance to the next level.');
    questionCount = 1; // Reset question count for retry
  }

  generateQuestion();
  updateScore();
}

// Update operators based on level
function updateSelectedOperators() {
  switch (level) {
    case 2:
      selectedOperators = ['+', '-', 'x'];
      break;
    case 3:
      selectedOperators = ['+', '-', 'x', '÷'];
      break;
  }
}

// Update score display
function updateScore() {
  document.getElementById('progress').textContent = `Level ${level} | Question ${questionCount} of ${totalQuestions}`;
  document.getElementById('score').textContent = `Score: ${score}`;
}

// Utility functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOperator(operators) {
  return operators[Math.floor(Math.random() * operators.length)];
}

// Update user input display
function updateDisplay() {
  const display = document.getElementById('user-input');
  display.textContent = userInput || "_";
}

// Handle keypad clicks
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', function () {
    const value = this.textContent;

    if (value === '⌫') {
      userInput = userInput.slice(0, -1);
    } else {
      userInput += value;
    }

    updateDisplay();
  });
});

// Event listener for Submit button
document.getElementById('submit-answer').addEventListener('click', checkAnswer);

// Initialize the game
loadProgress();
generateQuestion();
