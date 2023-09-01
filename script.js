const startButton = document.getElementById('start-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const playerHand = document.getElementById('player-hand');
const dealerHand = document.getElementById('dealer-hand');
const playerScore = document.getElementById('player-score');
const dealerScore = document.getElementById('dealer-score');

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

// Start
startButton.addEventListener('click', startGame);

function startGame() {
  if (gameInProgress) return;
  gameInProgress = true;

  deck = createDeck();
  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard()];

  updateUI();
  startButton.disabled = true;
  hitButton.disabled = false;
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

  for (const card of cards) {
    const value = card.split(' ')[0];
    if (value === 'A') {
      hasAce = true;
      score += 11;
    } else if (value === 'K' || value === 'Q' || value === 'J') {
      score += 10;
    } else {
      score += parseInt(value);
    }
  }

  if (hasAce && score > 21) {
    score -= 10;
  }

  return score;
}

// Hit
hitButton.addEventListener('click', () => {
  playerCards.push(drawCard());
  updateUI();

  if (calculateScore(playerCards) > 21) {
    endGame(false);
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

  if (hasBlackjack(playerCards) && hasBlackjack(dealerCards)) {
    message = "It's a Tie with Blackjack!";
  } else if (hasBlackjack(playerCards)) {
    message = "Blackjack! Player Wins!";
  } else if (hasBlackjack(dealerCards)) {
    message = "Dealer has Blackjack! Dealer Wins!";
  } else if (playerScoreValue > 21) {
    message = "Player Busts! Dealer Wins!";
  } else if (dealerScoreValue > 21) {
    message = "Dealer Busts! Player Wins!";
  } else if (playerScoreValue > dealerScoreValue) {
    message = "Player Wins!";
  } else if (playerScoreValue < dealerScoreValue) {
    message = "Dealer Wins!";
  } else {
    message = "It's a Tie!";  
  }

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

// Reset
hitButton.disabled = true;
standButton.disabled = true;
