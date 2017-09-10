//Game elements setup
var gameContainer = document.getElementById("gamecontainer");
var gameButtons = document.getElementsByClassName("gamebutton");
var gameStatus = document.getElementById("gamestatus");
var gameTimer = document.getElementById("timer");
var gameStartButton = document.getElementById("startbutton").onclick = function () {
    //Hide the Start Game button
    //this.style.visibility = "hidden";

    //Enable the game buttons
    document.getElementById("buttonrock").disabled = false;
    document.getElementById("buttonpaper").disabled = false;
    document.getElementById("buttonscissors").disabled = false;

    //Show the main game pieces
    gamecontainer.style.visibility = "visible";

    //Move the user's client to the game container and start.
    gameContainer.scrollIntoView();
    StartGame();
    StartTimer();
}

//Game actions
var gameConditions = ['Win', 'Lose', 'Tie'];

//Choices
//  Choice is the object's name. This also works for the "Tie" condition.
//  Win is what needs to be picked to win against this item.
//  Lose is what needs to be picked to Lose against this item.
var gameChoices = [
    { choice: 'Rock', win: 'Paper', lose: 'Scissors', img: 'images/rock.jpg' },
    { choice: 'Paper', win: 'Scissors', lose: 'Rock', img: 'images/paper.jpg' },
    { choice: 'Scissors', win: 'Rock', lose: 'Paper', img: 'images/scissors.jpg' }
];

//Game default values
var defaultGameScore = 20;
var defaultGameTimer = 6; //Due to how the timer works and displays, this (six) is correct.
var highScore = 30; //Arbitrary value above the player's starting points value.

//Timer helpers
var currentGameTimer = -1;
var timerRun = false;

//Game helper variables
var gameComputerChoice = null;
var gameComputerCondition = null;
var gamePlayerScore = 20;
var gameScoreElement = document.getElementById("score");
var gamePlayerAction = null;

//Function to actually start the game. Takes care of some non-game items of business (such as HTML and UI text adjustments).
//  Shows game elements
//  Ensures that any previous score or status notices are cleared out
//  Generates an RPS pick
function StartGame() {
    document.getElementById("newhighscore").style.visibility = "hidden";
    gameScoreElement = document.getElementById("score");
    gameScoreElement.innerText = defaultGameScore;
    gamePlayerScore = defaultGameScore;

    gameStatus.innerText = "";

    NextPick();
}

//Function to end the game
//  Stops the timer, checks the user's score
//  Empties and disables visual elements
//  Displays that the game has ended.
function EndGame() {
    //Stop the timer
    StopTimer();
    CheckEndScore();

    //Disable the game buttons
    document.getElementById("buttonrock").disabled = true;
    document.getElementById("buttonpaper").disabled = true;
    document.getElementById("buttonscissors").disabled = true;

    //Update game information
    //  Object name
    document.getElementById("computerpickobject").textContent = "";

    //  Object image
    document.getElementById("computerpickimg").src = "images/smileyface.jpg";

    //  Condition name
    document.getElementById("computerpickcondition").textContent = "";

    //  Status
    gameStatus.innerText = "The game has ended. Thanks for playing!";
}

//Core function to the game.
//  Generates a new pick and condition. This is done with a check to ensure that the same condition isn't chosen repeatedly
//      (There were cases where the same object and condition would be chosen sequentially.)
function NextPick() {
    //Generate next picks
    gameComputerChoice = gameChoices[Math.floor(Math.random() * gameChoices.length)];
    var previousCondition = gameComputerCondition;
    gameComputerCondition = gameConditions[Math.floor(Math.random() * gameConditions.length)];

    //Prevents condition sequential-repeats
    while (gameComputerCondition == previousCondition) {
        gameComputerCondition = gameConditions[Math.floor(Math.random() * gameConditions.length)];
    }

    //Update game information
    //  Some items are set to variables for debug output.

    //  Object name
    var objectText = document.getElementById("computerpickobject").textContent = gameComputerChoice.choice;

    //  Object image
    document.getElementById("computerpickimg").src = gameComputerChoice.img;

    //  Condition name
    var conditionText = document.getElementById("computerpickcondition").textContent = gameComputerCondition;

    //Reset Timer
    //  Reset is done here, as NextPick will be called after every pick, success or failure.
    //  StartTimer essentially resets the timer values for the background loop.
    StartTimer();

    //Debug
    document.getElementById("debugchoice").innerText = "Computer vars: Choice: " + gameComputerChoice.choice + " Condition: " + gameComputerCondition;
}

