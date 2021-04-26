//delcaring the gamestates
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//declaring the trex runnign and colliding
var trex, trex_running, trex_collided;

//declaring the ground and the invisible ground
var ground, invisibleGround, groundImage;

//declaring the clouds and their images 
var cloudsGroup, cloudImage;

//delcaring the obstalces
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

//declaring the backgroundimage
var backgroundImg

//declaring the score
var score=0;

//declaring the sounds 
var jumpSound, collidedSound;

//declaring the gameover and restart 
var gameOver, restart;


function preload(){
  //loading the jumpsound and collided sound
  jumpSound = loadSound("assets/sounds/jump.wav")
  collidedSound = loadSound("assets/sounds/collided.wav")
  
  //declaring the backgroundimage
  backgroundImg = loadImage("assets/backgroundImg.png")
  
  //declaring the sunimage
  sunAnimation = loadImage("assets/sun.png");
  
  //loading the trex_running
  trex_running = loadAnimation("assets/trex_2.png","assets/trex_1.png","assets/trex_3.png");
  
  ////loading the trexcollided
  trex_collided = loadAnimation("assets/trex_collided.png");
  
  //loading the groudimage
  groundImage = loadImage("assets/ground.png");
  
  //loading the cloudImage
  cloudImage = loadImage("assets/cloud.png");
  
  //loading the obstalces images
  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  
  //declaring the gameover and the restart image
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
}

function setup() {
  //setting the canvas to be suitible for all screens
  createCanvas(windowWidth, windowHeight);
  
  //creating the sun 
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  //creating the trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.08
  
  //creating the invisibleground
  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  //creating the ground
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  //creating the gameover
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  //creating the restart 
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  //making the gameoverimage and restart imgae scaling
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  //making the gameover image and the restart image making it visible
  gameOver.visible = false;
  restart.visible = false;

  //making the clouds and the obstacles group
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  //dislplaying the score
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  //displaying the score
  textSize(20);
  fill("black")
  text("Score: "+ score,30,50);
  
  if(mousePressedOver(restart)){
    reset();
  }
  //giving information for gameState-play
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if((touches.length >0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
  }
  //giving the information to gamestate-end
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
  
  drawSprites();
}

//creating a new function spawn clouds
function spawnClouds() {
 
  if (frameCount % 110 === 0) {
    var cloud = createSprite(width+40,height-300,40,10);
    cloud.y = Math.round(random(150,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

//creating a new function spawn obstacles 
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,height-95,20,30);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

//creating a new function of reset 
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
