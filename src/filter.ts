import { compose, difference, filter, flatten, juxt, map, prop, range, uniq } from 'ramda';
import { getBoxOf, getColOf, getRowOf } from './getters';
import { Cell } from './interfaces';

/**
 * Retrieves the value property from a cell
 */
const getValue: (cell: Cell) => number = prop('value');

/**
 * filters a list of numbers returning all non zero numbers
 */
const nonZero: (nums: number[]) => number[] = filter((x: number) => x !== 0);

/**
 * Takes a row, column or 3x3 box worth of cells, retrieves their values and filters
 * out any zero values.
 */
const getSegmentValues = compose(nonZero, map(getValue));

/**
 * Retrieves all non zero values for the row of cells that matches the current cell.
 * @param cell the current cell
 */
const getExistingRowValues = (cell: Cell) => compose(getSegmentValues, getRowOf(cell));

/**
 * Retrieves all non zero values for the column of cells that matches the current cell.
 * @param cell the current cell
 */
const getExistingColValues = (cell: Cell) => compose(getSegmentValues, getColOf(cell));

/**
 * Retrieves all non zero values for the 3x3 box of cells that matches the current cell.
 * @param cell the current cell
 */
const getExistingBoxValues = (cell: Cell) => compose(getSegmentValues, getBoxOf(cell));

/**
 * Returns a function that takes a target cell and returns an array of functions that when given the entire board
 * will retrieve any values that are in that target cells column, row or 3x3 box.
 */
const getRelevantCellValues: (cell: Cell) => ((cells: Cell[]) => number[])[] = juxt([getExistingRowValues, getExistingColValues, getExistingBoxValues]);

/**
 * Returns a function that when given the entire board of cells will return
 * all non zero values that share the same row, column or 3x3 box as the target cell.
 * @param cell the target cell
 */
const getDisqualified = (cell: Cell): (cells: Cell[]) => number[][] => juxt(getRelevantCellValues(cell));

/**
 * presets the difference function with the possible values for a cell i.e. 1 to 9
 */
const differenceWithCandidates = compose(difference, range(1))(10);

/**
 * types Ramda's uniq function for dealing with a number[]
 */
const uniqNumbers = uniq as ((arr: number[]) => number[]);

/**
 * types Ramda's flatten function for dealing with a number[][]
 */
const flattenNumbers = flatten as ((numbers: number[][]) => number[])

/**
 * Finds all cells that share the same row, col or 3x3 box with the target cell
 * and then returns a list of values that are NOT shared with other cells. 
 * @param cell the target cell 
 */
const getCellCandidates = (cell: Cell) => compose(
  differenceWithCandidates,
  uniqNumbers,
  flattenNumbers,
  getDisqualified(cell)
);

/**
 * Filters the candidates for each cell of the sudoku board.
 * @param cells the board of cells
 */
export const filterCandidates = (cells: Cell[]) => cells.map(cell => ({
  ...cell,
  candidates: getCellCandidates(cell)(cells)
} as Cell));
