//Struttura
let camera, scene, renderer;
let windowHalfX = window.innerWidth/2;
let windowHalfY = window.innerHeight/2;
let font;
let canvas;

//Per il mouse
let mouse = new THREE.Vector2();
let posmouse = new THREE.Vector3();
let clicked = false, moving = false;

//Ball
let ball, defoultZspeed = 0.7, boostZspeed = 1;
let radius = 5;

//Tunnel
let tunnel, scatola;
let w = 100, h = 100, d = 100, prof = -130;
let front = prof + d/2, bottom = prof - d/2;

//Pads & Bricks
let pad, pcpad, myscore = 0, pcscore = 0;
let wpad = 25, hpad = 15;
let wbrick = 17.5, hbrick = 6, dbrick = 2;
let brick = [], brickHit = [], numBrick;
let DIR = false, PAD = "pad", PC = "pc", BRICK = "brick";
let difficulty = speedPad = 0.7;

//Testi, audio e tastiera
let text = [];
let boing, context;
let kmap = [];

//MotionControl
let direction = new THREE.Vector3(0, 0, -80);
let orientationGamma = 0;
let orientationBeta = 0;
let initialOrientationGamma = 0;
let initialOrientationBeta = 0;
let speed = 1;

//FrameRate
let fps = 60;
const interval = 1000 / fps;
let now, delta;
let then = Date.now();


function loadFont() {

    let loader = new THREE.FontLoader();
    loader.load( 'font/gentilis_regular.typeface.json', function ( response ) {
        font = response;
        init(font);
        animate();
    } );
}

function setupLights() {
    let ambientLight = new THREE.AmbientLight(0xaaaaaa);
    scene.add(ambientLight);

    let spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(10, 100, bottom);
    spotLight.castShadow = true;

    scene.add(spotLight);
}

loadFont();

function init(font) {

    canvas = document.getElementById('canvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    scene.add(camera);
    camera.lookAt(scene.position);


    //Tunnel
    let geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,d));
    let mat = new THREE.LineBasicMaterial( { color: 0xffffff ,depthWrite: true} );
    tunnel = new THREE.LineSegments( geo, mat );
    tunnel.position.z = prof;
    scene.add( tunnel );

    let geo1 = new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,0));
    let mat1 = new THREE.LineBasicMaterial( { color: 0xFE0011, depthWrite: false  ,linewidth :500} );
    scatola = new THREE.LineSegments(geo1,mat1);
    scatola.geometry.colorsNeedUpdate = true;

    scatola.position.z = front  ;
    scene.add(scatola);

    for(let i= 0; i < 8 ; i++){
        let cos = [];
        let geo1 = new THREE.EdgesGeometry(new THREE.BoxGeometry(w,h,10));
        let mat1 = new THREE.LineBasicMaterial( { color: 0x00F017, depthTest: false } );
        cos[i] = new THREE.LineSegments(geo1,mat1);
        cos[i].position.z = - 30 + prof+(i*10);
        scene.add(cos[i]);
    }

    //Ball
    ball = new Ball(radius);
    context = new AudioContext();
    boing = new Sound(context);

    //PAD
    let geometry = new THREE.BoxGeometry(wpad,hpad,0);
    pad = new Pad(true,geometry);
    pcpad = new Pad(false,geometry);

    setupLights();

    //Scritte
    text[1] = new Text(myscore, font,1,-70,53,-d);
    text[2] = new Text(pcscore, font,2,70,53,-d);
    text[3] = new Text("Me", font,3,-80,43,-d);
    text[4] = new Text("Pc", font,4,70,43,-d);
    text[5] = new Text("YOU WIN",font,5,-20,0,-75);
    text[6] = new Text("YOU LOSE",font,6,-20,0,-75);
    text[5].hidden();
    text[6].hidden();

    //Bricks
    setupBricks();

    renderer = new THREE.WebGLRenderer({canvas: canvas,alpha:true,antialias: true,});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    document.addEventListener( 'touchmove', onTouchMove, false);
    window.addEventListener('deviceorientation', handleOrientation, true);
    // window.addEventListener("compassneedscalibration", function(event) {
    //     alert("Compass needs calibration");
    // }, true);
    document.getElementById("one").addEventListener("click", function () {
        Restart(1);
    });
    document.getElementById("three").addEventListener("click", function () {
        Restart(3);
    });
    document.addEventListener('keydown', onkeydown, false);
    document.addEventListener('keyup',onkeyup,false);
    window.addEventListener( 'resize', onWindowResize, false );

    kmap = [];
    onkeydown = onkeyup = function(e){
        e = e || event; // IE
        kmap[e.keyCode] = e.type === 'keydown';

    };

    if(checkMobile && !move){
        fps = 30;
        difficulty = 0.7;
    }else if(checkMobile && move){
        fps = 30;
        difficulty = 0.5;
    }
}

