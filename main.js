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
let HP = null
heroBattleHP = document.querySelector('#battle-hero-HP')
monsterBattleHP = document.querySelector('#monster-HP')
let inBattle = false
let mapHP = document.getElementById("hero-HP")
let mapEXP = document.getElementById("hero-EXP")
let mapGold = document.getElementById("hero-gold")
let mapStats = document.getElementById("mapStats")
let mapWestShop = document.getElementById("west-shop")
let mapEastShop = document.getElementById("east-shop")


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
let scorpionImg = new Image()
scorpionImg.src = "./images/Scorpion.png"
let skeletonImg = new Image()
skeletonImg.src = "./images/skeleton.png"
let golemImg = new Image()
golemImg.src = "./images/golem.png"
let dragonImg = new Image()
dragonImg.src = "./images/dragon.png"

let battleImg = document.getElementById("battle")
battleImg.classList.add("hidden")
let monsters = []
let level = 0
let maxMultiplier = 1.5
let minMultiplier = 0.5



// Much of below code was adapted from the following tutorial https://dev.to/martyhimmel/animating-sprite-sheets-with-javascript-ag3

//adding event listeners for presing and releasing keys

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

// loading image of hero using animation

function loadHeroImage() {
  heroImg.src = './images/Green-Cap-Character-16x18.png';
  heroImg.onload = function() {
    window.requestAnimationFrame(gameLoop);
  };
}


/* level up pseudo code

if exp = 325 level =5 .. call newlevel(level) ... this will create 5 new monsters
else if exp = 175 level =4
else if exp = 75 level =3
else if exp = 25 {level =2 and 

*/


// creating classes for monster and player objects

class Monster {
  constructor(x, y, width, height, isAlive) {
    this.x = x
    this.y = y
    this.width = 33
    this.height = 33
    this.isAlive = true
  }
  
  render() {
    // x, y, width, height
    if (level === 0) {
      ctx.drawImage(slimeImg, this.x, this.y, this.width, this.height)
    }

    if (level === 1) {
      ctx.drawImage(scorpionImg, this.x, this.y, this.width, this.height)
    }
    
    if (level === 2) {
      ctx.drawImage(skeletonImg, this.x, this.y, this.width, this.height)
    }

    if (level === 3) {
      ctx.drawImage(golemImg, this.x, this.y, this.width, this.height)
    }

    if (level === 4) {
      ctx.drawImage(dragonImg, this.x, this.y, this.width, this.height)
    }
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

    if (horizHit && vertHit) {
      console.log('full hit')
    }
    return horizHit && vertHit
  }
}

class Hero extends Monster {
  constructor(x, y, width, height, HP, maxHP, EXP, attack, potion, gold, isAlive) {
    super(x, y, SCALED_WIDTH, SCALED_HEIGHT, isAlive)
    this.HP = 24
    this.maxHP = 24
    this.EXP = 0
    this.attack = 2
    this.potion = 1
    this.gold = 10
    this.isAlive = true
  }
}

class Slime extends Monster {
  constructor(x, y, width, height, HP, attack, expBounty, goldBounty, isAlive) {
    super(x, y, isAlive)
    this.HP = 6
    this.attack = 2
    this.expBounty = 5
    this.goldBounty = 5
    this.isAlive = true
  }
}

class Scorpion extends Monster {
  constructor(x, y, width, height, HP, attack, expBounty, goldBounty, isAlive) {
    super(x, y, isAlive)
    this.HP = 9
    this.attack = 3
    this.expBounty = 10
    this.goldBounty = 5
    this.isAlive = true
  }
}

class Skeleton extends Monster {
  constructor(x, y, width, height, HP, attack, expBounty, goldBounty, isAlive) {
    super(x, y, isAlive)
    this.HP = 14
    this.attack = 4.5
    this.expBounty = 20
    this.goldBounty = 5
    this.isAlive = true
  }
}

class Golem extends Monster {
  constructor(x, y, width, height, HP, attack, expBounty, goldBounty, isAlive) {
    super(x, y, isAlive)
    this.HP = 20
    this.attack = 6
    this.expBounty = 25
    this.goldBounty = 5
    this.isAlive = true
  }
}

