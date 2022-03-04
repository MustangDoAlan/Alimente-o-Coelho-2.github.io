const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var rope;
var fruta,frutaOpc;
var frutaLink;
var bgImg,foodImg,coelhoImg;
var coelho;
var blink,eat,sad;
var bgSound,sadSound,cutSound,eatingSound,airSound;

function preload(){
  bgImg = loadImage("background.png");
  foodImg = loadImage("melon.png");
  coelhoImg = loadImage("Rabbit-01.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");

  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  eat.looping = false;
  sad.looping = false;

  bgSound = loadSound("sound1.mp3");
  sadSound = loadSound("sad.wav");
  cutSound = loadSound("rope_cut.mp3");
  eatingSound = loadSound("eating_sound.mp3");
  airSound = loadSound("air.wav");

}

function setup() 
{
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    telaW = displayWidth;
    telaH = displayHeight;
    createCanvas(displayWidth,displayHeight);
  }
  else{
    telaW = windowWidth;
    telaH = windowHeight
    createCanvas(windowWidth,windowHeight);
  }
  frameRate(80);
  //bgSound.play();
  bgSound.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  button = createImg("cut_btn.png");
  button.position(20,30);
  button.size(50,50);
  button.mouseClicked(drop);

  button2 = createImg("cut_btn.png");
  button2.position(300,30);
  button2.size(50,50);
  button2.mouseClicked(drop2);

  button3 = createImg("cut_btn.png");
  button3.position(360,200);
  button3.size(50,50);
  button3.mouseClicked(drop3);

  muteBtn = createImg("mute.png");
  muteBtn.position(450,20);
  muteBtn.size(50,50);
  muteBtn.mouseClicked(mute);

  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  coelho = createSprite(150,telaH-80,100,100);
  coelho.scale = 0.2;

  coelho.addAnimation("piscando",blink);
  coelho.addAnimation("comendo",eat);
  coelho.addAnimation("triste",sad);
  coelho.changeAnimation("piscando");

  
  ground = new Ground(telaW/2,telaH,telaW,20);
  rope = new Rope(8,{x:40,y:30});
  rope2 = new Rope(7,{x:320,y:30});
  rope3 = new Rope(4,{x:380,y:200});
  
  frutaOpc = {
    density : 0.001
  } 

fruta = Bodies.circle(300,300,15,frutaOpc);
Matter.Composite.add(rope.body,fruta);

frutaLink = new Link(rope,fruta);
frutaLink2 = new Link(rope2,fruta);
frutaLink3 = new Link(rope3,fruta);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
  imageMode(CENTER);
  
}


function draw() 
{
  background(51);
  image(bgImg,width/2,height/2,telaW,telaH);

  ground.show();
  rope.show();
  rope2.show();
  rope3.show();
  Engine.update(engine);

  if(fruta != null){
  image(foodImg,fruta.position.x,fruta.position.y,60,60);
  }

  if(collide(fruta,coelho)=== true){
    coelho.changeAnimation("comendo");
    eatingSound.play();
  }

  if(fruta != null && fruta.position.y >= 650){
    coelho.changeAnimation("triste");
    sadSound.play();
    bgSound.stop();
    fruta = null;
  }

  drawSprites();

   
}

function drop(){
    cutSound.play();
    rope.break();
    frutaLink.separar();
    frutaLink = null;
}

function drop2(){
  cutSound.play();
  rope2.break();
  frutaLink2.separar();
  frutaLink2 = null;
}

function drop3(){
  cutSound.play();
  rope3.break();
  frutaLink3.separar();
  frutaLink3 = null;
}

function collide(body,sprite){
  if(body != null){
    var distancia = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
    if(distancia<= 80 ){
      World.remove(world,fruta);
      fruta = null;
      return true;
    }
    else {
      return false;
    }
  }
}

function airBallon(){
  Matter.Body.applyForce(fruta,{x:0,y:0},{x:0.01,y:0});
  airSound.play();

}

function mute(){
  if(bgSound.isPlaying()){
    bgSound.stop();
  }
  else{
    bgSound.play();
  }
}