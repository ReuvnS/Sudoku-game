//our 4 boards
const board1 = [
  ["6", "8", "5", "3", "2", "9", "1", "7", "4"],
  ["9", "7", "1", "4", "8", "5", "3", "2", "6"],
  ["2", "3", "4", "7", "6", "1", "8", "5", "9"],
  ["3", "6", "2", "5", "7", "4", "9", "8", "1"],
  ["5", "4", "9", "6", "1", "8", "7", "3", "2"],
  ["7", "1", "8", "2", "9", "3", "4", "6", "5"],
  ["8", "2", "3", "9", "4", "6", "5", "1", "7"],
  ["1", "9", "7", "8", "5", "2", "6", "4", "3"],
  ["4", "5", "6", "1", "3", "7", "2", "9", "8"],
];

const board2 = [
  ["3", "1", "6", "5", "7", "8", "4", "9", "2"],
  ["5", "2", "9", "1", "3", "4", "7", "6", "8"],
  ["4", "8", "7", "6", "2", "9", "5", "3", "1"],
  ["2", "6", "3", "4", "1", "5", "9", "8", "7"],
  ["9", "7", "4", "8", "6", "3", "1", "2", "5"],
  ["8", "5", "1", "7", "9", "2", "6", "4", "3"],
  ["1", "3", "8", "9", "4", "7", "2", "5", "6"],
  ["6", "9", "2", "3", "5", "1", "8", "7", "4"],
  ["7", "4", "5", "2", "8", "6", "3", "1", "9"],
];

const board3 = [
  ["7", "1", "2", "5", "8", "3", "6", "9", "4"],
  ["6", "3", "9", "7", "1", "4", "2", "5", "8"],
  ["8", "4", "5", "2", "6", "9", "1", "7", "3"],
  ["5", "2", "1", "4", "3", "6", "9", "8", "7"],
  ["3", "6", "7", "9", "2", "8", "4", "1", "5"],
  ["4", "9", "8", "1", "7", "5", "3", "2", "6"],
  ["1", "8", "4", "6", "9", "7", "5", "3", "2"],
  ["2", "5", "3", "8", "4", "1", "7", "6", "9"],
  ["9", "7", "6", "3", "5", "2", "8", "4", "1"],
];

const board4 = [
  ["3", "1", "6", "5", "7", "8", "4", "9", "2"],
  ["5", "2", "9", "1", "3", "4", "7", "6", "8"],
  ["4", "8", "7", "6", "2", "9", "5", "3", "1"],
  ["2", "6", "3", "4", "1", "5", "9", "8", "7"],
  ["9", "7", "4", "8", "6", "3", "1", "2", "5"],
  ["8", "5", "1", "7", "9", "2", "6", "4", "3"],
  ["1", "3", "8", "9", "4", "7", "2", "5", "6"],
  ["6", "9", "2", "3", "5", "1", "8", "7", "4"],
  ["7", "4", "5", "2", "8", "6", "3", "1", "9"],
];

// Create global variables
var timer;//how much time has left
var timeRemaining;//timer in sec
var lives;//lives remaining
var selectedNum;//selected number from the bank that we wanna place in the board
var selectedTile;//selcected p in the board
var disableSelect;//true or false (enabled/disabled to select numbers and tiles in current time)
var boardRand;//save the board that was selected in current time

