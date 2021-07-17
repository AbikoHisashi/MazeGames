let mTimer
let TIMER_INTERVAL = 100

const drawFieldGrid = () => {
    ctx.fillStyle = "black"
    for (let x = 0; x < canvasHight / cellSize; x++) {
        ctx.beginPath()
        ctx.moveTo(x * cellSize, 0)
        ctx.lineTo(x * cellSize, canvasHight)
        ctx.moveTo(0, x * cellSize)
        ctx.lineTo(canvasWidth, x * cellSize)
        ctx.closePath()
        ctx.stroke()
    }
}
const drawCheckerboard = () => {
    for (let x = 0; x < canvasWidth / cellSize; x++) {
        for (let y = 0; y < canvasHight / cellSize; y++) {
            if ((x * Math.floor(canvasWidth / cellSize) + y) % 2 === 0)
                ctx.fillStyle = "black"
            else
                ctx.fillStyle = "white"
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
    }
}

class Field {
    constructor(ca) {
        this.canvas = ca
        this.player = new Player(this)
        this.len = 20
        this.cellSize = Math.floor(this.canvas.width / this.len)
        this.cells = new Array(this.len)
        for (let x = 0; x < this.len; x++) this.cells[x] = new Array(this.len).fill(0)

        for (let i = 0; i < 300; i++) {
            let x = Math.floor(Math.random() * this.len)
            let y = Math.floor(Math.random() * this.len)
            //  console.log(x, y)
            this.cells[x][y] = 1
        }
    }
    show() {
        ctx.fillStyle = "black"
        for (let x = 0; x < this.len; x++) {
            // console.log(this.cells[x])
            for (let y = 0; y < this.len; y++) {
                if (this.cells[x][y] !== 1) continue
                ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
            }
        }
        this.player.show()
    }
}

class Player {
    constructor(field) {
        this.field = field
        this.x = 0
        this.y = 0
    }
    show() {
        ctx.fillStyle = "red"
        ctx.fillRect(this.x, this.y, this.field.cellSize, this.field.cellSize)
    }
    move(x, y) {
        this.x = (this.x + this.field.canvas.width + x * this.field.cellSize) % this.field.canvas.width
        this.y = (this.y + this.field.canvas.height + y * this.field.cellSize) % this.field.canvas.height
    }
}

window.onload = function setup() {
    const canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    f = new Field(canvas)
    f.show()
    //    draw(f)
}

function draw(f) {
    if (!mTimer) {
        mTimer = performance.now()
    }
    if (mTimer + TIMER_INTERVAL < performance.now()) {
        mTimer += TIMER_INTERVAL
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        f.show()
    }
    requestAnimationFrame(draw(f))
}

document.onkeydown = (e) => {
    switch (e.keyCode) {
        case 37:// left
            f.player.move(-1, 0)
            console.log("left")
            break
        case 38:// up
            f.player.move(0, -1)
            console.log("up")
            break
        case 39:// right
            f.player.move(1, 0)
            console.log("r")
            break
        case 40:// down
            f.player.move(0, 1)
            console.log("d")
            break
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    f.show()
}

