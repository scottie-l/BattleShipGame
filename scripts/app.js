'use strict';

let playerHits = 0;
let computerHits = 0;
let playerStrikes = [];
let computerStrikes = [];
let playerShips = getPlayerShips();
let computerShips = []; getComputerShips();
let status1 = false;
let playerName = getPlayerName();
let surrender = false;
let missileStatus = false;
let hitSound;
let missSound;
let winSound;
let loseSound;

hitSound = new Sound('Images/SiteAssets/hit-sound.wav');
missSound = new Sound('Images/SiteAssets/water-miss2.mp3');
winSound = new Sound('Images/SiteAssets/applause6.wav');
loseSound = new Sound('Images/SiteAssets/sfxboo (1).wav');

// Fill in the ship positions for Computer's Ships
function getComputerShips() {
  computerStrikes = [];
  for (let i = 0; i < 3; i++) {
    let temp2 = false;
    let temp = getRandomPosition();
    for (let x = 0; x < computerShips.length; x++) {
      if (temp === computerShips[x]){
        temp2 = true;
        console.log('Reload Ships');
        getComputerShips();
      }} if (temp2 === false && computerShips.length < 3){
      computerShips.push(temp);
    }
  }
}

// Get Player's Ships from localStorage
function getPlayerShips() {
  let jsonData = localStorage.getItem('playerShips');
  let parsedData = JSON.parse(jsonData);
  return parsedData;
}

// Random Position Generator for Computer's Ships
function getRandomPosition () {
  let position = [];
  const characters = 'ABCDE';
  let letterSpot = '';
  const randomLetter = Math.floor(Math.random() * characters.length);
  letterSpot += characters[randomLetter];
  position.push(letterSpot);
  let numberSpot = Math.floor(Math.random() * 5) + 1;
  position.push(numberSpot);
  return(position.join(''));
}

// Computer's Strike Function
function computerStrike() {
  let table = document.getElementById('playerBoard');
  let missile = document.getElementById('missile');
  
  // Removes missile
  if (missileStatus === true) {
    missile.remove();
    missileStatus = false;
  }
  

  if (playerHits !== 3){
    let list = document.getElementById('computerlist');
    let strikeSpot = getRandomPosition();
    let id = ('P' + strikeSpot);
    let boxId = document.getElementById(id);
    let temp = false;

    // Check for duplicate strikes
    for (let i = 0; i < computerStrikes.length; i++){
      if (strikeSpot === computerStrikes[i]) {
        temp = true;
      }
    }
    if (temp === false) {
      let x = 0;

      // Check for hit
      for (let i = 0;i < 3; i++) {
        x++;
        if (strikeSpot === playerShips[i]){
          hitSound.play();
          let icon = document.getElementById(id).childNodes[0];
          icon.src = 'Images/SiteAssets/Explosion.png';
          icon.setAttribute('id', 'explosion');
          computerHits++;
          x = 0;
          // Applies table shake animation
          let animationEndCallback = (e) => {
            table.removeEventListener('animationend', animationEndCallback);
            table.classList.remove('applySwing');
          };
          table.classList.add('applySwing');
          table.addEventListener('animationend', animationEndCallback);


          status1 = false;
          let li = document.createElement('li');
          li.innerText = (strikeSpot + ' Hit');
          list.appendChild(li);
        }
      }

      // If computer misses
      if (x === 3) {
        missSound.play();
        boxId.innerText = 'MISS';
        status1 = false;
        let li = document.createElement('li');
        li.innerText = (strikeSpot + ' Miss');
        list.appendChild(li);
      }

      // Win Card if computer wins
      if (computerHits === 3) {
        let wincard = document.getElementById('winCard');
        let name = document.createElement('p');
        let text = document.createElement('p');
        text.innerText = 'You Lose';
        name.innerText = playerName;
        let button = document.createElement('button');
        button.className = 'button';
        button.innerText = 'Play Again';
        button.setAttribute('onclick', 'playAgain()');
        wincard.appendChild(name);
        wincard.appendChild(text);
        wincard.appendChild(button);
        loseSound.play();
      }
      computerStrikes.push(strikeSpot);

      // Rerun if duplicate strike position
    } else {
      console.log('repeat');
      computerStrike();
    }
  }
}

// Surrender button function
function surrenderButton() {
  if (surrender === false) {
    (computerHits === 3);
    let wincard = document.getElementById('winCard');
    let name = document.createElement('p');
    let text = document.createElement('p');
    text.innerText = 'You Lose';
    name.innerText = playerName;
    let button = document.createElement('button');
    button.className = 'button';
    button.innerText = 'Play Again';
    button.setAttribute('onclick', 'playAgain()');
    name.innerText = 'Play Again';
    wincard.appendChild(name);
    wincard.appendChild(text);
    wincard.appendChild(button)
    loseSound.play();
    surrender = true;
  }
}

