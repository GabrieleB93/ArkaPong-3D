class Text{

    constructor(string,font,i,x,y,z){

        this.i = i;
        this.x = x;
        this.y = y;
        this.z = z;
        let textGeo = new THREE.TextGeometry( string, {

            font: font,
            size:8,
            height: 0,
            curveSegments: 2,
            bevelEnabled: false
        });

        let textMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, transparent:true , opacity: 1 } );
        this.textMesh = new THREE.Mesh( textGeo, textMaterial );
        this.textMesh.position.set(x,y,z);
        scene.add( this.textMesh);
    }

    Remove(){
        scene.remove(this.textMesh);
    }

    hidden(){
        this.textMesh.material.opacity = 0;
    }

    notHidden(){
        this.textMesh.material.opacity = 1;
    }

    refreshText(string){

        this.Remove();
        text[this.i] = new Text(string,font,this.i,this.x, this.y,this.z);
    }
}