import p5 from 'node-p5'

function sketch (p: any) {
  p.setup = () => {
    let canvas = p.createCanvas(200, 200)
    setTimeout(() => {
      p.saveCanvas(canvas, 'myCanvas', 'png').then((filename: string) => {
        console.log(`saved the canvas as ${filename}`)
        p5
      })
    }, 100)
    p.noLoop()
  }
  p.draw = () => {
    p.background(50)
    p.text('hello world!', 50, 100)
  }
}

let p5Instance = p5.createSketch(sketch)
