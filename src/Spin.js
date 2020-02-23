import * as PIXI from 'pixi.js';

// import * as PIXI, {DisplayObjectContainer} from 'pixi.js';
// import {PIXI, DisplayObjectContainer} from 'pixi.js';

import React, { Component } from 'react';

function toHex(d) {
	return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}

class Spin extends Component {
	constructor(props) {
		super();
		global.ss = this;
		
		this.refCanvas = React.createRef();
		
		this.spin = props.virtualSpin;
		
		//this.spins = props.spins;
		// console.log(PIXI);
		// debugger;
		
		// this._onRotate = this.onRotate.bind(this);
		// this._onSpin = this.onSpin.bind(this);
		// this._onKnob = this.onKnob.bind(this);
		// this._onButton = this.onButton.bind(this);
	}
	
	// getSpins() {
	// 	const spins = [];
	// 	for (let id in this.props.spins) {
	// 		spins.push(this.props.spins[id]);
	// 	}
	// 	return spins;
	// }
	
	componentWillUnmount() {
		this.spin.removeListener('rotate', this.onRotate);
		// this.spin.removeListener('spin', this.onSpin);
		this.spin.removeListener('knob', this.onKnob);
		this.spin.removeListener('button', this.onButton);
	}
	componentDidMount() {
		
		this.worldWidth = 400;
		
		// const spins = this.getSpins();
		
		// this.worldHeight = spins.length * 310;
		this.worldHeight = 260;
		
		this.app = new PIXI.Application({
			width: this.worldWidth,         // default: 800
			height: this.worldHeight,        // default: 600
			antialias: true,    // default: false
			transparent: true, // default: false
			resolution: 1,       // default: 1
			view: this.refCanvas.current,
		});
		
		var imageSrc = this.imageSrc = "logo.png";
		
		this.app.loader
		.add(imageSrc)
		.load(this.setup.bind(this));
		
		this.dragging = false;
		this.dragPoint = {};
		this.midX = 250;
		this.midY = 130;
		
		
		
		// this.spin.on('rotate', (angle) => {
		// 	this.spin.container.rotation = angle;
		// 	this.drawKnob();
		// 	// sprite.rotation = angle;
		// 	// fingerHole.rotation = angle;
		// 	// console.log('rotate', angle);
		// });
		
		// global.ps = this;
		
		window.addEventListener('keydown', this.keyDown, false);
		window.addEventListener('keyup', this.keyUp, false);
	}
	
	keyDown = e => {
		console.log(e.keyCode);
		// 37 left
		// 39 right
		// 38 up
		// 40 down
		switch (e.keyCode) {
			case 37:
				this.spin.startSpinLeft();
				break;
			case 39:
				this.spin.startSpinRight();
				break;
			case 38:
				this.spin.pushButton();
				break;
			case 40:
				this.spin.pushKnob();
				break;
		}
		
	};
	keyUp = e => {
		switch (e.keyCode) {
			case 37:
				this.spin.stopSpinLeft();
				break;
			case 39:
				this.spin.stopSpinRight();
				break;
			case 38:
				this.spin.releaseButton();
				break;
			case 40:
				this.spin.releaseKnob();
				break;
		}
	};
	
	onRotate = (angle) => {
		// console.log('onRotate', angle);
		//if (!this.container) return;
		this.container.rotation = angle;
		this.drawKnob();
	};
	
	onSpin = (direction, position) => {
		console.log('Spin spin', direction);
	// 	// if (!s.isSpinning) {
	// 	// 	s.isSpinning = true;
	//
	// 	this.container.rotation = this.spin.knob.angle;
	//
	// 	this.drawKnob();
	//
	// 	// }
	// 	// clearTimeout(s.timer);
	// 	// s.timer = setTimeout(() => {
	// 	// 	s.isSpinning = false;
	// 	// 	this.drawKnob();
	// 	// }, 400);
	};
	
	onKnob = (pushed) => {
		this.drawKnob();
		this.drawLogo();
	};
	
