'use-strict'

window.onload = function () {
  class Easel {
    // Build and hold a canvas
    constructor (cellNum) {
      let canvasSize = Math.min(window.innerHeight, window.innerWidth)
      this.cellSize = canvasSize / cellNum

      this.canvas = document.createElement('canvas')
      this.canvas.height = canvasSize
      this.canvas.width = canvasSize
      document.body.appendChild(this.canvas)
      this.context = this.canvas.getContext('2d')
      this.context.fillStyle = '#000'
    }
    draw ({snake, food}) {
      let width = this.canvas.width
      let cell = this.cellSize
      this.context.clearRect(0, 0, width, width)
      this.context.strokeRect(food.x * cell, food.y * cell, cell, cell)
      snake.tail.forEach((pos) => {
        this.context.fillRect(pos.x * cell, pos.y * cell, cell, cell)
      })
    }
  }

  class Snake {
    constructor (cellNum) {
      let mid = Math.floor(cellNum / 2)
      this.tail = [{x: mid, y: mid}]
      this.length = 1
      this.dir = 'down'
    }
    get head () {
      return this.tail[this.tail.length - 1]
    }
    set head (pos) {
      this.tail.push(pos)
      this.tail = this.tail.slice(-(this.length))
    }
  }

  class Game {
    constructor () {
      // Game settings
      this.cellNum = 11    // Grid size
      this.stepTime = 700  // Game speed

      // Init
      this.easel = new Easel(this.cellNum)
      this.snake = new Snake(this.cellNum)

      // Add EventListeners
      document.addEventListener('keydown', this.keyHandler.bind(this), false)
      document.getElementsByTagName('canvas')[0]
          .addEventListener('touchstart', this.touchHandler.bind(this), true)

      // Draw snakehead and food starting position
      this.setFood()
      this.easel.draw({food: this.food, snake: this.snake})
    }
    startGame () {
      console.log('Starting game')
      this.timer = setInterval(this.step.bind(this), this.stepTime)
    }
    step () { // Called on an interval timer
      let {x, y} = this.snake.head
      switch (this.snake.dir) {
        case 'up':
          this.snake.head = {x, y: y -= 1}
          break
        case 'down':
          this.snake.head = {x, y: y += 1}
          break
        case 'left':
          this.snake.head = {x: x -= 1, y}
          break
        case 'right':
          this.snake.head = {x: x += 1, y}
          break
      }
      if (this.badCollision()) {
        this.gameOver()
      } else {
        if (this.foodCollision()) {
          this.setFood()
          this.snake.length += 1
        }
        this.easel.draw({food: this.food, snake: this.snake})
      }
    }
    badCollision () {
      let borderCollision = (this.snake.head.x < 0 || this.snake.head.x >= this.cellNum ||
          this.snake.head.y < 0 || this.snake.head.y >= this.cellNum)
      let tailCollision = (function (tail) {
        tail = tail.slice()
        let head = tail.pop()
        return tail.some((el) => { return (el.x === head.x && el.y === head.y) })
      }(this.snake.tail))
      return borderCollision || tailCollision
    }
    foodCollision () {
      return (this.snake.head.x === this.food.x && this.snake.head.y === this.food.y)
    }
    setFood () {
      this.food = {
        x: Math.floor(this.cellNum * Math.random()),
        y: Math.floor(this.cellNum * Math.random())
      }
    }
    gameOver () {
      console.log('Game over')
      clearTimeout(this.timer)
    }
    keyHandler (e) {
      if (this.timer === undefined) {
        this.startGame()
      };
      switch (e.code) {
        case 'ArrowUp':
          this.snake.dir = 'up'
          break
        case 'ArrowRight':
          this.snake.dir = 'right'
          break
        case 'ArrowDown':
          this.snake.dir = 'down'
          break
        case 'ArrowLeft':
          this.snake.dir = 'left'
          break
        default:
      }
    }
    touchHandler (e) {
      if (this.timer === undefined) {
        this.startGame()
      };
      if (e.pageX > e.pageY) { // down/right
        if (this.easel.canvas.height - e.pageX > e.pageY) {
          this.snake.dir = 'up'
        } else {
          this.snake.dir = 'right'
        }
      } else { // up/left
        if (this.easel.canvas.height - e.pageX < e.pageY) {
          this.snake.dir = 'down'
        } else {
          this.snake.dir = 'left'
        }
      }
    }
  }
  // Initialize
  new Game()
}

// TODO:
// 1) use position class for easier comparison and collision detection
// 2) avoid placing food on the tail
// 3) improve touch interface
// 4) show game-over and reset
// 5) forbid backwards movement
