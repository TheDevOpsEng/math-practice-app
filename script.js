let score = 0;
let totalQuestions = 10;
let questionCount = 1;
let level = 1;
let currentQuestion = {};
let userInput = "";
let selectedOperators = ['+', '-', 'x', '÷'];
let soundEnabled = true;

// Save progress to Local Storage
function saveProgress() {
  const progressData = { score, level, questionCount };
  localStorage.setItem('mathAppProgress', JSON.stringify(progressData));
}

// Load progress from Local Storage
function loadProgress() {
  const savedProgress = localStorage.getItem('mathAppProgress');
  if (savedProgress) {
    const { score: savedScore, level: savedLevel, questionCount: savedQuestionCount } = JSON.parse(savedProgress);
    score = savedScore;
    level = savedLevel;
    questionCount = savedQuestionCount;
    updateScore();
  }
}

// Reset progress function
function resetProgress() {
  if (confirm('Are you sure you want to reset your progress?')) {
    localStorage.removeItem('mathAppProgress');
    alert('Progress has been reset!');
    location.reload();
  }
}

// Generate a random question
function generateQuestion() {
  const operator = selectedOperators[Math.floor(Math.random() * selectedOperators.length)];
  let num1, num2, answer;

  if (operator === '÷') {
    num2 = Math.floor(Math.random() * 9) + 1;
    answer = Math.floor(Math.random() * 9) + 1;
    num1 = num2 * answer;
  } else {
    num1 = Math.floor(Math.random() * 10 * level) + 1;
    num2 = Math.floor(Math.random() * 10 * level) + 1;

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
  document.getElementById('user-input').textContent = userInput || "_";
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
    if (soundEnabled) audio.src = './sounds/right.wav';
  } else {
    resultMessage.textContent = 'Wrong!';
    resultMessage.style.color = 'red';
    emoji.textContent = '😢';
    if (soundEnabled) audio.src = './sounds/wrong.wav';
  }

  if (soundEnabled) audio.play().catch(error => console.error("Audio playback error:", error));
  saveProgress();
  setTimeout(() => nextQuestion(), 2000);
}

// Move to the next question
function nextQuestion() {
  if (questionCount >= totalQuestions) {
    levelUp();
  } else {
    questionCount++;
    generateQuestion();
    updateScore();
    document.getElementById('emoji').textContent = '🙂';
  }
}

// Level up
function levelUp() {
  level++;
  questionCount = 1;
  alert(`Great job! You've advanced to Level ${level}!`);
  generateQuestion();
  updateScore();
}

// Update the score display
function updateScore() {
  document.getElementById('progress').textContent = `Level ${level} | Question ${questionCount} of ${totalQuestions}`;
  document.getElementById('score').textContent = `Score: ${score}`;
}

// Show specific tab by toggling the 'hidden' class
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden')); // Hide all tabs
  document.getElementById(tabId).classList.remove('hidden'); // Show the selected tab
}

// Apply settings
function applySettings() {
  selectedOperators = [];
  if (document.getElementById('addition').checked) selectedOperators.push('+');
  if (document.getElementById('subtraction').checked) selectedOperators.push('-');
  if (document.getElementById('multiplication').checked) selectedOperators.push('x');
  if (document.getElementById('division').checked) selectedOperators.push('÷');
  soundEnabled = document.getElementById('sound').checked;

  alert('Settings updated!');
}

// Handle keypad button clicks
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', () => {
    const value = key.textContent;
    if (value === '⌫') {
      userInput = userInput.slice(0, -1);
    } else {
      userInput += value;
    }
    updateDisplay();
  });
});

// Add event listener for the Submit Answer button
document.getElementById('submit-answer').addEventListener('click', checkAnswer);

// Start the game
loadProgress();
generateQuestion();
