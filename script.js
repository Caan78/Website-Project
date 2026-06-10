// ===== VOCABULARY DATA (inline) =====
var VOCABULARY = {
  topics: [
    {
      id: "alltag", name: "Alltag", icon: "&#x1F3E0;",
      flashcards: [
        { de: "der Supermarkt", en: "supermarket" },
        { de: "einkaufen", en: "to go shopping" },
        { de: "die Rechnung", en: "bill / invoice" },
        { de: "der Termin", en: "appointment" },
        { de: "aufraumen", en: "to tidy up" },
        { de: "die Nachbarschaft", en: "neighbourhood" },
        { de: "kochen", en: "to cook" },
        { de: "der Alltag", en: "everyday life" },
        { de: "punktlich", en: "on time" },
        { de: "das Gesprach", en: "conversation" }
      ],
      sentences: [
        { words: ["I","usually","cook","dinner","at","home"], solution: "I usually cook dinner at home." },
        { words: ["She","goes","to","the","supermarket","every","week"], solution: "She goes to the supermarket every week." },
        { words: ["My","neighbour","is","very","friendly"], solution: "My neighbour is very friendly." },
        { words: ["We","have","an","appointment","at","three","o'clock"], solution: "We have an appointment at three o'clock." },
        { words: ["He","always","arrives","on","time"], solution: "He always arrives on time." }
      ],
      freewriting: [
        { prompt: "Describe your typical morning in English.", example: "I usually wake up at seven o'clock. First, I drink a cup of coffee. Then I take a shower and get dressed. I leave the house at eight." },
        { prompt: "What do you do after work? Write 2-3 sentences.", example: "After work, I usually go to the supermarket. Then I cook dinner and relax at home. Sometimes I call a friend or watch a film." },
        { prompt: "Describe your neighbourhood in English.", example: "I live in a quiet neighbourhood. There is a park nearby and a small supermarket on the corner. The people here are very friendly." }
      ]
    },
    {
      id: "reisen", name: "Reisen", icon: "&#x1F30D;",
      flashcards: [
        { de: "der Flughafen", en: "airport" },
        { de: "das Gepack", en: "luggage" },
        { de: "die Unterkunft", en: "accommodation" },
        { de: "die Abfahrt", en: "departure" },
        { de: "die Ankunft", en: "arrival" },
        { de: "buchen", en: "to book" },
        { de: "der Reisepass", en: "passport" },
        { de: "die Verspatung", en: "delay" },
        { de: "umsteigen", en: "to change (trains/planes)" },
        { de: "der Aufenthalt", en: "stay" }
      ],
      sentences: [
        { words: ["My","flight","departs","at","six","in","the","morning"], solution: "My flight departs at six in the morning." },
        { words: ["I","booked","a","hotel","near","the","city","centre"], solution: "I booked a hotel near the city centre." },
        { words: ["Please","show","me","your","passport"], solution: "Please show me your passport." },
        { words: ["The","train","has","a","delay","of","twenty","minutes"], solution: "The train has a delay of twenty minutes." },
        { words: ["We","need","to","change","trains","in","Brussels"], solution: "We need to change trains in Brussels." }
      ],
      freewriting: [
        { prompt: "Describe your last trip (or a dream trip) in English.", example: "Last summer I travelled to Portugal. I stayed in a small hotel near the beach. The weather was wonderful and the food was delicious." },
        { prompt: "What do you always pack in your suitcase? Write 2-3 sentences.", example: "I always pack my passport and some comfortable clothes. I also bring a book for the journey. Of course, I never forget my phone charger." },
        { prompt: "Describe an airport or train station in English.", example: "The airport was very busy. There were long queues at the check-in desk. I had to wait one hour before boarding." }
      ]
    },
    {
      id: "freizeit", name: "Freizeit", icon: "&#x1F3AF;",
      flashcards: [
        { de: "das Hobby", en: "hobby" },
        { de: "spazieren gehen", en: "to go for a walk" },
        { de: "das Konzert", en: "concert" },
        { de: "sich ausruhen", en: "to rest / to relax" },
        { de: "der Verein", en: "club / association" },
        { de: "lesen", en: "to read" },
        { de: "das Wochenende", en: "weekend" },
        { de: "treffen (Freunde)", en: "to meet (friends)" },
        { de: "drausen", en: "outdoors / outside" },
        { de: "entspannen", en: "to relax" }
      ],
      sentences: [
        { words: ["At","the","weekend","I","like","to","go","for","a","walk"], solution: "At the weekend I like to go for a walk." },
        { words: ["She","reads","a","book","every","evening"], solution: "She reads a book every evening." },
        { words: ["We","often","meet","our","friends","on","Saturdays"], solution: "We often meet our friends on Saturdays." },
        { words: ["I","enjoy","spending","time","outdoors"], solution: "I enjoy spending time outdoors." },
        { words: ["They","went","to","a","concert","last","Friday"], solution: "They went to a concert last Friday." }
      ],
      freewriting: [
        { prompt: "What do you enjoy most in your free time? Write 2-3 sentences.", example: "In my free time I enjoy reading and going for walks. At the weekend I often meet my friends for coffee. Sometimes we go to the cinema or a concert." },
        { prompt: "Describe a perfect weekend in English.", example: "My perfect weekend starts with a long sleep. Then I have breakfast outside and take a walk in the park. In the evening I relax at home with a good film." },
        { prompt: "Do you have a hobby? Explain it briefly in English.", example: "My hobby is photography. I take pictures of nature and people. I also edit the photos on my computer. It is a great way to be creative." }
      ]
    }
  ]
};

