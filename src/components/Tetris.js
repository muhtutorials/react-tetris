import React, { useState } from 'react';

import { createStage, checkCollision } from '../gameHelpers';
import Display from './Display';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import Stage from './Stage';
import Button from './Button';
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';


const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameInProgress, setGameInProgress] = useState(false);
  const [paused, setPaused] = useState(false);


  const [player, updatePlayerPosition, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  const movePlayer = direction => {
    if (!checkCollision(player, stage, { x: direction, y: 0 })) {
      updatePlayerPosition({ x: direction, y: 0, collided: false });
    }
  };

  const startGame = () => {
    // reset everything
    setStage(createStage());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setGameInProgress(true);
    setScore(0);
    setRows(0);
    setLevel(0);
  };

  const pauseGame = () => {
    paused ? setDropTime(1000 / (level + 1) + 200) : setDropTime(null);
    setPaused(!paused)
  };

  const drop = () => {
    // increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(level => level + 1);
      // increase speed
      setDropTime(1000 / (level + 1) + 200)
    }
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPosition({ x: 0, y: 1, collided: false });
    } else {
      // stage is completely filled with tetrominos
      if (player.position.y < 1) {
        console.log('Game Over');
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPosition({ x: 0, y: 0, collided: true })
    }
  };

  // on down arrow release resume automatic drop
  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        console.log('Interval on');
        setDropTime(1000 / (level + 1) + 200);
      }
    }
  };

  const dropPlayer = () => {
    console.log('Interval off');
    setDropTime(null);
    drop();
  };

  // { keyCode } - destructures event
  const move = ({ keyCode }) => {
    if (!gameOver) {
      // 37 - left arrow
      if (keyCode === 37) {
        movePlayer(-1);
        // 39 - right arrow
      } else if (keyCode === 39) {
        movePlayer(1);
        // 40 - down arrow
      } else if (keyCode === 40) {
        dropPlayer();
        // 40 - up arrow
      } else if (keyCode === 38) {
        playerRotate(stage, 1);
      }
    }
  };

  useInterval(() => drop(), dropTime);

  return (
    // role attribute is for key press event to work in the whole window
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {
            gameOver ?
              <Display gameOver={gameOver} text="Game Over" />
            :
              <div>
                <Display text={`Score: ${score}`} />
                <Display text={`Rows: ${rows}`} />
                <Display text={`Level: ${level}`} />
              </div>
          }
          <Button callback={startGame} text='start game' />
          {
            gameInProgress && !gameOver &&
              <Button callback={pauseGame} text={paused ? 'resume game' : 'pause game'} />
          }
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  )
};


export default Tetris;