class Dragon extends Monster {
  constructor(x, y, width, height, HP, attack, expBounty, goldBounty, isAlive) {
    super(x, y, isAlive)
    this.HP = 30
    this.attack = 8
    this.expBounty = 5
    this.goldBounty = 5
    this.isAlive = true
  }
}

let monstersByLevel = [Slime, Scorpion, Skeleton, Golem, Dragon]


mainHero = new Hero (heroX, heroY)


//drawMap function for drawing the map, hero, and monsters on the canvas

function drawMap(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(background,0,0,800,600)
  mapHP.innerText = `HP: ${mainHero.HP}`
  mapEXP.innerText = `EXP: ${mainHero.EXP}`
  mapGold.innerText = `GOLD: ${mainHero.gold}`
  ctx.drawImage(heroImg,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT)
  monsters.forEach(monster => {
    if (monster.HP > 0) {
      monster.render()
    }
  })
}

//creating an array of monsters randomly placed on the map

createMonsters = (monsterType) => {
  for(i=0; i<5; i++) {
    monsterX = Math.floor(Math.random() * (767+1))
    monsterY = Math.floor(Math.random() * (567+1))
    if(monsterType = Dragon){
      monsters[0] = new Dragon (385, 100)
    }
    else {
      monsters[i] = new monsterType (monsterX, monsterY)
    }
  }
}

newLevel = (level) => {
  console.log(`current exp is ${mainHero.EXP}`)
  console.log(`current level is ${level}`)
  createMonsters(monstersByLevel[level])
}

const checkLevel = (exp) => {
  if (exp === 325) {
    level = 4
    newLevel(4)
    document.getElementById('slime-monster').classList.add('hidden')
    document.getElementById('scorpion-monster').classList.add('hidden')
    document.getElementById('skeleton-monster').classList.add('hidden')
    document.getElementById('golem-monster').classList.add('hidden')
    document.getElementById('dragon-monster').classList.remove('hidden')
    mainHero.maxHP = 40
    mainHero.HP = 40
    mainHero.attack = 7
    return
  }
  else if (exp === 175) {
    level = 3
    newLevel(3)
    document.getElementById('slime-monster').classList.add('hidden')
    document.getElementById('scorpion-monster').classList.add('hidden')
    document.getElementById('skeleton-monster').classList.add('hidden')
    document.getElementById('golem-monster').classList.remove('hidden')
    mainHero.maxHP = 38
    mainHero.HP = 38
    mainHero.attack = 6
    return
  }
  else if (exp === 75) {
    level = 2
    newLevel(2)
    document.getElementById('slime-monster').classList.add('hidden')
    document.getElementById('scorpion-monster').classList.add('hidden')
    document.getElementById('skeleton-monster').classList.remove('hidden')
    mainHero.maxHP = 34
    mainHero.HP = 34
    mainHero.attack = 5
    return
  }
  else if (exp === 25) {
    level = 1
    newLevel(1)
    document.getElementById('slime-monster').classList.add('hidden')
    document.getElementById('scorpion-monster').classList.remove('hidden')
    mainHero.maxHP = 30
    mainHero.HP = 30
    mainHero.attack = 4
    return
  }
  else if (exp === 0) {
    level = 0
    newLevel(0)
    return
  }
}

checkLevel(mainHero.EXP)

loadHeroImage();

// gameLoop function takes w,a,s,d movement keys and maps them to the movement and animation of the hero across the map

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

// checks for collisions between hero and monsters; starts battle sequence upon collision

const checkCollision = (otherObject) => {
  if (inBattle) return
  if (otherObject.HP <= 0) return
  if (mainHero.isCollidingWith(otherObject)) {
      inBattle = true
      startBattle(otherObject)
  }
}

