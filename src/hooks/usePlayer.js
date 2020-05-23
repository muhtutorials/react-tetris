import { useState, useCallback } from 'react';

import { randomTetromino, TETROMINOS } from '../tetrominos';
import { checkCollision, STAGE_WIDTH } from '../gameHelpers';


export const usePlayer = () => {
  const [player, setPlayer] = useState({
    position: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false
  });

  const rotate = (tetromino, direction) => {
    // make rows become columns
    const rotatedTetromino = tetromino.map((_, index) => tetromino.map(column => column[index]));
    // reverse each row to get a rotated tetromino
    if (direction > 0) return rotatedTetromino.map(row => row.reverse());
    return rotatedTetromino.reverse()
  };

  const playerRotate = (stage, direction) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, direction);
    // prevent rotation through existing tetrominos and borders of the stage
    const position = clonedPlayer.position.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.position.x += offset;
      // move player away from the wall or another tetromino if colliding with it on rotation
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -direction);
        clonedPlayer.position.x = position;
        return;
      }
    }
    setPlayer(clonedPlayer)
  };

  const updatePlayerPosition = ({ x, y, collided }) => {
    setPlayer(player => ({
      ...player,
      position: { x: player.position.x += x, y: player.position.y += y },
      collided
    }))
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      position: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false
    })
  }, []);

  return [player, updatePlayerPosition, resetPlayer, playerRotate];
};
