function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getOutcome(playerSelection, computerSelection) {
  playerSelection = playerSelection.toLowerCase();
  computerSelection = computerSelection.toLowerCase();
  let LOSE = "lose";
  let WIN = "win";
  let DRAW = "draw";
  // draw
  if (playerSelection==computerSelection) {
    return DRAW
  }
  // not draw
  switch (playerSelection) {
    case "rock":
      switch (computerSelection) {
        case "paper": return LOSE;
        case "scissors": return WIN;
      }
    case "paper":
      switch (computerSelection) {
        case "rock": return WIN;
        case "scissors": return LOSE;
      }
    case "scissors":
      switch (computerSelection) {
        case "rock": return LOSE;
        case "paper": return WIN;
      }
  }
}

/**
 * Play 1 round of RPS, given the player choice
 * Returns array of player choice, computer choice, and outcome
 * @param  {String} hand Player's hand
 * @return {String[]} Array of player and computer's hand, and outcome
 */
function playRound(hand) {
  let randInt = getRandomIntInclusive(0,2);
  let player = hand;
  let computer;
  switch (randInt) {
    case 0:
      computer = "rock";
      break;
    case 1:
      computer = "paper";
      break;
    case 2:
      computer = "scissors";
      break;
  }

  return [player, computer, getOutcome(player, computer)];
}


// ===============Enable/Disable hand buttons===============
/**
 * Disables a button
 * @param  {Element} button A button element
 */
function buttonDisable(button) {
  button.disabled = true;
  button.classList.add("btn_disabled");
}

/**
 * Enables a button
 * @param  {Element} button A button element
 */
function buttonEnable(button) {
  button.disabled = false;
  button.classList.remove("btn_disabled");
}

/**
 * @param  {Map<string, Element>} buttonMap 
 */
function buttonGroupDisable(buttonMap) {
  buttonMap.forEach(buttonDisable);
}

/**
 * @param  {Map<string, Element>} buttonMap 
 */
function buttonGroupEnable(buttonMap) {
  buttonMap.forEach(buttonEnable);
}


// ================flip animation================

/**
 * Add a flip animation to an element, and runs the callback in the mid-point of the animation
 * Also undims the element 
 * @param  {Element}  element  The element to flip
 * @param  {Function} callback First function, run at middle of flip
 * @param  {Function} callback2 Second function, run at end of flip
 * @param  {boolean} undim Whether to undim or not
 */
function animationFlip(element, callback, callback2=null, undim=true) {
  element.classList.add("ani-cardclose");
  element.addEventListener("animationend", firstHalf);
  function firstHalf() {
    element.removeEventListener("animationend", firstHalf);
    if (typeof callback == "function") {callback();}
    if (undim) {element.classList.remove("hand_darken");}
    element.classList.add("ani-cardopen");
    element.classList.remove("ani-cardclose");
    element.addEventListener("animationend", secondHalf);
    function secondHalf() {
      element.removeEventListener("animationend", secondHalf);
      if (typeof callback2 == "function") {callback2();}
      element.classList.remove("ani-cardopen");
    }
  }
  // element.classList.add("hand_darken");
}

/**
 * Change display to given hand
 * @param  {Element} display The display element containing the `<img>` element, should be `display_player` or `display_computer`
 * @param  {string} hand     The hand to change to, `rock`, `paper`, `scissors`, `none`
 */
function changeDisplayHand(display, hand) {
  image = display.querySelector("img");
  image.src = `./res/${hand}.png`;
}

function test() {
  let cpu = document.querySelector("#display_computer");
  let player = document.querySelector("#display_player");
  animationFlip(
  player, 
  () => {
    changeDisplayHand(player, "rock")
    animationFlip(cpu, () => changeDisplayHand(cpu, "scissors"))
  });
}

// ===============animation utilities===============

/**
 * Adds an attribute showing the element is being animated
 * @param  {Element} element
 */
function animationSetActive(element) {
  element.setAttribute("data-animating", "true");
}

/**
 * Removes the attribute showing the element is being animated
 * @param  {Element} element
 */
function animationSetInactive(element) {
  element.setAttribute("data-animating", "false");
}

