// シードを固定するため　for debug
// let r = Math.floor(Math.random() * 1000)
// r = 240
// Math.random.seed = (function me(s) {
//     // Xorshift128 (init seed with Xorshift32)
//     s ^= s << 13; s ^= 2 >>> 17; s ^= s << 5;
//     let x = 123456789 ^ s;
//     s ^= s << 13; s ^= 2 >>> 17; s ^= s << 5;
//     let y = 362436069 ^ s;
//     s ^= s << 13; s ^= 2 >>> 17; s ^= s << 5;
//     let z = 521288629 ^ s;
//     s ^= s << 13; s ^= 2 >>> 17; s ^= s << 5;
//     let w = 88675123 ^ s;
//     let t;
//     Math.random = function () {
//         t = x ^ (x << 11);
//         x = y; y = z; z = w;
//         // >>>0 means 'cast to uint32'
//         w = ((w ^ (w >>> 19)) ^ (t ^ (t >>> 8))) >>> 0;
//         return w / 0x100000000;
//     };
//     Math.random.seed = me;
//     return me;
// })(r);
// console.log("seed", r)

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
        this.len = 21
        this.cellSize = (this.canvas.width / this.len)
        this.cells = new Array(this.len)
        for (let x = 0; x < this.len; x++) this.cells[x] = new Array(this.len).fill(0)
        this.knockingDownMethod()
        this.cells[0][0] = 0
    }

    /** 等間隔に壁を設置する
     * x,y 座標が奇数のセルを壁にする
     */
    setUniformIntervalWall() {
        this.cells.forEach((array, x) => {
            array.forEach((cell, y) => {
                this.cells[x][y] = (x % 2 === 1 && y % 2 === 1) ? 1 : 0
            })
        })
    }

    /** 棒倒し法で迷路をつくる
     * 
     */
    knockingDownMethod() {
        this.setUniformIntervalWall()
        this.knockingDown(1, 1)
        for (let y = 0; y < this.len; y++) {
            for (let x = 0; x < this.len; x++) {
                if (x % 2 == 1 && y % 2 == 1) {
                    if (this.knockingDown(x, y)) return
                }
            }
        }
    }

    /** 棒を倒す
     * 
     */
    knockingDown(x, y) {
        console.log("knockingDown ", x, y)
        let r = Math.floor(Math.random() * 4)
        let flag = 1
        let n = 0
        while (flag) {
            n++
            console.log("r" + r)
            switch (r) {
                case 0: { // up
                    if (y - 1 >= 0 && this.cells[x][y - 1] === 0 && y === 1) {
                        this.cells[x][y - 1] = 1
                        flag = 0
                    }
                    break
                } case 1: { // right
                    if (x + 1 < this.len && this.cells[x + 1][y] === 0) {
                        this.cells[x + 1][y] = 1
                        flag = 0
                    }
                    break
                } case 2: { // down
                    if (y + 1 < this.len && this.cells[x][y + 1] === 0) {
                        this.cells[x][y + 1] = 1
                        flag = 0
                    }
                    break
                } case 3: { // left
                    if (x - 1 >= 0 && this.cells[x - 1][y] === 0) {
                        this.cells[x - 1][y] = 1
                        flag = 0
                    }
                    break
                }
            }
            r = (r + 1) % 4
            if (n >= 4) return 1
        }
        return 0
    }

    setRandomWall() {
        for (let i = 0; i < 300; i++) {
            let x = Math.floor(Math.random() * this.len)
            let y = Math.floor(Math.random() * this.len)
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
        ctx.fillRect(this.x * this.field.cellSize, this.y * this.field.cellSize, this.field.cellSize, this.field.cellSize)
    }
    move(x, y) {
        const nextX = (this.x + x + this.field.len) % this.field.len
        const nextY = (this.y + y + this.field.len) % this.field.len
        if (this.field.cells[nextX][nextY] === 0) {
            this.x = nextX
            this.y = nextY
        }
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

