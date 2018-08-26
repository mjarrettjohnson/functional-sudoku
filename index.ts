import { initCells } from './src/create';
import { createUpdate } from './src/run';


try {
  const cells = initCells();
  const update = createUpdate();
  update(cells);
} catch (e) { }
