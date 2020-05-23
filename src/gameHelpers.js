export const STAGE_HEIGHT = 20;
export const STAGE_WIDTH = 12;


// from(arrayLike, mapfn) method creates a new, shallow-copied Array instance from an array-like or iterable object
// mapfn - map function to call on every element of the array
// fill() method changes all elements in an array to a static value, from a start index (default 0)
// to an end index (default array.length). It returns the modified array.
export const createStage = () => (
  Array.from(Array(STAGE_HEIGHT), () => Array(STAGE_WIDTH).fill([0, 'clear']))
);


export const checkCollision = (player, stage, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.length; y++) {
    for (let x = 0; x < player.tetromino[y].length; x++) {
      // check if we're on a tetromino cell
      if (player.tetromino[y][x] !== 0) {
        if (
          // check that our move is inside the game area's height (y axis)
          // we shouldn't go through the bottom of the game area
          !stage[y + player.position.y + moveY] ||
          // check that our move is inside the game area's width (x axis)
          !stage[y + player.position.y + moveY][x + player.position.x + moveX] ||
          // check that the cell we're moving to isn't set to clear
          stage[y + player.position.y + moveY][x + player.position.x + moveX][1] !== 'clear'
        ) {
          return true
        }
      }
    }
  }
};