	onButton = (pushed) => {
		this.drawButton();
	};
	
	
	mouseDown = (e) => {
		var x = e.layerX;
		var y = e.layerY;
		e.preventDefault();
		console.log('down', x, y);
		
		
		window.addEventListener('mousemove', this.mouseMove, false);
		window.addEventListener('mouseup', this.mouseUp, false);
		
		if (x > 50 && x < 85 && y > 113 && y < 140) {
			if (!this.spin.state.buttonPushed) {
				// this.buttonPushed = true;
				// window.addEventListener('mouseup', this.mouseUp, false);
				this.spin.pushButton();
			}
			return;
		}
		
		if (x > 229 && x < 268 && y > 110 && y < 147) {
			if (!this.spin.state.knobPushed) {
				// this.knobPushed = true;
				// window.addEventListener('mouseup', this.mouseUp, false);
				this.spin.pushKnob();
			}
			// return;
		}
		
		const i = Math.floor(y / 300);
		// const spins = this.getSpins();
		// const spin = spins[i];
		const spin = this.spin;

		// if (!spin) {
		//     let me = this;
		//     debugger;
		//     return;
		// }
		//const sprite = spin.sprite; //this.sprites[i];
		
		// const sprite = spin.container;

		let { midX, midY } = this;
		// midY += (sprite.position.y - this.midY);

		this.draggingSpin = spin;

		var angle = Math.atan2(midY - y, midX - x);
		if (angle < 0) angle = Math.PI * 2 + angle;
		this.dragPoint = {
			last: spin.angle,
			angle: angle,
			//knobAngle: knob.angle,
			times: [new Date().getTime()],
			angles: [spin.angle]
			//dragPoint.previous = diffAngle;
		};
		// var knobDeg = knob.angle * 180 / Math.PI;

		var deg = angle * 180 / Math.PI;
		console.log('down angle', deg);
		//debugger;

		// knob.torque = 0;
		// Body.setAngularVelocity(knob, 0);

		// this.spinsV.stop();

		this.dragging = true;
		//lastAngle = angle;



	};
	
	mouseMove = (e) => {
		if (!this.dragging) return;
		// const spin = this.draggingSpin;
		//
		// if (!spin || !spin.knob) {
		// 	debugger:
		// 	return;
		// }
		
		const spin = this.spin;
		//const sprite = spin.sprite;
		// const sprite = spin.container;

		let { midX, midY } = this;
		// midY += (sprite.position.y - this.midY);
		const { dragPoint } = this;
		console.log('midY', midY);

		var x = e.layerX;
		var y = e.layerY;

		var angle = Math.atan2(midY - y, midX - x);
		var deltaAngle = (angle - dragPoint.angle);
		if (deltaAngle > Math.PI) {
			var ndeltaAngle = Math.PI * 2 - deltaAngle;
			//console.log('fix deltaAngle >', deltaAngle, ndeltaAngle);
			deltaAngle = ndeltaAngle;
		}
		else if (deltaAngle < -Math.PI) {
			var ndeltaAngle = Math.PI * 2 + deltaAngle;
			//console.log('fix deltaAngle <', deltaAngle, ndeltaAngle);
			deltaAngle = ndeltaAngle;
		}
		dragPoint.angle = angle;


		var newAngle = spin.knob.angle + deltaAngle;

		//console.log('deltaAngle', deltaAngle, newAngle, spin.knob.angle);
		var deg = angle * 180 / Math.PI;
		console.log('move angle', deltaAngle);

		spin.rotateKnob(deltaAngle);

		//dragPoint.angle
		var limit = 7;
		dragPoint.angles.push(newAngle);
		if (dragPoint.angles.length > limit) dragPoint.angles.shift();
		//dragPoint.timeDiff = new Date().getTime() - dragPoint.timeDiff;
		dragPoint.times.push(new Date().getTime());
		if (dragPoint.times.length > limit) dragPoint.times.shift();

	};
	
