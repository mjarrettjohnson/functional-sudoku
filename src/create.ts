import { compose, identity, map } from 'ramda';
import { veryHard as board } from './boards';
import { filterCandidates } from './filter';
import { Cell } from './interfaces';

const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Returns an array of candidates for both the x and y axes
 */
const getRowsAndCols: () => [number[], number[]] = () => identity([candidates, candidates]) as [number[], number[]];

/**
 * Creates a new Cell 
 * 
 * @param x the column value of the new cell
 * @param y the row value of the new cell
 * @param z the box value of the new new cell
 */
const createCell = (x: number, y: number, z: number) => ({ x, y, z, candidates, value: 0 });

/**
 * Creates the array of 81 cells for the sudoku board.
 * 
 * @param cols a list of numbers 1 to 9
 * @param rows a list of numbers 1 to 9
 */
const createCells = ([cols, rows]: [number[], number[]]): Cell[] => {

  let current = 1;
  let box = 1;

  const iterateRows = map((row: number) => {
    box = current;
    if (row % 3 == 0) current += 3;
    return iterateCols(row)(cols);
  })

  const iterateCols = (row: number) => map((col: number) => {
    const cell = createCell(col, row, box);
    if (col % 3 === 0) box += 1;
    return cell;
  });

  const empty: Cell[] = [];
  return (empty).concat(...iterateRows(rows));
}

/**
 * Retrieves the values stored in the board and sets the value on the 
 * corresponding cells.
 * @param cells the array of cells that define the sudoku board
 */
export const fillFromValueArray = (cells: Cell[]) => cells.map((cell: Cell, index: number) => ({
  ...cell,
  value: board[index]
}))

/**
 * Creates a list of 81 cells with column, row and 3x3 box coordinates then fills the cells using the 
 * corresponding value array before finally filtering the candidate values for the empty cells;
 */
export const initCells = () => compose(filterCandidates, fillFromValueArray, createCells, getRowsAndCols)({});
