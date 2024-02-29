const descriptions = {
  en: `
    <h2>Blackjack</h2>
    <p>
      <strong>Blackjack</strong> is a card game played between a player and a dealer. The basic rule is to get as close to 21 points as possible without exceeding 21 points.<br>
      The side with the highest score between a player and a dealer wins.
    </p>

    <h3>Gameplay</h3>
    <p>Players are initially dealt two cards and can then either <strong>hit</strong> or <strong>stand</strong>.</p>

    <h3>Terminology</h3>
    <p>
      <strong>Hit:</strong> To request another card from the dealer to increase the total value of the hand.<br>
      <strong>Stand:</strong> To decline any further cards and retain the current hand value.<br>
      <strong>Dealer:</strong> The person representing the house who deals the cards and plays against the player.<br>
      <strong>Blackjack:</strong> A winning hand consisting of an ace and a card with a value of 10, totaling 21.<br>
			In addition to the 10 card, J, Q, and K cards are also considered 10 points.<br>
			Cards of A are worth 1 or 11 points.
    </p>
  `,
  jp: `
    <h2>ブラックジャック</h2>
    <p>
      <strong>ブラックジャック</strong>は、プレイヤーとディーラーの間でプレイされるカードゲームです。基本的なルールは、21点を超えないように21点にできるだけ近づけることです。<br>
      プレイヤーとディーラーの点数が高い側が勝利します。
    </p>

    <h3>ゲームプレイ</h3>
    <p>プレイヤーは最初に2枚のカードを配られ、その後に<strong>ヒット</strong>または<strong>スタンド</strong>という動作を行えます。</p>

    <h3>用語の解説</h3>
    <p>
      <strong>ヒット：</strong> ディーラーからもう1枚のカードを要求して手札の合計値を増やすこと。<br>
      <strong>スタンド：</strong> これ以上のカードを受け取らず、現在の手札の値を維持すること。<br>
      <strong>ディーラー：</strong> ハウスを代表してカードを配る人で、プレイヤーと対戦する。<br>
      <strong>ブラックジャック：</strong> エースと10点のカードで構成される合計が21の勝ち手。<br>
			10のカードのほかに、J、Q、Kのカードも10点とみなされます。<br>
			Aのカードは1点または11点とみなします。
    </p>
  `
};

let currentLanguage = 'en';

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'jp' : 'en';
  document.getElementById('description').innerHTML = descriptions[currentLanguage];
}

document.getElementById('description').innerHTML = descriptions[currentLanguage];