	mouseUp = (e) => {
		console.log('mouse up');
		window.removeEventListener('mouseup', this.mouseUp, false);
		window.removeEventListener('mousemove', this.mouseMove, false);
		
		if (this.spin.state.buttonPushed) {
			this.spin.releaseButton();
		}
		
		if (this.spin.state.knobPushed) {
			this.spin.releaseKnob();
		}
		
		if (!this.dragging) return;
		
		// const spin = this.draggingSpin;
		const spin = this.spin;
		
		const { dragPoint } = this;
		
		// window.removeEventListener('mouseup', this.mouseUp, false);

		this.dragging = false;

		//var v = dragPoint.diffAngle / dragPoint.timeDiff;
		if (dragPoint.times.length < 4) return;
		console.log('up', dragPoint.times, dragPoint.angles);

		// var angularVelocities = [];
		var diffTime, diffAngle, av;
		var totalDiffTime = 0;
		var totalDiffAngle = 0;
		var overallDir = (dragPoint.angles[0] - dragPoint.angles[dragPoint.angles.length - 1]) < 0 ? 1 : -1;
		var now = new Date().getTime();
		for (var i = 1; i < dragPoint.times.length - 3; i++) {
			if (now - dragPoint.times[i] > 100) {
				return;
			}
			diffTime = dragPoint.times[i + 1] - dragPoint.times[i];

			diffAngle = dragPoint.angles[i + 1] - dragPoint.angles[i];

			totalDiffAngle += diffAngle;
			totalDiffTime += diffTime;
			av = (diffAngle / diffTime) * i + 1;
			console.log(i, 'av ' + av, 'a=' + diffAngle, 't=' + diffTime);
		}
		// linear average
		if (totalDiffTime === 0) return;
		var averageAngularVelocity = totalDiffAngle / totalDiffTime;
		if (averageAngularVelocity < 0 && overallDir === 1) {
			//alert('correct right');
			averageAngularVelocity = -averageAngularVelocity;
		}
		if (averageAngularVelocity > 0 && overallDir === -1) {
			//alert('correct left');
			averageAngularVelocity = -averageAngularVelocity;
		}
		if (isNaN(averageAngularVelocity)) {
			return;
		}
		if (isNaN(overallDir)) {
			return;
		}
		console.log('aav', averageAngularVelocity, overallDir);
		spin.setAngularVelocity(averageAngularVelocity * 10);
	};
	
	setup() {
		
		let x = this.midX;
		let y;
		
		//this.sprites = [];
		
		// let spin;
		
		// const spins = this.getSpins();
		// for (let i = 0; i < spins.length; i++) {
		// 	spin = spins[i];
		
		let i = 0;
		
		// y = (i * 300) + this.midY;
		y = this.midY;
		
		this.createspinsprite();
		
		
		// virtual spin
		// let s = spin;
		// spin.on('spin', (direction) => {
		// 	if (!s.isSpinning) {
		// 		s.isSpinning = true;
		// 		this.drawKnob(s);
		// 	}
		// 	clearTimeout(s.timer);
		// 	s.timer = setTimeout(() => {
		// 		s.isSpinning = false;
		// 		this.drawKnob(s);
		// 	}, 400);
		// });
		// spin.on('knob', (pushed) => {
		// 	this.drawKnob(s);
		// 	this.drawLogo(s);
		// });
		// spin.on('button', (pushed) => {
		// 	this.drawButton(s);
		// });
		//
		// spin.on('leds-changed', (ledColors) => {
		// 	//const { spinStates } = this.state;
		// 	//console.log('ledColors', spin.index, ledColors);
		// 	//spinStates[spin.id].ledColors = ledColors;
		// 	spin.ledColors = ledColors;
		// 	this.drawRing(spin);
		// 	// this.setState({
		// 	//     spinStates
		// 	// });
		// });
		
		// }
		
		
		this.spin.on('rotate', this.onRotate);
		// this.spin.on('spin', this._onSpin);
		this.spin.on('knob', this.onKnob);
		this.spin.on('button', this.onButton);
		
		this.refCanvas.current.addEventListener('mousedown', this.mouseDown, false);
	}
	
