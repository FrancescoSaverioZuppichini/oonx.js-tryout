import logo from "./logo.svg"
import { Tensor, InferenceSession } from "onnxjs"
import "./App.css"
import { softmax, loadImage, imgToGray, argmax } from "./utils.js"
// https://github.com/microsoft/onnxjs-demo/tree/master/src
// https://github.com/onnx/models/tree/master/vision/body_analysis/emotion_ferplus
import React, { Component } from "react"

export default class Model extends Component {
    constructor(props) {
        super(props)
        this.state = { output: 0 }
        this.emotionMap = [
            "neutral",
            "happiness",
            "surprise",
            "sadness",
            "anger",
            "disgust",
            "fear",
            "contempt"
        ]

        this.canvas = React.createRef()
        this.tempCanvas = React.createRef()
    }

    componentDidMount() {
        const url = "/dl/model.onnx"

        this.session = new InferenceSession()
        this.session.loadModel(url)
            .then(() => document.getElementById('putin'))
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
        canvas.width = img.width
        canvas.height = img.height
        const context = canvas.getContext("2d")

        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
        const data = this.scale(context, 64, 64)
        const x = imgToGray(data, 64, 64)

        return x
    }

    scale(ctx, width, height) {
        const scaledCtx = this.tempCanvas.current.getContext("2d")
        scaledCtx.drawImage(ctx.canvas, 0, 0, width, height)
        return scaledCtx.getImageData(0, 0, width, height).data
    }

    postprocess(output) {
        const probs = softmax(Array.prototype.slice.call(output))
        const maxInd = argmax(probs)

        return this.emotionMap[maxInd]
    }

    render() {
        return <div>
            <canvas ref={this.canvas} width="400" height="400" style={{ display: "none" }}></canvas>
            <canvas ref={this.tempCanvas} width="400" height="400" style={{ display: "none" }}></canvas>
            {this.props.children(this.state.output)}
        </div>
    }
}
