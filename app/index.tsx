import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[]; // length 9

const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares: Board): Player | null {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const App: React.FC = () => {
  const [board, setBoard] = useState<Board>(Array<Cell>(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [score, setScore] = useState<{ X: number; O: number; draws: number }>({
    X: 0,
    O: 0,
    draws: 0,
  });

  const winner = useMemo(() => calculateWinner(board), [board]);
  const isBoardFull = useMemo(() => board.every((c) => c !== null), [board]);

  const status: string = winner
    ? `Winner: ${winner}`
    : isBoardFull
    ? "Draw"
    : `Turn: ${isXNext ? "X" : "O"}`;

  const handlePress = (index: number) => {
    if (board[index] || winner) return;

    const nextBoard: Board = [...board];
    nextBoard[index] = isXNext ? "X" : "O";
    setBoard(nextBoard);
    setIsXNext((prev) => !prev);

    const w = calculateWinner(nextBoard);
    if (w) {
      setScore((s) => ({ ...s, [w]: s[w] + 1 }));
      Alert.alert("Game Over", `Winner is ${w}`);
      return;
    }
    if (nextBoard.every((c) => c !== null)) {
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
      Alert.alert("Game Over", "It's a draw!");
    }
  };

  const handleResetBoard = () => {
    setBoard(Array<Cell>(9).fill(null));
    setIsXNext(true);
  };

  const handleResetAll = () => {
    handleResetBoard();
    setScore({ X: 0, O: 0, draws: 0 });
  };

  const renderSquare = (index: number) => (
    <TouchableOpacity style={styles.square} onPress={() => handlePress(index)}>
      <Text
        style={[
          styles.squareText,
          board[index] === "X" && styles.xText,
          board[index] === "O" && styles.oText,
        ]}
      >
        {board[index]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>

      <View style={styles.scoreboard}>
        <View style={styles.scorePill}>
          <Text style={styles.scoreLabel}>X</Text>
          <Text style={styles.scoreValue}>{score.X}</Text>
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.scoreLabel}>O</Text>
          <Text style={styles.scoreValue}>{score.O}</Text>
        </View>
        <View style={styles.scorePill}>
          <Text style={styles.scoreLabel}>Draws</Text>
          <Text style={styles.scoreValue}>{score.draws}</Text>
        </View>
      </View>

      <Text style={styles.status}>{status}</Text>

      <View style={styles.board}>
        <View style={styles.row}>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </View>
        <View style={styles.row}>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </View>
        <View style={styles.row}>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleResetBoard}>
          <Text style={styles.buttonText}>Reset Board</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={handleResetAll}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>
            Reset All
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

const SIZE = 96; // square size

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f8",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
  },
  scoreboard: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  scorePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  scoreLabel: {
    fontWeight: "700",
    marginRight: 8,
  },
  scoreValue: {
    fontVariant: ["tabular-nums"],
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  board: {
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  squareText: {
    fontSize: 40,
    fontWeight: "900",
  },
  xText: {
    // You can theme X differently if you want later
  },
  oText: {
    // You can theme O differently if you want later
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  button: {
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#111827",
  },
  secondaryText: {
    color: "#111827",
  },
});