//Sets the game timer to do its work.
function StartTimer() {
    timerRun = true;
    currentGameTimer = defaultGameTimer;
}

//Sets the game timer to stop doing its work.
function StopTimer() {
    timerRun = false;
    currentGameTimer = -1
}

//Handles user input
//  Checks result and calls ResultSuccess/ResultFailure where appropriate.
//  Resets timer and gets the next pick ready to go.
function MakeChoice(userChoice) {
    //Evaluate their choice
    //gameChoices: 0 = Rock, 1 = Paper, 2 = Scissors
    var choiceObject = null;
    switch (userChoice) {
        case ('Rock'):
            choiceObject = gameChoices[0];
            break;
        case ('Paper'):
            choiceObject = gameChoices[1];
            break;
        case ('Scissors'):
            choiceObject = gameChoices[2];
            break;
        default:
            return;
    }

    //Debug
    document.getElementById("debuguserchoice").innerText = "User picked: " + choiceObject.choice;

    //Handle result
    if (gameComputerCondition == "Win") {
        if (choiceObject.choice == gameComputerChoice.win) {
            ResultSuccess();
        } else {
            ResultFailure();
        }
    } else if (gameComputerCondition == "Lose") {
        if (choiceObject.choice == gameComputerChoice.lose) {
            ResultSuccess();
        } else {
            ResultFailure();
        }
    } else if (gameComputerCondition == "Tie") {
        if (choiceObject.choice == gameComputerChoice.choice) {
            ResultSuccess();
        } else {
            ResultFailure();
        }
    }

    //Reset the timer
    StartTimer();

    //Get next game item
    NextPick();
}

//Function to handle when the user picks correctly.
function ResultSuccess() {
    //Add points to score.
    UpdateScore(5);

    //Update status
    gameStatus.innerText = "Success! You won 5 points!";

    //Debug
    document.getElementById("debugresult").innerText = "Result: Success"
}

//Function to handle when the user picks incorrectly.
function ResultFailure() {
    //Remove points from score.
    UpdateScore(-10);

    //Update status
    gameStatus.innerText = "Incorrect. You LOST 10 points!"

    //Debug
    //document.getElementById("debugresult").innerText = "Result: Failure"
}

//Handles user scoring
//  Updates scores
//  Checks if score is a losing (negative) score or if it's a new highscore.'
function UpdateScore(amount) {
    gamePlayerScore += amount;
    gameScoreElement.innerText = gamePlayerScore;

    if (gamePlayerScore <= 0) {
        console.log("Player ran out of points.");
        EndGame();
    }

    if (gamePlayerScore > highScore) {
        gameStatus.innerText = "New high score!! Your score: " + gamePlayerScore + ", previous high score: " + highScore;
        highScore = gamePlayerScore;
        document.getElementById("newhighscore").style.visibility = "visible";
    } else {
        //This allows the "new high score!" message's visibility to update.
        document.getElementById("newhighscore").style.visibility = "hidden";
    }
}

//End of game function, checks if the score is a new highscore.
function CheckEndScore() {
    if (gamePlayerScore > highScore || gamePlayerScore == highScore) {
        highScore = gamePlayerScore;
        document.getElementById("highscorepoints").innerText = highScore;
    }
}

//The game timer. Ran in an interval.
//  Runs on one-second (1000ms) intervals.
//  It is always running in the background.
//      However, when GameStart or GameEnd are called is when it changes state to do something or stop doing something.
var timerInterval = setInterval(function () {
    //-1 is the "not counting" value. Very much hardcoded nastiness.
    if (currentGameTimer == -1) {
        gameTimer.innerText = 0;
    } else {
        //Debug log. Stuck in an else so that non-default (!= -1) timer values won't spam up the console.
        console.log("Timer value: " + currentGameTimer + " -- timerRun value: " + timerRun);
    }

    if (timerRun == true) {
        currentGameTimer -= 1;
        gameTimer.innerText = currentGameTimer;

        if (currentGameTimer <= 0) {
            console.log("Timer has hit zero.");
            EndGame();
        }
    }
}, 1000);