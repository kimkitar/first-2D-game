let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceshipImage, bulletImage, gameoverImage, monstarImage;
let gameover = false;
let score = 0;

let spaceshipX = canvas.width / 2 - 32;
let spaceshipY = canvas.height - 64;

let bulletList = [];
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 23;
    this.y = spaceshipY;
    this.alive = true;
    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < monstarList.length; i++) {
      if (
        this.y <= monstarList[i].y &&
        this.x >= monstarList[i].x &&
        this.x <= monstarList[i].x + 40
      ) {
        score++;
        this.alive = false;
        monstarList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let monstarList = [];
function monstar() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 48);
    monstarList.push(this);
  };
  this.update = function () {
    this.y += 4; // 악마 속도

    if (this.y >= canvas.height - 48) {
      gameover = true;
      console.log("gameover");
    }
  };
}

function loadIamge() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.jpeg";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  gameoverImage = new Image();
  gameoverImage.src = "images/gameover.jpg";

  monstarImage = new Image();
  monstarImage.src = "images/monstar.png";
}

let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];

    if (event.keyCode == 32) {
      createBullet();
    }
  });
}

function createBullet() {
  console.log("총알생성");
  let b = new Bullet();
  b.init();
  console.log("새로운 총알", bulletList);
}

function createmonstar() {
  const interval = setInterval(function () {
    let e = new monstar();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 6;
  } //right
  if (37 in keysDown) {
    spaceshipX -= 6;
  } //left

  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 64) {
    spaceshipX = canvas.width - 64;
  }

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for (let i = 0; i < monstarList.length; i++) {
    monstarList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText("Score:&{score}", 20, 20);
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  for (let i = 0; i < monstarList.length; i++) {
    ctx.drawImage(monstarImage, monstarList[i].x, monstarList[i].y);
  }
}

function main() {
  if (!gameover) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameoverImage, 10, 180, 390, 390);
  }
}

loadIamge();
setupKeyboardListener();
createmonstar();
main();
