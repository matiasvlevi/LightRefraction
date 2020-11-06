
let r1;
let n1 = 1.00;
let n2 = 1.45;
let s1;
let s2;

function setup() {
  r1 = new Ray(100,100,30,400,true);
  s1 = createSlider(0,3,n1,0.05);
  s2 = createSlider(0,3,n2,0.05);
  createCanvas(600,600);
}

function draw() {
  background(51);
  drawMesures();
  n1 = s1.value();
  n2 = s2.value();
  r1.render();
  line(0,300,600,300)
}

class Ray {
  constructor(x,y,a,length,incident) {
    this.pos = createVector(x,y);
    this.angle = a;
    this.length = length;
    this.refractedRay = undefined;
    this.incident = incident;
    this.previous = [];
  }
  render() {
    angleMode(DEGREES);

    if (this.previous.length > 0) {
      let b = this.pos.x-300;
      let a = this.pos.y-300;
      let c = findLength(a,b)
      this.angle = asin(b/c)//sin(mouseY)*findLength(300-mouseY,300-mouseX)//map(mouseX,0,600,-90,90);
    }

    let x1 = this.pos.x;
    let y1 = this.pos.y;
    let x2 = (this.length*cos(this.angle+90))+x1;
    let y2 = (this.length*sin(this.angle+90))+y1;


    if (y2 > 300 && this.incident == true) {
      let p = lineIntersection(x1,y1,x2,y2,0,300,600,300);
      x2 = p[0];
      y2 = p[1];

      let refAngle = findThetaR(n1,n2,this.angle);
      this.refractedRay = new Ray(0,0,0,0,false);
      this.refractedRay.pos.x = x2;
      this.refractedRay.pos.y = y2;
      this.refractedRay.length = 600;
      this.refractedRay.angle = refAngle;
    } else {
      this.refractedRay = undefined;
    }
    if (this.refractedRay !== undefined && this.pos.y < 300) {
      this.refractedRay.render()
    }


    this.previous = [x1,y1,x2,y2];
    stroke(255);
    line(x1,y1,x2,y2);
  }
}
function findThetaR(n1,n2,thetaI) {
  let top = n1*sin(thetaI);
  let down = n2;
  let ans = asin(top/down);
  return ans;
}
function lineIntersection(x1,y1,x2,y2,x3,y3,x4,y4) {
  let topx = (x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4);
  let topy = (x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4);
  let down = (x1-x2)*(y3-y4) - (y1 - y2)*(x3-x4)
  let x = topx/down;
  let y = topy/down;

  return [x,y];
}
function findLength(a,b) {
  return sqrt(pow(a,2)+pow(b,2));
}
function drawMesures() {
  noStroke()
  fill(255)
  text("Indice de refraction: "+n1,10,20);
  text("Indice de refraction: "+n2,10,580);
  noFill();
  stroke(255,100);
  ellipse(300,300,400,400);

  for (let i = 0;i < 36; i++) {
    push();
    let offset = 135+90;
    let x = (cos(i*10+offset)-sin(i*10+offset))*140+300;
    let y = (sin(i*10+offset)+cos(i*10+offset))*140+300;
    let xl = (cos(i*10+offset)-sin(i*10+offset))*150+300;
    let yl = (sin(i*10+offset)+cos(i*10+offset))*150+300;
    textSize(10);
    textAlign(CENTER)
        text(formatDeg(i*10),xl,yl);
    translate(x,y);

    rotate(i*10);
    stroke(255,20);
    line(0,0,0,150)

    pop()
  }

  fill(255,100)
  ellipse(300,300,2,2);
}
function formatDeg(x) {
  if (x >= 0 && x < 90) {
    return x;
  } else if (x >= 270 && x < 360) {
    return  map(x,360,270,0,90);
  } else if (x < 270 && x >= 180) {
    return map(x,270,180,90,0);
  } else if (x < 180 && x >= 90) {
     return map(x,180,90,0,90);
  }
}

function mouseDragged(){
  if (mouseX > 0 && mouseX < 600 && mouseY < 600 && mouseY > 0) {
    r1.pos.x = mouseX;
    r1.pos.y = mouseY;
  }

}