//the onload function run when the window load
window.onload = function () {
  id("header").classList.add("hidden");
  id("login-error-msg").classList.add("hidden");
  id("start-btn").classList.add("hidden");
  id("solve-btn").classList.add("hidden");
  const loginForm = document.getElementById("login-form");
  const loginButton = document.getElementById("login-form-sumbit");
  const loginErrorMsg = document.getElementById("login-error-msg");

  // Define the login button from HTML and do only validiation
  loginButton.addEventListener("click", (e) => {
    //prevent the onload function to run again when login button clicked
    e.preventDefault();
    //Set the username and password values and the rules for them
    const username = loginForm.username.value;
    const password = loginForm.password.value;
    //if true hide all login elements & show welcome elements
    if (username === "abcd" && password === "1234") {
      id("loginWindow").classList.add("hidden");
      id("login-error-msg").classList.add("hidden");
      //when this one clicked we go to goToGame function
      id("start-btn").classList.remove("hidden");
      id("welcome").classList.remove("hidden");
      id("start-btn").classList.add("hidden");
    } else {
      loginErrorMsg.style.opacity = 1;
      id("login-error-msg").classList.remove("hidden");
    }
  });

  //add click event listener to each number in number container
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].addEventListener("click", function () {
      //if selecting is not disable = means enabled
      if (!disableSelect) {
        //if number is already selected (already clicked once)
        if (this.classList.contains("selected")) {
          //then remove selection and clear value of selectedNum
          this.classList.remove("selected");
          selectedNum = null;
        } else {
          //deselect all other numbers
          for (let i = 0; i < 9; i++) {
            id("number-container").children[i].classList.remove("selected");
          }
          //select it and update selectedNum variable
          this.classList.add("selected");
          selectedNum = this;
          updateMove();
        }
      }
    });
  }
};

//used once after welcome page, to hide and show elements
function goToGame() {
  id("header").classList.remove("hidden");
  id("start-btn").classList.remove("hidden");
  id("solve-btn").classList.remove("hidden");
  id("youLose").classList.add("hidden");
  id("youWin").classList.add("hidden");
  id("welcome").classList.add("hidden");
  id("board").classList.add("hidden");
}

//for all the 'start-btn' buttons - when the user choose required stats (diff & time) and clicked 'start new game' btn
function startGame() {
  id("youLose").classList.add("hidden");
  id("youWin").classList.add("hidden");
  id("stats").classList.remove("hidden");
//to save the board as a string
  let board;
  //to save the num that was chozen between 1-4
  let rand;
  //get random board
  rand = Math.floor(Math.random() * 4) + 1;
  if (rand == 1) {
    boardRand = board1;
  } else if (rand == 2) {
    boardRand = board2;
  } else if (rand == 3) {
    boardRand = board3;
  } else {
    boardRand = board4;
  }
  //send diff and board to createBoardDiff function and save in board
  if (id("diff-1").checked) {
    board = createBoardDiff("diff-1", boardRand);
  } else if (id("diff-2").checked) {
    board = createBoardDiff("diff-2", boardRand);
  } else {
    board = createBoardDiff("diff-3", boardRand);
  }
  //Set lives to 3 and enable selecting numbers and tiles
  lives = 3;
  disableSelect = false;
  id("lives").textContent = "Lives Remaining: 3";
  //Creates board based on difficulty
  generateBoard(board);
  //   Starts the timer
  startTimer();
  // Show number container
  id("number-container").classList.remove("hidden");
}

  //saves board based on difficulty inside a string and returns it
  function createBoardDiff(diff, boardRand) {
  //save the board as a string
  let str = "";
  for (let row = 0; row < boardRand.length; row++) {
    for (let col = 0; col < boardRand[row].length; col++) {
      str += boardRand[row][col];
    }
  }
  //show 75%
  if (diff == "diff-1") {
    for (let i = 0; i < 21; i++) {
      let num = Math.floor(Math.random() * 81);
      if (str.charAt(num) !== "-") str = replaceAt(str, num, "-");
      else i = i - 1;
    }
  }
  //show 50% 
  else if (diff == "diff-2") {
    for (let i = 0; i < 41; i++) {
      let num = Math.floor(Math.random() * 81);
      if (str.charAt(num) !== "-") str = replaceAt(str, num, "-");
      else i = i - 1;
    }
  }
  //show 20% 
  else {
    for (let i = 0; i < 60; i++) {
      let num = Math.floor(Math.random() * 81);
      if (str.charAt(num) !== "-") str = replaceAt(str, num, "-");
      else i = i - 1;
    }
  }
  return str;
}