/**
 * Checks if element is being animated
 * @param  {Element} element
 */
function animationIsActive(element) {
  let isAnimating = element.getAttribute("data-animating");
  return isAnimating=="true"
}

// ================fade animation================

/**
 * make an element invisible with fading animation, can be bought back with fadeBack
 * callback is called after fade is finished
 * @param  {Element} element 
 * @param  {Function} callback 
 */
function fadeAway(element, callback) {
  element.classList.add("ani-fadeout");
  element.addEventListener("animationend", doCallback);
  function doCallback() {
    element.removeEventListener("animationend", doCallback);
    element.classList.add("hidden");
    element.classList.remove("ani-fadeout");
    if (typeof callback == "function") {callback();}
  }
}

/**
 * make an element visible with fading animation, made invisible with fadeAway
 * callback is called after fade is finished
 * @param  {Element} element 
 * @param  {Function} callback 
 */
function fadeBack(element, callback) {
  element.classList.remove("hidden");
  element.classList.add("ani-fadein");
  element.addEventListener("animationend", doCallback);
  function doCallback() {
    element.removeEventListener("animationend", doCallback)
    element.classList.remove("ani-fadein");
    element.classList.remove("hidden");
    if (typeof callback == "function") {callback();}
  }
}

// ====================useful functions====================
/**
 * change the text in a element, with fading animation
 * @param  {Element} element `#message` div element
 * @param  {String} text    text to put in element
 * @param  {Function} callback    function to execute
 * @param  {String} when    when to execute function, in `middle` of fade, or at `end` of fade
 */
function fadeChangeText(element, text, callback=null, when="end") {
  fadeAway(element, secondHalf);
  function secondHalf() {
    element.innerText = text;
    if (when=="middle") {
      //middle
      if (typeof callback == "function") {callback();}
      fadeBack(element);
    } else {
      //end
      fadeBack(element, callback);
    }
  }
}

/**
 * Slowly dims display of a person, it is `player` or `computer`
 * @param  {String} person `player` or `computer`
 */
function dimDisplay(person) {
  elementToDim = document.getElementById(`display_${person}`);
  elementToDim.classList.add("hand_darken");
}

/**
 * INSTANTLY lights display of a person, it is `player` or `computer`
 * @param  {String} person `player` or `computer`
 */
function undimDisplay(person) {
  elementToUndim = document.getElementById(`display_${person}`);
  elementToUndim.classList.remove("hand_darken");
}

/**
 * Set points text to value, `person` is either `player` or `computer`
 * @param {String} person The side to set the points
 * @param {number} points The value of the points
 */
function setScoreDisplay(person, points) {
  element = document.getElementById(`score_${person}`);
  element.innerText = `${points} points`;
}

function flipHandDisplays(player_hand, cpu_hand, callback) {
  let cpu = document.querySelector("#display_computer");
  let player = document.querySelector("#display_player");
  animationFlip(
  player, 
  () => {
    changeDisplayHand(player, player_hand);
    animationFlip(cpu, () => {
      changeDisplayHand(cpu, cpu_hand)
      if (typeof callback == "function") {callback();}
    });
  },
  callback);
}

function dimLoserDisplay() {
  result = memory.get("result");
  if (result=="win") {
    dimDisplay("computer");
  } else if (result=="lose") {
    dimDisplay("player");
  } else {
    dimDisplay("player");
    dimDisplay("computer");
  }
}

// =====================main code=====================

function playHand(hand) {
  output = playRound(hand);
  player = output[0];
  computer = output[1];
  result = output[2];
  score_computer = memory.get("computer points");
  memory.set("player hand", player);
  memory.set("computer hand", computer);
  memory.set("result", result);
  if (result=="win") {
    score_player = memory.get("player points");
    memory.set("player points", score_player+1);
  } else if (result=="lose") {
    score_computer = memory.get("computer points");
    memory.set("computer points", score_computer+1);
  }
  console.log(memory);
  updateInterface();
}

