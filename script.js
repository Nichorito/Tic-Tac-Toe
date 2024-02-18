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
        if (board[column][row] === 0) {
            console.log("Valid Move")
            board[row][column].addMarker(player) 
        }
        else {console.log(`that is an invalid move on ${board[column][row]}`)}
    }

    //Prints the board to the console after each players turn
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
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

    const playRound = (column, row) => {

        //Place player mark on desired column and row
        console.log(`Marking ${column},${row} with ${getActivePlayer().name}'s mark: ${getActivePlayer().mark}`);
        board.placeMarker(column, row, getActivePlayer().mark)

        //Switch turn
        switchPlayerTurn();
        printNewRound();
    }

    //Initial boot display
    printNewRound();

    return { playRound, getActivePlayer};
}

const game = GameController();