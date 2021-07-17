const TILE_SIZE = 24
const TIMER_INTERVAL = 100
const MAP_WIDTH = 20
const MAP_HEIGHT = 20

let mX = new Array()
let mY = new Array()
let mDX = 0
let mDY = 1
let mAX, mAY
let mTimer
let mFoodX, mFoodY
let mGameOver, mGameClear

function addFood() {
    let x = mFoodX = Math.floor(Math.random() * (MAP_WIDTH + 1 >> 1)) << 1
    let y = mFoodY = Math.floor(Math.random() * (MAP_HEIGHT + 1 >> 1)) << 1

    while (isBody(mFoodX, mFoodY)) {
        mFoodX += 2
        if (x == mFoodX && y == mFoodY) {
            mGameClear = true
            break
        }
        if (mFoodX < MAP_WIDTH) {
            continue
        }
        mFoodX = 0
        mFoodY += 2
        if (mFoodY >= MAP_HEIGHT)
            mFoodY = 0
    }

    mX.push(mX[mX.length - 1])
    mY.push(mY[mY.length - 1])
}

function draw(ca) {
    let g = ca.getContext("2d")
    g.clearRect(0, 0, ca.width, ca.height)
    g.fillStyle = "#ffff00"
    g.beginPath()
    let r = TILE_SIZE / 2
    g.arc(mFoodX * TILE_SIZE + r, mFoodY * TILE_SIZE + r, r, 0, 2 * Math.PI)
    g.fill()
    g.fillStyle = "#00ffff"
    for (let i = 0; i < mX.length - 1; i++)
        g.fillRect(mX[i] * TILE_SIZE, mY[i] * TILE_SIZE, TILE_SIZE, TILE_SIZE)

    let x = (MAP_WIDTH / 2 - 5) * TILE_SIZE
    let y = (MAP_HEIGHT / 2 * TILE_SIZE) - TILE_SIZE

    g.fillStyle = "#ffffff"
    g.font = "24px MS Gothic"
    if (mGameClear)
        g.fillText("GAME CLEAR", x, y)
    if (mGameOver)
        g.fillText("GAME OVER", x, y)
    if (mGameOver || mGameClear) {
        g.fillText("SCORE " + mX.length, x, y + TILE_SIZE)
    }
}

function isBody(x, y) {
    for (let i = 0; i < mX.length - 1; i++) {
        if (mX[i] == x && mY[i] == y)
            return true
    }
    return false
}

function tick() {
    if (mGameOver || mGameClear) return
    if ((mX[0] & 1) == 0 && (mY[0] & 1) == 0) {
        mAX = mDX
        mAY = mDY
    }
    let x = mX[0] + mAX
    let y = mY[0] + mAY
    if (isBody(x, y) || x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT)
        mGameOver = true

    mX.unshift(x) // 先頭[0]に追加
    mY.unshift(y)
    mX.pop()
    mY.pop()
    if (x == mFoodX && y == mFoodY)
        addFood()
}

function onPaint() {
    if (!mTimer) {
        mTimer = performance.now()
    }
    if (mTimer + TIMER_INTERVAL < performance.now()) {
        mTimer += TIMER_INTERVAL
        tick()
        draw(document.getElementById("canvas"))
    }
    requestAnimationFrame(onPaint)
}

window.onkeydown = function (ev) {
    let c = ev.keyCode
    if (c == 37) { mDX = -1; mDY = 0 }
    if (c == 38) { mDX = 0; mDY = -1 }
    if (c == 39) { mDX = 1; mDY = 0 }
    if (c == 40) { mDX = 0; mDY = 1 }
}

window.onload = function (ev) {
    mX.push(MAP_WIDTH / 4 * 2)
    mY.push(MAP_HEIGHT / 4 * 2)
    addFood()
    onPaint()
}
