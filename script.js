let board;
let score = 0;
let rows = 4;
let columns = 4;
let boardHistory = [];
let lives = 3;

window.onload = function() {
    setGame();
    document.getElementById("new-game-btn").addEventListener("click", newGame);
    document.getElementById("undo-btn").addEventListener("click", undo);
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
    saveToHistory();

    document.getElementById("board").addEventListener("click", handleTileClick);
}

function handleTileClick(e) {
    let target = e.target;
    if (target.classList.contains("x99")) {
        let coords = target.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (lives > 0) {
            lives--;
            updateLivesDisplay();

            board[r][c] = 0;
            updateTile(target, 0);
            
            alert("Nyawa digunakan!");
            saveToHistory();
        } else {
            alert("Maaf, nyawa habis!");
        }
    }
}

function updateLivesDisplay() {
    const hearts = document.querySelectorAll('.heart-icon');
    hearts.forEach((heart, index) => {
        if (index < lives) {
            heart.classList.remove('used');
        } else {
            heart.classList.add('used');
        }
    });
}

function newGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    lives = 3;
    document.getElementById("score").innerText = score;
    boardHistory = [];
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 0);
        }
    }
    
    setTwo();
    setTwo();
    saveToHistory();
    updateLivesDisplay();
}

function saveToHistory() {
    let currentBoard = board.map(row => [...row]);
    boardHistory.push({ board: currentBoard, score: score });
    if (boardHistory.length > 10) {
        boardHistory.shift();
    }
}

function undo() {
    if (boardHistory.length > 1) {
        boardHistory.pop();
        let lastState = boardHistory[boardHistory.length - 1];
        board = lastState.board.map(row => [...row]);
        score = lastState.score;
        document.getElementById("score").innerText = score;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                updateTile(tile, board[r][c]);
            }
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.className = "tile";
    
    if (num > 0) {
        tile.innerText = num;
        if (num === 99) {
            tile.classList.add("x99");
            tile.innerText = "";
        } else {
            tile.classList.add("x" + num.toString());
        }

        if (num <= 4) {
            tile.style.color = "#72675d";
        }
    } else {
        tile.classList.add("x0");
    }
}

document.addEventListener("keyup", (e) => {
    let oldBoard = board.map(row => [...row]);
    
    if (e.code == "ArrowLeft") {
        slideLeft();
    } else if (e.code == "ArrowRight") {
        slideRight();
    } else if (e.code == "ArrowUp") {
        slideUp();
    } else if (e.code == "ArrowDown") {
        slideDown();
    }
    
    let isChanged = JSON.stringify(oldBoard) !== JSON.stringify(board);
    if (isChanged) {
        setTwo();
        saveToHistory();
    }
    
    document.getElementById("score").innerText = score;
});

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            let randomChance = Math.random();
            if (randomChance < 0.05) {
                board[r][c] = 99;
            } else {
                board[r][c] = 2;
            }

            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
            tile.classList.add("tile-new");
            found = true;
        }
    }
}