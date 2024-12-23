import "./styles.css";
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

function GameController(playerOneName = "Guest", playerTwoName = "Nicholas") {

    //Create the board and screen
    const board = Gameboard();
    let gameInProgress = true;

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
    console.log("players have been made within gamecontroller")
    //Receive the name DOM element from screenController as newName, set player name
    //to the passed variable
    const setPlayerName = (newName, playerNumber) => {
        players[playerNumber].name = newName;
    };

    //Logic for switching turns
    let activePlayer = players[0];

    const setActivePlayer = (playerNumber) => {
        activePlayer = players[playerNumber];
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        if (activePlayer === players[1]) {
            setTimeout(() => AIMove(), 750); // Use an arrow function to delay the call
        }
    }

    //Will be used for console declaration and later for UI 
    const getActivePlayer = () => activePlayer;

    const incrementScore = () => activePlayer.score++;

    const resetScore = () => {
        players[0].score = 0;
        players[1].score = 0;
    }


    //Creates an updated board within the console, checks if a player has won,
    //and then resets the board if they have

    const printNewRound = () => {
        console.log(`\n\n${getActivePlayer().name}'s turn.`);
        board.printBoard();
    }

    
    //Runs anytime a tile is clicked

    const playRound = (column, row) => {
       // if (gameInProgress == true) {
            const cell = Cell();

            //Place player mark on desired column and row
            console.log(`Marking ${column},${row} with ${getActivePlayer().name}'s mark: ${getActivePlayer().mark}`);
    
            //Generate new board
            printNewRound();
    
            let validMove = board.placeMarker(column, row, getActivePlayer().mark)
    
            //Check whether the desired column and row are available
            if (validMove === true){
    
                //Set color of marker
                cell.setColor(row, column, getActivePlayer().mark)
    
                const currentBoard = board.printBoard();
                const playerWon = checkWinCondition(currentBoard);
                const draw = checkForDraw(currentBoard);
    
                if (playerWon == true) {
                    incrementScore();
                    console.log(`${players[0].name}s' score is ` + players[0].score + `. ${players[1].name}s score is ` + players[1].score);       
                    updateScreenCallback(column, row);     
                    return;
                }
    
                if (draw == true) {
                    console.log("\nDRAW!")
                    updateScreenCallback(column, row);
                    return;
                }
    
                //Switch turn
                switchPlayerTurn();
                return true; 
            }
            else {
                return false;
            }
      //  }
    }

    let updateScreenCallback;

    const setUpdateScreen = (callback) => {
        updateScreenCallback = callback; // Set the callback
    };

    const AIMove = () => {
        const canAIMove = document.querySelector('#AIbutton').value;
        console.log("Can AI move? " + canAIMove + " ; Is the game in progress? " + gameInProgress);
        if (canAIMove === "true" && gameInProgress == true) {
            const bestMove = findBestMove();
            console.log(`AI has chosen to place a mark at ${bestMove.row}, ${bestMove.col}`);
            playRound(bestMove.row, bestMove.col); // Play the chosen move
            updateScreenCallback(bestMove.row, bestMove.col); // Update the screen
        }

            // while (!validMove) {
            //     //Attempt a winning move, if no winning move is possible then check to see if the player 
            //     //is about to win.  If both are null then make a random move
            //     let move = checkForWin();
            //     if (checkForWin() == null) { move = blockPlayer(); }
            //     if (blockPlayer() == null) { move = RandomMove(); }
                
            //     console.log(`AI is attempting to place a mark at ${move[0]},${move[1]}`);
            //     validMove = playRound(move[0], move[1]); // Attempt to play the round and check if valid
            //     if (gameInProgress == false) {return}
            // }

            // Helper function to find the best move
            function findBestMove() {
                const currentBoard = board.printBoard();
                let bestValue = -Infinity;
                let bestMove = { row: -1, col: -1 };

                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (currentBoard[i][j] === '') {
                            currentBoard[i][j] = 'O'; // AI tries a move
                            const moveValue = minimax(currentBoard, 0, false); // Evaluate the move
                            currentBoard[i][j] = ''; // Undo the move

                            //replace the best move if the evaluated move is better
                            if (moveValue > bestValue) {
                                bestValue = moveValue;
                                bestMove = { row: i, col: j };
                            }
                        }
                    }
                }
                //returns the best move possible
                return bestMove;
            }

            // Minimax function to evaluate the best move
            function minimax(board, depth, isMaximizingPlayer) {
                const score = evaluateBoard(board);
                if (score !== 0 || isGameOver(board)) return score; // Base case: terminal node

                //Calculates the best possible move for the AI and gives it a score
                if (isMaximizingPlayer) {
                    let best = -Infinity;

                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (board[i][j] === '') {
                                board[i][j] = 'O'; // AI makes a move
                                best = Math.max(best, minimax(board, depth + 1, false));
                                board[i][j] = ''; // Undo the move
                            }
                        }
                    }
                    return best - depth; // Subtract depth to prefer quicker wins

                //Calculates best possible player move and gives it a score
                } else {
                    let best = Infinity;

                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (board[i][j] === '') {
                                board[i][j] = 'X'; // Player makes a move
                                best = Math.min(best, minimax(board, depth + 1, true));
                                board[i][j] = ''; // Undo the move
                            }
                        }
                    }
                    return best + depth; // Add depth to delay opponent's win
                }
            }

            function evaluateBoard(board) {
                // Check rows, columns, and diagonals for a winner
                for (let i = 0; i < 3; i++) {
                    if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                        if (board[i][0] === 'O') return 10; // AI wins
                        if (board[i][0] === 'X') return -10; // Player wins
                    }
                    if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                        if (board[0][i] === 'O') return 10;
                        if (board[0][i] === 'X') return -10;
                    }
                }
                if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
                    if (board[0][0] === 'O') return 10;
                    if (board[0][0] === 'X') return -10;
                }
                if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
                    if (board[0][2] === 'O') return 10;
                    if (board[0][2] === 'X') return -10;
                }
                return 0; // No winner
            }

            // Check if the game is over (no empty spaces)
            function isGameOver(board) {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (board[i][j] === '') return false;
                    }
                }
                return true;
            }


            //////////OLD CODE////////////
           /* function RandomMove() {
                column = Math.floor(Math.random() * 3); // 0 to 2 for columns
                row = Math.floor(Math.random() * 3); // 0 to 2 for rows
                return [column, row];
            }

            //Check if there are any possible moves to win for the AI (runs before the blocking function)
            function checkForWin() {
                const currentBoard = board.printBoard();
                
                // Check rows
                for (let i = 0; i < 3; i++) {
                    if (currentBoard[i][0] === 'O' && currentBoard[i][1] === 'O' && currentBoard[i][2] === '') return [i, 2];
                    if (currentBoard[i][0] === 'O' && currentBoard[i][2] === 'O' && currentBoard[i][1] === '') return [i, 1];
                    if (currentBoard[i][1] === 'O' && currentBoard[i][2] === 'O' && currentBoard[i][0] === '') return [i, 0];
                    
                }
                // Check columns
                for (let j = 0; j < 3; j++) {
                    if (currentBoard[0][j] === 'O' && currentBoard[1][j] === 'O' && currentBoard[2][j] === '') return [2, j];
                    if (currentBoard[0][j] === 'O' && currentBoard[2][j] === 'O' && currentBoard[1][j] === '') return [1, j];
                    if (currentBoard[1][j] === 'O' && currentBoard[2][j] === 'O' && currentBoard[0][j] === '') return [0, j];
                    
                }
                // Check diagonals
                if (currentBoard[0][0] === 'O' && currentBoard[1][1] === 'O' && currentBoard[2][2] === '') return [2, 2];
                if (currentBoard[0][0] === 'O' && currentBoard[2][2] === 'O' && currentBoard[1][1] === '') return [1, 1];
                if (currentBoard[1][1] === 'O' && currentBoard[2][2] === 'O' && currentBoard[0][0] === '') return [0, 0];
                
                if (currentBoard[0][2] === 'O' && currentBoard[1][1] === 'O' && currentBoard[2][0] === '') return [2, 0];
                if (currentBoard[0][2] === 'O' && currentBoard[2][0] === 'O' && currentBoard[1][1] === '') return [1, 1];
                if (currentBoard[1][1] === 'O' && currentBoard[2][0] === 'O' && currentBoard[0][2] === '') return [0, 2];

                console.log("No win condition found")
                // No blocking move found
                return null;
            }

            // Check if the player is about to win and block them
            function blockPlayer() {
                const currentBoard = board.printBoard();
                
                // Check rows
                for (let i = 0; i < 3; i++) {
                    if (currentBoard[i][0] === 'X' && currentBoard[i][1] === 'X' && currentBoard[i][2] === '') return [i, 2];
                    if (currentBoard[i][0] === 'X' && currentBoard[i][2] === 'X' && currentBoard[i][1] === '') return [i, 1];
                    if (currentBoard[i][1] === 'X' && currentBoard[i][2] === 'X' && currentBoard[i][0] === '') return [i, 0];
                    
                }
                // Check columns
                for (let j = 0; j < 3; j++) {
                    if (currentBoard[0][j] === 'X' && currentBoard[1][j] === 'X' && currentBoard[2][j] === '') return [2, j];
                    if (currentBoard[0][j] === 'X' && currentBoard[2][j] === 'X' && currentBoard[1][j] === '') return [1, j];
                    if (currentBoard[1][j] === 'X' && currentBoard[2][j] === 'X' && currentBoard[0][j] === '') return [0, j];
                    
                }
                // Check diagonals
                if (currentBoard[0][0] === 'X' && currentBoard[1][1] === 'X' && currentBoard[2][2] === '') return [2, 2];
                if (currentBoard[0][0] === 'X' && currentBoard[2][2] === 'X' && currentBoard[1][1] === '') return [1, 1];
                if (currentBoard[1][1] === 'X' && currentBoard[2][2] === 'X' && currentBoard[0][0] === '') return [0, 0];
                
                if (currentBoard[0][2] === 'X' && currentBoard[1][1] === 'X' && currentBoard[2][0] === '') return [2, 0];
                if (currentBoard[0][2] === 'X' && currentBoard[2][0] === 'X' && currentBoard[1][1] === '') return [1, 1];
                if (currentBoard[1][1] === 'X' && currentBoard[2][0] === 'X' && currentBoard[0][2] === '') return [0, 2];

                console.log("No win condition found")
                // No blocking move found
                return null;
            }
        
            console.log(`AI has placed a mark at ${column},${row}`);
            updateScreenCallback(column, row);
            return {column, row};
        }*/
        
    };

    const clearGrid = () => {
        console.log("\nResetting screen")
        board.resetBoard();
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
        gameInProgress = true;
        });
    }

    const checkForDraw = (currentBoard) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (currentBoard[i][j] === '') {
                    return false; // There's at least one empty space, not a draw
                }
            }
        }
        console.log("Game is draw")
        gameInProgress = false;
        return true;
    }
    
    //Checks to see whehter a player has made 3 of a row horizontally, vertically, or diagonally
    const checkWinCondition = (currentBoard) => {
        //Check for horizontal win conditions
        for (let row = 0; row < 3; row++) {
            if (currentBoard[row][0] === currentBoard[row][1] && currentBoard[row][1] === currentBoard[row][2] && currentBoard[row][0] !== '') {
                console.log(`CONGRATULATIONS ${getActivePlayer().name.toUpperCase()}!! YOU WON!!!`);
                gameInProgress = false;
                return true;
            }
        }

        //Check for vertical win conditions
        for (let col = 0; col < 3; col++) {
            if (currentBoard[0][col] === currentBoard[1][col] && currentBoard[1][col] === currentBoard[2][col] && currentBoard[0][col] !== '') {
                console.log(`CONGRATULATIONS ${getActivePlayer().name.toUpperCase()}!! YOU WON!!!`);
                gameInProgress = false;
                return true;
            }
        }

        //Check for diagonal win conditions
        if ((currentBoard[0][0] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][2] && currentBoard[0][0] !== '') ||
            (currentBoard[0][2] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][0] && currentBoard[0][2] !== '')) {
                console.log(`CONGRATULATIONS ${getActivePlayer().name.toUpperCase()}!! YOU WON!!!`);
                gameInProgress = false;
                return true;
        }

        return false;
    }


    //Initial boot display
    printNewRound();

    return { playRound, AIMove, setUpdateScreen, clearGrid, resetScore, getActivePlayer, setActivePlayer, checkWinCondition, checkForDraw, switchPlayerTurn, setPlayerName, players, getBoard: board.getBoard, printBoard: board.printBoard, gameInProgress };
    
}



