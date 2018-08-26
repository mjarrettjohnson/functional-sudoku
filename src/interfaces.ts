
/**
 * Represents each available spot in the Sudoku board.
 */
export interface Cell {
  x: number;
  y: number;
  z: number
  value: number;
  candidates: number[];
}