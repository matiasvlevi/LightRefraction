
let r1;
let n1 = 1.00;
let n2 = 1.45;
let showAngle = false;
let data = [];
let wnx = 900;
let wny = 800;
let circleSize = 600;
function setup() {
  r1 = new Ray(100,100,30,800,"Incident");

  createCanvas(wnx,wny);
  //data = printData(5);
}

function draw() {
  background(51);
  dottedVLine(100,700)
  n1 = document.getElementsByName("n1")[0].value;
  n2 = document.getElementsByName("n2")[0].value;

  r1.render(255);
  //line(wnx/2,0,wnx/2,wny);


  line(0,wny/2,wnx,wny/2)
  drawIndicerelatif();
  drawMesures();
}

class Ray {
  constructor(x,y,a,length,incident) {
    this.pos = createVector(x,y);
    this.angle = a;
    this.length = length;
    this.refractedRay = undefined;
    this.intensity = 255;
    this.type = incident;
    this.mirroredRay = undefined;
    this.parent = undefined;
    this.previous = [];
  }
  render() {
    angleMode(DEGREES);

    if (this.previous.length > 0) {
      let b = this.pos.x-(wnx/2);
      let a = this.pos.y-(wny/2);
      let c = findLength(a,b)
      this.angle = asin(b/c);
    }

    let x1 = this.pos.x;
    let y1 = this.pos.y;
    let x2 = (this.length*cos(this.angle+90))+x1;
    let y2 = (this.length*sin(this.angle+90))+y1;

    if (y2 > wny/2 && this.type == "Incident") {

        let p = lineIntersection(x1,y1,x2,y2,0,wny/2,wnx,wny/2);
        x2 = p[0];
        y2 = p[1];
        this.mirroredRay = new Ray(0,0,0,0,"Mirrored");
        this.mirroredRay.pos.x = x2;
        this.mirroredRay.pos.y = y2;
        this.mirroredRay.length = 600;
        this.mirroredRay.angle = -1*((90+this.angle)-180)+90;
        this.mirroredRay.parent = this;
        let refAngle = findThetaR(n1,n2,this.angle);
        this.refractedRay = new Ray(0,0,0,0,"Refracted");
        this.refractedRay.pos.x = x2;
        this.refractedRay.pos.y = y2;
        this.refractedRay.length = 600;
        this.refractedRay.angle = refAngle;
        this.refractedRay.parent = this;
        if (this.pos.y < wny/2) {
            fill(255);
            ellipse(x1,y1,6,6)
        }

    } else {
        this.refractedRay = undefined;
    }
    if (this.pos.y < wny/2) {

        if (this.refractedRay !== undefined ) {
            this.refractedRay.render();
        }
        if (this.mirroredRay !== undefined) {
            this.mirroredRay.render();
        }
    }
    let parentPosy = this.pos.y;
    if (this.type == "Refracted") {

        this.intensity = calcIntensity_r(this.parent.angle);
        parentPosy = this.parent.pos.y;
    }
    if (this.type == "Mirrored") {
        this.intensity = calcIntensity(this.parent.angle);
        parentPosy = this.parent.pos.y;

    }
    if (this.type == "Incident" && this.pos.y > (wny/2)) {

        stroke(this.intensity);

    } else {

        stroke(this.intensity);
        line(x1,y1,x2,y2);
    }

    if (showAngle == true && parentPosy < wny/2) {
        drawAngle(this);
        drawAngleArc(this);
        drawAngleSimetry(this.angle, this.type);
    }

    this.previous = [x1,y1,x2,y2];

  }
}
function drawIndicerelatif() {
    push()
    textAlign(LEFT)
    noStroke()
    fill(255)
    let indiceRelatif = n2/n1;
    text("Indice relatif: "+round(indiceRelatif*1000)/1000,15,395);
    pop()
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
  // text("Indice de refraction: "+n1,10,20);
  // text("Indice de refraction: "+n2,10,580);
  noFill();
  stroke(255,100);
  ellipse(wnx/2,wny/2,circleSize,circleSize);
  for (let i = 0; i < 72; i++) {
      let offset = 135+90;
      let n = 5;
    let x = (cos(i*n+offset)-sin(i*n+offset))*210+(wnx/2);
    let y = (sin(i*n+offset)+cos(i*n+offset))*210+(wny/2);
    push();
    translate(x,y);
    rotate(i*n);
    stroke(100);
    line(0,0,0,10);
    pop();
  }
  for (let i = 0; i < 360; i++) {
      let offset = 135+90;
      let n = 1;
    let x = (cos(i*n+offset)-sin(i*n+offset))*210+(wnx/2);
    let y = (sin(i*n+offset)+cos(i*n+offset))*210+(wny/2);
    push();
    translate(x,y);
    rotate(i*n);
    stroke(100);
    line(0,0,0,5);
    pop();
  }
  for (let i = 0;i <36; i++) {
    push();
    let offset = 135+90;
    let n = 10;
    let x = (cos(i*n+offset)-sin(i*n+offset))*210+(wnx/2);
    let y = (sin(i*n+offset)+cos(i*n+offset))*210+(wny/2);
    let xl = (cos(i*n+offset)-sin(i*n+offset))*218+(wnx/2);
    let yl = (sin(i*n+offset)+cos(i*n+offset))*218+(wny/2)+3;

    textSize(10);
    textAlign(CENTER)
    noStroke()
    fill(180)
    let deg = formatDeg(i*n);
    if (deg !== 90) {
        text(deg,xl,yl);
    }

    translate(x,y);

    rotate(i*n);
    stroke(100);
    line(0,0,0,20)

    pop()
  }

  fill(255,100)
  ellipse(wnx/2,wny/2,2,2);
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

    if (mouseX >= 0 && mouseX <= wnx && mouseY <= wny && mouseY >= 0) {
        if (!(mouseX < 75 && mouseX > 0 && mouseY < 460 && mouseY > 350)) {
            if (!(mouseX < 120 && mouseX > 0 && mouseY < 60 && mouseY > 0)) {
                r1.pos.x = mouseX;
                r1.pos.y = mouseY;
            }


        }

    }

}
function printData(increment) {
    let arr = [];
    for (let i =-90; i < 91; i+=increment) {
        //console.log("Incident: "+i+" Refracted: "+findThetaR(n1,n2,i))\
        let r = round(abs(findThetaR(n1,n2,i))*1000)/1000;
        //console.log("("+i+","+r+")")
        arr.push([i,r]);
    }
    return arr;
}
function download_csv() {
    let str = prompt("Increment");
    let inter = 0;
    console.log(str)
    if (str == null || str == "") {
        return ;
    } else {
        inter = JSON.parse(str);
    }
    data = printData(inter);

    let csv = 'thetaI,thetaR\n';
    data.forEach(function(row) {
            csv += row.join(',');
            csv += "\n";
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'refractionData.csv';
    hiddenElement.click();
}
function dottedVLine(y1,y2) {
    push()
    for (let i = y1; i < y2; i+=16) {
        stroke(255,100);
        line(wnx/2,i,wnx/2,i+4);
    }
    pop()
}
function togglevisible() {
    showAngle = !showAngle;
}
function drawAngleSimetry(angle, type){

    let ang = 0;
    let bool = false;
    if (type == "Incident") {
        ang = angle;
        bool = true;
    } else if (type == "Mirrored") {
        ang = angle-180;
        bool = true;
    }
    if (bool == true) {
        let anghalf = ang/2;
        let lx = ((cos(anghalf+180+45) - sin(anghalf+180+45))*26)+(wnx/2);
        let ly = ((sin(anghalf+180+45) + cos(anghalf+180+45))*26)+(wny/2);

        push();
        translate(lx,ly);
        rotate(anghalf)
        stroke(255)
        line(0,0,0,10)
        pop();
    }

}
function drawAngleArc(ray) {

    if (ray.angle !== 0 && ray.angle !== 180) {
        noFill();
        stroke(255);
        let buffer = 0;
        let angleAdd = 0;
        let  pos = [];
        let refAngle = 0;
        if (ray.type == "Mirrored") {
            buffer = 180;
            angleAdd = 90;
            refAngle = -90;
            pos = [ray.pos.x,ray.pos.y]
        } else if (ray.type == "Refracted") {
            buffer = 0;
            angleAdd = 90;
            refAngle = 90;
            pos = [ray.pos.x,ray.pos.y];
        } else if (ray.type == "Incident") {
            buffer = 0;
            angleAdd = -90;
            refAngle = -90;
            pos = [wnx/2,wny/2];
        }

        if (ray.angle < buffer) {
            arc(pos[0],pos[1],64,64,(ray.angle+angleAdd),refAngle)
        } else {
            arc(pos[0],pos[1],64,64,refAngle,(ray.angle+angleAdd))
        }

    }
    stroke(255)


}
function drawAngle(ray) {

    let ang = 0;



        let ax = 0;
        let ay = 0;
        if (ray.type == "Refracted") {

            ang = -ray.angle;
            let anghalf = ang/2;

            ax = ((cos(-anghalf+45) - sin(-anghalf+45))*45)+(wnx/2);
            ay = ((sin(-anghalf+45) + cos(-anghalf+45))*45)+(wny/2);
        } else if (ray.type == "Mirrored") {
            ang = ray.angle-180;
            let anghalf = ang/2;

            ax = ((cos(anghalf+180+45) - sin(anghalf+180+45))*45)+(wnx/2);
            ay = ((sin(anghalf+180+45) + cos(anghalf+180+45))*45)+(wny/2);
        } else if (ray.type == "Incident") {
            ang = ray.angle;
            let anghalf = ang/2;

            ax = ((cos(anghalf+180+45) - sin(anghalf+180+45))*45)+(wnx/2);
            ay = ((sin(anghalf+180+45) + cos(anghalf+180+45))*45)+(wny/2);
        }


        noStroke();
        fill(255)
        textAlign(CENTER);
        text(round(abs(ang)*10)/10,ax,ay);
        //ellipse(px,py,3,3);




}
