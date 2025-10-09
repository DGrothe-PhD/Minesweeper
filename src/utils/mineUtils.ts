import { isOffBoard } from './boardUtils';
import type { BoardSize, Coordinate, BoardData, CellData } from '@/types';


export const getMineLocations = (
  currentCell: Coordinate,
  currentBoard: BoardData,
  mineCount: number,
  boardSize: BoardSize
) => {
  const rowCount = boardSize.rowCount;
  const columnCount = boardSize.columnCount;

  let allocatedMines = 0;

  const newMineLocations: Coordinate[] = [];

  while (allocatedMines < mineCount) {
    let row = Math.floor(Math.random() * rowCount);
    let col = Math.floor(Math.random() * columnCount);

    let cell = currentBoard[row][col];

    if (cell.x === currentCell.x && cell.y === currentCell.y) {
      // The first cell that is subjected to a left click should be ignored when placing a mine
      // to make the game a bit easier/fairer - the user cannot lose on the
      // the first left click
      continue;
    }
    // check for a duplication location in the newMineLocations array and skip if found
    if (
      newMineLocations.some(
        (location) => location.x === cell.x && location.y === cell.y
      )
    ) {
      continue;
    }

    if (!cell.hasMine) {
      newMineLocations.push({ x: cell.x, y: cell.y });
      allocatedMines++;
    }
  }

  return newMineLocations;
};

export const getCellsWithMines = (newMineLocations: Coordinate[], currentBoard: BoardData): CellData[] => {
  const cellsWithMines: CellData[] = [];

  for (const location of newMineLocations) {
    const currentCell = currentBoard[location.x][location.y];

    const updatedCell = {
      ...currentCell,
      hasMine: true,
    };
    cellsWithMines.push(updatedCell);
  }
  return cellsWithMines;
};

export const getAdjacentMinesCount = (
  selectedCell: Coordinate,
  currentBoard: BoardData,
  boardSize: BoardSize
): number => {
  let adjacentMinesCount = 0;

  let x = selectedCell.x;
  let y = selectedCell.y;

  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      let xPos = x + i;
      let yPos = y + j;

      if (isOffBoard(xPos, yPos, boardSize)) {
        continue;
      }
      let neighbourCell = currentBoard[xPos][yPos];

      if (neighbourCell.hasMine) {
        adjacentMinesCount++;
      }
    }
  }
  return adjacentMinesCount;
};