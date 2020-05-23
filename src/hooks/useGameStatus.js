import { useState, useEffect, useCallback } from 'react';


export const useGameStatus = rowsCleared => {
  const [score, setScore] = useState(0);
  const [rows, setRows] = useState(0);
  const [level, setLevel] = useState(0);

  const linePoints = [40, 100, 300, 1200];

  const calculateScore = useCallback(() => {
    if (rowsCleared > 0) {
      // calculate score based on number of cleared lines and level and then set it
      setScore(score => score + linePoints[rowsCleared - 1] * (level + 1));
      // calculate sum of cleared rows and then set it
      setRows(rows => rows + rowsCleared);
    }
  }, [level, linePoints, rowsCleared]);

  useEffect(() => {
    calculateScore();
  }, [calculateScore, rowsCleared, score]);

  return [score, setScore, rows, setRows, level, setLevel];
};
