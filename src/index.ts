import p5 from 'node-p5'

let tokenData = {
  tokenId: '2831',
  hashes: ['0xb5b54ea7d262bf7349c4329a43dc56b8959b41e585e3dafc63b1c0e4bd28483e']
}
let numHashes = tokenData.hashes.length
let hashPairs: string[] = []
for (let i = 0; i < numHashes; i++) {
  for (let j = 0; j < 32; j++) {
    hashPairs.push(tokenData.hashes[i].slice(2 + j * 2, 4 + j * 2))
  }
}
let decPairs = hashPairs.map(x => {
  return parseInt(x, 16)
})

let seed = parseInt(tokenData.hashes[0].slice(0, 16), 16)
let color

let index = 0
let ht
let wt = 2
let speed = 1
let segments
let amp = 1

let loops = false
let startColor = decPairs[29]
let reverse = decPairs[30] < 128
let slinky = decPairs[31] < 35
let pipe = decPairs[22] < 32
let bold = decPairs[23] < 15
let segmented = decPairs[24] < 30
let fuzzy = pipe && !slinky

let width = 3000
let height = 2000

function sketch (p: any) {
  p.setup = () => {
    let canvas = p.createCanvas(width, height)
    p.colorMode(p.HSB, 255)
    segments = p.map(decPairs[26], 0, 255, 12, 20)
    ht = p.map(decPairs[27], 0, 255, 3, 4)
    p.spread = decPairs[28] < 3 ? 0.5 : p.map(decPairs[28], 0, 255, 5, 50)
    p.strokeWeight(2000 / 1200)
    setTimeout(() => {
      p.saveCanvas(canvas, 'squiggle', 'png').then((filename: string) => {
        console.log(`saved the canvas as ${filename}`)
        // p5
      })
    }, 1000)
    p.noLoop()
  }
  p.draw = () => {
    color = 0
    //  background(backgroundArray[backgroundIndex]);
    //  background('transparent');
    p.background([0, 0, 0, 0])
    let div = Math.floor(p.map(Math.round(decPairs[24]), 0, 230, 3, 20))
    let steps = slinky ? 50 : fuzzy ? 1000 : 200
    p.translate(width / 2 - width / wt / 2, height / 2)
    for (let j = 0; j < segments - 2; j++) {
      for (let i = 0; i <= steps; i++) {
        let t = i / steps
        let x = p.curvePoint(
          (width / segments / wt) * j,
          (width / segments / wt) * (j + 1),
          (width / segments / wt) * (j + 2),
          (width / segments / wt) * (j + 3),
          t
        )
        let y = p.curvePoint(
          p.map(decPairs[j], 0, 255, -height / ht, height / ht) * amp,
          p.map(decPairs[j + 1], 0, 255, -height / ht, height / ht) * amp,
          p.map(decPairs[j + 2], 0, 255, -height / ht, height / ht) * amp,
          p.map(decPairs[j + 3], 0, 255, -height / ht, height / ht) * amp,
          t
        )
        let hue = reverse
          ? 255 - ((color / p.spread + startColor + index) % 255)
          : (color / p5.spread + startColor + index) % 255

        if (fuzzy) {
          p.noStroke()
          p.fill(hue, 255, 255, 20)
          let fuzzX = x + p.map(rnd(), 0, 1, 0, height / 10)
          let fuzzY = y + p.map(rnd(), 0, 1, 0, height / 10)
          if (p.dist(x, y, fuzzX, fuzzY) < height / 11.5) {
            p.circle(
              fuzzX,
              fuzzY,
              p.map(rnd(), 0, 1, height / 160, height / 16)
            )
          }
        } else {
          if (slinky && pipe) {
            if (i == 0 || i == steps - 1) {
              p.fill(0)
            } else {
              p.noFill()
            }
            p.stroke(0)
            p.circle(x, y, height / 7)
          }

          if (slinky) {
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

          p.circle(x, y, bold && !slinky ? height / 5 : height / 13)

          if (segmented && !slinky && !bold) {
            if (i % div === 0 || i == 0 || i == steps - 1) {
              p.noStroke()
              p.fill(decPairs[25])
              p.circle(x, y, height / 12)
            }
          }
        }
        color++
      }
      seed = parseInt(tokenData.hashes[0].slice(0, 16), 16)
    }

    loops === true ? (index = index + speed) : (index = index)
  }

  function rnd () {
    seed ^= seed << 13

    seed ^= seed >> 17

    seed ^= seed << 5

    return ((seed < 0 ? ~seed + 1 : seed) % 1000) / 1000
  }
}

let p5Instance = p5.createSketch(sketch)
