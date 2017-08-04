'use-strict';

window.onload = function() {

  // Intialize canvas
  let cell_num = 15;
  let cell_size = Math.floor((Math.min(window.innerHeight,window.innerWidth))/cell_num);
  let canvas_size = cell_size*cell_num;
  let canvas_mid = Math.floor(cell_num/2);
  let canvas = document.createElement('canvas');
  canvas.height = canvas_size;
  canvas.width = canvas_size;
  document.body.appendChild(canvas);
  let context = canvas.getContext("2d");
  context.fillStyle = "#000";

  // Snake game object literal
  let snake = {
    x: canvas_mid,
    y: canvas_mid,
    dir: 'down',
    initialize() {
      context.fillRect(snake.x*cell_size,snake.y*cell_size,cell_size,cell_size);
    },
    start() {
      console.log('Starting game')
      this.interval = setInterval(this.step,1000);
    },
    move() {
      switch (this.dir) {
        case 'up':
          this.y-=1;
          break;
        case 'down':
          this.y+=1;
          break;
        case 'left':
          this.x-=1;
          break;
        case 'right':
          this.x+=1;
          break;
      }
      if (this.x < 0 || this.x > 14 || this.y < 0 || this.y > 14) {
        this.game_over();
      }
    },
    step() {
      snake.move();
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(snake.x*cell_size,snake.y*cell_size,cell_size,cell_size);
    },
    game_over() {
      console.log('Game over');
      clearTimeout(this.interval);
    },
  }
  // Initialize
  snake.initialize();

  // Keyboard event listener
  document.addEventListener('keydown', keyHandler, false)
  function keyHandler (event) {
    if(snake.interval===undefined){
      snake.start();
    };
    switch (event.code) {
      case 'ArrowUp':
        snake.dir = 'up';
        break;
      case 'ArrowRight':
        snake.dir = 'right';
        break;
      case 'ArrowDown':
        snake.dir = 'down';
        break;
      case 'ArrowLeft':
        snake.dir = 'left';
        break;
      default:
      // No action on other keys
    }
  }
  // Touch event listener
  document.getElementsByTagName('canvas')[0].addEventListener('touchstart', touchHandler, true);
  function touchHandler(e) {
    if(snake.interval===undefined) {
      snake.start();
    };
    if (e.pageX > e.pageY) { // down/right
      if (canvas.height-e.pageX > e.pageY ) {
        snake.dir = 'up';
      } else {
        snake.dir = 'right';
      }
    } else { // up/left
      if (canvas.height-e.pageX < e.pageY ) {
        snake.dir = 'down';
      } else {
        snake.dir = 'left';
      }
    }
  }

};
