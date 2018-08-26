import { Cell } from './interfaces';

/**
 * Prints a seperator
 */
const printLine = () => console.log('----------------------------');

/**
 * Loops over the sudoku board and prints each row
 * @param cells the sudoku board
 */
export const print = (cells: Cell[]) => {
  let counter = 1;
  let row = '';
  printLine()
  cells.forEach(cell => {
    cell.value === 0
      ? row += '| |'
      : row += `|${cell.value}|`

    if (counter % 9 === 0) {
      console.log(row);
      row = '';
    }
    counter++;
  })
  printLine()
  return cells;
}