function handleOrientation(event) {

    // if(move){
    //     let maxX = w - wpad;
    //     let maxY = h - hpad;
    //
    //     let x = (initialOrientationBeta - orientationBeta)  ;
    //     let y = (initialOrientationGamma - orientationGamma) ;
    //     // Because we don't want to have the device upside down
    //     // We constrain the x value to therange [-90,90]
    //     // if (x >  30) { x =  30}
    //     // if (x < -15) { x = -15}
    //     // if (y >  28) { y =  28}
    //     // if (y < -20) { y = -20}
    //     if (window.innerHeight !== screen.height) {
    //         let pos = new THREE.Vector3(((maxY*y/45 - (hpad/2))),(maxX*x/45 - (wpad/2)),front);
    //         pad.moveAt(pos);
    //     }else{
    //         let pos = new THREE.Vector3(((maxX*x/45 - (wpad/2))),(maxY*y/45 - (hpad/2)),front);
    //         pad.moveAt(pos);
    //     }
    //
    // }

    if(move){
        if (!initialOrientationGamma) {
            initialOrientationGamma = event.gamma;
            initialOrientationBeta = event.beta;
        }

        orientationGamma = event.gamma;
        orientationBeta = event.beta;
    }

}

function Recalibrate(){
    direction = new THREE.Vector3(0, 0, -80);
    orientationGamma = 0;
    orientationBeta = 0;
    initialOrientationGamma = 0;
    initialOrientationBeta = 0;
}

function onTouchMove(event) {
    // Update the mouse variable
    event.preventDefault();
    mouse.x = ( event.touches[0].pageX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.touches[0].pageY / renderer.domElement.clientHeight ) * 2 + 1;

    // Make the sphere follow the mouse
    let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    let dir = vector.sub(camera.position).normalize();
    let distance = (-camera.position.z) -( 80) / dir.z ;
    let pos = camera.position.clone().add(dir.multiplyScalar(distance));

    if(pos.x > 0 && pos.y < h/2 - hpad/2  && pos.y > -(h/2 - hpad/2)){

        let tmp = pos.add(new THREE.Vector3(-50,0,0));
        pad.moveAt(tmp);
    }
}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown( event ) {


//
//        event.preventDefault();
//
//        var mouse_x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
//        var mouse_y = -( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
//
//        var vector = new THREE.Vector3(mouse_x,mouse_y,0.5);
//        vector.unproject(camera);
//        var raycaster = new THREE.Raycaster(camera.position,vector.sub(camera.position).normalize());
//
//        var intersects = raycaster.intersectObjects(objects);
//
//        if (intersects.length > 0) {
//
//            console.log('How', true, new Date());
//            selected = intersects[0].object;
//            var intersects = raycaster.intersectObjects(plane);
//            offset.copy(intersects[0].point).sub(plane.position);
//        }
}

function onDocumentMouseUp(  ) {

    if(clicked === false){
        clicked = true;
    }
    if(ball.PadCollision(pad,PAD)){
        moving = true;
    }
}

function onDocumentMouseMove(event) {

    // Update the mouse variable
    event.preventDefault();
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    // Make the sphere follow the mouse
    let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    let dir = vector.sub(camera.position).normalize();
    let distance = (-camera.position.z) -( 80) / dir.z ;
    posmouse = camera.position.clone().add(dir.multiplyScalar(distance));

    if(posmouse.x< w/2 - wpad/2 && posmouse.x > -(w/2 - wpad/2) && posmouse.y < h/2 - hpad/2 && posmouse.y > -(h/2 - hpad/2)){
        pad.moveAt(posmouse);
    }
}

