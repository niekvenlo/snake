'use-strict';

window.onload = function() {

  class Easel {
    constructor(cell_num) {
      // Build and hold a canvas
      let canvas_size = Math.min(window.innerHeight,window.innerWidth);
      this.cell_size = canvas_size/cell_num;

      this.canvas = document.createElement('canvas');
      this.canvas.height = canvas_size;
      this.canvas.width = canvas_size;
      document.body.appendChild(this.canvas);
      this.context = this.canvas.getContext("2d");
      this.context.fillStyle = "#000";
    }
    draw({snake,food}) {
      this.draw_clear();
      this.draw_snake(snake);
      this.draw_food(food);
    }
    draw_clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    draw_food({x,y}) {
      let c = this.cell_size;
      this.context.strokeRect(x*c, y*c, c, c);
    }
    draw_snake({x,y,tail}) {
      this.context.fillRect(
        x*this.cell_size,
        y*this.cell_size,
        this.cell_size,
        this.cell_size);
    }
  }

  class Snake {
    constructor(cell_num) {
      this.x = Math.floor(cell_num/2);
      this.y = Math.floor(cell_num/2);
      this.dir = 'down';
      this.tail = [];
      this.length = 1;
    }
  }

  class Game {
    constructor() {
      // Game settings
      this.cell_num = 11;   // Grid size
      this.steptime = 700;  // Game speed

      // Init
      this.easel = new Easel(this.cell_num);
      this.snake = new Snake(this.cell_num);

      // Add EventListeners
      document.addEventListener('keydown', this.keyHandler.bind(this), false)
      document.getElementsByTagName('canvas')[0].addEventListener('touchstart', this.touchHandler.bind(this), true);

      // Draw snakehead and food starting position
      this.set_food();
      this.easel.draw({food: this.food, snake: this.snake});
    }
    start_game() {
      console.log('Starting game');
      this.timer = setInterval(this.step.bind(this),this.steptime);
    }
    step() { // Called on an interval timer
      switch (this.snake.dir) {
        case 'up':    this.snake.y-=1; break;
        case 'down':  this.snake.y+=1; break;
        case 'left':  this.snake.x-=1; break;
        case 'right': this.snake.x+=1; break;
      }
      if (this.bad_collision()) {
        this.game_over();
      } else {
        if (this.food_collision()) {
          this.set_food();
          this.snake.length += 1;
          console.log(this.snake);
        }
        this.easel.draw({food: this.food, snake: this.snake});
      }
    }
    bad_collision() {
      return (this.snake.x < 0 || this.snake.x >= this.cell_num ||
          this.snake.y < 0 || this.snake.y >= this.cell_num)
    }
    food_collision() {
      return (this.snake.x === this.food.x && this.snake.y === this.food.y)
    }
    set_food() {
      this.food = {
        x: Math.floor(this.cell_num*Math.random()),
        y: Math.floor(this.cell_num*Math.random()),
      }
    }
    game_over() {
      console.log('Game over');
      clearTimeout(this.timer);
    }
    keyHandler(e) {
      if(this.timer===undefined){
        this.start_game();
      };
      switch (e.code) {
        case 'ArrowUp':    this.snake.dir = 'up';    break;
        case 'ArrowRight': this.snake.dir = 'right'; break;
        case 'ArrowDown':  this.snake.dir = 'down';  break;
        case 'ArrowLeft':  this.snake.dir = 'left';  break;
        default:
      }
    }
    touchHandler(e) {
      if(this.timer===undefined) {
        this.start_game();
      };
      if (e.pageX > e.pageY) { // down/right
        if (this.easel.canvas.height-e.pageX > e.pageY ) {
          this.snake.dir = 'up';
        } else {
          this.snake.dir = 'right';
        }
      } else { // up/left
        if (this.easel.canvas.height-e.pageX < e.pageY ) {
          this.snake.dir = 'down';
        } else {
          this.snake.dir = 'left';
        }
      }
    }
  }

  // Initialize
  new Game;

};
