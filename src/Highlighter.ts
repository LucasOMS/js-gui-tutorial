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
  public heigth: number;
  public width: number;
  public highlight: boolean;

  constructor(x: number, y: number, width: number, heigth: number, highlight: boolean = false) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.heigth = heigth;
    this.highlight = highlight;
  }

  compareTo(cell: Cell) {
    if (this.y < cell.y) return -1;
    if (this.y > cell.y) return 1;
    if (this.x < cell.x) return -1;
    if (this.x > cell.x) return 1;
    return 0;
  }
}

class Grid {
  cells: Cell[] = [];
  private everyXpositionOfGrid: number[] = [];
  private everyYpositionOfGrid: number[] = [];

  constructor(elements: SquareToHighlight[]) {
    for (const elem of elements) {
      this.everyXpositionOfGrid.push(elem.x);
      this.everyXpositionOfGrid.push(elem.x + elem.width);
    }
    for (const elem of elements) {
      this.everyYpositionOfGrid.push(elem.y);
      this.everyYpositionOfGrid.push(elem.y + elem.heigth);
    }
    const xPositions = [0, ...this.everyXpositionOfGrid].sort((a, b) => a - b);
    const yPositions = [0, ...this.everyYpositionOfGrid].sort((a, b) => a - b);
    for (const x of xPositions) {
      const indexX = xPositions.indexOf(x);
      if (indexX === xPositions.length - 1) continue;
      for (const y of yPositions) {
        const indexY = yPositions.indexOf(y);
        if (indexY === yPositions.length - 1) continue;
        const width = xPositions[indexX + 1] - xPositions[indexX];
        const height = yPositions[indexY + 1] - yPositions[indexY];
        this.cells.push(new Cell(x, y, width, height, shouldHighlight(x, y)));
      }
    }

    function shouldHighlight(x: number, y: number): boolean {
      for (const elem of elements) {
        const withinX = elem.x <= x && elem.x + elem.width > x;
        const withinY = elem.y <= y && elem.y + elem.heigth > y;
        if (withinX && withinY) return true;
      }
      return false;
    }
  }

  addToDOM() {
    // Append grid to the DOM
    document.body.insertAdjacentHTML('beforeend',
      '<div id="js-gui-tutorial-grid">' +
      this.cells.sort((c1, c2) => c1.compareTo(c2)).map(cell =>
        cell.highlight ? '' : `<div class="js-gui-tutorial-cell" 
                style=" 
                top: ${cell.y}px;
                left: ${cell.x}px; 
                width: ${cell.width}px; 
                height: ${cell.heigth}px"></div>`).join('')
      + '</div>',
    );
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
      elements.push(computeSquareRectToHighlitghtFromDOMElement(elem));

      function computeSquareRectToHighlitghtFromDOMElement(element: any) {
        const DOMposition = getOffset(element);
        return new SquareToHighlight(DOMposition.x, DOMposition.y, element.offsetWidth, element.offsetHeight);
      }

      function getOffset(element: any) {
        let _x = 0;
        let _y = 0;
        while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
          _x += element.offsetLeft - element.scrollLeft;
          _y += element.offsetTop - element.scrollTop;
          element = element.offsetParent;
        }
        return { x: _x, y: _y };
      }
    });

    // Create the grid
    const grid = new Grid(elements);
    grid.addToDOM();
  }

  public unhighlight() {
    const elem = document.getElementById('js-gui-tutorial-grid');
    if (elem) elem.remove();
  }
}
