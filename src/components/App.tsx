import {useCallback, useEffect, useState} from 'react';
import '../style/App.css';
import Cell from "../classes/Cell";
import MenuButton from "./MenuButton";

function App() {
    const CELL_SIZE = 20;
    const [isPainting, setIsPainting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [board, setBoard] = useState(() => getWhiteBoard());
    const allowedSpeeds = [2000, 1000, 500, 250, 100];
    const [speed, setSpeed] = useState(1000);

    useEffect(() => {
        const handleResize = () => {
            console.log('resize')
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
            setBoard(getWhiteBoard());
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });

    function changeSpeed() {
        const index = allowedSpeeds.indexOf(speed);
        if (index === allowedSpeeds.length - 1) {
            setSpeed(allowedSpeeds[0]);
            return allowedSpeeds[0];
        } else {
            setSpeed(allowedSpeeds[index + 1]);
            return allowedSpeeds[index + 1];
        }
    }

    function getWhiteBoard(): Cell[][] {
        const maxCellsX = Math.floor(windowSize.width / CELL_SIZE) + 4;
        const maxCellsY = Math.floor((windowSize.height*0.95) / CELL_SIZE) + 4;
        return Array(maxCellsY).fill(new Cell()).map(() => Array(maxCellsX).fill(new Cell()))
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
        }, speed);
        return () => clearInterval(interval)
    }, [isUpdating, getNewBoard, speed])
    

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
        if (isPainting && board[i] && board[i][j] && !board[i][j].isAlive){
            onCellClick(i, j)
        }
    }

    return (
        <div className="Board" draggable="false">
            {board.slice(2,-3).map((row, i) => (
                <div className="row" key={i+2}>
                    {row.slice(2, -3).map((cell, j) => (
                        <div className="cell" key={j+2} data-i={i+2} data-j={j+2} style={{backgroundColor: cell.isAlive ? "black" : "white"}}
                             onMouseDown={(event) => {
                                 event.preventDefault();
                                 handleMouseDown(i+2, j+2)
                             }}
                             onMouseUp={handleMouseUp}
                             onMouseOver={() => {
                                 handleMouseOver(i+2, j+2)
                             }}
                             onTouchStart={(event) => {
                                 event.preventDefault();
                                 handleMouseDown(i+2,j+2)}
                             }
                             onTouchEnd={handleMouseUp}
                             onTouchMove={(event) => {
                                 event.preventDefault();
                                 const x = event.touches[0].clientX;
                                 const y = event.touches[0].clientY;
                                 const target = document.elementFromPoint(x, y) as HTMLElement;
                                 const i = Number(target.dataset.i);
                                 const j = Number(target.dataset.j);
                                 handleMouseOver(i, j);
                             }}
                             draggable="false"
                        >
                        </div>
                    ))}
                </div>
            ))}
            <MenuButton toggleStop={() => setIsUpdating(!isUpdating)} toggleSpeed={()=>changeSpeed()}/>
        </div>
    );
}

export default App;
