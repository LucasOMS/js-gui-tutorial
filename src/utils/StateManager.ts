export class StateManager {
  private static INSTANCE: StateManager | undefined;

  constructor() {
    if (StateManager.INSTANCE) return StateManager.INSTANCE;
    StateManager.INSTANCE = this;
    return StateManager.INSTANCE;
  }

  private _scenarioInProgress = false;

  get scenarioInProgress(): boolean {
    return this._scenarioInProgress;
  }

  set scenarioInProgress(value: boolean) {
    this._scenarioInProgress = value;
  }

  public static getInstance(): StateManager {
    return new StateManager();
  }
}