// Player Strike Function
function playerStrike(event){
  let list = document.getElementById('playerlist');
  let table = document.getElementsByClassName('compBoard')[0];
  let loadBar = document.getElementById('progress-value');
  let temp = false;

  // Prevents clicks if game has been won
  if (playerHits < 3 && computerHits < 3 && status1 === false && surrender === false) {
    let boxId = event.target.id;
    let td = document.getElementById(boxId);

  // Checks for duplicate strikes
    for (let i = 0; i < playerStrikes.length; i++){
      if (temp === false){
        if (boxId === playerStrikes[i]) {
          temp = true;
        }
      }
    }
    if (temp === false){
      let x = 0;
      for (let i = 0; i < 3; i++){
        if (x < 3) {
          x++;
// Check if strike hits
          if (boxId === computerShips[i]) {
            hitSound.play();
            let img = document.createElement('img');
            img.setAttribute('src', 'Images/SiteAssets/Explosion.png');
            img.setAttribute('id', 'explosion');
            td.appendChild(img);
            playerHits++;
            x = 0;
            // Apply animation for board shake
            let animationEndCallback = (e) => {
              table.removeEventListener('animationend', animationEndCallback);
              table.classList.remove('applySwing');
            };
            table.classList.add('applySwing');
            table.addEventListener('animationend', animationEndCallback);
            let li = document.createElement('li');
            li.innerText = (boxId + ' Hit');
            list.appendChild(li);
          }
        }
      }
// If strike misses
      if (x === 3) {
        missSound.play();
        td.innerText = 'MISS';
        let li = document.createElement('li');
        li.innerText = (boxId + ' Miss');
        list.appendChild(li);
      }
// If player wins create win card
      if (playerHits === 3) {
        let wincard = document.getElementById('winCard');
        let name = document.createElement('p');
        let text = document.createElement('p');
        text.innerText = 'You Won!';
        name.innerText = playerName;
        let button = document.createElement('button');
        button.className = 'button';
        button.innerText = 'Play Again';
        button.setAttribute('onclick', 'playAgain()');
        wincard.appendChild(name);
        wincard.appendChild(text);
        wincard.appendChild(button);
        winSound.play();
      }
      playerStrikes.push(boxId);
      
      // Missile loading bar animation
      status1 = true;
      let div = document.getElementById('progress');
      let missile = document.createElement('img');
      missile.setAttribute('src', 'Images/SiteAssets/Missile1.png');
      missile.setAttribute('id', 'missile');
      div.appendChild(missile);
      missileStatus = true;
      let animationEndCallback = (e) => {
        loadBar.removeEventListener('animationend', animationEndCallback);
        loadBar.classList.remove('applyLoad');
      };
      loadBar.classList.add('applyLoad');
      loadBar.addEventListener('animationend', animationEndCallback);
      setTimeout(computerStrike, 3500);
    }
  }
}

// Player's list display on side
function createPlayerlist() {
  let playerHitList = document.getElementById('playerlist');
  let name = document.createElement('p');
  let hitMiss = document.createElement('p');
  hitMiss.innerText = 'Hit/Miss';
  name.innerText = (playerName + '\'s');
  playerHitList.appendChild(name);
  playerHitList.appendChild(hitMiss);
}

// Add Player's name to Player list display
function createPlayerLabel() {
  let playerLabel = document.getElementById('playerBoardLabel');
  playerLabel.innerText = playerName + '\'s Field';
}

createPlayerlist();
createPlayerLabel();

// Load the Player's ships into the board
function loadShips() {
  for (let i = 0; i < playerShips.length; i++){
    let position = ('P' + playerShips[i]);
    let boxId = document.getElementById(position);
    let img = document.createElement('img');
    img.setAttribute('src', 'Images/SiteAssets/Battleship-Icon.png');
    img.setAttribute('id', 'battleShipIcon');
    boxId.appendChild(img);
  }
}

// Play again button function
function playAgain() {
  window.location.href = './index.html';
}

// audio function
function Sound(src) {
  this.sound = document.createElement('audio');
  this.sound.src = src;
  this.sound.setAttribute('preload', 'auto');
  this.sound.setAttribute('controls', 'none');
  this.sound.style.display = 'none';
  document.body.appendChild(this.sound);
  this.sound.volume = 0.05;
  this.play = function(){
    this.sound.play();
  };
  this.stop = function(){
    this.sound.pause();
  };
}

// Get Player's from local storage
function getPlayerName() {
  let jsonData = localStorage.getItem('playerName');
  let parsedData = JSON.parse(jsonData);
  return parsedData;
}

// get ships from local storage
loadShips();
let compBoard = document.getElementsByClassName('compBoard');
compBoard[0].addEventListener('click', playerStrike);
