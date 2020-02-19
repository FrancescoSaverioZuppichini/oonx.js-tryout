import { Tensor, InferenceSession } from "onnxjs"

export function softmax(arr) {
  const C = Math.max(...arr)
  const d = arr.map(y => Math.exp(y - C)).reduce((a, b) => a + b)
  return arr.map((value, index) => {
    return Math.exp(value - C) / d
  })
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", err => reject(err))
    img.src = src
  })
}


export function imgToGray(data, width, height ) {
  const greyScale = []
  for (let i = 0; i < data.length; i += 4) {
    greyScale.push(
      (data[i] * 0.299 +
        data[i + 1] * 0.587 +
        data[i + 2] * 0.114 -
        127.5) /
      127.5
    )
  }
  const tensor = new Tensor(new Float32Array(width * height), "float32", [
    1,
    1,
    width,
    height
  ])
  tensor.data.set(greyScale)

  return tensor
}