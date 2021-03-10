import MovingBox from './movingBox.js';
import Board from "./board.js";
import { OrbitControls } from './lib/OrbitControls.js';
import { Point3, usefulKey } from './usefulStuff.js';

let myBoard = new Board();
let myBox = new MovingBox(Math.floor(Math.random() * 7), myBoard.boardArray);

const scene = new THREE.Scene(); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
const clock = new THREE.Clock();

const light = new THREE.AmbientLight( 0x404040 );

const controls = new OrbitControls( camera, renderer.domElement );

let score = 0; //the number displayed in the top of the screen
let keyState = {};    
let froze = false;
function updateScore(){
    document.getElementById("score").innerHTML = "Score: " + score;
}

function removeBoard(){
    for(let i = 0 ; i < myBoard.boardArray.length; i++){
        for(let j = 0; j < myBoard.boardArray[0].length; j++){scene.remove(myBoard.boardArray[i][j].rectMesh);}
    } 
}

function addBoard(){
    for(let i = 0 ; i < myBoard.boardArray.length; i++){
        for(let j = 0; j < myBoard.boardArray[0].length; j++){scene.add(myBoard.boardArray[i][j].rectMesh);}
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
    
    let div = document.getElementById("webgl").appendChild(renderer.domElement); //sets the webgl renderer to the div
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("rgb(0,0,0)");
    
    controls.enablePan = false; //disables dragging with right mouse button
    controls.rotateSpeed = 0.5; //makes the orbit rotating speed half of the original
    controls.update();

    scene.add(light);
    light.position.z = 4;
    camera.position.z = 15;

    addBox();
    addBoard();

    //stars
    const amount = 2000;
    const distance = 500;
    const segments = 2;
    const safeDistance = new Point3(10,10,25); //the size of a cube in which stars won't spawn
    const calculatPosition = (sphere) =>{
        sphere.position.x = Math.random() * distance - distance / 2;
        sphere.position.y = Math.random() * distance - distance / 2;
        sphere.position.z = Math.random() * distance - distance / 2;
    }
    let material = new THREE.MeshBasicMaterial( {color: 0xffffff} ); //generates the material, only needs to be done once
    let geometry = new THREE.SphereGeometry(0.1,segments, segments); //generates the mesh
    for(let i = 0; i < amount; i++){
		let sphere = new THREE.Mesh(geometry, material);
        calculatPosition(sphere);
        while(sphere.position.x > -safeDistance.x && sphere.position.x < safeDistance.x && sphere.position.y > -safeDistance.y && sphere.position.y < safeDistance.y && sphere.position.z > -safeDistance.z && sphere.position.z < safeDistance.z){
            calculatPosition(sphere);
        }
        scene.add(sphere);
    }


    

    updateScore();
    clock.start(); //starts the clock which is used for the chunks moving down
}

    const keyEsc = 27;
    const keySpace = 32;
    const keyR = 82;
    const keyShift = 16;
    const keyArrDown = 40;
    const keyArrRight = 39;
    const keyArrUp = 38;
    const keyArrLeft = 37;


window.addEventListener('keydown',function(e){
    if(keyState[e.keyCode] == undefined){ keyState[e.keyCode] =  new usefulKey();}
    
    let copy = keyState[e.keyCode].getPressed();
    keyState[e.keyCode].setPressed(true);
    
    if(copy == keyState[e.keyCode].getPressed()){ return;}
    
    if (e.keyCode == 27){
        
        if(!froze){
            clock.stop();
        }
        else{
            clock.start();
        }
        froze = !froze;        
    }
    else if(froze){return;}
    else if(e.keyCode == keyArrUp){
        myBox.rotate(0, myBoard.boardArray);
    }
    else if(e.keyCode == keyR ){ 
        resetBoard();
    }
    else if(e.keyCode == keySpace){ 
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
            updateScore();
        }
        addBoard();
        resetBox();
    }
    

},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode].setPressed(false);
    
},true);



function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
    if(clock.getElapsedTime() > 0.2){
        clock.stop();
        clock.start();
        moveDown();
    }
    
    if(froze){return;}

    if(keyState[keyArrDown] != undefined)    
    if(keyState[keyArrDown].canDoStuff()){
        moveDown();
    }
    if(keyState[keyArrLeft] != undefined) 
    if(keyState[keyArrLeft].canDoStuff()){
        if (myBox.isCollidingX(myBoard.boardArray, 1).x == 0) {
            myBox.moveX(-1, myBoard.boardArray);
        }
    }
    if(keyState[keyArrRight] != undefined) 
    if(keyState[keyArrRight].canDoStuff()){
        if (myBox.isCollidingX(myBoard.boardArray, 1).y == 0) {
            myBox.moveX(1, myBoard.boardArray);
        }
    }
    

   
}



function resetBoard(){    
    score = 0;
    updateScore();
    removeBoard(); //removes the threejs objects from the scene
    myBoard = undefined; 
    myBoard = new Board(); //generates a new board
    addBoard(); //adds it to the threejs scene
    myBox.calculateGhostPos(myBoard.boardArray);
}


function resetBox(){
    const generateRandomBox = () =>{
        return new MovingBox(Math.floor(Math.random() * 7), myBoard.boardArray);
    }
    removeBox();
    let tempBox = generateRandomBox();
    while(tempBox.type == myBox.type){ //generates a new box until it isn't the same type as the old one
        tempBox = generateRandomBox();
    }
    myBox = tempBox;
    addBox();
}

function moveDown(){
    if(myBox.isCollidingY(myBoard.boardArray, 1).y == false){ //moves the chunk by one if there is no collision found
        myBox.moveY(1);
        return;
    }
    if(myBoard.placeBlock(myBox)){ //returns true if a chunk goes out of the screen on the vertical axis
        resetBoard(); //simply resets the whole board
    }
    if(myBoard.isLineFinished()){ 
        removeBoard();
    }
    while(myBoard.checkFinishedLines()){
        score = score + 1000;
        updateScore();
    }
    addBoard();
    resetBox();
}

/*
window.addEventListener("keydown", (event) => {
    if (event.defaultPrevented) {
      return; 
    }
  
    switch (event.key) {
      case "ArrowDown":
        moveDown();
        break;
      case "ArrowUp":
        
        break;
      case "ArrowLeft":
        
        break;
      case "ArrowRight":
        
        break;
      case "Shift":
        
        break;
      case " ":
        
        break;
      
      
    }
  

    event.preventDefault();
  }, true);
*/







main(); 
animate(); //starts main loop

