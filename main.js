let print = console.log;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getOutcome(playerSelection, computerSelection) {
    playerSelection = playerSelection.toLowerCase();
    computerSelection = computerSelection.toLowerCase();
    let LOSE = "LOSE";
    let WIN = "WIN";
    let DRAW = "DRAW";
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

function loopInputRPS() {
    let question = "Input your choice:";
    while (true) {
        let input = prompt(question).toLowerCase();
        if (input=="rock" || input=="paper" || input=="scissors") return input;
        question = "Invalid input. Input your choice:";
    }
}

function playRound() {
    let randInt = getRandomIntInclusive(0,2);
    let player = loopInputRPS();
    let computer;
    switch (randInt) {
        case 0: computer = "rock"; break;
        case 1: computer = "paper"; break;
        case 2: computer = "scissors"; break;
    }

    switch (getOutcome(player, computer)) {
        case "WIN":
            print(`You win! Your ${player} beat ${computer}.`);
            return 1;
        case "LOSE":
            print(`You lose! Your ${player} lost to ${computer}.`);
            return -1;
        case "DRAW":
            print(`A draw! Both hands are ${player}.`);
            return 0;
    }
}

function game() {
    let score = 0;
    for (let i=0; i<5; i++) {
        score += playRound();
    }
    print(`Game over. Your score is ${score} points.`);
}

game();
