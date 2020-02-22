import React from 'react';
import SpinSimulator from './SpinSimulator';

function SpinSimulatorApp() {
  return (
    <div className="SpinSimulator">
      <SpinSimulator />
      <div className="arrows-info">
          Use Arrow Keys:<br/>
          <span className="arrow">↑</span> Button
          &nbsp;
          <span className="arrow">↓</span> Knob
          &nbsp;
          <span className="arrow">←</span> Spin Left
          &nbsp;
          <span className="arrow">→</span> Spin Right
      </div>
    </div>
  );
}

export default SpinSimulatorApp;
