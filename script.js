

/*
** The gameboard represents the state of the game.  
** Each square has a cell, which will be defined later
** We will use a later method to mark the cells with an X or an O
*/

function Gameboard() {
    let board = [];
    const rows = 3;
    const columns = 3;

    for (let i = 0; i < rows ; i++) {
        //declares the next row as an empty array
        board[i] = [];
        //Fills the column array
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // Will later be used to render the board
    const getBoard = () => board;

    // Checks whether the column and row the player chose is available and 
    // if it is, placer a marker there
    const placeMarker = (column, row, player) => {
        if (board[column][row].getValue() === '') {
            console.log("Valid Move")
            board[column][row].addMarker(player) 
            return true;
        }
        else {
            console.log(`that is an invalid move on ${column}, ${row}`)
            return false;
        };
    }

    //Resets the board after win condition has been met
    const resetBoard = () => {
        board.forEach(row => row.forEach(cell => cell.addMarker('')));
    }

    //Prints the board to the console after each players turn
    const printBoard = () => {
        let boardWithCellValues = board.map(row => row.map(cell => cell.getValue()));
        console.log(boardWithCellValues)
        return boardWithCellValues;
    }

    //Provide interface for application
    return { getBoard, placeMarker, printBoard, resetBoard};
}





/* 
** A cell represents a square on the 3x3 grid and can be marked by:
** - : Blank square,
** 1 : Player one's mark,
** O2 : Player two's mark
*/

function Cell() {
    let value = '';

    const setColor = (column, row, activePlayer) => {
        const selectedCell = document.querySelector(`[data-column="${column}"][data-row="${row}"]`);
        selectedCell.classList.add(activePlayer);
    }

    // Change cell value
    const addMarker = (mark) => {
        value = mark;
    }

    const getValue = () => value;

    return { addMarker, getValue, setColor };
}



/*
** The GameController is responsible for switcing turns and placing player markers
** It also determines when the game is over and increments winning players score
*/

function GameController(playerOneName = "Nicholas", playerTwoName = "Guest") {

    //Create the board and screen
    const board = Gameboard();

    //Create player objects with name and marker type
    const players = [
        {
            name: playerOneName,
            mark: "X",
            score: 0
        },
        {
            name: playerTwoName,
            mark: "O",
            score: 0
        }
    ];

    //Receive the name DOM element from screenController as newName, set player name
    //to the passed variable
    const setPlayerName = (newName, playerNumber) => {
        players[playerNumber].name = newName;
    };

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    //Will be used for console declaration and later for UI 
    const getActivePlayer = () => activePlayer;

    const incrementScore = () => activePlayer.score++


    //Creates an updated board within the console, checks if a player has won,
    //and then resets the board if they have

    const printNewRound = () => {
        console.log(`\n\n${getActivePlayer().name}'s turn.`);
        board.printBoard();
    }


    //Runs anytime a tile is clicked

    const playRound = (column, row) => {
        const cell = Cell();

        //Place player mark on desired column and row
        console.log(`Marking ${column},${row} with ${getActivePlayer().name}'s mark: ${getActivePlayer().mark}`);

        //Generate new board
        printNewRound();

        let validMove = board.placeMarker(column, row, getActivePlayer().mark)

        //Check whether the desired column and row are available
        if (validMove === true){

            //Set color of marker
            cell.setColor(row, column, getActivePlayer().name)

            const currentBoard = board.printBoard();
            const playerWon = checkWinCondition(currentBoard);

            if (playerWon == true) {
                incrementScore();
                console.log("Nicholas' score is " + players[0].score + ". Guest score is " + players[1].score);              
                return;
            }

            //Switch turn
            switchPlayerTurn();    
        }
    }

    const resetScreen = () => {
        console.log("\nResetting screen")
        board.resetBoard();
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
        })
    }


     //Checks to see whehter a player has made 3 of a row horizontally, vertically, or diagonally

     const checkWinCondition = (currentBoard) => {
        //Check for horizontal win conditions
        for (let row = 0; row < 3; row++) {
            if (currentBoard[row][0] === currentBoard[row][1] && currentBoard[row][1] === currentBoard[row][2] && currentBoard[row][0] !== '') {
                console.log(`CONGRATULATIONS ${getActivePlayer().name.toUpperCase()}!! YOU WON!!!`);
                return true;
            }
        }

        //Check for vertical win conditions
        for (let col = 0; col < 3; col++) {
            if (currentBoard[0][col] === currentBoard[1][col] && currentBoard[1][col] === currentBoard[2][col] && currentBoard[0][col] !== '') {
                console.log(`CONGRATULATIONS ${getActivePlayer().name.toUpperCase()}!! YOU WON!!!`);
                return true;
            }
        }

        //Check for diagonal win conditions
        if ((currentBoard[0][0] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][2] && currentBoard[0][0] !== '') ||
            (currentBoard[0][2] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][0] && currentBoard[0][2] !== '')) {
                console.log(`CONGRATULATIONS ${getActivePlayer().name.toUpperCase()}!! YOU WON!!!`);
                return true;
        }

        return false;
    }


    //Initial boot display
    printNewRound();

    return { playRound, resetScreen, getActivePlayer, checkWinCondition, switchPlayerTurn, setPlayerName, players, getBoard: board.getBoard, printBoard: board.printBoard};
}



