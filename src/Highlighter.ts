class SquareToHighlight {
  public x: number;
  public y: number;
  public width: number;
  public heigth: number;

  constructor(x: number, y: number, width: number, heigth: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.heigth = heigth;
  }
}

class Cell {
  public x: number;
  public y: number;
  public highlight: boolean;

  constructor(x: number, y: number, highlight: boolean = false) {
    this.x = x;
    this.y = y;
    this.highlight = highlight;
  }

  compareTo(cell: Cell) {
    if (this.x < cell.x) return 1;
    if (this.x > cell.x) return -1;
    if (this.y < cell.y) return 1;
    if (this.y > cell.y) return -1;
    return 0;
  }
}

class Grid {
  cells: Cell[] = [];
  private everyXpositionOfGrid: number[] = [];
  private everyYpositionOfGrid: number[] = [];

  constructor(elements: SquareToHighlight[]) {
    const positions: [number, number][] = [];
    for (const elem of elements) {
      this.everyXpositionOfGrid.push(elem.x);
      this.everyXpositionOfGrid.push(elem.x + elem.width);
    }
    for (const elem of elements) {
      this.everyYpositionOfGrid.push(elem.y);
      this.everyYpositionOfGrid.push(elem.y + elem.heigth);
    }
    for (const elem of elements) {
      positions.push([elem.x, elem.y]);
    }
    for (const x of this.everyXpositionOfGrid) {
      for (const y of this.everyYpositionOfGrid) {
        this.cells.push(new Cell(x, y, shouldHighlight(x, y)));
      }
    }

    function shouldHighlight(x: number, y: number): boolean {
      for (const pos of positions) {
        if (pos[0] === x && pos[1] === y) return true;
      }
      return false;
    }
  }

  addToDOM() {
    const templateX = this.createTemplateGridFrom(this.everyXpositionOfGrid);
    const templateY = this.createTemplateGridFrom(this.everyYpositionOfGrid);
    // Append grid to the DOM
    document.body.insertAdjacentHTML('beforeend',
      `<div id="js-gui-tutorial-grid" style="position:absolute; 
                top: 0; left:0; height: 100vh; width: 100vh; 
                z-index: 1337; 
                display: grid; 
                grid-template-columns: ${templateX};
                grid-template-rows: ${templateY}">
            ${
        this.cells.sort((c1, c2) => c1.compareTo(c2)).map(cell => `<div style="background: ${cell.highlight ? 'transparent' : 'blue'}"></div>`).join('')
      }
        </div>`);
  }

  // noinspection JSMethodCanBeStatic
  private createTemplateGridFrom(positions: number[]): string {
    positions.sort((a, b) => a - b);
    const areas = [];
    for (let i = 0; i < positions.length; i++) {
      let areaSize = positions[i];
      if (i > 0) {
        areaSize -= positions[i - 1];
      }
      areas.push(areaSize);
    }
    return areas.map(pos => `${pos}px`).join(' ');
  }
}

export class Highlighter {
  private selector: string;

  constructor(selector: string) {
    this.selector = selector;
  }

  public highlight() {
    const elements: SquareToHighlight[] = [];
    document.querySelectorAll(this.selector).forEach(elem => {
      const rect = elem.getBoundingClientRect();
      elements.push(new SquareToHighlight(rect.x, rect.y, rect.width, rect.height));
    });

    // First step, create the grid
    const grid = new Grid(elements);
    grid.addToDOM();
  }

  public unhighlight() {
    const elem = document.getElementById('js-gui-tutorial-grid');
    if (elem) elem.remove();
  }
}
