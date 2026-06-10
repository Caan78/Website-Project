// ===== STATE =====
let allData = [];         // all topics from vocabulary.json
let currentTopic = null;  // the selected topic object
let currentMode = null;   // 'flashcards' | 'sentences' | 'freewriting'

// Flashcard state
let fcCards = [];
let fcIndex = 0;
let fcCorrect = 0;

// Sentence state
let sentItems = [];
let sentIndex = 0;
let sentAnswer = [];    // words the user has placed
let sentPool = [];      // words still in the pool

// Free writing state
let fwItems = [];
let fwIndex = 0;


// ===== INIT =====
fetch('data/vocabulary.json')
  .then(res => res.json())
  .then(data => {
    allData = data.topics;
    renderTopics();
  })
  .catch(() => {
    document.getElementById('topic-list').innerHTML =
      '<p style="color:#ef4444">Fehler beim Laden der Daten.</p>';
  });


// ===== SCREEN NAVIGATION =====
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  window.scrollTo(0, 0);
}


// ===== HOME: RENDER TOPICS =====
function renderTopics() {
  const container = document.getElementById('topic-list');
  container.innerHTML = '';

  allData.forEach(topic => {
    const btn = document.createElement('button');
    btn.className = 'topic-card';
    btn.innerHTML = `
      <span class="topic-icon">${topic.icon}</span>
      <span>
        <div class="topic-name">${topic.name}</div>
        <div class="topic-count">${topic.flashcards.length} Vokabeln · ${topic.sentences.length} Sätze</div>
      </span>
    `;
    btn.onclick = () => selectTopic(topic);
    container.appendChild(btn);
  });
}


// ===== TOPIC SELECTION =====
function selectTopic(topic) {
  currentTopic = topic;
  document.getElementById('mode-topic-title').textContent = topic.icon + ' ' + topic.name;
  showScreen('mode');
}


// ===== MODE START =====
function startMode(mode) {
  currentMode = mode;
  if (mode === 'flashcards') startFlashcards();
  else if (mode === 'sentences') startSentences();
  else if (mode === 'freewriting') startFreewriting();
}


// ===========================
// MODE 1: FLASHCARDS
// ===========================
function startFlashcards() {
  fcCards = shuffle([...currentTopic.flashcards]);
  fcIndex = 0;
  fcCorrect = 0;
  showScreen('flashcards');
  renderCard();
}

function renderCard() {
  const card = fcCards[fcIndex];
  document.getElementById('fc-german').textContent = card.de;
  document.getElementById('fc-english').textContent = card.en;
  document.getElementById('fc-card').classList.remove('flipped');
  document.getElementById('fc-progress').textContent =
    (fcIndex + 1) + ' / ' + fcCards.length;
}

function flipCard() {
  document.getElementById('fc-card').classList.toggle('flipped');
}

function nextCard(correct) {
  if (correct === 1) fcCorrect++;
  fcIndex++;
  if (fcIndex >= fcCards.length) {
    showResults('flashcards', fcCorrect, fcCards.length);
  } else {
    renderCard();
  }
}


// ===========================
// MODE 2: SENTENCES
// ===========================
function startSentences() {
  sentItems = shuffle([...currentTopic.sentences]);
  sentIndex = 0;
  showScreen('sentences');
  renderSentence();
}

function renderSentence() {
  const item = sentItems[sentIndex];
  sentAnswer = [];
  sentPool = shuffle([...item.words]);

  document.getElementById('sent-progress').textContent =
    (sentIndex + 1) + ' / ' + sentItems.length;
  document.getElementById('sent-feedback').className = 'feedback hidden';
  document.getElementById('sent-feedback').textContent = '';
  document.getElementById('sent-check-btn').classList.remove('hidden');
  document.getElementById('sent-next-btn').classList.add('hidden');
  document.getElementById('sent-reset-btn').classList.remove('hidden');

  renderWordAreas();
}