// ===== STATE =====
var allData = VOCABULARY.topics;
var currentTopic = null;
var currentMode = null;
var fcCards = [], fcIndex = 0, fcCorrect = 0;
var sentItems = [], sentIndex = 0, sentAnswer = [], sentPool = [];
var fwItems = [], fwIndex = 0;

// ===== INIT =====
renderTopics();

// ===== SCREEN NAVIGATION =====
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById('screen-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

// ===== HOME: RENDER TOPICS =====
function renderTopics() {
  var container = document.getElementById('topic-list');
  container.innerHTML = '';
  allData.forEach(function(topic) {
    var btn = document.createElement('button');
    btn.className = 'topic-card';
    btn.innerHTML =
      '<span class="topic-icon">' + topic.icon + '</span>' +
      '<span>' +
        '<div class="topic-name">' + topic.name + '</div>' +
        '<div class="topic-count">' + topic.flashcards.length + ' Vokabeln &middot; ' + topic.sentences.length + ' Satze</div>' +
      '</span>';
    btn.onclick = (function(t) { return function() { selectTopic(t); }; })(topic);
    container.appendChild(btn);
  });
}

// ===== TOPIC SELECTION =====
function selectTopic(topic) {
  currentTopic = topic;
  document.getElementById('mode-topic-title').textContent = topic.name;
  showScreen('mode');
}

// ===== MODE START =====
function startMode(mode) {
  currentMode = mode;
  if (mode === 'flashcards') startFlashcards();
  else if (mode === 'sentences') startSentences();
  else if (mode === 'freewriting') startFreewriting();
}

// ===== FLASHCARDS =====
function startFlashcards() {
  fcCards = shuffle(currentTopic.flashcards.slice());
  fcIndex = 0; fcCorrect = 0;
  showScreen('flashcards');
  renderCard();
}

function renderCard() {
  var card = fcCards[fcIndex];
  document.getElementById('fc-german').textContent = card.de;
  document.getElementById('fc-english').textContent = card.en;
  document.getElementById('fc-card').classList.remove('flipped');
  document.getElementById('fc-progress').textContent = (fcIndex + 1) + ' / ' + fcCards.length;
}

function flipCard() {
  document.getElementById('fc-card').classList.toggle('flipped');
}

function nextCard(correct) {
  if (correct === 1) fcCorrect++;
  fcIndex++;
  if (fcIndex >= fcCards.length) showResults('flashcards', fcCorrect, fcCards.length);
  else renderCard();
}

// ===== SENTENCES =====
function startSentences() {
  sentItems = shuffle(currentTopic.sentences.slice());
  sentIndex = 0;
  showScreen('sentences');
  renderSentence();
}

function renderSentence() {
  sentAnswer = [];
  sentPool = shuffle(sentItems[sentIndex].words.slice());
  document.getElementById('sent-progress').textContent = (sentIndex + 1) + ' / ' + sentItems.length;
  document.getElementById('sent-feedback').className = 'feedback hidden';
  document.getElementById('sent-feedback').textContent = '';
  document.getElementById('sent-check-btn').classList.remove('hidden');
  document.getElementById('sent-next-btn').classList.add('hidden');
  document.getElementById('sent-reset-btn').classList.remove('hidden');
  renderWordAreas();
}

function renderWordAreas() {
  var answerArea = document.getElementById('sent-answer-area');
  var poolArea = document.getElementById('sent-word-pool');
  answerArea.innerHTML = '';
  answerArea.className = 'word-area answer-area';
  poolArea.innerHTML = '';
  sentAnswer.forEach(function(word, i) {
    var chip = document.createElement('button');
    chip.className = 'word-chip in-answer';
    chip.textContent = word;
    chip.onclick = (function(idx) { return function() { moveToPool(idx); }; })(i);
    answerArea.appendChild(chip);
  });
  sentPool.forEach(function(word, i) {
    var chip = document.createElement('button');
    chip.className = 'word-chip';
    chip.textContent = word;
    chip.onclick = (function(idx) { return function() { moveToAnswer(idx); }; })(i);
    poolArea.appendChild(chip);
  });
}

function moveToAnswer(i) { sentAnswer.push(sentPool[i]); sentPool.splice(i, 1); renderWordAreas(); }
function moveToPool(i) { sentPool.push(sentAnswer[i]); sentAnswer.splice(i, 1); renderWordAreas(); }

function resetSentence() {
  sentAnswer = [];
  sentPool = shuffle(sentItems[sentIndex].words.slice());
  document.getElementById('sent-feedback').className = 'feedback hidden';
  document.getElementById('sent-check-btn').classList.remove('hidden');
  document.getElementById('sent-next-btn').classList.add('hidden');
  renderWordAreas();
}

function checkSentence() {
  if (sentAnswer.length === 0) return;
  var item = sentItems[sentIndex];
  var userClean = sentAnswer.join(' ').toLowerCase();
  var solutionClean = item.solution.replace(/[.!?]$/, '').toLowerCase();
  var feedback = document.getElementById('sent-feedback');
  var answerArea = document.getElementById('sent-answer-area');
  if (userClean === solutionClean) {
    feedback.textContent = 'Richtig!';
    feedback.className = 'feedback success';
    answerArea.classList.add('correct');
  } else {
    feedback.textContent = 'Nicht ganz. Richtig: ' + item.solution;
    feedback.className = 'feedback error';
    answerArea.classList.add('incorrect');
  }
  document.getElementById('sent-check-btn').classList.add('hidden');
  document.getElementById('sent-next-btn').classList.remove('hidden');
  document.getElementById('sent-reset-btn').classList.add('hidden');
}

function nextSentence() {
  sentIndex++;
  if (sentIndex >= sentItems.length) showResults('sentences', null, sentItems.length);
  else renderSentence();
}

// ===== FREE WRITING =====
function startFreewriting() {
  fwItems = shuffle(currentTopic.freewriting.slice());
  fwIndex = 0;
  showScreen('freewriting');
  renderPrompt();
}

function renderPrompt() {
  var item = fwItems[fwIndex];
  document.getElementById('fw-prompt').textContent = item.prompt;
  document.getElementById('fw-input').value = '';
  document.getElementById('fw-example').classList.add('hidden');
  document.getElementById('fw-show-btn').classList.remove('hidden');
  document.getElementById('fw-progress').textContent = (fwIndex + 1) + ' / ' + fwItems.length;
}

function showExample() {
  document.getElementById('fw-example-text').textContent = fwItems[fwIndex].example;
  document.getElementById('fw-example').classList.remove('hidden');
  document.getElementById('fw-show-btn').classList.add('hidden');
}

function nextPrompt() {
  fwIndex++;
  if (fwIndex >= fwItems.length) showResults('freewriting', null, fwItems.length);
  else renderPrompt();
}

// ===== RESULTS =====
function showResults(mode, correct, total) {
  var message = '';
  if (mode === 'flashcards') {
    message = 'Du hast ' + correct + ' von ' + total + ' Vokabeln gewusst.';
    if (correct === total) message += ' Perfekt!';
    else if (correct >= total * 0.7) message += ' Weiter so!';
    else message += ' Ub die schwierigen Karten nochmal.';
  } else if (mode === 'sentences') {
    message = 'Du hast alle ' + total + ' Satze bearbeitet. Gut gemacht!';
  } else {
    message = 'Du hast alle ' + total + ' Schreibubungen abgeschlossen. Toll!';
  }
  document.getElementById('results-message').textContent = message;
  showScreen('results');
}

// ===== UTILITY =====
function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}
