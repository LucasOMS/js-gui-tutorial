import { uuid } from 'uuidv4';

export interface TooltipConfiguration {
  actionName?: string | undefined;
  textContent: string;
}

export class Indication {
  private readonly id: string;
  private tooltipConfig: TooltipConfiguration;
  private actionCallback: (() => void) | undefined;

  constructor(tooltipConfig: TooltipConfiguration) {
    this.tooltipConfig = tooltipConfig;
    this.id = uuid();
  }

  show() {
    document.body.insertAdjacentHTML('beforeend',
      `<div id="${this.id}" class="js-gui-tooltip">
                <p>${this.tooltipConfig.textContent}</p>
                ${this.tooltipConfig.actionName ? `<button id="${this.id}-button">${this.tooltipConfig.actionName}</button>` : ''}
            </div>`);
    const button = document.getElementById(`${this.id}-button`);
    if (button)
      button.addEventListener('click', () => {
        if (this.actionCallback)
          this.actionCallback();
        this.destroy();
      });
  }

  destroy() {
    const tooltip = document.getElementById(`${this.id}`);
    if (tooltip)
      tooltip.remove();
  }

  /**
   * Must be called before show method
   * @param callback
   */
  public onAction(callback: (() => void)) {
    this.actionCallback = callback;
  }
}
