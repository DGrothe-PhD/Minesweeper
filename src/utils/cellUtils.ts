import { isOffBoard } from "./boardUtils";
import { getAdjacentMinesCount } from "./mineUtils.ts";
import type {
  CellData,
  BoardData,
  BoardSize,
  Coordinate,
  FlagLocations,
} from '@/types';

export const coordinatesMatch = (
  a: Coordinate | CellData,
  b: Coordinate | CellData
): boolean => a.x === b.x && a.y === b.y;

export const hasCell = (x: number, y: number, cells: Array<Coordinate | CellData>): boolean => {
  return cells.some((cell) => coordinatesMatch(cell, { x, y }));
};

export const getIncorrectlyFlaggedCells = (gameBoard: BoardData, currentFlagLocations: FlagLocations): CellData[] => {
  const updatedCells: CellData[] = [];

  for (const flagLocation of currentFlagLocations) {
    let cell = gameBoard[flagLocation.x][flagLocation.y];

    if (cell.hasMine) continue;

    const updatedCell = {
      ...cell,
      isIncorrectlyFlagged: true,
    };
    updatedCells.push(updatedCell);
  }

  return updatedCells;
};

export const getRevealedMineCells = (gameBoard: BoardData, currentMineLocations: Coordinate[]): CellData[] => {
  const updatedCells: CellData[] = [];

  for (const mineLocation of currentMineLocations) {
    let cell = gameBoard[mineLocation.x][mineLocation.y];

    if (cell.isFlagged) continue;

    const updatedCell = {
      ...cell,
      isRevealed: true,
    };
    updatedCells.push(updatedCell);
  }

  return updatedCells;
};

const isRevealed = (x: number, y: number, currentBoard: BoardData): boolean => {
  const cell = currentBoard[x][y];

  return cell.isRevealed;
};

export const revealCell = (
  x: number,
  y: number,
  currentBoard: BoardData,
  boardSize: BoardSize,
  revealedCells: CellData[] = []
): CellData[] => {
  if (
    isOffBoard(x, y, boardSize) ||
    hasCell(x, y, revealedCells) ||
    isRevealed(x, y, currentBoard)
  ) {
    console.log('Skipping cell due to guard clause:', x, y);
    return revealedCells;
  } 

  //  console.log('revealCell called', { x, y, cell: currentBoard[x][y], revealedCells });
    

  const cell = currentBoard[x][y];

  const updatedCell = {
    ...cell,
    isFlagged: false,
    isRevealed: true,
  };

  console.log('Revealed cell', updatedCell.x, updatedCell.y, 'adjacentMinesCount:', updatedCell.adjacentMinesCount);

  if (updatedCell.hasMine) {
    updatedCell.hasExplodedMine = true;
    revealedCells.push(updatedCell);
    return revealedCells;
  }
  updatedCell.adjacentMinesCount = getAdjacentMinesCount(
    updatedCell,
    currentBoard,
    boardSize
  );
  revealedCells.push(updatedCell);

  console.log('Revealed cell', updatedCell.x, updatedCell.y, 'adjacentMinesCount:', updatedCell.adjacentMinesCount);

  if (updatedCell.adjacentMinesCount === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        revealCell(x + i, y + j, currentBoard, boardSize, revealedCells);
      }
    }
  }

  return revealedCells;
};

export const getFilteredFlagLocations = (
  currentFlagLocations: Coordinate[],
  cells: Array<Coordinate | CellData>
): Coordinate[] => {
  return currentFlagLocations.filter(
    (location) => !cells.some((cell) => coordinatesMatch(location, cell))
  );
};
