import { Step } from './Step';
import { ModuleIniter } from './utils/ModuleIniter';
import { StateManager } from './utils/StateManager';

export class Scenario {
  private steps: Step[];
  private currentStep: number;

  constructor(steps: Step[]) {
    ModuleIniter.getInstance().init();
    if (steps.length === 0) throw new Error('Cannot instantiate a scenario without a step');
    this.steps = steps;
    this.currentStep = 0;
  }

  public start() {
    if (StateManager.getInstance().scenarioInProgress) throw new Error('Cannot have two scenarii at a time');
    StateManager.getInstance().scenarioInProgress = true;
    this.currentStep = 0;
    this.startStep();
  }

  startStep() {
    this.steps[this.currentStep].start();
    if (this.currentStep + 1 === this.steps.length) // Finish the last step finishes the scenario
      this.steps[this.currentStep].onFinish(this.finish.bind(this));
    else // Finish a step start the next one
      this.steps[this.currentStep].onFinish(this.startStep.bind(this));
    this.currentStep += 1; // Go to next step for next call
  }

  // noinspection JSMethodCanBeStatic
  private finish() {
    StateManager.getInstance().scenarioInProgress = false;
  }
}