function renderWordAreas() {
  const answerArea = document.getElementById('sent-answer-area');
  const poolArea = document.getElementById('sent-word-pool');

  answerArea.innerHTML = '';
  answerArea.className = 'word-area answer-area';
  poolArea.innerHTML = '';

  sentAnswer.forEach((word, i) => {
    const chip = document.createElement('button');
    chip.className = 'word-chip in-answer';
    chip.textContent = word;
    chip.onclick = () => moveToPool(i);
    answerArea.appendChild(chip);
  });

  sentPool.forEach((word, i) => {
    const chip = document.createElement('button');
    chip.className = 'word-chip';
    chip.textContent = word;
    chip.onclick = () => moveToAnswer(i);
    poolArea.appendChild(chip);
  });
}

function moveToAnswer(poolIndex) {
  sentAnswer.push(sentPool[poolIndex]);
  sentPool.splice(poolIndex, 1);
  renderWordAreas();
}

function moveToPool(answerIndex) {
  sentPool.push(sentAnswer[answerIndex]);
  sentAnswer.splice(answerIndex, 1);
  renderWordAreas();
}

function resetSentence() {
  const item = sentItems[sentIndex];
  sentAnswer = [];
  sentPool = shuffle([...item.words]);
  document.getElementById('sent-feedback').className = 'feedback hidden';
  document.getElementById('sent-check-btn').classList.remove('hidden');
  document.getElementById('sent-next-btn').classList.add('hidden');
  renderWordAreas();
}

function checkSentence() {
  if (sentAnswer.length === 0) return;

  const item = sentItems[sentIndex];
  const userSentence = sentAnswer.join(' ');
  // Strip trailing punctuation from solution for comparison
  const solutionClean = item.solution.replace(/[.!?]$/, '').toLowerCase();
  const userClean = userSentence.toLowerCase();

  const feedback = document.getElementById('sent-feedback');
  const answerArea = document.getElementById('sent-answer-area');

  if (userClean === solutionClean) {
    feedback.textContent = '✓ Richtig!';
    feedback.className = 'feedback success';
    answerArea.classList.add('correct');
  } else {
    feedback.textContent = '✗ Nicht ganz. Richtig: ' + item.solution;
    feedback.className = 'feedback error';
    answerArea.classList.add('incorrect');
  }

  document.getElementById('sent-check-btn').classList.add('hidden');
  document.getElementById('sent-next-btn').classList.remove('hidden');
  document.getElementById('sent-reset-btn').classList.add('hidden');
}

function nextSentence() {
  sentIndex++;
  if (sentIndex >= sentItems.length) {
    showResults('sentences', null, sentItems.length);
  } else {
    renderSentence();
  }
}


// ===========================
// MODE 3: FREE WRITING
// ===========================
function startFreewriting() {
  fwItems = shuffle([...currentTopic.freewriting]);
  fwIndex = 0;
  showScreen('freewriting');
  renderPrompt();
}

function renderPrompt() {
  const item = fwItems[fwIndex];
  document.getElementById('fw-prompt').textContent = item.prompt;
  document.getElementById('fw-input').value = '';
  document.getElementById('fw-example').classList.add('hidden');
  document.getElementById('fw-show-btn').classList.remove('hidden');
  document.getElementById('fw-progress').textContent =
    (fwIndex + 1) + ' / ' + fwItems.length;
}

function showExample() {
  const item = fwItems[fwIndex];
  document.getElementById('fw-example-text').textContent = item.example;
  document.getElementById('fw-example').classList.remove('hidden');
  document.getElementById('fw-show-btn').classList.add('hidden');
}

function nextPrompt() {
  fwIndex++;
  if (fwIndex >= fwItems.length) {
    showResults('freewriting', null, fwItems.length);
  } else {
    renderPrompt();
  }
}


// ===========================
// RESULTS SCREEN
// ===========================
function showResults(mode, correct, total) {
  let message = '';
  if (mode === 'flashcards') {
    message = `Du hast ${correct} von ${total} Vokabeln gewusst.`;
    if (correct === total) message += ' Perfekt! 🌟';
    else if (correct >= total * 0.7) message += ' Weiter so!';
    else message += ' Üb die schwierigen Karten nochmal.';
  } else if (mode === 'sentences') {
    message = `Du hast alle ${total} Sätze bearbeitet. Gut gemacht!`;
  } else {
    message = `Du hast alle ${total} Schreibübungen abgeschlossen. Toll!`;
  }

  document.getElementById('results-message').textContent = message;
  showScreen('results');
}


// ===========================
// UTILITY
// ===========================
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
