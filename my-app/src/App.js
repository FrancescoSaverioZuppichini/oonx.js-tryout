import logo from "./logo.svg"
import { Tensor, InferenceSession } from "onnxjs"
import "./App.css"
import {softmax} from "./utils.js"
// https://github.com/microsoft/onnxjs-demo/tree/master/src
// https://github.com/onnx/models/tree/master/vision/body_analysis/emotion_ferplus
import React, { Component } from "react"

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { output: 0 }
    this.session = new InferenceSession()
    const url = "/dl/model.onnx"

    this.session = new InferenceSession()
    this.session.loadModel(url).then(() => {
      this.drawCanvas(this.inference)
      
    })
  }

  inference = (x) => {
      // generate model input
    const inferenceInputs = [new Tensor([2.0, 3.0, 4.0, 5.0, 6.0, 7.0], "float32", [3, 2])]
    // execute the model
    this.session.run([x]).then(output => {
      // consume the output
      const outputTensor = output.values().next().value
      this.postprocess(outputTensor.data)
      console.log(`model output tensor: ${outputTensor.data}.`)
    })
  
  }

  drawCanvas(cb) {
    //Get the canvas element by using the getElementById method.
    var canvas = document.getElementById("my_canvas")
    //Get a 2D drawing context for the canvas.
    var context = canvas.getContext("2d")

    //The path to the image that we want to add.
    var imgPath = "/obama.jpg"

    //Create a new Image object.
    var img = new Image()

    //Set the src of this Image object.
    img.src = imgPath

    //the x coordinates
    var x = 0

    //the y coordinates
    var y = 0

    //When our image has loaded.
    img.onload = () => {
      //Draw the image onto the canvas.
      context.drawImage(
        img,
        x,
        y,
        img.width,
        img.height,
        0,
        0,
        canvas.width,
        canvas.height
      )

      const data = this.scale(context)
      const height = 64
      const width = 64
      const greyScale = [];
      for (let i = 0; i < data.length; i+= 4) {
        greyScale.push((data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114 - 127.5)/127.5);
      }
      const tensor = new Tensor(new Float32Array(width*height), 'float32', [1, 1, width,  height])
      tensor.data.set(greyScale)

      cb(tensor)
    }
  }

  scale(ctx){ 
		const scaledImage = document.getElementById('temp-canvas');
		const scaledCtx = scaledImage.getContext('2d');
		scaledImage.width = 64
		scaledImage.height = 64
    scaledCtx.drawImage(ctx.canvas, 0, 0, 64, 64);
		return scaledCtx.getImageData(0, 0, 64, 64).data
  }
  
  postprocess(output) {
    const emotionMap = ['neutral', 'happiness', 'surprise', 'sadness', 'anger',
       'disgust', 'fear', 'contempt'];

       const myOutput = softmax(Array.prototype.slice.call(output));
       console.log(myOutput)
       let maxInd = -1;
       let maxProb = -1;
       for (let i = 0; i < myOutput.length; i++) {
         if (maxProb < myOutput[i]) {
           maxProb = myOutput[i];
           maxInd = i;
         }
       }
      
       this.setState({ output: `${emotionMap[maxInd]}`})

  }

  render() {
    return <div>{this.state.output}</div>
  }
}
