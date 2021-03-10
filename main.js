import MovingBox from './movingBox.js';
import Board from "./board.js";
import { Box, Color, Point } from "./usefulStuff.js";
import { OrbitControls } from './lib/OrbitControls.js';

let myBoard = new Board();
let myBox = new MovingBox(0, myBoard.boardArray);


let score = 0;
document.getElementById("score").innerHTML = score;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
const clock = new THREE.Clock();

//const light = new THREE.PointLight(0xffffff, 1);
const light = new THREE.AmbientLight( 0x404040 );

const controls = new OrbitControls( camera, renderer.domElement );


function removeBoard(){
    for(let i = 0 ; i < myBoard.boardArray.length; i++){
        for(let j = 0; j < myBoard.boardArray[0].length; j++){
            scene.remove(myBoard.boardArray[i][j].rectMesh);
        }
    } 
}

function addBoard(){
    for(let i = 0 ; i < myBoard.boardArray.length; i++){
        for(let j = 0; j < myBoard.boardArray[0].length; j++){
            scene.add(myBoard.boardArray[i][j].rectMesh);
        }
    } 
}


function addBox(){
    for(let i = 0 ; i < myBox.size; i++){
        for(let j = 0; j < myBox.size; j++){
            scene.add(myBox.boxArray[i][j].rectMesh);
            scene.add(myBox.ghostArray[i][j].rectMesh);
        }
    }
}

function removeBox(){
    for(let i = 0 ; i < myBox.size; i++){
        for(let j = 0; j < myBox.size; j++){
            scene.remove(myBox.boxArray[i][j].rectMesh);
            scene.remove(myBox.ghostArray[i][j].rectMesh);
        }
    }
}


function main(){
    
    
    //THREEJS stuff
    let div = document.getElementById("webgl");
    div.appendChild(renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("rgb(0,0,0)");
    //renderer.shadowMap.enabled = true;
    
    
   //controls.enableDamping = true;
   //controls.dampingFactor= 1;
   controls.enablePan = false;
   controls.rotateSpeed = 0.5;
    
    scene.add(light);
    light.position.y = 0;
    light.position.x = 0;
    light.position.z = 4;

    camera.position.z = 15;



    controls.update();
    
        addBox();

        addBoard();
    //stars
    const amount = 500;
    const distance = 200;
    const segments = 2;
    for(let i = 0; i < amount; i++){
        let geometry = new THREE.SphereGeometry(Math.random()/5,segments, segments);
        let material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		let sphere = new THREE.Mesh(geometry, material);

        sphere.position.x = Math.random() * distance - distance / 2;
		sphere.position.y = Math.random() * distance - distance / 2;
        sphere.position.z = Math.random() * distance - distance / 2;

        scene.add(sphere);
    }



   clock.start();
}


function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);


    if(clock.getElapsedTime() > 0.2){
        clock.stop();
        clock.start();
        moveDown();
    }
}



function resetBoard(){
    removeBoard();
    myBoard = undefined;
    myBoard = new Board();
    addBoard();
}

function moveDown(){
    if(myBox.isCollidingY(myBoard.boardArray, 1).y == false){
        myBox.moveY(1);
    }
    else{
        if(myBoard.placeBlock(myBox)){
            resetBoard();
        }
        if(myBoard.isLineFinished()){
            removeBoard();
        }
        while(myBoard.checkFinishedLines()){
            score = score + 1000;
            document.getElementById("score").innerHTML = score;
        }

        addBoard();

        let type11 = myBox.type;

        removeBox();

        myBox = undefined;
        myBox = new MovingBox(Math.floor(Math.random() * 7), myBoard.boardArray);
        
        addBox();
        
        
    }
}

let num = 0;

function interval(func, wait, times){
    var interv = function(w, t){
        return function(){
            if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait, times);

    setTimeout(interv, wait);
};



window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
      return; 
    }
  
    switch (event.key) {
      case "ArrowDown":
        moveDown();
        break;
      case "ArrowUp":
        myBox.rotate(0, myBoard.boardArray);
        break;
      case "ArrowLeft":
        if (myBox.isCollidingX(myBoard.boardArray, 1).x == 0) {
            myBox.moveX(-1, myBoard.boardArray);
        }
        break;
      case "ArrowRight":
        if (myBox.isCollidingX(myBoard.boardArray, 1).y == 0) {
            myBox.moveX(1, myBoard.boardArray);
        }
        break;
      case "Shift":
        
        break;
      case " ":
        while(myBox.isCollidingY(myBoard.boardArray, 1).y == false){
            myBox.moveY(1);
        }
        if(myBoard.placeBlock(myBox)){
            resetBoard();
        }
        if(myBoard.isLineFinished()){
            removeBoard();
        }
        while(myBoard.checkFinishedLines()){
            score = score + 1000;
            document.getElementById("score").innerHTML = score;
        }

        addBoard();

        let type11 = myBox.type;

        removeBox();

        myBox = undefined;
        myBox = new MovingBox(Math.floor(Math.random() * 7), myBoard.boardArray);
        
        addBox();
        break;
      case "r":
        resetBoard();
      break;
      default:
        return; 
        break;
    }
  

    event.preventDefault();
  }, true);




main();
animate();
//interval(loop,50,3333333333333333);
//setInterval(loop,300);