	createspinsprite() {
		// var color = 0x000000;
		var lineColor = 0xF0F0F0;
		
		var lineThickness = 2;
		
		let x = this.midX;
		let y = this.midY;
		
		
		var p = PIXI;
		// console.log(PIXI);
		// debugger;
		this.container = new PIXI.Container();
		// return;
		this.container.position.x = x;
		this.container.position.y = y;
		
		//logo.interactive = true;
		
		// Set a new fill color
		const caseLineColor = 0xAAAAAA;
		const caseShape = new PIXI.Graphics();
		const caseColor = 0xF1F1F1;
		caseShape.beginFill(caseColor);
		caseShape.lineStyle(1, caseLineColor);
		caseShape.drawEllipse(250, y, 220, 120); // drawEllipse(x, y, width, height)
		caseShape.endFill();
		this.app.stage.addChild(caseShape);
		
		const caseErase = new PIXI.Graphics();
		caseErase.beginFill(0xFFFFFF);
		caseErase.drawRect(251, y - 122, 160, 244); // drawEllipse(x, y, width, height)
		caseErase.endFill();
		this.app.stage.addChild(caseErase);
		
		const caseRound = new PIXI.Graphics();
		caseRound.beginFill(0xF1F1F1); // Blue
		//caseRound.lineStyle(lineThickness, caseLineColor);
		caseRound.drawEllipse(250, y, 120, 120); // drawEllipse(x, y, width, height)
		caseRound.endFill();
		this.app.stage.addChild(caseRound);
		
		var semicircle = new PIXI.Graphics();
		//semicircle.beginFill(0xff0000);
		semicircle.lineStyle(1, caseLineColor);
		semicircle.arc(0, 0, 120, -Math.PI / 2, Math.PI / 2); // cx, cy, radius, startAngle, endAngle
		semicircle.position = { x: 250, y: y };
		this.app.stage.addChild(semicircle);
		
		// const caseRoundL = new PIXI.Graphics();
		// //caseRound.beginFill(0xF1F1F1); // Blue
		// caseRoundL.lineStyle(1, caseLineColor);
		// caseRoundL.drawEllipse(250, spin.y, 120, 120); // drawEllipse(x, y, width, height)
		// caseRoundL.endFill();
		// this.app.stage.addChild(caseRoundL);
		
		// const caseErase = new PIXI.Graphics();
		// caseErase.beginFill(0xFFFFFF);
		// caseErase.drawRect(250, spin.y-120, 160, 240); // drawEllipse(x, y, width, height)
		// caseErase.endFill();
		// this.app.stage.addChild(caseErase);
		
		this.ring = new PIXI.Graphics();
		this.app.stage.addChild(this.ring);
		
		// spin.ledsquares = [];
		// spin.leds = [];
		// spin.ledsblur = [];
		// for (let i = 0; i < 24; i++) {
		//     spin.ledsquares[i] = new PIXI.Graphics();
		//     this.app.stage.addChild(spin.ledsquares[i]);
		//     spin.leds[i] = new PIXI.Graphics();
		
		//     // spin.ledsblur[i] = new PIXI.filters.BlurFilter();
		//     // spin.ledsblur[i].blur = 3;
		//     // spin.leds[i].filters = [ spin.ledsblur[i] ];
		
		//     this.app.stage.addChild(spin.leds[i]);
		// }
		
		this.drawRing();
		
		this.knobCircle = new PIXI.Graphics();
		this.fingerHole = new PIXI.Graphics();
		
		this.drawKnob();
		
		this.logo = new PIXI.Sprite(
			this.app.loader.resources[this.imageSrc].texture
		);
		this.drawLogo();
		
		
		this.buttonOuter = new PIXI.Graphics();
		this.app.stage.addChild(this.buttonOuter);
		this.button = new PIXI.Graphics();
		this.app.stage.addChild(this.button);
		this.drawButton();
		
		
		
		this.container.addChild(this.knobCircle);
		this.container.addChild(this.fingerHole);
		
		this.container.addChild(this.logo);
		//spin.container.addChild(spin.logo);
		
		this.app.stage.addChild(this.container);
		
		
		// spin.on('leds-changed', (ledColors) => {
		// 	console.log('leds-changed', ledColors);
		// });
		//
		// spin.on('rotate', (angle) => {
		// 	spin.container.rotation = angle;
		// 	// sprite.rotation = angle;
		// 	// fingerHole.rotation = angle;
		// 	// console.log('rotate', angle);
		// });
		//
		
		this.spin.startSimulation();
	}
	
	drawLogo() {
		var logoScale = this.spin.state.knobPushed ? 0.088 : 0.09;
		// var logoScale = 0.09;
		this.logo.x = 0;
		this.logo.y = 0;
		this.logo.anchor.x = 0.5;
		this.logo.anchor.y = 0.5;
		this.logo.scale.x = logoScale;
		this.logo.scale.y = logoScale;
	}
	
