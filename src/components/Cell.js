import React from 'react';

import { StyledCell } from './styles/StyledCell';
import { TETROMINOS } from '../tetrominos';


const Cell = ({ type }) => (
  <StyledCell type={type} color={TETROMINOS[type].color} />
);


// re-render only changed cells
export default React.memo(Cell);
