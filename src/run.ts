import { all, any, compose, filter, ifElse, map, prop, sortBy } from 'ramda';
import { filterCandidates } from './filter';
import { Cell } from './interfaces';
import { print } from './print';

/**
 * Return a function that takes the board and returns true if all 
 * cells have a non zero value
 */
const isFinished = all((cell: Cell) => cell.value !== 0);

/**
 * Returns a function that returns true if any zero valued cell has an empty list 
 * of candidates.
 */
const isBoardInvalid = any((cell: Cell) => cell.value === 0 && cell.candidates.length === 0)

/**
 * Returns the first cell in a list of cells. 
 * 
 * @param cells an array of cells
 */
const getFirst = (cells: Cell[]) => cells[0];

/**
 * Sorts a list of cells by the number of possible candidate values they have. 
 */
const sortByCandidateLength: (cells: Cell[]) => Cell[] = sortBy((cell: Cell) => cell.candidates.length);

/**
 * Retrieves all cells whose value is zero.
 */
const getEmptyCells: (cells: Cell[]) => Cell[] = filter((cell: Cell) => cell.value === 0);

/**
 * Retrieves the empty cell that has the least number of candidate values.
 */
const getCellWithLeastNumberOfCandidates = compose(getFirst, sortByCandidateLength, getEmptyCells);

/**
 * Returns a copy of a cell
 * @param cell the cell to copy
 */
const clone = (cell: Cell) => ({ ...cell });

/**
 * Returns a function that takes a cell and then sets its value with the provided value
 * @param value the new value of the cell
 */
const updateValueOfCellWith = (value: number) => (cell: Cell) => ({ ...cell, value })

/**
 * Returns true if the current cell has the same coordinates as the target cell.
 * @param cell the target cell
 */
const isMatchingCell = (cell: Cell) => (current: Cell) => current.x === cell.x && current.y === cell.y;

/**
 * Returns a function that takes each cell in the board, finds the target cell
 * then sets its value with the candidate.
 * @param cell the target cell
 */
const updateCellsWith = (cell: Cell) => (candidate: number) => {
  const isMatch = isMatchingCell(cell);
  const updateValue = updateValueOfCellWith(candidate);
  return map(ifElse(isMatch, updateValue, clone))
}

/**
 * Returns a cells candidates
 */
export const getCandidates: (cell: Cell) => number[] = prop('candidates');

/**
 * Prints the current generation and the solved board.
 * @param cells the final list of cells 
 * @param iteration the number of times the board was changed
 */
const showFinishedBoard = (cells: Cell[], iteration: number) => {
  console.log('GENERATION: ', iteration);
  print(cells);
}

/**
 * Returns the update function that will recursively bruteforce
 * the sudoku
 */
export const createUpdate = () => {

  let iteration = 0;

  /**
   * Returns a function that takes a cell and a candidate to try, that then
   * fills the value of the cell with the candidate before determining if the 
   * board is invalid or solved.
   * @param cells the current state of the board
   */
  const runCycle = (cells: Cell[]) => (current: Cell) => (candidate: number) => {
    const runUpdate = compose(update, updateCellsWith(current)(candidate));
    const solved: Cell[] | null = runUpdate(cells);

    if (!solved) return null;

    if (isFinished(solved)) {
      showFinishedBoard(solved, iteration);
      throw new Error('solved');
    }

    return solved;
  }

  /**
   * function that will recusrively attempt to fill empty cells in the board with
   * their candidate values.
   * @param cells the current state of the board
   */
  const update = (cells: Cell[]) => {

    if (isBoardInvalid(cells)) return null;
    if (isFinished(cells)) return cells;

    print(cells);
    iteration++;

    const current: Cell = getCellWithLeastNumberOfCandidates(filterCandidates(cells));

    const runUpdateFor = runCycle(cells);

    const iterateCandidates = map(runUpdateFor(current));

    compose(iterateCandidates, getCandidates)(current);

    return null;
  }

  return update;
}