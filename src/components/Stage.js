import React from 'react';

import Cell from './Cell';
import { StyledStage } from './styles/StyledStage';


const Stage = ({ stage }) => (
  <StyledStage height={stage.length} width={stage[0].length}>
    {stage.map(row => row.map((cell, index) => <Cell key={index} type={cell[0]} />))}
  </StyledStage>
);


export default Stage;
