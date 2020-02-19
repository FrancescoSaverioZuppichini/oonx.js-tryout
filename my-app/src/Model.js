import logo from "./logo.svg"
import { Tensor, InferenceSession } from "onnxjs"
import "./App.css"
import { softmax, loadImage, imgToGray } from "./utils.js"
// https://github.com/microsoft/onnxjs-demo/tree/master/src
// https://github.com/onnx/models/tree/master/vision/body_analysis/emotion_ferplus
import React, { Component } from "react"

export default class Model extends Component {
    constructor(props) {
        super(props)
        this.state = { output: 0 }
        this.canvas = React.createRef()
        this.tempCanvas = React.createRef()
    }

    componentDidMount() {
        const url = "/dl/model.onnx"

        this.session = new InferenceSession()
        this.session.loadModel(url)
        .then(() => loadImage("/obama.jpg"))
        .then(img => this.getInputFromImg(img))
        .then(x => this.inference(x))
        .then(output => this.setState({ output }))

    }

    inference = async x => {
        const outputs = await this.session.run([x])
        const pred = outputs.values().next().value
        return this.postprocess(pred.data)
    }

    async getInputFromImg(img) {
        const canvas = this.canvas.current
        const context = canvas.getContext("2d")
        
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
        const data = this.scale(context, 64, 64 )
        const x = imgToGray(data, 64, 64)

        return x
    }

    scale(ctx,  width, height ) {
        const scaledCtx = this.tempCanvas.current.getContext("2d")
        scaledCtx.drawImage(ctx.canvas, 0, 0, width, height)
        return scaledCtx.getImageData(0, 0, width, height).data
    }

    postprocess(output) {
        const emotionMap = [
            "neutral",
            "happiness",
            "surprise",
            "sadness",
            "anger",
            "disgust",
            "fear",
            "contempt"
        ]

        const probs = softmax(Array.prototype.slice.call(output))

        let maxInd = -1
        let maxProb = -1
        for (let i = 0; i < probs.length; i++) {
            if (maxProb < probs[i]) {
                maxProb = probs[i]
                maxInd = i
            }
        }

        return emotionMap[maxInd]
    }

    render() {
        return <div>
            <canvas ref={this.canvas} width="400" height="400"></canvas>
            <canvas ref={this.tempCanvas} width="400" height="400" style={{ display: "none" }}></canvas>
            {this.props.children(this.state.output)}
        </div>
    }
}
