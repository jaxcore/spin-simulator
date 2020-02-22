import React, { Component } from 'react';
import Spin from './Spin';

import VirtualSpin from 'jaxcore-virtualspin';

const ipcRenderer = window.ipcRenderer;

class SpinSimulator extends Component {
	constructor(props) {
		super(props);
		
		// this.engine = VirtualSpin.createWorld(300, 300, 90);
		this.engine = VirtualSpin.createWorldLogos(null, 300, 300, 90);
		
		this.virtualSpin = new VirtualSpin({
			engine: this.engine,
			// canvasRef: this.canvasRef,
			x: 0,
			y: 0,
			bodySize: 85,
			width: 90,
			height: 90
		});
		
		// this.state = {
		// 	spinPosition: props.spin.spinPosition,
		// 	buttonPushed: props.spin.buttonPushed,
		// 	knobPushed: props.spin.knobPushed
		// };
		
		// this.spinPosition = props.spin.spinPosition;
		// this.buttonPushed = props.spin.buttonPushed;
		// this.knobPushed = props.spin.knobPushed;
		
		window.virtualSpin = this.virtualSpin;
		
		//this.id = Math.random().toString().substring(2);
		
		// this._onSpin = this.onSpin.bind(this);
		// this._onButton = this.onButton.bind(this);
		// this._onKnob = this.onKnob.bind(this);
	}
	
	componentWillUnmount() {
		this.virtualSpin.stopSimulation();
	}
	componentDidMount() {
		if (ipcRenderer) {
			
			ipcRenderer.send('simulator-begin');
			
			ipcRenderer.on('simulator-started', (event, id) => {
				this.id = id;
				
				window.addEventListener('beforeunload', (e) => {
					ipcRenderer.send('simulator-spin-close', this.id);
				});
				
				this.virtualSpin.on('spin', (diff, time) => {
					// ipcRenderer.
					ipcRenderer.send('simulator-spin', this.id, this.virtualSpin.state.spinPosition);
				});
				this.virtualSpin.on('button', (pushed) => {
					// ipcRenderer.
					ipcRenderer.send('simulator-button', this.id, pushed);
				});
				this.virtualSpin.on('knob', (pushed) => {
					// ipcRenderer.
					ipcRenderer.send('simulator-knob', this.id, pushed);
				});
			});
			
			
		}
		// this.virtualSpin.startSimulation();
		// this.engine._start();
	}
	
	componentWillReceiveProps(nextProps) {
		// if (nextProps.spin) {
		// 	console.log('componentWillReceiveProps spinPosition', nextProps.spin.spinPosition);
		// 	if (nextProps.spin.spinPosition !== this.spinPosition) {
		// 		this.spinPosition = nextProps.spin.spinPosition;
		// 		this.virtualSpin.setPosition(this.spinPosition)
		// 	}
		// 	if (nextProps.spin.buttonPushed !== this.buttonPushed) {
		// 		this.buttonPushed = nextProps.spin.buttonPushed;
		// 		if (this.buttonPushed) this.virtualSpin.pushButton();
		// 		else this.virtualSpin.releaseButton();
		// 	}
		// 	if (nextProps.spin.knobPushed !== this.knobPushed) {
		// 		this.knobPushed = nextProps.spin.knobPushed;
		// 		if (this.knobPushed) this.virtualSpin.pushKnob();
		// 		else this.virtualSpin.releaseKnob();
		// 	}
		// }
	}
	
	render() {
		return (
			<div className="spin-visualizer">
				<Spin virtualSpin={this.virtualSpin}/>
			</div>
		);
	}
}

export default SpinSimulator;
