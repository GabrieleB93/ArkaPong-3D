class Pad{

    constructor(type,geometry){

        let position;
        if(type === true){
            position = camera.position.z - 80;
        }else {
            position = camera.position.z - 180;
        }

        //let geometry = new THREE.BoxGeometry(wpad,hpad,0);
        let material = new THREE.MeshBasicMaterial({ color: 0xB00E24 , opacity: 0.4,transparent:type});
        this.pad = new THREE.Mesh( geometry, material );
        this.pad.position.z = position;

        let geo = new THREE.EdgesGeometry(geometry);
        let mat = new THREE.LineBasicMaterial( { color: 0x0B0000 } );
        this.edge = new THREE.LineSegments( geo, mat );
        this.edge.position.z = position;

        scene.add(this.edge);
        scene.add(this.pad);
    }

    PcpadMove(difficulty){

        let padx = this.pad.position.x;
        let dx = Math.min(difficulty, Math.abs(ball.getPositionX() - padx));

        padx += ball.getPositionX() > padx ? dx : -dx;

        let tmpx =(Math.max(-w +wpad*2+13, Math.min(w-wpad*2-13, padx))) ;

        let pady = this.pad.position.y;
        let dy = Math.min(difficulty, Math.abs(ball.getPositionY() - pady));

        pady += ball.getPositionY() > pady ? dy : -dy;

        let tmpy =(Math.max(-h+hpad*2+28, Math.min(h-hpad*2-28, pady)));

        let pos = new THREE.Vector3(tmpx, tmpy, -180);
        this.moveAt(pos);

    }

    moveAt(pos){
        this.pad.position.copy(pos);
        this.edge.position.copy(pos);
    }

    getPositionX(){
        return this.pad.position.x;
    }

    getPositionY(){
        return this.pad.position.y;
    }

    changeColor(x){
        this.pad.material.color.setHex(x);
    }

    directionToXR(speed){

        if(this.pad.position.x + wpad/2 < w/2){
            let pos = new THREE.Vector3(this.pad.position.x + speed,this.pad.position.y,-80);
            this.moveAt(pos);
        }
    }

    directionToYU(speed){
        if(this.pad.position.y + hpad/2 < h/2){
            let pos = new THREE.Vector3(this.pad.position.x,this.pad.position.y + speed,-80);
            this.moveAt(pos);
        }
    }

    directionToYD(speed){
        if(this.pad.position.y - hpad/2 > - h/2){
            let pos = new THREE.Vector3(this.pad.position.x,this.pad.position.y - speed,-80);
            this.moveAt(pos);
        }
    }

    directionToXL(speed){
        if(this.pad.position.x - wpad/2 > - (w/2)){
            let pos = new THREE.Vector3(this.pad.position.x - speed,this.pad.position.y,-80);
            this.moveAt(pos);
        }
    }

}

class Brick extends Pad {

    constructor(pos,geometry){

        super(true,geometry);
        this.moveAt(pos);
        this.pad.material.opacity = 0.8;
        this.pad.material.color.setHex(0x008716);

    }

    removeBrick(){
        scene.remove(this.pad);
        scene.remove(this.edge);
    }
}