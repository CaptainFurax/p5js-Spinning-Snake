function setup(){
  angleMode(DEGREES);
  frameRate(14);
  cv = createCanvas(560, 560, WEBGL).parent("mc");
  gfx = createGraphics(400, 400);
  scl = 16;
  stp = 400/scl;
  init();
}
function draw(){
  background( (go)?"#00695C":"#154360" );
  gfxGrid();
  if ( frameCount%2==0 && !go ) {
    snake.rollUpd();
    if ( snake.self_Hit() || snake.outOfPlane() ) gameOvr(); 
  } 
  if ( snake.hit(food) ) {
    snake.grow();
    food = getFood(); 
    swap = true;
  }
    snake.rendr();
    drawSquare( food, "#B71C1C" );
  select("#score").html( "Score : " + String(snake.body.length-1) );
  select("#msg").html( msg );
  p = plane(400,400,0,0);
  if ( swap ) rz += (way * 10);
  (!go)?p.rotate( rz ):p.rotate( rz += 10 );
  if ( rz%90==0 && swap ) 
  { 
    swap = false;
    (way > 0)?vdList.unshift(vdList.pop()):vdList.push(vdList.shift());
  }
  translate(-200,-200);
  p.image( gfx, 0, 0 );

}
function keyPressed(){
  switch( key ) {
    case 'ArrowDown'  : vDir = vdList[1]; if (!swap) way = 1; break;
    case 'ArrowUp'    : vDir = vdList[3]; if (!swap) way = -1; break;
    case 'ArrowRight' : vDir = vdList[0]; if (!swap) way = 1; break;
    case 'ArrowLeft'  : vDir = vdList[2]; if (!swap) way = -1; break;
    case ' '          : if ( go ) init(); break;
  }
}
function gfxGrid()
{
  gfx.background("#9E9D24");
  for( var i=0; i < 400+stp; i +=stp ){
    push();
      gfx.strokeWeight(0.5);
      gfx.stroke("#444");
      gfx.line(i, 0, i, 400);
      gfx.line(0, i, 400, i);
    pop();
  }
}
function getFood(){ 
  return createVector(floor(random(scl))*stp, floor(random(scl))*stp);
}
function gameOvr(){
  msg = "Gamme Au Vert ! - Hit the Space Bar !";
  go = true;
}
function init(){
  snake = new Snake();
  food = getFood();
  vdList = [ createVector(stp,0), createVector(0,stp), createVector(-stp,0), createVector(0,-stp) ];
  vDir = vdList[0];
  go = false; rz = 0; swap = false; way = 1;
  msg = "Use Arrows to Control";
}
function drawSquare(vec, col) {
  push();
    gfx.noStroke();
    gfx.fill(col);
    gfx.rect( vec.x, vec.y, stp, stp );
  pop();
}
class Snake {
  constructor() { this.body = [ createVector((scl/2)*stp,(scl/2)*stp) ]; }
  rendr() { for ( var v of this.body ) drawSquare(v, (this.body.indexOf(v)%2==0)?"#D4AC0D":"#2471A3") }
  rollUpd() {
    this.body.push( this.body.shift() );
    if ( this.body.length > 1 ) this.body[ this.body.length-1 ] = this.body[ this.body.length-2 ].copy();
    this.getHead().add( vDir );
  }
  getHead() { return this.body[ this.body.length-1 ] }
  grow() {
    this.body.unshift( this.body[0].copy().add( -vDir ) );
  }
  hit(f) { return (this.getHead().x == f.x && this.getHead().y == f.y); }
  self_Hit() { return this.body.slice(0,-1).some( (v) => { let here = this.hit(v); return here; } ); }
  outOfPlane() {
    let head = this.getHead();
    return( head.x < 0 || head.x > (stp-1)*scl || head.y < 0 || head.y > (stp-1)*scl );
  }
}