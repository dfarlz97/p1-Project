let gameBoard = document.querySelector('.grid')
const baseUrl = "http://localhost:3000/players"
const formContainer = document.getElementById('player-signup')
const userForm = document.getElementById("player-form")
const scoreDisplay = document.querySelector("#score > h4")
let currentPlayer = JSON.parse(localStorage.getItem("player"))


document.addEventListener("DOMContentLoaded", function() {
    getPlayers()
    if(!!currentPlayer){
        console.log('HERE')
        userForm.style.display = "none"

        const userDiv = document.createElement("div")
        const greetingH4 = document.createElement("h4")
        const pTag = document.createElement("p")

        greetingH4.innerText = `Welcome back, ${currentPlayer.userName}`
        pTag.innerText = `Your current high score is ${currentPlayer.score}`
        userDiv.append(greetingH4, pTag)
        formContainer.appendChild(userDiv)
    } else {
        console.log('NOPE')
    }


    document.addEventListener("keyup", control);
    createBoard()
    startGame()
});

userForm.addEventListener('submit', createPlayer)

function getPlayers(){
    fetch(baseUrl)
    .then(res => res.json())
    .then(players => players.sort((playerA, playerB) => {
        const playerAScore = Number(playerA.score)
        const playerBScore = Number(playerB.score)
        return playerBScore - playerAScore
    }))
    .then(renderRankings)
}
function renderRankings(players){
    for(let i = 0; i < players.length; i++){
        let ranking = i + 1
        renderUserRanking(ranking, players[i])
    }
}

function renderUserRanking(ranking, player){
    const rankingsList = document.getElementById("rankings-list")

    const rankingsRow = document.createElement('tr')

    const rankCol = document.createElement('td')
    rankCol.innerText = ranking
    const userCol = document.createElement('td')
    userCol.innerText = player.userName
    const scoreCol = document.createElement('td')
    scoreCol.innerText = player.score

    rankingsRow.append(rankCol, userCol, scoreCol)
    rankingsList.appendChild(rankingsRow)
}

function createPlayer(e){
    e.preventDefault()

    const userData = {
        userName: userForm.player.value,
        score: scoreDisplay.innerHTML
    }

    fetch(baseUrl, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body: JSON.stringify(userData)
    }).then(res => res.json())
    .then(player => {
        localStorage.setItem("player", JSON.stringify(player))
        getPlayers()
    })

    userForm.reset()
}

let grid = 16;
let snake = { 
    x: 0,
    y: 0,

// snake velocity. moves one grid length every frame in either the x or y direction
dx: grid,
dy: 0,

// keep track of all grids the snake body occupies
cells: [],

// length of the snake. grows after eating item
maxCells: 1 
};

let item = {
    x: 0,
    y: 0
}

let width = 10; // width of grid
let currentIndex = 0; // start at 0 and increment
let itemIndex = 0; // item starts at index 0 as well
let currentSnake = [2, 1, 0]; // snake is in an array
let direction = 1;
let score = 0; // score starts at 0 
let speed = 1; // set speed variable
let intervalTime = 0; // set interval
let interval = 0; // set interval
let gridSquares = [];


function createBoard(){
    for (let i = 0; i < 100; i++) { //iterates through and adds div elements as long as it is less than the area of the grid
      let createSnake = document.createElement("div");
      gameBoard.append(createSnake);
    }
}

function startGame(){
    clearInterval(interval); // stop any previous interval
    let gridSquares = document.querySelectorAll(".grid div");        
    randomItem(gridSquares);
    direction = 1;
    intervalTime = 1000;
    currentSnake = [2, 1, 0];
    currentIndex = 0;
    currentSnake.forEach(index=>gridSquares[index].classList.add("snake"))
    interval = setInterval(moveResult, intervalTime);
}

function moveResult() {
    let gridSquares = document.querySelectorAll(".grid div");
    if(checkForHit(gridSquares)){
        return clearBoard()
    } else {
        let snakeTail = currentSnake.pop();
        gridSquares[snakeTail].classList.remove("snake");
        currentSnake.unshift(currentSnake[0] + direction);
        eatItem(gridSquares, snakeTail);
        gridSquares[currentSnake[0]].classList.add("snake");
    }
  }

function moveSnake(gridSquares) {
    let snakeTail = currentSnake.pop() 
    gridSquares[snakeTail].classList.remove("snake") 
    currentSnake.unshift(currentSnake[0]+direction)  
 
    eatItem(gridSquares, snakeTail)  
    gridSquares[currentSnake[0]].classList.add("snake")  
}

function checkForHit(gridSquares) {
    if(  
        (currentSnake[0] + width >=(width*width) && direction === width) ||
        (currentSnake[0] % width ===width -1 && direction ===1) ||   
        (currentSnake[0] % width === 0 && direction === -1) ||   
        (currentSnake[0] - width <= 0 && direction === -width) ||
        gridSquares[currentSnake[0] + direction].classList.contains("snake")   
        ){ 
            
        return true  
        }else{  
        return false 
        }
}

function eatItem(gridSquares, snakeTail) {
    if(gridSquares[currentSnake[0]].classList.contains("item")) {
      gridSquares[currentSnake[0]].classList.remove("item");
      gridSquares[snakeTail].classList.add("snake");
      currentSnake.push(snakeTail);
      randomItem(gridSquares);
      clearInterval(interval);
      intervalTime = intervalTime * speed;
      interval = setInterval(moveResult, intervalTime);
      keepCount()
    }
  }

function randomItem(gridSquares){
    do {
        itemIndex = Math.floor(Math.random() * gridSquares.length); // selects random position for item
    } 
    while (gridSquares[itemIndex].classList.contains("snake")); // while there is no snake in that position 
        gridSquares[itemIndex].classList.add("item"); // adds item to unoccupied position
    }

function control(e){ 
    if (e.keyCode===39){
        direction = 1 // right 
        console.log('right key')
    }else if (e.keyCode===38){ 
        direction = -width //up arrow: snake will go ten divs up
        console.log('up key')
    }else if (e.keyCode===37){ 
        direction = -1 // left: snake will go left one div
        console.log('left key')
    }else if (e.keyCode===40){
        direction = +width // down: snake head will instantly appear 10 divs below from the current div 
        console.log('right key')
    } 
} 

function clearBoard(){
    if(checkForHit){
        let gridSquares = document.querySelectorAll(".grid div")
        currentSnake.forEach(index=>gridSquares[index].classList.remove("snake"))
        let gridItems = document.querySelectorAll('.item')
        gridItems[0].remove('item')
    }
}

function keepCount(){
    if(eatItem){
        let scoreDisplay = document.querySelector("#score > h4")
        score +=50;
        scoreDisplay.innerHTML = score 
        console.log(score) 
    }
}








