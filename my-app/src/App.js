import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"
import Model from './Model.js'
import Webcam from "react-webcam"

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.webcamRef = React.createRef();
  }

  onUserMedia = (media) => {
    console.log(media)
  }

  render() {
    return (
      <div>
        <img id='putin' src='putin.jpg'></img>
        <Webcam
          audio={false}
          height={720}
          ref={this.webcamRef}
          onUserMedia={this.onUserMedia}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
        <Model input={document.getElementById('putin')}>
          {output => (
            <p>{output}</p>
          )}
        </Model>
      </div>
    )
  }
}
