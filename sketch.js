var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, dino, dinoImage;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg, restartImg;

var gameOver, restart;

var jumpSound, dieSound, checkpointSound



function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  dinoImage = loadAnimation("Untitled01.png","Untitled02.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");

  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-72,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage("gameOver", gameOverImg);

  restart = createSprite(width/2,height/2);
  restart.addImage("restart", restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;
 
  trex.setCollider("circle", 0,0,40);

  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  trex.debug = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  dinoGroup = new Group();
  
  console.log("Olá" + 5);
  
  score = 0;
}

function draw() {
  background(360);
  text("Pontuação: "+ score, width-100,height-600);
  
  if(gameState === PLAY){
       
    ground.velocityX = -(4 + 3* score/500);
    gameOver.visible = false;
    restart.visible = false;
   
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if(score>0 && score%500 === 0){
      checkpointSound.play();
      checkpointSound.setVolume(1);
    }
   
    if(touches.length >0 || keyDown("space")&& trex.y >= height-100) {
        trex.velocityY = -13;
        jumpSound.play();
        jumpSound.setVolume(1);
        touches=[];
    }
    
  
    trex.velocityY = trex.velocityY + 0.8
  
    spawnClouds();
    spawndino();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
      dieSound.setVolume(1);
    }
    if(dinoGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
      dieSound.setVolume(1);
    }
  }
   else if (gameState === END) {
      background(360)
      ground.velocityX = 0;
      trex.velocityY = 0;
      gameOver.visible = true;
      restart.visible = true;

      trex.changeAnimation("collided", trex_collided);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     dinoGroup.setVelocityXEach(0);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     dinoGroup.setLifetimeEach(-1);
   }
  
  trex.collide(invisibleGround);

  if(mousePressedOver(restart)){
    reset();
  }
  if(score>0 && score> 1000 && score<2000){
    background(0);
  }

  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  dinoGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_running);
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width-200,height-90,10,40);
   obstacle.velocityX = -(6+score/1000);
   
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    obstacle.scale = 0.5;
    obstacle.lifetime = 600;
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
   if (frameCount % 60 === 0) {
    cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 540;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
    }
}


function spawndino() {
  if (score === 100) {
   dino = createSprite(width+80,height-100,40,10);
   dino.y = Math.round(random(500,420));
   dino.addAnimation("dino",dinoImage);
   dino.scale = 2;
   dino.velocityX = -5;
   dino.lifetime = 120;
   dinoGroup.add(dino);
   }
}