let cellId = 0;

// Two types of cell:
// background cell(fixed position)
// movable cell(active; inactive)
class Cell {
  constructor (row = -1, col = -1, val = 0) {
    this.id = cellId++;
    this.val = val;
    this.fromRow = -1;
    this.fromCol = -1;
    this.curRow = row;
    this.curCol = col;
  }

  isNew() {
    return (this.fromRow == -1 && this.fromCol == -1) && this.isVisible();
  }

  isVisible() {
    return this.val != 0;
  }

  getValueClass(val) {
    if (val == 0) {
      return "";
    } else {
      return "value-" + val;
    }
  }
}

export default Cell;
