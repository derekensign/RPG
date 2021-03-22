const WIDTH = 16;
const HEIGHT = 18;
const SCALE = 2.3
const SCALED_WIDTH = SCALE * WIDTH
const SCALED_HEIGHT = SCALE * HEIGHT
const CYCLE_LOOP = [0, 1, 0, 2];
const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;
const FRAME_LIMIT = 12;
const PLAYER_SPEED = 1.4;



let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
canvas.width = 800
canvas.height = 600

let background = new Image();
background.src = "./images/8bitbg.png"

background.onload = function(){
  ctx.drawImage(background,0,0,800,600)
}

let keyPresses = {};
let currentDirection = FACING_DOWN;
let currentLoopIndex = 0;
let frameCount = 0;
let heroX = 400;
let heroY = 300;
let heroImg = new Image();
let slimeImg = new Image()
slimeImg.src = "./images/slime.png"
let battleImg = new Image()
battleImg.src = "./images/BattleScreen.jpg"

let monsters = []


// Much of below code was adapted from the following tutorial https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

function loadHeroImage() {
  heroImg.src = './images/Green-Cap-Character-16x18.png';
  heroImg.onload = function() {
    window.requestAnimationFrame(gameLoop);
  };
}


class Monster {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = 33
    this.height = 33
  }
  
  render() {
    // x, y, width, height
    ctx.drawImage(slimeImg, this.x, this.y, this.width, this.height)
  }
  
  leftEdge() {
    return this.x
  }
  
  rightEdge() {
    return this.x + this.width
  }
  
  topEdge() {
    return this.y
  }
  
  bottomEdge() {
    return this.y + this.height
  }
  
  isCollidingWith(other) {
    
    const horizHit = this.leftEdge() <= other.rightEdge() && this.rightEdge() >= other.leftEdge()
    
    const vertHit = this.topEdge() <= other.bottomEdge() && this.bottomEdge() >= other.topEdge()
    
    return horizHit && vertHit
  }
}

class Hero extends Monster {
  constructor(x, y, width, height) {
    super(x, y, SCALED_WIDTH, SCALED_HEIGHT)
  }
}

class Slime extends Monster {
  constructor(x, y, width, height) {
    super(x, y)
  }
}

function drawMap(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(background,0,0,800,600)
  ctx.drawImage(heroImg,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT)
  monsters.forEach(monster => {
    monster.render()
  })
}

createMonsters = () => {
  for(i=0; i<5; i++) {
    monsterX = Math.floor(Math.random() * (767+1))
    monsterY = Math.floor(Math.random() * (567+1))
    monsters[i] = new Monster(monsterX, monsterY)
    }
}

createMonsters()

loadHeroImage();

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let hasMoved = false;

  if (keyPresses.w) {
    moveCharacter(0, -PLAYER_SPEED, FACING_UP);
    hasMoved = true;
  } else if (keyPresses.s) {
    moveCharacter(0, PLAYER_SPEED, FACING_DOWN);
    hasMoved = true;
  }

  if (keyPresses.a) {
    moveCharacter(-PLAYER_SPEED, 0, FACING_LEFT);
    hasMoved = true;
  } else if (keyPresses.d) {
    moveCharacter(PLAYER_SPEED, 0, FACING_RIGHT);
    hasMoved = true;
  }

  if (hasMoved) {
    frameCount++;
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0;
      currentLoopIndex++;
      if (currentLoopIndex >= CYCLE_LOOP.length) {
        currentLoopIndex = 0;
      }
    }
  }
  
  if (!hasMoved) {
    currentLoopIndex = 0;
  }

  drawMap(CYCLE_LOOP[currentLoopIndex], currentDirection, heroX, heroY);
  window.requestAnimationFrame(gameLoop);
}

const checkCollision = (otherObject) => {
  if (mainHero.isCollidingWith(otherObject)) {
      startBattle()
  }
}

startBattle = () => {
  drawBattle()
}

drawBattle = () => {
  documentSelec
  ctx.drawImage(battleImg,0,0,800,600)
}
  

function moveCharacter(moveX, moveY, direction) {
  if (heroX + moveX > 0 && heroX + WIDTH + moveX < canvas.width) {
    heroX += moveX;
  }
  if (heroY + moveY > 0 && heroY + HEIGHT + moveY < canvas.height) {
    heroY += moveY;
  }
  currentDirection = direction;
  mainHero = new Hero (heroX, heroY)
  for (i=0; i<5; i++) {
    checkCollision(monsters[i])
  }
}