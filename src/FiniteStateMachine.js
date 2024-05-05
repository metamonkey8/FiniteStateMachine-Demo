class FiniteStateMachine {
    constructor() {
      this.states = new Set();
      this.transitions = new Map();
      this.currentState = null;
    }
  
    addState(state) {
      this.states.add(state);
      if (!this.currentState) {
        this.currentState = state;
      }
    }
  
    addTransition(fromState, toState, event) {
      if (!this.states.has(fromState) || !this.states.has(toState)) {
        throw new Error('Either fromState or toState not defined');
      }
      if (!this.transitions.has(fromState)) {
        this.transitions.set(fromState, new Map());
      }
      this.transitions.get(fromState).set(event, toState);
    }
  
    handleEvent(event) {
      if (!this.currentState) {
        throw new Error('No current state defined');
      }
      const transitions = this.transitions.get(this.currentState);
      if (!transitions || !transitions.has(event)) {
        throw new Error('Invalid event for current state');
      }
      this.currentState = transitions.get(event);
    }
  }
  
  export { FiniteStateMachine };