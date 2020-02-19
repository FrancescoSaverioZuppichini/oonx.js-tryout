import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Model from './Model.js'
import Webcam from 'react-webcam'

const videoConstraints = {
	width: 1280,
	height: 720,
	facingMode: 'user'
}

export default class App extends Component {
	constructor(props) {
		super(props)
		this.webcamRef = React.createRef()
	}

	componentDidMount() {
		this.setUpWebCam()
	}

	setUpWebCam() {
		var video = document.getElementById('video')

		// Get access to the camera!
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			// Not adding `{ audio: true }` since we only want video now
			navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
				//video.src = window.URL.createObjectURL(stream);
				video.srcObject = stream
				video.play()
			})
		}
	}

	capture = () => {
		var video = document.getElementById('video')
		var canvas = document.getElementById('canvas2')
		var context = canvas.getContext('2d')
		context.drawImage(video, 0, 0, 640, 480)
	}
	render() {
		return (
			<div>
				<img id="putin" src="putin.jpg" />
				<video id="video" width="640" height="480" autoplay />
				<button onClick={this.capture}>Capture photo</button>
				<canvas id="canvas2" width="400" height="400" />

				<Model input={document.getElementById('putin')}>{(output) => <p>{output}</p>}</Model>
			</div>
		)
	}
}
