let score = 0;
let totalQuestions = 10;
let questionCount = 1;
let level = 1; // Default starting level
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
  selectedOperators = ['+', '-'];
  localStorage.removeItem('mathAppProgress');
  alert('Progress has been reset!');
  updateScore();
  generateQuestion();
}

// Apply settings
function applySettings() {
  const levelSelect = document.getElementById('level-select');
  level = parseInt(levelSelect.value);

  selectedOperators = [];
  if (document.getElementById('addition').checked) selectedOperators.push('+');
  if (document.getElementById('subtraction').checked) selectedOperators.push('-');
  if (document.getElementById('multiplication').checked) selectedOperators.push('x');
  if (document.getElementById('division').checked) selectedOperators.push('÷');

  alert(`Settings applied! Starting from Level ${level}.`);
  generateQuestion();
}

// Generate question based on the selected level
function generateQuestion() {
  let num1, num2, operator, answer;

  switch (level) {
    case 1: // Basic Level
      num1 = getRandomInt(1, 10);
      num2 = getRandomInt(1, 10);
      operator = getRandomOperator(['+', '-']);
      break;

    case 2: // Intermediate Level
      num1 = getRandomInt(10, 20);
      num2 = getRandomInt(10, 20);
      operator = getRandomOperator(['+', '-', 'x']);
      break;

    case 3: // Advanced Level
      num1 = getRandomInt(20, 50);
      num2 = getRandomInt(1, 10);
      operator = getRandomOperator(['+', '-', 'x', '÷']);
      break;
  }

  if (operator === '÷') {
    num1 = num2 * getRandomInt(1, 10); // Ensure division works cleanly
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

// Utility functions
function calculateAnswer(num1, num2, operator) {
  switch (operator) {
    case '+': return num1 + num2;
    case '-': return num1 - num2;
    case 'x': return num1 * num2;
    case '÷': return Math.floor(num1 / num2);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomOperator(operators) {
  return operators[Math.floor(Math.random() * operators.length)];
}

function updateDisplay() {
  const display = document.getElementById('user-input');
  display.textContent = userInput || "_";
}

// Event listeners
document.getElementById('submit-answer').addEventListener('click', checkAnswer);

// Initialize
loadProgress();
generateQuestion();
