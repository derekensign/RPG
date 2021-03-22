const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');
let heroImg = new Image();
heroImg.src = "images/Green-Cap-Character-16x18.png"
const scale = 2
const cycle = [0, 1, 0, 2]
let cycleIndex = 0
let frameCount = 0
let currentDirection = 0
const FACING_DOWN = 0
const FACING_UP = 1
const FACING_LEFT = 2
const FACING_RIGHT = 3
const FRAME_LIMIT = 12
const PLAYER_SPEED = 20

heroImg.onload = function() {
    heroStep()
}
canvas.setAttribute('height', getComputedStyle(canvas).height)
canvas.setAttribute('width', getComputedStyle(canvas).width)
const heroWidth = 16
const heroHeight = 18
const scaledWidth = scale * heroWidth
const scaledHeight = scale * heroHeight



document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      player.y -= PLAYER_SPEED
    } else if (event.key === 'ArrowDown') {
      player.y += PLAYER_SPEED
    } else if (event.key === 'ArrowLeft') {
      player.x -= PLAYER_SPEED
    } else if (event.key === 'ArrowRight') {
      player.x += PLAYER_SPEED
    }
  })

  function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(heroImg,
                  frameX * heroWidth, frameY * heroHeight, heroWidth, heroHeight,
                  canvasX, canvasY, scaledWidth, scaledHeight);
  }
  
function heroAni() {
    drawFrame(0, 0, 0, 0)
    drawFrame(1, 0, scaledWidth, 0)
    drawFrame(0, 0, scaledWidth * 2, 0)
    drawFrame(2, 0, scaledWidth * 3, 0)
    window.requestAnimationFrame(heroStep)
  }



function heroStep() {
    frameCount++
    if (frameCount < 15) {
        window.requestAnimationFrame(heroStep)
        return
    }
    frameCount = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawFrame(cycle[cycleIndex], currentDirection, 0, 0)
    cycleIndex++
  if (cycleIndex >= cycle.length) {
        cycleIndex = 0
        currentDirection++
  }
  if (currentDirection >= 4) {
        currentDirection = 0
        window.requestAnimationFrame(heroStep)
  }
}

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
  
    drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
    window.requestAnimationFrame(gameLoop);
  }
  
  function moveCharacter(deltaX, deltaY, direction) {
    if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
      positionX += deltaX;
    }
    if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
      positionY += deltaY;
    }
    currentDirection = direction;
  }