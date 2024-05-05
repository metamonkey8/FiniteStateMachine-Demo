const { FiniteStateMachine } = require('./FiniteStateMachine');

describe('FiniteStateMachine', () => {
  let fsm;

  beforeEach(() => {
    fsm = new FiniteStateMachine();
    fsm.addState('idle');
    fsm.addState('inTransit');
    fsm.addTransition('idle', 'inTransit', 'START_TRANSIT');
  });

  test('initial state should be idle', () => {
    expect(fsm.currentState).toBe('idle');
  });

  test('should transition to inTransit state', () => {
    fsm.handleEvent('START_TRANSIT');
    expect(fsm.currentState).toBe('inTransit');
  });

  test('should not transition from idle state when event fired is not added/defined', () => {
    try {
        fsm.handleEvent('NOT_DEFINED_EVENT');
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
    } catch (e) {
        expect(e.message).toBe("Invalid event for current state");
        expect(fsm.currentState).toBe('idle');

    }
  });

  test('should not transition from inTransit state when event fired is not added/defined', () => {
    try {
        fsm.handleEvent('START_TRANSIT');
        fsm.handleEvent('NOT_DEFINED_EVENT');
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
    } catch (e) {
        expect(e.message).toBe("Invalid event for current state");
        expect(fsm.currentState).toBe('inTransit');
    }
  });

  test('should throw an error for state not defined in transition add', () => {
    try {
        fsm.addTransition('idle', 'finished', 'FINISHED');
        // Fail test if above expression doesn't throw anything.
        expect(true).toBe(false);
    } catch (e) {
        expect(e.message).toBe("Either fromState or toState not defined");
    }
  });
});