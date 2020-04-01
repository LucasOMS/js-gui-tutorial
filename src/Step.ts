import { Highlighter } from './Highlighter';
import { Indication, TooltipConfiguration } from './Indication';

export class Step {
  private readonly highlightSelector: string;
  private readonly action: string;
  private hightlighter: Highlighter | undefined;
  private elementsWithListener: Element[] = [];
  private onFinishCallback: (() => void) | undefined;
  private indicator: Indication | undefined;
  private tooltipConfig: TooltipConfiguration;

  constructor(highlightSelector: string, action: string, tooltipConfig: TooltipConfiguration) {
    this.highlightSelector = highlightSelector;
    this.action = action;
    this.tooltipConfig = tooltipConfig;
  }

  public start() {
    // Bind action first to prevent bind on generated DOM elements
    this.bindAction();
    this.highlight();
    this.showIndication();
  }

  public onFinish(callback: () => void) {
    this.onFinishCallback = callback;
  }

  private readonly finishStepCallback: () => void = () => {
    this.finish();
    if (this.indicator)
      this.indicator.destroy();
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

  private showIndication() {
    this.indicator = new Indication(this.tooltipConfig);
    if (this.tooltipConfig.actionName)
      this.indicator.onAction(this.finish.bind(this));
    this.indicator.show();
  }
}
