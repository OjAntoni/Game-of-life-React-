import {useCallback, useEffect, useState} from 'react';
import '../style/App.css';
import Cell from "../classes/Cell";
import MenuButton from "./MenuButton";

function App() {
    const CELL_SIZE = 20;
    const [board, setBoard] = useState(() => getWhiteBoard());
    const [isPainting, setIsPainting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);

    function getWhiteBoard(): Cell[][] {
        const headerHeight = 40;
        const numRows = Math.floor((window.innerHeight - headerHeight) / CELL_SIZE);
        const numCols = Math.floor(window.innerWidth / CELL_SIZE);

        return Array(numRows).fill(new Cell()).map(() => Array(numCols).fill(new Cell()))
    }

    const getNewBoard = useCallback((board: Cell[][]) => {
        return board.map((row, i) => {
            return row.map((cell, j) => {
                const neighbors = getNeighbors(i, j, board)
                if (cell.isAlive) {
                    if (neighbors < 2 || neighbors > 3) {
                        return new Cell()
                    }
                } else {
                    if (neighbors === 3) {
                        return new Cell(true)
                    }
                }
                return cell
            })
        })
    }, []);

    useEffect(() => {
        let interval = setInterval(() => {
            if (isUpdating) {
                setBoard((board) => getNewBoard(board));
            }
        }, 1000);
        return () => clearInterval(interval)
    }, [isUpdating, getNewBoard])
    

    const getNeighbors = (i: number, j: number, board: Cell[][]) => {
        let neighbors = 0
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x === 0 && y === 0) {
                    continue
                }
                if (board[i + x] && board[i + x][j + y] && board[i + x][j + y].isAlive) {
                    neighbors++
                }
            }
        }
        return neighbors
    }

    const onCellClick = (i: number, j: number) => {
        setBoard((board) => {
            return board.map((row, x) => {
                return row.map((cell, y) => {
                    if (x === i && y === j) {
                        return new Cell(!cell.isAlive)
                    }
                    return cell
                })
            })
        })
    }

    const handleMouseDown = (i: number, j: number) => {
        setIsPainting(true)
        onCellClick(i, j)
    }

    const handleMouseUp = () => {
        setIsPainting(false)
    }

    const handleMouseOver = (i: number, j: number) => {
        if (isPainting) {
            onCellClick(i, j)
        }
    }

    return (
        <div className="Board" draggable="false">
            {board.map((row, i) => (
                <div className="row" key={i}>
                    {row.map((cell, j) => (
                        <div className="cell" key={j} style={{backgroundColor: cell.isAlive ? "black" : "white"}}
                             onMouseDown={(event) => {
                                 event.preventDefault();
                                 handleMouseDown(i, j)
                             }}
                             onMouseUp={handleMouseUp}
                             onMouseOver={() => {
                                 handleMouseOver(i, j)
                             }}
                             onTouchStart={(event) => {
                                 event.preventDefault();
                                 handleMouseDown(i, j)}
                             }
                             onTouchEnd={handleMouseUp}
                             onTouchMove={(event) => {
                                 event.preventDefault();
                                 const target = event.target as Element;
                                 const rect = target.getBoundingClientRect();
                                 const x = event.touches[0].clientX;
                                 const y = event.touches[0].clientY;
                                 const i = Math.floor((y - rect.top) / CELL_SIZE);
                                 const j = Math.floor((x - rect.left) / CELL_SIZE);
                                 handleMouseOver(i, j);
                             }}
                             draggable="false"
                        >
                        </div>
                    ))}
                </div>
            ))}
            <MenuButton toggleStop={() => setIsUpdating(!isUpdating)}/>
        </div>
    );
}

export default App;
