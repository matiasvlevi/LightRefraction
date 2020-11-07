
let r1;
let n1 = 1.00;
let n2 = 1.45;
let s1;
let s2;
let data = [];
function setup() {
  r1 = new Ray(100,100,30,400,true);
  s1 = createSlider(0,3,n1,0.005);
  s2 = createSlider(0,3,n2,0.005);
  createCanvas(600,600);
  data = printData(5);
}

function draw() {
  background(51);

  n1 = s1.value();
  n2 = s2.value();
  if (mouseY < 300) {
      r1.render(255);
  }
  line(0,300,600,300)
  drawMesures();
}

class Ray {
  constructor(x,y,a,length,incident) {
    this.pos = createVector(x,y);
    this.angle = a;
    this.length = length;
    this.refractedRay = undefined;
    this.rIntensity = 0;
    this.mIntensity = 0;
    this.mirroredRay = undefined;
    this.incident = incident;
    this.previous = [];
  }
  render(intensity) {
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
    fill(255);
    ellipse(x1,y1,6,6)
      let p = lineIntersection(x1,y1,x2,y2,0,300,600,300);
      x2 = p[0];
      y2 = p[1];
      this.mirroredRay = new Ray(0,0,0,0,false);
      this.mirroredRay.pos.x = x2;
      this.mirroredRay.pos.y = y2;
      this.mirroredRay.length = 600;
      this.mirroredRay.angle = -1*((90+this.angle)-180)+90;
      let refAngle = findThetaR(n1,n2,this.angle);
      this.refractedRay = new Ray(0,0,0,0,false);
      this.refractedRay.pos.x = x2;
      this.refractedRay.pos.y = y2;
      this.refractedRay.length = 600;
      this.refractedRay.angle = refAngle;

      this.rIntensity = calcIntensity_r(this.angle);
      this.mIntensity = calcIntensity(this.angle);
    } else {
      this.refractedRay = undefined;
    }
    if (this.refractedRay !== undefined && this.pos.y < 300) {
      this.refractedRay.render(this.rIntensity);
      this.mirroredRay.render(this.mIntensity);
      //console.log(-1*(180 - (90 + this.angle)))
    }


    this.previous = [x1,y1,x2,y2];
    stroke(intensity);
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

  for (let i = 0;i <36; i++) {
    push();
    let offset = 135+90;
    let n = 10;
    let x = (cos(i*n+offset)-sin(i*n+offset))*140+300;
    let y = (sin(i*n+offset)+cos(i*n+offset))*140+300;
    let xl = (cos(i*n+offset)-sin(i*n+offset))*150+300;
    let yl = (sin(i*n+offset)+cos(i*n+offset))*150+300;

    textSize(10);
    textAlign(CENTER)
    noStroke()
    fill(255,170)
    text(formatDeg(i*n),xl,yl);
    translate(x,y);

    rotate(i*n);
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
function calcIntensity(x) {
    return 2.26666*abs(x)+51;
}
function calcIntensity_r(x) {
    return -2.26666*abs(x)+255;
}
function mouseDragged(){
  if (mouseX > 0 && mouseX < 600 && mouseY < 600 && mouseY > 0) {
    r1.pos.x = mouseX;
    r1.pos.y = mouseY;
  }

}
function printData(increment) {
    let arr = [];
    for (let i =-90; i < 91; i+=increment) {
        //console.log("Incident: "+i+" Refracted: "+findThetaR(n1,n2,i))\
        let r = round(findThetaR(n1,n2,i)*1000)/1000;
        console.log("("+i+","+r+")")
        arr.push([i,r]);
    }
    return arr;
}



function download_csv() {
    let inter = JSON.parse(prompt("Increment"));
    data = printData(inter);
    let csv = 'thetaI,thetaR\n';
    data.forEach(function(row) {
            csv += row.join(',');
            csv += "\n";
    });

    console.log(csv);
    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'refractionData.csv';
    hiddenElement.click();
}