	drawRing() {
		const caseColor = 0xF1F1F1;
		var ringFillColor = 0xEBEBEB;
		var lineColor = 0xDDDDDD;
		var ringSize = 113;
		this.ring.clear();
		this.ring.beginFill(ringFillColor);
		this.ring.lineStyle(2, lineColor);  //(thickness, color)
		// this.ring.drawCircle(spin.x, spin.y, ringSize);   //(x,y,radius)
		this.ring.drawCircle(this.midX, this.midY, ringSize);   //(x,y,radius)
		//ring.fillCircle(0, 0, ringSize);   //(x,y,radius)
		this.ring.endFill();
		
		// const ledSize = 21;
		// let x, y;
		// for (let i = 0; i < 24; i++) {
		
		
		//     spin.ledsquares[i].beginFill(0xFFFFFF);
		
		//     let c = 0xFFFFFF;
		//     let hex = toHex(spin.ledColors[i][0])+toHex(spin.ledColors[i][1])+toHex(spin.ledColors[i][2]);
		//     console.log(i, 'hex', hex);
		//     spin.leds[i].beginFill(new Number(hex));
		//     //spin.leds[i].beginFill(c);
		
		//     x = spin.x + ringSize - ledSize - 3;
		//     y = spin.y - ledSize / 2;
		
		//     spin.ledsquares[i].position.x = spin.x;
		//     spin.ledsquares[i].position.y = spin.y;
		//     spin.ledsquares[i].pivot.x = spin.x;
		//     spin.ledsquares[i].pivot.y = spin.y;
		
		//     spin.leds[i].position.x = spin.x;
		//     spin.leds[i].position.y = spin.y;
		//     spin.leds[i].pivot.x = spin.x;
		//     spin.leds[i].pivot.y = spin.y;
		
		//     spin.ledsquares[i].rotation = i * Math.PI * 2 / 24;
		//     spin.leds[i].rotation = i * Math.PI * 2 / 24;
		
		//     spin.ledsquares[i].drawRect(x, y, ledSize, ledSize);
		
		//     spin.leds[i].drawCircle(x + 10, y + 9, 9);
		
		//     spin.ledsquares[i].endFill();
		//     spin.leds[i].endFill();
		// }
	}
	
	drawKnob() {
		var knobFillColor = this.spin.state.knobPushed ? 0xF1F1F1 : 0xFDFDFD;
		// console.log('drawKnob', this.spin.state.knobPushed);
		// var knobFillColor = 0xFDFDFD;
		// console.log('drawKnob', knobFillColor, spin);
		var lineThickness = 2;
		
		var lineColor = (this.spin.state.knobPushed || this.spin.isSpinning) ? 0xBBBBBB : 0xDDDDDD;
		// var lineColor = 0xDDDDDD;
		
		//lineColor = 0xF0F0F0;
		
		var knobSize = this.spin.state.knobPushed ? 85 : 87;
		// var knobSize = 87;
		this.knobCircle.clear();
		this.knobCircle.beginFill(knobFillColor);
		this.knobCircle.lineStyle(lineThickness, lineColor);  //(thickness, color)
		this.knobCircle.drawCircle(0, 0, knobSize);   //(x,y,radius)
		this.knobCircle.endFill();
		
		var fingerHoleSize = this.spin.state.knobPushed ? 26.2 : 27;
		// var fingerHoleSize = 27;
		var fingerHoldOffset = this.spin.state.knobPushed ? 51.5 : 53;
		
		this.fingerHole.clear();
		this.fingerHole.lineStyle(lineThickness, 0xAAAAAA);  //(thickness, color)
		this.fingerHole.drawCircle(0, -fingerHoldOffset, fingerHoleSize);   //(x,y,radius)
		this.fingerHole.endFill();
	}
	
	drawButton() {
		var fillColor = this.spin.state.buttonPushed ? 0xEEEEEE : 0xFDFDFD;
		// var fillColor = 0xFDFDFD;
		// var lineColor = spin.buttonPushed ? 0xBBBBBB : 0xAAAAAA;
		var lineColor = 0xAAAAAA;
		//lineColor = 0xF0F0F0;
		
		var buttonSize = this.spin.state.buttonPushed ? 18 : 19;
		// var buttonSize = 19;
		
		let x = 69;
		// let y = spin.y;
		let y = this.midY;
		
		this.buttonOuter.clear();
		this.buttonOuter.beginFill(0xFAFAFA);
		this.buttonOuter.lineStyle(1, 0xCCCCCC);  //(thickness, color)
		this.buttonOuter.drawCircle(x, y, 25);   //(x,y,radius)
		this.buttonOuter.endFill();
		
		this.button.clear();
		this.button.beginFill(fillColor);
		this.button.lineStyle(1, lineColor);  //(thickness, color)
		this.button.drawCircle(x, y, buttonSize);   //(x,y,radius)
		this.button.endFill();
	}
	
	render() {
		return (<canvas ref={this.refCanvas} id="spinscanvas"></canvas>);
		//return (<div id="knob" ref={this.refDiv}></div>);
	}
}

export default Spin;