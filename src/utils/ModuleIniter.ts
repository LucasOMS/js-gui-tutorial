export class ModuleIniter {
  private static INSTANCE: ModuleIniter | undefined;
  private initialized: boolean = false;

  constructor() {
    if (ModuleIniter.INSTANCE) return ModuleIniter.INSTANCE;
    ModuleIniter.INSTANCE = this;
    return ModuleIniter.INSTANCE;
  }

  public static getInstance(): ModuleIniter {
    return new ModuleIniter();
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    setupStyles();

    function setupStyles() {
      const head = document.getElementsByTagName('head').item(0);
      if (head)
        head.insertAdjacentHTML('beforeend',
          `<style>
                    .js-gui-tooltip {
                        position: fixed;
                        bottom: 12px;
                        left: 50%;
                        transform: translate(-50%, 0);
                        z-index: 2000;
                        background: white;
                        padding: 8px 16px;
                        max-width: 90vw;
                        border-radius: 3px;
                        box-shadow: #0000008f 1px 1px 4px 0;
                    }
                    #js-gui-tutorial-grid {
                        position:absolute; 
                        top:0; 
                        left: 0
                    }
                    #js-gui-tutorial-grid .js-gui-tutorial-cell {
                        background: rgba(0, 0, 0, .7);
                        position: absolute;
                    }
                </style>`);
    }
  }
}
