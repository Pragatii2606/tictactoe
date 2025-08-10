 const HUMAN = 'X';
    const AI = 'O';
    let board = Array(9).fill(null);
    const cells = [];

    const winningCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    const boardEl = document.getElementById('board');
    const statusEl = document.getElementById('status');

    function renderBoard() {
      boardEl.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = "cell w-20 h-20 flex items-center justify-center text-3xl font-bold rounded-xl bg-gray-900 cursor-pointer text-white border border-purple-500";
        cell.innerText = board[i] || '';
        cell.addEventListener('click', () => handleMove(i));
        boardEl.appendChild(cell);
        cells[i] = cell;
      }
    }

    function handleMove(index) {
      if (board[index] || checkWinner(board)) return;
      board[index] = HUMAN;
      renderBoard();
      if (!checkWinner(board) && board.includes(null)) {
        const best = bestMove();
        board[best] = AI;
        renderBoard();
      }
      showStatus();
    }

    function bestMove() {
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = AI;
          let score = minimax(board, 0, false);
          board[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      return move;
    }

    function minimax(newBoard, depth, isMaximizing) {
      let result = checkWinner(newBoard);
      if (result === AI) return 10 - depth;
      if (result === HUMAN) return depth - 10;
      if (!newBoard.includes(null)) return 0;

      if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (!newBoard[i]) {
            newBoard[i] = AI;
            best = Math.max(best, minimax(newBoard, depth + 1, false));
            newBoard[i] = null;
          }
        }
        return best;
      } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
          if (!newBoard[i]) {
            newBoard[i] = HUMAN;
            best = Math.min(best, minimax(newBoard, depth + 1, true));
            newBoard[i] = null;
          }
        }
        return best;
      }
    }

    function checkWinner(b) {
      for (let combo of winningCombos) {
        const [a, b1, c] = combo;
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
      }
      return null;
    }

    function showStatus() {
      const winner = checkWinner(board);
      if (winner) {
        statusEl.innerText = `${winner} wins! 🎉`;
      } else if (!board.includes(null)) {
        statusEl.innerText = "It's a draw! 🤝";
      } else {
        statusEl.innerText = '';
      }
    }

    function resetGame() {
      board = Array(9).fill(null);
      renderBoard();
      statusEl.innerText = '';
    }

    renderBoard();