function setupBricks(){

    for(let i = 0 ; i<numBrick; i++){
        if(brickHit[i]===false){
            brick[i].removeBrick();
        }
    }

    let brickGeometry = new THREE.BoxGeometry(wbrick,hbrick,dbrick);
    let maxi = Math.floor(Math.random() * (4)) +(4);
    numBrick=0;
    for(let i = 0; i<maxi; i++){

        let maxj = Math.floor(Math.random() * (3)) +(2);

        for(let j=0; j<maxj; j++){
            let distx = 1.6 - (0.1*maxj);
            let disty = 2.5 - (0.1*maxi);
            let pos =new THREE.Vector3(-w/2+25-(maxj*maxj) + ((j*wbrick*distx))+10,h/2-(hbrick*2) -(i*hbrick*disty)-5,-130);

            brick[numBrick+j] = new Brick(pos,brickGeometry);
            brick[numBrick+j].name = numBrick+j;

        }
        numBrick += maxj;
    }

    for(let i = 0 ; i<numBrick; i++){
        brickHit[i]=false;
    }
}

function Restart(x) {

    setupBricks();
    myscore = 0;
    pcscore = 0;
    text[1].refreshText(myscore);
    text[2].refreshText(pcscore);
    DIR = false;
    text[5].hidden();
    text[6].hidden();
    start = true;

    if(x === 3){
        move = true;
        document.getElementById("four").style.display = 'inline';
        difficulty = 0.5;
    }else{
        move = false;
        document.getElementById("four").style.display = 'none';
        difficulty = 0.7;
    }

}

function padMove() {

    if(kmap[13] || kmap[32]){
    onDocumentMouseUp();
    }

    if(kmap[65] && kmap[87]){

        pad.directionToXL(speedPad/2);
        pad.directionToYU(speedPad/2);
    }

    if(kmap[87]){
        pad.directionToYU(speedPad);
    }

    if(kmap[83]){
        pad.directionToYD(speedPad);
    }

    if(kmap[65]){
        pad.directionToXL(speedPad);
    }

    if(kmap[68]){
        pad.directionToXR(speedPad);
    }

    if(kmap[65] && kmap[83]){
        pad.directionToXL(speedPad/2);
        pad.directionToYD(speedPad/2);
    }

    if(kmap[68] && kmap[87]){
        pad.directionToYU(speedPad/2);
        pad.directionToXR(speedPad/2);
    }

    if(kmap[68] && kmap[83]){
        pad.directionToXL(speedPad/2);
        pad.directionToYD(speedPad/2);
    }
}

function PointMade(x){


    if(x === 1){
        myscore +=1;
        text[x].refreshText(myscore);
    }else{
        pcscore +=1;
        text[x].refreshText(pcscore);
    }

    moving = false;
    clicked = false;
    let pos = new THREE.Vector3(0, 0, -180);
    pcpad.moveAt(pos);


    if(myscore === 5){

        text[5].notHidden();

        document.getElementById("one").style.visibility = 'visible';
        if(checkMobile){
            document.getElementById("three").style.visibility = 'visible';
        }
        start = false;
        move = false;

    }else if(pcscore === 5){

        text[6].notHidden();

        document.getElementById("one").style.visibility = 'visible';
        if(checkMobile){
            document.getElementById("three").style.visibility = 'visible';
        }
        start = false;
        move = false;
    }

    ball.NewBall();
}

function animate() {

    requestAnimationFrame(animate);

    if (( window.innerHeight !== screen.height)) {

        document.getElementById("two").style.display = 'inline';
    }else{
        document.getElementById("two").style.display = 'none';
    }

    now = Date.now();
    delta = now - then;

    // Nuovo frame
    if (delta > interval) {

        then = now - (delta % interval);

        if (start) {
            ball.MoveBall();
            pcpad.PcpadMove(difficulty);

            if(!checkMobile){

                if(posmouse.x < 50 && posmouse.x >-50 && posmouse.y <50 && posmouse.y > -50){

                    document.getElementById("canvas").style.cursor = "none";

                }else{
                    document.getElementById("canvas").style.cursor = "default";
                }
            }

        }

        if(move){

            if (orientationGamma) {
                let x = (initialOrientationBeta - orientationBeta)  ;
                let y = (initialOrientationGamma - orientationGamma) ;

                direction.add(new THREE.Vector3(0, y * speed * -0.058,0));
                direction.add(new THREE.Vector3(x * speed * -0.058, 0, 0));
            }

            if(direction.x < 50 && direction.x >-50 && direction.y <50 && direction.y > -50){
                pad.moveAt(direction);
            }
        }

        padMove();
        render();
    }
}

function render() {

    renderer.autoClear = true;
    renderer.clear();
    renderer.render(scene, camera);

}