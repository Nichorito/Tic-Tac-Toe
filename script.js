/*
** The gameboard represents the state of the game.  
** Each square has a cell, which will be defined later
** We will use a later method to mark the cells with an X or an O
*/

function Gameboard() {
    const board = [];
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
        console.log(board[column][row])
        if (board[column][row].getValue() === 0) {
            console.log("Valid Move")
            board[column][row].addMarker(player) 
            return true;
        }
        else {
            console.log(`that is an invalid move on ${column}, ${row}`)
            return false;
        };
    }

    //Prints the board to the console after each players turn
    const printBoard = () => {
        const boardwithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardwithCellValues);
        return boardwithCellValues;
    }

    //Provide interactable interface for application
    return { getBoard, placeMarker, printBoard };
}

/* 
** A cell represents a square on the 3x3 grid and can be marked by:
** - : Blank square,
** 1 : Player one's mark,
** O2 : Player two's mark 
*/

function Cell() {
    let value = 0;

    // Change cell value
    const addMarker = (player) => {
        value = player;
    }
    const getValue = () => value;

    return { addMarker, getValue };
}

/*
** The GameController is responsible for switcing turns and placing player markers
** It also determines when the game is over and increments winning players score
*/

function GameController(playerOneName = "Nicholas", playerTwoName = "Guest") {

    //Create the board
    const board = Gameboard();

    //Create player objects with name and marker type
    const players = [
        {
            name: playerOneName,
            mark: 1 
        },
        {
            name: playerTwoName,
            mark: 2
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    //Will be used for console declaration and later for UI 
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }

    const checkWinCondition = () => {
        const currentBoard = board.printBoard();
        //Check for horizontal win conditions
        for (let row = 0; row < 3; row++) {
            if (currentBoard[row][0] === currentBoard[row][1] && currentBoard[row][1] === currentBoard[row][2] && currentBoard[row][0] !== 0) {
                return true;
            }
        }

        //Check for vertical win conditions
        for (let col = 0; col < 3; col++) {
            if (currentBoard[0][col] === currentBoard[1][col] && currentBoard[1][col] === currentBoard[2][col] && currentBoard[0][col] !== 0) {
                return true;
            }
        }

        //Check for diagonal win conditions
        if ((currentBoard[0][0] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][2] && currentBoard[0][0] !== 0) ||
            (currentBoard[0][2] === currentBoard[1][1] && currentBoard[1][1] === currentBoard[2][0] && currentBoard[0][2] !== 0)) {
            return true;
        }

        return false;
    }

    const playRound = (column, row) => {

        //Place player mark on desired column and row
        console.log(`Marking ${column},${row} with ${getActivePlayer().name}'s mark: ${getActivePlayer().mark}`);
        let validMove = board.placeMarker(column, row, getActivePlayer().mark)
        

        //Check whether a player has won, break if they have
        let playerWon = checkWinCondition();
        console.log(playerWon)

        if (playerWon === true) {
            console.log(`CONGRATULATIONS ${getActivePlayer().name.toUpperCase()}!! YOU WON!!!`);
            return;
        }

        //Check whether the desired column and row are available, do not switch turns
        //on an invalid move
        if (validMove === true){
            //Switch turn
            switchPlayerTurn();    
        }

        printNewRound();

    }


    //Initial boot display
    printNewRound();

    return { playRound, getActivePlayer};
}

const game = GameController();