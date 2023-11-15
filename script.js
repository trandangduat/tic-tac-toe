const Game = (function() {
    const id = function (i, j) {
        return (3 * parseInt(i) + parseInt(j));
    }
    const gameBoard = (function () {
        let board = new Array(9);
        const reset = function () {
            for (let i = 0; i < 9; i++) board[i] = -1;
        };
        const fillCell = (i, j, type) => board[id(i, j)] = type;
        const check = function() {
            let line;
            let type = -1;
            // Check 2 diags
            if (board[0] > -1 && board[0] == board[4] && board[4] == board[8]) {
                line = [0, 4, 8];
                type = board[0];
            }
            if (board[2] > -1 && board[2] == board[4] && board[4] == board[6]) {
                line = [2, 4, 6];
                type = board[2];
            }
            // Check row & col
            for (let i = 0; i < 3; i++) {
                if (board[id(i, 0)] > -1 
                    && board[id(i, 0)] == board[id(i, 1)] 
                    && board[id(i, 1)] == board[id(i, 2)]) {
                        line = [id(i, 0), id(i, 1), id(i, 2)];
                        type = board[id(i, 0)];
                    }
                if (board[id(0, i)] > -1 
                    && board[id(0, i)] == board[id(1, i)]
                    && board[id(1, i)] == board[id(2, i)]) {
                        line = [id(0, i), id(1, i), id(2, i)];
                        type = board[id(0, i)];
                    }
            }
            return {line, type};
        }
        return { board, reset, check, fillCell };
    })();

    const htmlBoard = (function() {
        let board = new Array(9);
        let gameBoardContainer = document.getElementById("game-board");
        for (let i = 0; i < 9; i++) {
            board[i] = document.createElement('div');
            board[i].setAttribute("id", "cell");
            board[i].innerHTML = '';
            gameBoardContainer.appendChild(board[i]);
        }
        const reset = function() {
            for (let i = 0; i < 9; i++) {
                board[i].innerHTML = '';
                board[i].removeAttribute("class");
            }
            console.log("game resetto!");
        };
        const fillCell = function (i, j, type) {
            board[id(i, j)].innerHTML = (type == 0 ? "O" : "X");
        }
        const fillBackgroundCellWithColor = function (index) {
            index.forEach(i => board[i].setAttribute("class", "flicker"));
        }
        return {board, reset, fillCell, fillBackgroundCellWithColor};

    })();

    const gameController = (function() {
        const Player = function (name) {
            return { name };
        };
        const player = [Player('Player 1'), Player('Player 2')];

        let saveChangeButton = document.getElementById("save-changes");
        let firstPlayerName = document.getElementById("first-player-name");
        let secondPlayerName = document.getElementById("second-player-name");

        saveChangeButton.addEventListener("click", (e) => {
            player[0].name = firstPlayerName.value;
            player[1].name = secondPlayerName.value;
        });


        gameBoard.reset();
        htmlBoard.reset();

        const handleMove = function (i, j) {
            if (gameBoard.board[id(i, j)] != -1) {
                alert("That cell was already filled!");
                return;
            }
            htmlBoard.fillCell(i, j, currentPlayer);
            gameBoard.fillCell(i, j, currentPlayer);
            currentPlayer = 1 - currentPlayer;
            moveCount++;
            
            let winner = gameBoard.check();
            if (winner.type != -1) {
                htmlBoard.fillBackgroundCellWithColor(winner.line);
                setTimeout(() => alert("The winner: " + player[winner.type].name), 200);
            } else if (moveCount == 9) {
                setTimeout(() => alert("Draw"), 200);
            }
        };

        let currentPlayer = 0;
        let moveCount = 0;
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
            htmlBoard.board[id(i, j)].addEventListener("click", () => {
                handleMove(i, j);
            });
        }


        let resetButton = document.getElementById("reset-btn");
        resetButton.addEventListener("click", () => {
            currentPlayer = 0;
            moveCount = 0;
            gameBoard.reset();
            htmlBoard.reset();
        });

    })();

})();