//replace a character in the board to '-'
function replaceAt(str, index, replace) {
  return str.substring(0, index) + replace + str.substring(index + 1);
}

//timer function
function startTimer() {
  // Sets time remining based on input(time the user picked)
  if (id("time-1").checked) timeRemaining = 180;//3 min
  else if (id("time-2").checked) timeRemaining = 300;//5 min
  else timeRemaining = 600;//10 min
  // Sets timer for first second
  id("timer").textContent = 'Time Left: '+ timeConversion(timeRemaining);
  // Sets timer to update every sec
  timer = setInterval(function () {
    timeRemaining--;
    // If no time remaining end the game
    if (timeRemaining === 0) endGame();
    //show user time left
    id("timer").textContent = 'Time Left: '+ timeConversion(timeRemaining);
  }, 1000);
}

// Converts secs into string of MM:SS format - returns to startTimer & endGame funcs
function timeConversion(time) {
  //time in sec
  //turns time to minutes by dividing in 60
  let minutes = Math.floor(time / 60);
  //if minutes is 3/5 add '0' before
  if (minutes < 10) minutes = "0" + minutes;
  //checks sec left by % 60 - division's remainer is the sec left
  let seconds = time % 60;
  //is sec in 1 digit number add '0' before
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}

//when btn 'solve' is clicked
function createSolvedBoard() {
  //create the solve board based on current board saved in boardRand and save it in solution as a string
  let solution = "";
  for (let row = 0; row < boardRand.length; row++) {
    for (let col = 0; col < boardRand[row].length; col++) {
      solution += boardRand[row][col];
    }
  }
  //put the answer in every tile (p) in the board based on the solution str
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].textContent = solution[i];
  }
  //clear timer
  clearTimeout(timer);
  //disable selection of numbers and tiles
  disableSelect = true;
}

function generateBoard(board) {
  // Clear previous board
  clearPrevious();
  // idCount used to save tile id one by one
  let idCount = 0;
  // Create 81 tiles(p's)
  for (let i = 0; i < 81; i++) {
    // Create a new paragraph elemnt
    let tile = document.createElement("p");
    // if the tile is not supposed to be blank
    if (board.charAt(i) != "-") {
      // Set tile text to current number
      tile.textContent = board.charAt(i);
    } else {
      // Add click event listener to empty tiles
      tile.addEventListener("click", function () {
        // if selecting is not disabled = enabled
        if (!disableSelect) {
          //if the tile is already selected(already clicked once)
          if (tile.classList.contains("selected")) {
            //then remove selection
            tile.classList.remove("selected");
            //set var to null
            selectedTile = null;
          } else {
            //deselect all other tiles
            for (let i = 0; i < 81; i++) {
              qsa(".tile")[i].classList.remove("selected");
            }
            //add selection and update variable
            tile.classList.add("selected");
            selectedTile = tile;
            updateMove();
          }
        }
      });
    }
    //Assign tile id
    tile.id = idCount;
    // Increment(move) for next tile
    idCount++;
    // Add tile class to all tiles
    tile.classList.add("tile");
    // Create dividing lines on the board
    if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
      tile.classList.add("bottomBoarder");
    }
    if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
      tile.classList.add("rightBoarder");
    }
    //add class list addB to required tiles
    if (
        (tile.id > 2 && tile.id < 6) ||
        (tile.id > 11 && tile.id < 15) ||
        (tile.id > 20 && tile.id < 24) ||
        (tile.id > 26 && tile.id < 30) ||
        (tile.id > 35 && tile.id < 39) ||
        (tile.id > 44 && tile.id < 48) ||
        (tile.id > 32 && tile.id < 36) ||
        (tile.id > 41 && tile.id < 45) ||
        (tile.id > 50 && tile.id < 54) ||
        (tile.id > 56 && tile.id < 60) ||
        (tile.id > 65 && tile.id < 69) ||
        (tile.id > 74 && tile.id < 78)
    )
      tile.classList.add("addB");
    // Add tile to board
    id("board").appendChild(tile);
  }
}
//put the number selected in tile board selected if its correct/ lower lives in not
function updateMove() {
  //if a tile and a number is selected
  if (selectedTile && selectedNum) {
    // set the tile to the correct number
    selectedTile.textContent = selectedNum.textContent;
    // if the number matches the corresponding number in the solution key
    if (checkCorrect(selectedTile)) {
      // deselect the tiles
      selectedTile.classList.remove("selected");
      selectedNum.classList.remove("selected");
      // clear the selected variables
      selectedNum = null;
      selectedTile = null;
      // check if board is completed
      if (checkDone()) {
        endGame();
      }
      // if the number does not match the solution key
    } else {
      //disable selecting new numbers for one second
      disableSelect = true;
      //make the tile turn red
      selectedTile.classList.add("incorrect");
      //run in one second
      setTimeout(function () {
        //subtract lives by one
        lives--;
        //if no lives left end game
        if (lives === 0) {
          endGame();
        } else {
          //if lives is not equal to zero
          //update lives text
          id("lives").textContent = "Lives remaining: " + lives;
          // renable selecting numbers and tiles
          disableSelect = false;
        }
        // restore tile color and remove selected from both
        selectedTile.classList.remove("incorrect");
        selectedTile.classList.remove("selected");
        selectedNum.classList.remove("selected");
        //clear the tiles text and clear selected variables
        selectedTile.textContent = "";
        selectedTile = null;
        selectedNum = null;
      }, 1000);
    }
  }
}

