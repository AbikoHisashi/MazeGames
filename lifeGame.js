class Gen {
    constructor() {
        this.cells = [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 1, 1, 0, 1, 1, 0,
            0, 0, 1, 1, 0, 1, 1, 0,
            0, 0, 1, 1, 0, 1, 1, 0,
            0, 0, 0, 0, 0, 1, 1, 0,
            0, 0, 1, 1, 1, 0, 0, 0,
            0, 0, 1, 1, 1, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ]
        this.len = Math.sqrt(this.cells.length)
        this.cellSize = height / this.len
    }
    next() {
        let t = this
        let n = new Gen()
        for (let i = 0; i < t.cells.length; i++) {
            let lives = t.livesAround(...t.indexToXy(i))
            if (t.cells[i] === 0) {
                // 現世代で死んでいるセル
                n.cells[i] = (lives === 3) ? 1 : 0
            } else {
                // 現世代で生きているセル
                n.cells[i] = (lives === 2 || lives === 3) ? 1 : 0
            }
        }
        return n
    }
    livesAround(x, y) {
        let lives = 0
        for (let a = x - 1; a <= x + 1; a++) {
            for (let b = y - 1; b <= y + 1; b++) {
                if (a === x && b === y) continue
                let i = this.xyToIndex(a, b)
                if (i === -1) continue
                lives += this.cells[i]
            }
        }
        return lives;
    }
    xyToIndex(x, y) {
        if (x < 0 || x >= this.len || y < 0 || y >= this.len) return -1
        return y * this.len + x
    }
    indexToXy(i) {
        if (i < 0 || i >= this.len * this.len) return -1
        let x = i % this.len
        let y = floor(i / this.len)
        return [x, y]
    }
    draw() {
        fill(0, 51, 153)
        stroke(255, 255, 255)
        for (let [i, c] of this.cells.entries()) {
            if (c !== 1) continue
            let [x, y] = this.indexToXy(i)
            rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
        }
    }
}
let g
function setup() {
    createCanvas(480, 480);
    g = new Gen()
    redrawAll()
}
function redrawAll() {
    background(204, 204, 255);
    g.draw()
}
function mousePressed() {
    g = g.next()
    redrawAll()
}
function draw() {
    if (frameCount % 20 === 0) mousePressed()
}