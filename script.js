let score = 0;
let totalQuestions = 355;
let questionCount = 1;
let currentQuestion = {};
let userInput = "";
let selectedOperators = ['+', '-', 'x', '÷']; // Default: All operators enabled

// Save progress to localStorage
function saveProgress() {
  const progress = {
    score,
    questionCount,
    selectedOperators,
  };
  localStorage.setItem('mathAppProgress', JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
  const savedProgress = localStorage.getItem('mathAppProgress');
  if (savedProgress) {
    const { score: savedScore, questionCount: savedQuestionCount, selectedOperators: savedOperators } = JSON.parse(savedProgress);
    score = savedScore;
    questionCount = savedQuestionCount;
    selectedOperators = savedOperators;

    updateScore();
    generateQuestion();
  } else {
    generateQuestion();
  }
}

// Apply settings and save them to localStorage
function applySettings() {
  selectedOperators = [];
  if (document.getElementById('addition').checked) selectedOperators.push('+');
  if (document.getElementById('subtraction').checked) selectedOperators.push('-');
  if (document.getElementById('multiplication').checked) selectedOperators.push('x');
  if (document.getElementById('division').checked) selectedOperators.push('÷');

  saveProgress(); // Save updated settings
  alert('Settings applied!');
  toggleSettings();
}

// Generate a random question
function generateQuestion() {
  if (selectedOperators.length === 0) {
    alert('Please select at least one operation in the settings!');
    return;
  }

  const operator = selectedOperators[Math.floor(Math.random() * selectedOperators.length)];
  let num1, num2, answer;

  if (operator === '÷') {
    num2 = Math.floor(Math.random() * 9) + 1;
    answer = Math.floor(Math.random() * 9) + 1;
    num1 = num2 * answer;
  } else {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;

    switch (operator) {
      case '+': answer = num1 + num2; break;
      case '-': answer = num1 - num2; break;
      case 'x': answer = num1 * num2; break;
    }
  }

  currentQuestion = { num1, num2, operator, answer };
  document.getElementById('question').textContent = `${num1} ${operator} ${num2}`;
  userInput = "";
  updateDisplay();
}

// Update the user input display
function updateDisplay() {
  const display = document.getElementById('user-input');
  display.textContent = userInput || "_";
}

// Check if the user's answer is correct
function checkAnswer() {
  if (parseInt(userInput) === currentQuestion.answer) {
    score++;
    document.getElementById('user-input').textContent = 'Correct!';
    document.getElementById('user-input').style.color = 'green';
    setTimeout(nextQuestion, 1000);
  } else {
    document.getElementById('user-input').textContent = 'Wrong!';
    document.getElementById('user-input').style.color = 'red';
  }
}

// Move to the next question
function nextQuestion() {
  questionCount++;
  saveProgress(); // Save progress after moving to the next question
  generateQuestion();
  updateScore();
}

// Update the score display
function updateScore() {
  document.getElementById('progress').textContent = `${questionCount} of ${totalQuestions}`;
  document.getElementById('score').textContent = `Score: ${score}/${questionCount}`;
}

// Handle keypad button clicks
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', function () {
    const value = this.textContent;

    if (value === '⌫') { // Handle delete key
      userInput = userInput.slice(0, -1); // Remove last character
    } else {
      userInput += value; // Append the key value
    }

    updateDisplay();
  });
});

// Add event listener for the Submit Answer button
document.getElementById('submit-answer').addEventListener('click', checkAnswer);

// Reset progress by clearing localStorage and reloading the page
function resetProgress() {
  localStorage.removeItem('mathAppProgress');
  location.reload();
}

// Toggle Settings Panel
function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.classList.toggle('hidden');
}

// Load progress on page load
window.onload = loadProgress;
