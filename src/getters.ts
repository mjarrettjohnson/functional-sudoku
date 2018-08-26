import { compose } from 'ramda';
import { Cell } from './interfaces';

/**
 * Returns a function which takes the axis number and returns a filter function that
 * will return all cells where the specified axis matches the index
 * @param axis the cell property to check
 */
const getListOf = (axis: 'x' | 'y' | 'z') => (index: number) => (cells: Cell[]) => cells.filter((cell: Cell) => cell[axis] === index);

/**
 * Retrieves the target cell's column coordinate
 * @param cell the target cell
 */
const getX = (cell: Cell) => cell.x;

/**
 * Retrieves the target cell's row coordinate
 * @param cell the target cell
 */
const getY = (cell: Cell) => cell.y;

/**
 * Retrieves the target cell's 3x3 box coordinate
 * @param cell the target cell
 */
const getZ = (cell: Cell) => cell.z;

/**
 * Returns a function that when given a target cell and the list of all cells
 * will return all cells that match the target cell's row.
 */
export const getRowOf = compose(getListOf('y'), getY);

/**
 * Returns a function that when given a target cell and the list of all cells
 * will return all cells that match the target cell's column.
 */
export const getColOf = compose(getListOf('x'), getX);

/**
 * Returns a function that when given a target cell and the list of all cells
 * will return all cells that match the target cell's 3x3 box.
 */
export const getBoxOf = compose(getListOf('z'), getZ);
