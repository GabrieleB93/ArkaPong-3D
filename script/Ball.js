class Ball{

    constructor(radius){

        this.xspeed = 0;
        this.yspeed = 0;
        this.zspeed = defoultZspeed;
        this.direction = 1;
        this.radius = radius;
        this.ball = new THREE.Mesh(new THREE.SphereGeometry(radius,100,100),new THREE.MeshStandardMaterial({color: 0xffffff}));
        this.ball.position.y = 0;
        this.ball.position.x = 0;
        this.ball.position.z = -85;
        this.ball.castShadow = true;
        this.ball.receiveShadow = true;
        scene.add(this.ball);
    }

    MoveBall() {

        if(clicked && moving){

            moving = true;


            this.ball.position.x += this.xspeed;
            this.ball.position.y += this.yspeed;
            this.ball.position.z += this.zspeed;
            scatola.position.z = this.ball.position.z + this.radius;

            if(this.ball.position.x <= -w/2 + this.radius || this.ball.position.x>= w/2 - this.radius  ) {
                this.xspeed *= -this.direction;
                boing.play();

                while(this.ball.position.x <= -w/2 + this.radius || this.ball.position.x>= w/2 - this.radius){

                    this.ball.position.x += this.xspeed;
                }
            }

            if(this.ball.position.y  >= h/2 - this.radius  || this.ball.position.y  <= -h/2 + this.radius  ) {
                this.yspeed *= -this.direction;
                boing.play();
                while(this.ball.position.y  >= h/2 - this.radius  || this.ball.position.y  <= -h/2 + this.radius){

                    this.ball.position.y += this.yspeed;
                }
            }

            if(this.ball.position.z - this.radius < bottom) {
                if(ball.PadCollision(pcpad,PAD) === false) {

                    PointMade(1);
                }else {

                    ball.BounceOnPad(pcpad,PC);
                    while(this.ball.position.z - this.radius < bottom){
                        this.ball.position.z += this.zspeed;
                    }

                }
            } else if (this.ball.position.z + this.radius > front  ) {

                if (ball.PadCollision(pad, PAD) === false) {

                    PointMade(2);

                } else {

                    ball.BounceOnPad(pad, PAD);
                    while(this.ball.position.z + this.radius > front){
                        this.ball.position.z += this.zspeed;
                    }
                }
            }

            let t = this.ball.position.z + this.radius ;
            if(t  > (-131) && (t <= (-130 ))  ){

                if(DIR===true){
                    for (let i = 0; i < numBrick; i++) {
                        if (brickHit[i] === false ) {

                            if (ball.PadCollision(brick[i],BRICK)===true) {

                                brickHit[i] = true;
                                brick[i].removeBrick();
                                boing.play();
                                let diffy = this.ball.position.y - (brick[i].getPositionY());
                                let diffx = this.ball.position.x - (brick[i].getPositionX());
                                this.yspeed = (diffy)*0.06;
                                this.xspeed = (diffx)*0.06;
                                this.zspeed = defoultZspeed;
                                this.zspeed *= -this.direction;
                            }
                        }
                    }
                }

            }


            let p = this.ball.position.z - this.radius;
            if( p > (-130 ) && (p  <= (-128))){

                if(DIR === false){
                    for (let i = 0; i < numBrick; i++) {
                        if (brickHit[i] === false) {

                            if (ball.PadCollision(brick[i],BRICK)===true) {

                                brickHit[i] = true;
                                brick[i].removeBrick();
                                boing.play();

                                let diffy = this.ball.position.y - (brick[i].getPositionY());
                                let diffx = this.ball.position.x - (brick[i].getPositionX());
                                this.yspeed = (diffy)*0.09;
                                this.xspeed = (diffx)*0.09;
                                this.zspeed *= -this.direction;
                                this.zspeed = defoultZspeed;
                            }
                        }
                    }
                }

            }
        }
    }

    PadCollision(pad, type){

        let tmpPadx;
        let tmpPady;
        let tmpWpad;
        let tmpHpad;

        if(type === BRICK){
            tmpWpad = wbrick/2;
            tmpHpad = hbrick/2;
        }else{
            tmpWpad = wpad/2;
            tmpHpad = hpad/2;
        }

        tmpPadx = pad.getPositionX();
        tmpPady = pad.getPositionY();
        if((this.ball.position.x - this.radius<= tmpPadx + tmpWpad) && (this.ball.position.x + this.radius >= tmpPadx - tmpWpad)){
            if((this.ball.position.y - this.radius<= tmpPady + tmpHpad) && (this.ball.position.y + this.radius >= tmpPady - tmpHpad) ){
            }else{
                return false;
            }
        }else{
            return false;
        }
        return true;
    }

    NewBall(){

        scene.remove(this.ball);
        ball = new Ball(this.radius);

    }

    BounceOnPad(pad, type, index){

        let diffy = this.ball.position.y - (pad.getPositionY());
        let diffx = this.ball.position.x - (pad.getPositionX());

        switch(type){
            case PAD:
                // rangeboostx = 4;
                // rangeboosty = 6;
                DIR = false;
                break;
            case PC:
                // rangeboostx = 4;
                // rangeboosty = 6;
                DIR = true;
                break;
            case BRICK:
                // rangeboostx = 1;
                // rangeboosty = 2;
                brickHit[index] = true;
                brick[index].removeBrick();
                break;
            default:
                break;
        }

        this.yspeed = (diffy)*0.09;
        this.xspeed = (diffx)*0.09;

        if((diffy > -4 && diffy < 4)){

            if((diffx > -6 && diffx < 6)){

                boing.play();
                pad.changeColor(0xB00000);
                setTimeout(function(){
                    pad.changeColor(0xB00E24);
                },110);

                if(DIR === true){
                    this.zspeed *= -this.direction;
                    this.zspeed = boostZspeed;
                }else{
                    this.zspeed = boostZspeed;
                    this.zspeed *= -this.direction;
                }


            }else{

                boing.play();
                pad.changeColor(0xB00000);
                setTimeout(function(){
                    pad.changeColor(0xB00E24);
                },120);

                if(DIR === true){
                    this.zspeed *= -this.direction;
                    this.zspeed = defoultZspeed;
                }else{
                    this.zspeed = defoultZspeed;
                    this.zspeed *= -this.direction;
                }
            }

        }else{

            boing.play();
            pad.changeColor(0xB00000);
            setTimeout(function(){
                pad.changeColor(0xB00E24);
            },120);

            if(DIR === true){
                this.zspeed *= -this.direction;
                this.zspeed = defoultZspeed;
            }else{
                this.zspeed = defoultZspeed;
                this.zspeed *= -this.direction;
            }
        }

    }

    getPositionY(){
        return this.ball.position.y;
    }

    getPositionX(){
        return this.ball.position.x;
    }

    move(x,y,z){
        this.ball.position.y += y;
        this.ball.position.x += x;

    }

}