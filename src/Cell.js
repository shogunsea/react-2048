let cellId = 0;

// Two types of cell:
// background cell(fixed position)
// movable cell(active; inactive)
class Cell {
  constructor (row = -1, col = -1, val = 0) {
    this.id = cellId++;
    this.row = row;
    this.col = col;
    this.val = val;
  }
}

export default Cell;