function updateInterface() {
  buttonGroupDisable(hand_buttons)
  // get variables
  let player = memory.get("player hand");
  let computer = memory.get("computer hand");
  let player_score = memory.get("player points");
  let computer_score = memory.get("computer points");
  let result = memory.get("result");
  let MAX_POINTS = memory.get("points to win");
  if (player_score>=MAX_POINTS || computer_score>=MAX_POINTS) {
    // end game
    let message;
    if (result=="win") {
      message = `You got ${MAX_POINTS} points first. You win! Play again?`
    } else if (result=="lose") {
      message = `The computer got ${MAX_POINTS} points first. You lost! Play again?`
    } else {
      message = `This is not supposed to happen what the fuck did you do`
    }

    // flip displays, then show loser
    flipHandDisplays(player, computer, () => {
      setTimeout(dimLoserDisplay, 500);
      setTimeout(() => {
        setScoreDisplay("player", player_score);
        setScoreDisplay("computer", computer_score);
      }, 1500);
      fadeChangeText(msgBox, message, setTimeout(secondPart, 700), "end")
    });

    function secondPart() {
      fadeAway(hand_buttons_container, () => {
        fadeBack(single_button_container);
        buttonGroupEnable(hand_buttons);
      });
      single_button.onclick = retryPrompt;
    }
  } else {
    // continue game
    // set message
    let message;
    if (result=="win") {
      message = `Your ${player} won against ${computer}! Choose a hand:`
    } else if (result=="lose") {
      message = `Your ${player} lost to ${computer}! Choose a hand:`
    } else {
      message = `Both sides gave ${player}! Choose a hand:`
    }

    // flip displays, then show loser
    flipHandDisplays(player, computer, () => {
      setTimeout(dimLoserDisplay, 500);
      setTimeout(() => {
        setScoreDisplay("player", player_score);
        setScoreDisplay("computer", computer_score);
        buttonGroupEnable(hand_buttons)
      }, 800);
      fadeChangeText(msgBox, message)
    });

    function secondPart() {
      setScoreDisplay("player", player_score);
      setScoreDisplay("computer", computer_score);
    }
  }
}

/**
 * Used after prompted to start the game
 */
function initialPrompt() {
  let setupButton = () => {
    buttonEnable(single_button);
    single_button.onclick = startGame;
  }
  buttonDisable(single_button);
  fadeChangeText(
    msgBox, 
    "Be the first to get 10 points to win!", 
    ()=>fadeChangeText(single_button, "Let's play", setupButton, "middle"),
    "middle"
    );
}

/**
 * Used after prompted to retry the game
 */
function retryPrompt() {
  let setupButton = () => {
    buttonEnable(single_button);
    single_button.onclick = () => {
      startGame();
      let player = memory.get("player hand");
      let computer = memory.get("computer hand");
      let player_score = memory.get("player points");
      let computer_score = memory.get("computer points");
      setScoreDisplay("player", player_score);
      setScoreDisplay("computer", computer_score);
      flipHandDisplays(player, computer);
    };
  }
  buttonDisable(single_button);
  fadeChangeText(
    msgBox, 
    "Be the first to get 10 points to win!", 
    ()=>fadeChangeText(single_button, "Let's play", setupButton, "middle"),
    "middle"
    );
}

/**
 * Used when game is started for the first round
 */
function startGame() {
  // reinitialize memory
  memory.set("player points", 0);
  memory.set("computer points", 0);
  memory.set("player hand", "none");
  memory.set("computer hand", "none");
  memory.set("result", "none");

  fadeChangeText(msgBox, "Choose a hand:");
  fadeAway(
    single_button_container,
    () => fadeBack(hand_buttons_container)
    );
}


let memory = new Map();
memory.set("points to win", 10);

// setup hand buttons
hand_buttons_container = document.getElementById("hand-buttons");
hand_buttons_container.classList.add("hidden")
let hands = ["rock", "paper", "scissors"];

let hand_buttons = new Map();

for (const hand of hands) {
  hand_buttons.set(hand, document.querySelector(`#btn-${hand}`));
  hand_buttons.get(hand).addEventListener("click", () => playHand(hand));
}

// get single button 
single_button_container = document.getElementById("single-button");
single_button = document.getElementById("btn-single");
single_button.onclick = initialPrompt  // only 1 function allowed

msgBox = document.querySelector("#message");