/////////////////////
//SCREEN CONTROLLER//
/////////////////////

function ScreenController() {
    //Brings in all game functions to be tied into UI elements
    const game = GameController();
    const players = game.players;

    const activePlayerDiv = document.querySelector('#active-player');
    const boardDiv = document.querySelector('.grid');

    const playerOneScore = document.querySelector('#player1-score');
    const playerTwoScore = document.querySelector('#player2-score');
    const playerOneName = document.querySelector('#player-1');
    const playerTwoName = document.querySelector('#player-2');

    const newGameButton = document.querySelector('#new-game');
    
    let gameInProgress = true;

    const updateName = (playerNumber) => {
        
        //Edit player 1 name
        if (playerNumber === 1) {
            let openOrClosed;
            openOrClosed = openOrClosed === false ? true : false

            const playerInput = document.querySelector('#player1-input');
            playerInput.style.display = playerInput.style.display === "none" ? 'block' : 'none';
            game.setPlayerName(playerInput.value, 0);

            //Change name upon closing
            if (openOrClosed === false){
                const playerNameElement = document.querySelector('#player-1');
                playerNameElement.textContent = playerInput.value.toUpperCase();
            }
        }
        else if (playerNumber === 2) {
            let openOrClosed;
            openOrClosed = openOrClosed === false ? true : false

            const playerInput = document.querySelector('#player2-input');
            playerInput.style.display = playerInput.style.display === "none" ? 'block' : 'none';
            game.setPlayerName(playerInput.value, 1)

            //Change name upon closing
            if (openOrClosed === false){
                const playerNameElement = document.querySelector('#player-2');
                playerNameElement.textContent = playerInput.value.toUpperCase();
            }
        }
        
        updateScreen();
    }

    //Runs after the round has been played, updates current information
    const updateScreen = (column, row) => {

        //Get updated board and player turn
        const board = game.getBoard();
        const currentBoard = game.printBoard();
        const playerWon = game.checkWinCondition(currentBoard);
        const activePlayer = game.getActivePlayer();

        //Display the current turn
        activePlayerDiv.textContent = `${activePlayer.name}'s turn`;

        //Update player score display after each round
        playerOneScore.textContent = players[0].score;
        playerTwoScore.textContent = players[1].score;

        //Update players names when changed
        playerOneName.textContent = players[0].name.toUpperCase();
        playerTwoName.textContent = players[1].name.toUpperCase();

        //Gets the cell index and sets the text content equal to the console array value
        const cell = document.querySelector(`[data-column="${column}"][data-row="${row}"]`);
        cell.textContent = board[row][column].getValue();
    
        if (playerWon === true){
            //Display the winner
            activePlayerDiv.textContent = `${activePlayer.name} Wins!`;

            //Disable the flow of the game
            gameInProgress = false;

            //Display new game button
            newGameButton.style.display = 'block';
        }
        
    }

    function clickHandler(e) {
        if (!gameInProgress) return;

        //Store the selected row and column in constants
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;
        

        if (!selectedColumn || !selectedRow) return;

        //Play a round on click
        game.playRound(selectedRow, selectedColumn);
        
        //Update the screen with current information
        updateScreen(selectedColumn, selectedRow);
    }

    boardDiv.addEventListener('click', clickHandler);


    function displayWinner() {

    }

    //When an edit button is clicked tell the edit function which button has been clicked
    document.querySelector('#edit-player1-name').addEventListener('click', function() {
        updateName(1);
    });
    
    document.querySelector('#edit-player2-name').addEventListener('click', function() {
        updateName(2);
    });

    //Reset the screen when the new game button is clicked
    newGameButton.addEventListener('click', function() {
        const activePlayer = game.getActivePlayer();

        //Make tiles clickable again
        gameInProgress = true;
        //Reset the screen
        game.resetScreen();

        newGameButton.style.display = 'none';
        game.switchPlayerTurn();
        console.log(activePlayer.name);
        activePlayerDiv.textContent = `${activePlayer.name}'s turn`;
        console.log("Starting new round...");

        //Refresh the screen
        updateScreen();
    });

    updateScreen();

    return {displayWinner}
}

ScreenController();