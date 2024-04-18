let storage = localStorage;
const startButton = document.getElementById('start-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const playerHand = document.getElementById('player-hand');
const dealerHand = document.getElementById('dealer-hand');
const playerScore = document.getElementById('player-score');
const dealerScore = document.getElementById('dealer-score');
let count;
if (!count) {
  try {
    count = JSON.parse(storage.getItem('count'));
  } catch {
    count = { win: 0, lose: 0, tie: 0, blackjack: 0, reach21: 0 };
  }
}
let deck = [];
let playerCards = [];
let dealerCards = [];
let gameInProgress = false;

const suitEmojis = {
  'Hearts': '♥',
  'Diamonds': '♦',
  'Clubs': '♣',
  'Spades': '♠'
};

document.getElementById('toggle-scoreboard').addEventListener('click', function() {
  let scoreboard = document.getElementById('scoreboard');
  if (scoreboard.style.display === 'none') {
    scoreboard.style.display = 'block';
  } else {
    scoreboard.style.display = 'none';
  }
});

// Update scoreboard
function updateScoreboard(totalPlays, wins, losses, draws, blackjacks, twentyOne) {
  document.getElementById('total').textContent = `${totalPlays}`;
  document.getElementById('win').textContent = `${wins}`;
  document.getElementById('lose').textContent = `${losses}`;
  document.getElementById('tie').textContent = `${draws}`;
  document.getElementById('blackjack').textContent = `${blackjacks}`;
  document.getElementById('twenty-one').textContent = `${twentyOne}`;
}

// Start
startButton.addEventListener('click', startGame);

function startGame() {
  if (gameInProgress) return;
  gameInProgress = true;

  deck = createDeck();
  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard()];

  updateUI();
  playSound("snd/start.mp3");
  startButton.disabled = true;
  standButton.disabled = false;
}

// Draw
function drawCard() {
  const randomIndex = Math.floor(Math.random() * deck.length);
  const card = deck.splice(randomIndex, 1)[0];
  return card;
}

// Create
function createDeck() {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push(`${value} of ${suit}`);
    }
  }

  return deck;
}

// Update UI
function updateUI() {
  playerHand.innerHTML = playerCards.map(card => formatCard(card)).join(', ');
  dealerHand.innerHTML = dealerCards.map(card => formatCard(card)).join(', ');
  playerScore.textContent = calculateScore(playerCards);
  dealerScore.textContent = calculateScore(dealerCards);
  if (calculateScore(playerCards) === 21) {
    hitButton.disabled = true;
  } else {
    hitButton.disabled = false;
  }
}

// Format card
function formatCard(card) {
  const [value, suit] = card.split(' of ');
  return `${suitEmojis[suit]} ${value}`;
}

// Score
function calculateScore(cards) {
  let score = 0;
  let hasAce = false;
  let aceCount = 0;

  for (const card of cards) {
    const value = card.split(' ')[0];
    if (value === 'A') {
      hasAce = true;
      aceCount++;
      score += 11;
    } else if (value === 'K' || value === 'Q' || value === 'J') {
      score += 10;
    } else {
      score += parseInt(value);
    }
  }

  while (hasAce && score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }

  return score;
};

// Hit
hitButton.addEventListener('click', () => {
  playerCards.push(drawCard());
  updateUI();

  if (calculateScore(playerCards) > 21) {
    endGame(false);
  } else {
    playSound("snd/hit.mp3");
  }
});

// Stand
standButton.addEventListener('click', () => {
  while (calculateScore(dealerCards) < 17) {
    dealerCards.push(drawCard());
  }

  updateUI();
  endGame();
});

// Blackjack?
function hasBlackjack(cards) {
  return (
    (cards.length === 2 && calculateScore(cards) === 21)
  );
}

// End
function endGame() {
  gameInProgress = false;

  const playerScoreValue = calculateScore(playerCards);
  const dealerScoreValue = calculateScore(dealerCards);

  let message = "";
  let soundPath = "snd/";

  if (hasBlackjack(playerCards) && hasBlackjack(dealerCards)) {
    message = "It's a Tie with Blackjack!";
    soundPath += "tie.mp3";
    count.tie++;
    count.blackjack++;
  } else if (hasBlackjack(playerCards)) {
    message = "Blackjack! Player Wins!";
    soundPath += "bj.mp3";
    count.win++;
    count.blackjack++;
  } else if (hasBlackjack(dealerCards)) {
    message = "Dealer has Blackjack! Dealer Wins!";
    soundPath += "lose.mp3";
    count.lose++;
  } else if (playerScoreValue > 21) {
    message = "Player Busts! Dealer Wins!";
    soundPath += "burst.mp3";
    count.lose++;
  } else if (dealerScoreValue > 21) {
    message = "Dealer Busts! Player Wins!";
    soundPath += "win.mp3";
    count.win++;
  } else if (playerScoreValue > dealerScoreValue) {
    message = "Player Wins!";
    soundPath += "win.mp3";
    count.win++;
  } else if (playerScoreValue < dealerScoreValue) {
    message = "Dealer Wins!";
    soundPath += "lose.mp3";
    count.lose++;
  } else {
    message = "It's a Tie!";
    soundPath += "tie.mp3";
    count.tie++;
  }

  if (!hasBlackjack(playerCards) && playerScoreValue == 21) {
    message += " Player reached 21!";
    count.reach21++;
  }

  try {
    storage.setItem('count', JSON.stringify(count));
  } catch {}
  updateScoreboard(count.win + count.lose + count.tie, count.win, count.lose, count.tie, count.blackjack, count.reach21);
  playSound(soundPath);
  showMessage(message);

  startButton.disabled = false;
  hitButton.disabled = true;
  standButton.disabled = true;
}

// Pop up
function showMessage(message) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  const popup = document.createElement('div');
  popup.className = 'popup';
  popup.textContent = message;
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 1000);
}

function playSound(path) {
  const sound = new Audio(path);
  sound.play();
}

// Reset
hitButton.disabled = true;
standButton.disabled = true;