/////////////////////
//SCREEN CONTROLLER//
/////////////////////

//Brings in all game functions to be tied into UI elements
function ScreenController() {
    const game = GameController();
    const players = game.players;
    

    //Get HTML elements and store as variables
    const activePlayerDiv = document.querySelector('#active-player');
    const boardDiv = document.querySelector('.grid');
    const playerOneScore = document.querySelector('#player1-score');
    const playerTwoScore = document.querySelector('#player2-score');
    const playerOneName = document.querySelector('#player-1');
    const playerTwoName = document.querySelector('#player-2');
    const newGameButton = document.querySelector('#new-game');
    const AIbutton = document.querySelector('#AIbutton');

    
    //Set game as active (players can place tokens)
    let gameInProgress = true;

    //Name Updated (Called when the edit button is clicked)
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
        //Edit player 2 name
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
        const draw = game.checkForDraw(currentBoard);
        const activePlayer = game.getActivePlayer();

        //Display the current turn
        activePlayerDiv.textContent = `${activePlayer.name}'s turn`;

        //Update player score display after each round
        playerOneScore.textContent = players[0].score;
        playerTwoScore.textContent = players[1].score;

        //Update players names when changed
        playerOneName.textContent = players[0].name.toUpperCase();
        playerTwoName.textContent = players[1].name.toUpperCase();

        // Loop through the currentBoard and update each cell
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                const cell = document.querySelector(`[data-column="${column}"][data-row="${row}"]`);
                cell.textContent = board[row][column].getValue(); // Assuming getValue() returns the marker (X, O or empty string)
            }
        }
    
        if (playerWon === true){
            //Display the winner
            activePlayerDiv.textContent = `${activePlayer.name} Wins!`;

            //Disable the flow of the game
            gameInProgress = false;

            //Display new game button
            newGameButton.style.display = 'block';
        }        

        //Draw logic
        if (draw === true){
            //Display the winner
            activePlayerDiv.textContent = `DRAW!`;

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

    //Toggle AI on and off
    AIbutton.addEventListener('click', () => {
        // Toggle the AI on or off
        AIbutton.value = AIbutton.value === "true" ? "false" : "true";

        game.setActivePlayer(0);

        // Change button color based on AI state
        if (AIbutton.value === "false"){
            AIbutton.textContent = "2 PLAYER"
            AIbutton.style.color = "#FBF5E6"
        }
        else {
            AIbutton.textContent = "AI"
            AIbutton.style.color = "#FBF5E6"
        }
        // Reset board when AI is toggled
        game.resetScore();
        game.clearGrid();
        updateScreen();
    });

    boardDiv.addEventListener('click', clickHandler);

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
        game.clearGrid();

        newGameButton.style.display = 'none';
        game.switchPlayerTurn();
        console.log(activePlayer.name);
        activePlayerDiv.textContent = `${activePlayer.name}'s turn`;
        console.log("Starting new round...");

        //Refresh the screen
        updateScreen();
    });

    game.setUpdateScreen(updateScreen)

    updateScreen();

    return {displayWinner, updateScreen }
}

ScreenController();