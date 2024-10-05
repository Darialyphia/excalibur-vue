export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const mapRange = (
  num: number,
  inRange: [number, number],
  outRange: [number, number]
) => {
  const mapped: number =
    ((num - inRange[0]) * (outRange[1] - outRange[0])) / (inRange[1] - inRange[0]) +
    outRange[0];

  return clamp(mapped, outRange[0], outRange[1]);
};

export const indexToPoint = (idx: number, width: number) => ({
  x: idx % width,
  y: Math.floor(idx / width)
});

export const pointToIndex = ({ x, y }: { x: number; y: number }, width: number) =>
  width * y + x;

export type RotationAngleDeg = 0 | 90 | 180 | 270;

type Matrix<T> = T[][];
function rotate90<T>(matrix: Matrix<T>): Matrix<T> {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: Matrix<T> = [];

  // Create the rotated matrix with swapped dimensions
  for (let i = 0; i < cols; i++) {
    rotated.push([]);
  }

  // Fill the rotated matrix
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = matrix[i][j];
    }
  }

  return rotated;
}

function rotate180<T>(matrix: Matrix<T>): Matrix<T> {
  return matrix.map(row => row.reverse()).reverse();
}

function rotate270<T>(matrix: Matrix<T>): Matrix<T> {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: Matrix<T> = [];

  // Create the rotated matrix with swapped dimensions
  for (let i = 0; i < cols; i++) {
    rotated.push([]);
  }

  // Fill the rotated matrix
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[cols - 1 - j][i] = matrix[i][j];
    }
  }

  return rotated;
}

export function rotate<T>(a: T[][], deg: RotationAngleDeg): T[][] {
  if (deg % 90 !== 0) {
    throw new Error('Invalid input; degrees must be a multiple of 90');
  }
  const d = ((deg % 360) + 360) % 360;
  if (d === 90) {
    return rotate90(a);
  } else if (d === 180) {
    return rotate180(a);
  } else if (d === 270) {
    return rotate270(a);
  }
  // otherwise, if it's 0 degrees
  return a;
}

export const rotateAndFlat = <T>(a: T[], deg: RotationAngleDeg, width: number): T[] => {
  const rows = toRows(a, width);
  const rotated = rotate(rows, deg);

  const result = rotated.flat();
  return result;
};

export const toRows = <T>(arr: T[], width: number): T[][] => {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += width) {
    res.push(arr.slice(i, i + width));
  }

  return res;
};

export const getRotatedIndex = (
  arr: any[],
  index: number,
  { width, angle }: { width: number; angle: RotationAngleDeg }
) => {
  const rows = toRows(arr, width);
  const rotated = rotate(rows, angle);
  return rotated.flat().indexOf(arr[index]);
};
