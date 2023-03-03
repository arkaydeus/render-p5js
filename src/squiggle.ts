import p5 from 'node-p5'

let tokenData = {
  tokenId: '2831',
  hashes: ['0xb5b54ea7d262bf7349c4329a43dc56b8959b41e585e3dafc63b1c0e4bd28483e']
}

export const sketch = (p: any, exportImage: (imageData: string) => void) => {
  p.setup = () => {
    const width = 300
    const height = 200

    let canvas = p.createCanvas(width, height)
    p.colorMode(p.HSB, 255)

    let numHashes = tokenData.hashes.length
    let hashPairs: string[] = []
    for (let i = 0; i < numHashes; i++) {
      for (let j = 0; j < 32; j++) {
        hashPairs.push(tokenData.hashes[i].slice(2 + j * 2, 4 + j * 2))
      }
    }
    p.decPairs = hashPairs.map(x => {
      return parseInt(x, 16)
    })

    p.seed = parseInt(tokenData.hashes[0].slice(0, 16), 16)

    p.backgroundIndex = 0
    p.backgroundArray = [
      255, 225, 200, 175, 150, 125, 100, 75, 50, 25, 0, 25, 50, 75, 100, 125,
      150, 175, 200, 225
    ]
    p.index = 0
    p.ht
    p.wt = 2
    p.speed = 1
    p.segments
    p.amp = 1
    p.direction = 1
    p.loops = false
    p.startColor = p.decPairs[29]
    p.reverse = p.decPairs[30] < 128
    p.slinky = p.decPairs[31] < 35
    p.pipe = p.decPairs[22] < 32
    p.bold = p.decPairs[23] < 15
    p.segmented = p.decPairs[24] < 30
    p.fuzzy = p.pipe && !p.slinky

    p.segments = p.map(p.decPairs[26], 0, 255, 12, 20)
    p.ht = p.map(p.decPairs[27], 0, 255, 3, 4)
    p.spread = p.decPairs[28] < 3 ? 0.5 : p.map(p.decPairs[28], 0, 255, 5, 50)

    setTimeout(() => {
      p.saveCanvas(canvas, 'squiggle', 'png').then((filename: string) => {
        console.log(`saved the canvas as ${filename}`)
      })
      // const imageData = canvas.canvas.toDataURL()
      // console.log('imageData', imageData)
      // exportImage(imageData)
    }, 100)
    p.noLoop()
  }
  p.draw = () => {
    p.colorCode = 0
    //  background(backgroundArray[backgroundIndex]);
    //  background('transparent');
    p.background([0, 0, 0, 0])
    let div = Math.floor(p.map(Math.round(p.decPairs[24]), 0, 230, 3, 20))
    let steps = p.slinky ? 50 : p.fuzzy ? 1000 : 200
    p.translate(p.width / 2 - p.width / p.wt / 2, p.height / 2)
    for (let j = 0; j < p.segments - 2; j++) {
      for (let i = 0; i <= steps; i++) {
        let t = i / steps
        let x = p.curvePoint(
          (p.width / p.segments / p.wt) * j,
          (p.width / p.segments / p.wt) * (j + 1),
          (p.width / p.segments / p.wt) * (j + 2),
          (p.width / p.segments / p.wt) * (j + 3),
          t
        )
        let y = p.curvePoint(
          p.map(p.decPairs[j], 0, 255, -p.height / p.ht, p.height / p.ht) *
            p.amp,
          p.map(p.decPairs[j + 1], 0, 255, -p.height / p.ht, p.height / p.ht) *
            p.amp,
          p.map(p.decPairs[j + 2], 0, 255, -p.height / p.ht, p.height / p.ht) *
            p.amp,
          p.map(p.decPairs[j + 3], 0, 255, -p.height / p.ht, p.height / p.ht) *
            p.amp,
          t
        )
        let hue = p.reverse
          ? 255 - ((p.colorCode / p.spread + p.startColor + p.index) % 255)
          : (p.colorCode / p.spread + p.startColor + p.index) % 255

        if (p.fuzzy) {
          p.noStroke()
          p.fill(hue, 255, 255, 20)
          let fuzzX = x + p.map(rnd(), 0, 1, 0, p.height / 10)
          let fuzzY = y + p.map(rnd(), 0, 1, 0, p.height / 10)
          if (p.dist(x, y, fuzzX, fuzzY) < p.height / 11.5) {
            p.circle(
              fuzzX,
              fuzzY,
              p.map(rnd(), 0, 1, p.height / 160, p.height / 16)
            )
          }
        } else {
          if (p.slinky && p.pipe) {
            if (i == 0 || i == steps - 1) {
              p.fill(0)
            } else {
              p.noFill()
            }
            p.stroke(0)
            p.circle(x, y, p.height / 7)
          }

          if (p.slinky) {
            if (i == 0 || i == steps - 1) {
              p.fill(hue, 255, 255)
            } else {
              p.noFill()
            }
            p.stroke(hue, 255, 255)
          } else {
            p.noStroke()
            p.fill(hue, 255, 255)
          }

          p.circle(x, y, p.bold && !p.slinky ? p.height / 5 : p.height / 13)

          if (p.segmented && !p.slinky && !p.bold) {
            if (i % div === 0 || i == 0 || i == steps - 1) {
              p.noStroke()
              p.fill(p.decPairs[25])
              p.circle(x, y, p.height / 12)
            }
          }
        }
        p.colorCode++
      }
      p.seed = parseInt(tokenData.hashes[0].slice(0, 16), 16)
    }

    p.loops === true ? (p.index = p.index + p.speed) : (p.index = p.index)

    function rnd () {
      p.seed ^= p.seed << 13
      p.seed ^= p.seed >> 17
      p.seed ^= p.seed << 5
      return ((p.seed < 0 ? ~p.seed + 1 : p.seed) % 1000) / 1000
    }
  }
}

let p5Instance = p5.createSketch(sketch)