//checks if board is full or not - returns to updateMove func
function checkDone() {
  let tiles = qsa(".tile");
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].textContent === "") return false;
  }
  return true;
}

//ends the game
function endGame() {
  //Disable move and stop timer
  disableSelect = true;
  clearTimeout(timer);
  // display win or loose message
  if (lives === 0 || timeRemaining === 0) {
    id("youLose").classList.remove("hidden");
    id("lWindow").textContent = "Lives remaining: " + lives;
    id("tR").textContent = "  Time left: " + timeConversion(timeRemaining);
  } else {
    id("youWin").classList.remove("hidden");
    id("wWindow").textContent = "Lives remaining: " + lives;
    id("wR").textContent = "  Time left: " + timeConversion(timeRemaining);
  }
}

//checks if the number of the user is in the right place - returns to updateMove func
function checkCorrect(tile) {
  //puts boardRand arr in solution as str
  let solution = "";
  for (let row = 0; row < boardRand.length; row++) {
    for (let col = 0; col < boardRand[row].length; col++) {
      solution += boardRand[row][col];
    }
  }
  //if tile number is equal to solution number
  if (solution.charAt(tile.id) === tile.textContent) return true;
  else return false;
}

//clears the pre board - returns to generateBoard func
function clearPrevious() {
  // access all of the tiles
  let tiles = qsa(".tile");
  // Remove each tile
  for (let i = 0; i < tiles.length; i++) {
    tiles[i].remove();
  }
  // If there is a timer clear it
  if (timer) clearTimeout(timer);
  // Deselect any numbers
  for (let i = 0; i < id("number-container").children.length; i++) {
    id("number-container").children[i].classList.remove("selected");
  }
  // Clear selected vars
  return (selectedTile = null);
  return (selectedNum = null);
}

// Helper functions
// in order to take id's from html - used in all funcs
function id(id) {
  return document.getElementById(id);
}
// in order to create an array of tiles - used in 4 funcs
function qsa(selector) {
  //returns a static (not live) NodeList representing a list of the document's elements that match the specified group of selectors.
  return document.querySelectorAll(selector);
}
