import React, { Component } from 'react';
import Spin from './Spin';

import VirtualSpin from 'jaxcore-virtualspin';

const ipcRenderer = window.ipcRenderer;

class SpinSimulator extends Component {
	constructor(props) {
		super(props);
		
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
		
		this.ledRefs = [];
		for (let i=0;i<24;i++) {
			this.ledRefs[i] = React.createRef();
		}
		
		this.virtualSpin.setLeds(this.ledRefs);
		
		window.virtualSpin = this.virtualSpin;
		
		window.simulatorCommand = (method, args) => {
			// debugger;
			console.log('simulatorCommand', method, args);
			
			if (method === 'SCALAR') {
				let p = args[0];
				let c1 = [args[1],args[2],args[3]];
				let c2 = [args[4],args[5],args[6]];
				let c3 = [args[7],args[8],args[9]];
				console.log('scale()', p,c1,c2,c3);
				this.virtualSpin.scale(p,c1,c2,c3);
			}
			if (method === 'FLASH') {
				console.log('flash');
				this.virtualSpin.flash(args);
			}
			if (method === 'ROTATE') {
				let p = args[0];
				let c1 = [args[1],args[2],args[3]];
				let c2;
				if (args.length === 7) c2 = [args[4],args[5],args[6]];
				this.virtualSpin.rotate(p, c1, c2);
			}
			return true;
		};
	}
	
	componentWillUnmount() {
		this.virtualSpin.stopSimulation();
	}
	
	componentDidMount() {
		if (ipcRenderer) {
			
			ipcRenderer.send('simulator-begin');
			
			ipcRenderer.on('simulator-started', (event, id, instance) => {
				debugger;
				
				this.id = id;
				document.title = 'Jaxcore Spin Simulator '+instance;
				window.addEventListener('beforeunload', (e) => {
					ipcRenderer.send('simulator-spin-close', this.id);
				});
				
				this.virtualSpin.on('spin', (diff, time) => {
					console.log('spin', diff, time);
					ipcRenderer.send('simulator-spin', this.id, this.virtualSpin.state.spinPosition);
				});
				this.virtualSpin.on('button', (pushed) => {
					ipcRenderer.send('simulator-button', this.id, pushed);
				});
				this.virtualSpin.on('knob', (pushed) => {
					ipcRenderer.send('simulator-knob', this.id, pushed);
				});
				
			});
			ipcRenderer.on('simulator-command', (event, method, args) => {
				debugger;
			});
		}
		
		let midx = 222;
		let midy = 124;
		let radius = 100;
		let ao = Math.PI/2;
		let a,x,y;
		for (let i=0;i<24;i++) {
			a = ao - i * 2*Math.PI / 24;
			x = midx + Math.sin(a) * radius;
			y = midy + Math.cos(a) * radius;
			this.ledRefs[i].current.style.left = x+'px';
			this.ledRefs[i].current.style.top = y+'px';
		}
		
		// this.ledRefs[1].current.style.left = (midx+radius)+'px';
		// this.ledRefs[1].current.style.top = midy+'px';
		
		// this.virtualSpin.on('spin', (diff) => {
		// 	this.virtualSpin.rotate(diff, [255,0,0], [0,0,255]);
		// })
	}
	
	render() {
		let leds = [];
		for (let i=0;i<24;i++) {
			leds.push((<div key={i} className="led" ref={this.ledRefs[i]}/>));
		}
		return (
			<div className="spin-simulator">
				
				{leds}
				
				<Spin virtualSpin={this.virtualSpin}/>
			</div>
		);
	}
}

export default SpinSimulator;
