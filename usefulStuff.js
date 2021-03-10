
export class Color{
    constructor(r,g,b){
        this.r = r;
        this.g = g;
        this.b = b;
    }

}

export class Point{
    constructor(newx,newy){
        this.x = newx;
        this.y = newy;
    }
    
}

export class Box{
    constructor(){
        this.full = false;
        this.color = new Color(255,0,0);
        this.threeJSColor = new THREE.Color();

        this.rectGeometry = new THREE.BoxGeometry();
        this.rectMaterial = new THREE.MeshPhongMaterial({color: 0xAAAAAA});
        this.rectMesh = new THREE.Mesh(this.rectGeometry, this.rectMaterial);

        this.update();
    }

    update = () => { //TODO also apply color
        this.threeJSColor = new THREE.Color(this.color.r/255, this.color.g/255, this.color.b/255);
        if(this.full){
            //TODO change to THREEJS type color
            this.rectMaterial.color = this.threeJSColor;
            this.rectMaterial.transparent = false;
            this.rectMaterial.opacity = 1;
            this.rectMaterial.emissive = this.threeJSColor;

        }
        else{
            this.rectMaterial.color = new THREE.Color(0.3, 0.3, 0.3);
            this.rectMaterial.transparent = true;
            this.rectMaterial.opacity = 0.6;

            //this.rectMaterial.emissive = new THREE.color(0,0,0);
        }
    }


    setFull = (newFull) => {
        this.full = newFull;
        this.update();
    }

}

export class someVars{
    static size = 1;
    static gap = 0.2;
    static offsetX = (someVars.size*9) / 2;
    static offsetY = (someVars.size*19) / 2;
}