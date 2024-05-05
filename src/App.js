
import React, { Component } from 'react';
import { FiniteStateMachine } from './FiniteStateMachine';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFloor: 1,
      currentState: 'idle'
    };
    this.fsm = new FiniteStateMachine();
    this.fsm.addState('idle');
    this.fsm.addState('inTransit');
    this.fsm.addState('doorOpening');
    this.fsm.addState('doorOpen');
    this.fsm.addState('doorClosing');
    this.fsm.addTransition('idle', 'inTransit', 'CALL_ELEVATOR');
    this.fsm.addTransition('inTransit', 'doorOpening', 'ARRIVED_AT_FLOOR');
    this.fsm.addTransition('doorOpening', 'doorOpen', 'DOOR_OPENED');
    this.fsm.addTransition('doorOpen', 'doorClosing', 'DOOR_CLOSE');
    this.fsm.addTransition('doorClosing', 'idle', 'DOOR_CLOSED');
  }

  moveElevatorToFloor = (floor) => {
    const { currentFloor } = this.state;
    if (floor === currentFloor) {
      return;
    }
    let adjustment = null;
    if (floor > currentFloor) {
      adjustment = 1;
    }
    if (floor < currentFloor) {
      adjustment = -1;
    }
    this.setState({currentFloor: this.state.currentFloor + adjustment},()=>{setTimeout(this.moveElevatorToFloor.bind(this, floor),1000)})
  }

  callElevator = (floor) => {
    this.fsm.handleEvent('CALL_ELEVATOR');
    this.setState({ currentState: this.fsm.currentState });
    if (floor !== this.state.currentFloor) {
      this.moveElevatorToFloor(floor);
    }
  };

  arriveAtFloor = (floor) => {
    const { currentState } = this.state;
    if (currentState === 'inTransit') {
      this.setState({ currentFloor: floor });
      this.fsm.handleEvent('ARRIVED_AT_FLOOR');
      this.setState({ currentState: this.fsm.currentState });
    }
  };

  openDoor = () => {
    this.fsm.handleEvent('DOOR_OPENED');
    this.setState({ currentState: this.fsm.currentState });
    setTimeout(() => {
      this.fsm.handleEvent('DOOR_CLOSE');
      this.setState({ currentState: this.fsm.currentState });
    }, 3000); // 3 seconds door open duration
  };

  closeDoor = () => {
    this.fsm.handleEvent('DOOR_CLOSED');
    this.setState({ currentState: this.fsm.currentState });
  };

  render() {
    const { currentFloor, currentState } = this.state;

    return (
      <div>
        <h1>Elevator State Machine Demo</h1>
        <p>Current Floor: {currentFloor}</p>
        <p>Elevator State: {currentState}</p>
        {currentState === 'idle' && currentFloor !== 10 && (
          <button onClick={()=>{this.callElevator(10)}}>Call Elevator to Floor 10</button>
        )}
        {currentState === 'inTransit' && currentFloor === 10 && (
          <button onClick={()=>{this.arriveAtFloor(10)}}>Arrival at Floor 10</button>
        )}
        {currentState === 'idle' && currentFloor === 10 &&  (
          <button onClick={()=>{this.callElevator(1)}}>Call Elevator to Floor 1</button>
        )}
         {currentState === 'inTransit' && currentFloor === 1 && (
          <button onClick={()=>{this.arriveAtFloor(1)}}>Arrival at Floor 1 </button>
        )}
        {currentState === 'doorOpening' && (
          <button onClick={this.openDoor}>Opening Door</button>
        )}
        {currentState === 'doorOpen' && (
          <p>Door Open</p>
        )}
        {currentState === 'doorClosing' && (
          <button onClick={this.closeDoor}>Finish Closing Door</button>
        )}
      </div>
    );
  }
}

export default App;