startBattle = (battleMonster) => {
  turn = 1
  drawBattle()
  monsterBattleHP.innerText = `HP: ${battleMonster.HP}`
  heroBattleHP.innerText = `HP: ${mainHero.HP}`
  console.log(mainHero.HP)
  let attackButton = document.getElementById("attack")
  let potionButton = document.getElementById("potion")
  potionButton.innerText = `Potion: ${mainHero.potion}`

  const hasWon = () => {
    if (battleMonster.HP <= 0) {
      if (monsters[0] = Dragon) {
        alert('Congratluations. You have slain the dragon and won the game!')
      }
      inBattle = false
      mainHero.EXP += battleMonster.expBounty
      mainHero.gold += battleMonster.goldBounty
      document.getElementById("map-return").classList.remove('hidden')
      document.getElementById("map-return").addEventListener("click", function() {
        console.log('return to map!')
        canvas.classList.remove("hidden")
        battleImg.classList.add("hidden")
        mapStats.classList.remove("hidden")
        document.getElementById("map-return").classList.add('hidden')
      }
    )}
    }

  const hasLost = () => {
    if (mainHero.HP <= 0) {
      alert('GAME OVER')
    }
  }

  const usePotion = () => {
    if(mainHero.potion > 0) {
      mainHero.potion--
      potionButton.innerText = `Potion: ${mainHero.potion}`

      if(mainHero.maxHP > (mainHero.HP + (mainHero.maxHP / 3))){
      mainHero.HP += Math.floor(mainHero.maxHP / 3)
      heroBattleHP.innerText = `HP: ${mainHero.HP}`
      }
      else {
        mainHero.HP = mainHero.maxHP
        heroBattleHP.innerText = `HP: ${mainHero.HP}`
      }
    }
  }

  const heroAttack = () => {
    attackButton.removeEventListener("click", heroAttack, false)
    console.log(turn)

    console.log('Attack!')
    // document.getElementById("attack").removeEventListener("click", function())

    let heroMultiplier = Math.random() +.5 // number between 0.5 and 1.5
    console.log(heroMultiplier)
    battleMonster.HP -= Math.floor(mainHero.attack*heroMultiplier)
    monsterBattleHP.innerText = `HP: ${battleMonster.HP}`

    hasWon()
    setTimeout((enemyAttack), 1000)
  }

  
  const enemyAttack = () => {
    
    if (battleMonster.HP > 0) {
      attackButton.addEventListener("click", heroAttack)
      console.log('enemy turn')
      let monsterMultiplier = Math.random() +.5 // number between 0.5 and 1.5
      console.log(`Monster multiplier is ${monsterMultiplier}`)
      console.log(`Monster attack is ${battleMonster.attack}`)
      mainHero.HP -= Math.floor(battleMonster.attack*monsterMultiplier)
      console.log(`Hero HP: ${mainHero.HP}`)
      heroBattleHP.innerText = `HP: ${mainHero.HP}`
      hasLost()
      turn = 1
      console.log(turn)
    }

  }

    // while(battleMonster.HP > 0) {
      if (turn === 1) {
        turn = 0

        attackButton.addEventListener("click", heroAttack)
        potionButton.addEventListener("click", usePotion)
        // {once:true}
      
        // document.getElementById("attack").removeEventListener("click", heroAttack, false)
      }
    // }
      
    // } 
}


drawBattle = () => {
  canvas.classList.add("hidden")
  mapStats.classList.add("hidden")
  mapStats.classList.add("hidden")
  mapEastShop.classList.add("hidden")
  mapWestShop.classList.add("hidden")
  battleImg.classList.remove("hidden")
}
 
// moves and changes the direction of the hero; prevents hero from moving off canvas

function moveCharacter(moveX, moveY, direction) {
  if (heroX + moveX > 0 && heroX + WIDTH + moveX < canvas.width) {
    heroX += moveX;
  }
  if (heroY + moveY > 0 && heroY + HEIGHT + moveY < canvas.height) {
    heroY += moveY;
  }
  currentDirection = direction;
  mainHero.x = heroX
  mainHero.y = heroY
  for (i=0; i < monsters.length; i++) {
      checkCollision(monsters[i])
  }
}