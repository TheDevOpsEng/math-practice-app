let score = 0;
let totalQuestions = 10; // Number of questions per level
let questionCount = 1;
let level = 1; // Start from level 1
let currentQuestion = {};
let userInput = "";
let selectedOperators = ['+', '-', 'x', '÷']; // Default: All operators enabled

// Save progress to Local Storage
function saveProgress() {
  const progressData = {
    score: score,
    level: level,
    questionCount: questionCount,
  };
  localStorage.setItem('mathAppProgress', JSON.stringify(progressData));
}

// Load progress from Local Storage
function loadProgress() {
  const savedProgress = localStorage.getItem('mathAppProgress');
  if (savedProgress) {
    const progressData = JSON.parse(savedProgress);
    score = progressData.score;
    level = progressData.level;
    questionCount = progressData.questionCount;
    updateScore();
  } else {
    resetProgress(); // Start fresh if no saved progress
  }
}

// Reset progress
function resetProgress() {
  score = 0;
  level = 1;
  questionCount = 1;
  localStorage.removeItem('mathAppProgress'); // Clear stored progress
  alert('Progress has been reset!');
  updateScore();
  generateQuestion();
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
  const display = document.getElementById('user-input');
  display.textContent = userInput || "_";
}

// Check the user's answer
function checkAnswer() {
  const emoji = document.getElementById('emoji');
  const resultMessage = document.getElementById('user-input');
  const audio = new Audio(); // Create a new Audio object

  if (parseInt(userInput) === currentQuestion.answer) {
    score++;
    resultMessage.textContent = 'Correct!';
    resultMessage.style.color = 'green';
    emoji.textContent = '😄'; // Happy emoji
    audio.src = './sounds/right.wav'; // Path to correct answer sound
  } else {
    resultMessage.textContent = 'Wrong!';
    resultMessage.style.color = 'red';
    emoji.textContent = '😢'; // Sad emoji
    audio.src = './sounds/wrong.wav'; // Path to wrong answer sound
  }

  audio.play().catch(error => console.error("Audio playback error:", error)); // Play the sound and handle errors

  saveProgress(); // Save progress after each answer
  setTimeout(() => {
    nextQuestion();
  }, 2000);
}

// Move to the next question
function nextQuestion() {
  if (questionCount >= totalQuestions) {
    levelUp();
  } else {
    questionCount++;
    generateQuestion();
    updateScore();
    document.getElementById('emoji').textContent = '🙂'; // Reset to neutral face
  }
}

// Level up
function levelUp() {
  level++;
  questionCount = 1; // Reset question count
  alert(`Great job! You've advanced to Level ${level}!`);
  generateQuestion();
  updateScore();
}

// Update the score display
function updateScore() {
  document.getElementById('progress').textContent = `Level ${level} | Question ${questionCount} of ${totalQuestions}`;
  document.getElementById('score').textContent = `Score: ${score}`;
}

// Toggle the settings panel
function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.classList.toggle('hidden');
}

// Apply settings (update selected operators)
function applySettings() {
  selectedOperators = [];
  if (document.getElementById('addition').checked) selectedOperators.push('+');
  if (document.getElementById('subtraction').checked) selectedOperators.push('-');
  if (document.getElementById('multiplication').checked) selectedOperators.push('x');
  if (document.getElementById('division').checked) selectedOperators.push('÷');

  alert('Settings updated!');
  toggleSettings();
}

// Handle keypad button clicks
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

// Add event listener for the Submit Answer button
document.getElementById('submit-answer').addEventListener('click', checkAnswer);

// Start the game
loadProgress(); // Load progress on app start
generateQuestion();
