import p5 from 'node-p5'

export const sketch = (p: any, exportImage: (imageData: string) => void) => {
  p.setup = () => {
    let canvas = p.createCanvas(200, 200)
    setTimeout(() => {
      p.saveCanvas(canvas, 'myCanvas', 'png').then((filename: string) => {
        console.log(`saved the canvas as ${filename}`)
        p5
      })
      const imageData = canvas.canvas.toDataURL()
      // console.log('imageData', imageData)
      exportImage(imageData)
    }, 100)
    p.noLoop()
  }
  p.draw = () => {
    p.background(50)
    p.text('hello world!', 50, 100)
  }
}

// let p5Instance = p5.createSketch(sketch)
