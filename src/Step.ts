import { Highlighter } from './Highlighter';

export class Step {
  private readonly highlightSelector: string;
  private readonly action: string;
  private hightlighter: Highlighter | undefined;
  private elementsWithListener: Element[] = [];
  private onFinishCallback: (() => void) | undefined;

  constructor(highlightSelector: string, action: string) {
    this.highlightSelector = highlightSelector;
    this.action = action;
  }

  public start() {
    this.highlight();
    this.bindAction();
  }

  public onFinish(callback: () => void) {
    this.onFinishCallback = callback;
  }

  private readonly finishStepCallback: () => void = () => {
    this.finish();
  };

  private bindAction() {
    document.querySelectorAll(this.highlightSelector).forEach(elem => {
      elem.addEventListener(this.action, this.finishStepCallback);
      this.elementsWithListener.push(elem);
    });
  }

  private highlight() {
    this.hightlighter = new Highlighter(this.highlightSelector);
    this.hightlighter.highlight();
  }

  private finish() {
    if (this.hightlighter) this.hightlighter.unhighlight();
    for (const elem of this.elementsWithListener) {
      elem.removeEventListener(this.action, this.finishStepCallback);
    }
    if (this.onFinishCallback) this.onFinishCallback();
  }
}
