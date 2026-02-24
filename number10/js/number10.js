let offset=0;

function setup (){
  createCanvas (windowWidth, windowHeight); 
  rectMode (CENTER) ;
  // RECT MODE CENTER MEASURES PLACEMENT FROM THE CENTER OF THE SHAPE

} 

function draw() { 
  background (0);



  push();
  translate(offset, offset);
  fill(100, 200,100);
  rect(width/3, height/2, 100, 100);
  pop() ;


  rect (width *2/3, height/2, 100, 100);

}


function keyPressed ( ){
  offset += random(-100, 100);

  offset=constraint(offset, -200, 200);


}

function windowResized(){
resizeCanvas (windowWidth, windowHeight);
}