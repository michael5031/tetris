import MovingBox from './movingBox.js';
import Board from "./board.js";
import { OrbitControls } from './lib/OrbitControls.js';
import { Point3, usefulKey } from './usefulStuff.js';
import {guiInit, handleState} from "./gui.js"
import { GLTFLoader } from './lib/GLTFLoader.js';
import { BoxGeometry } from './lib/three.module.js';
let myBoard = new Board();
let myBox = new MovingBox(Math.floor(Math.random() * 7), myBoard.boardArray);
let myHold = undefined;
const scene = new THREE.Scene(); 
const renderer = new THREE.WebGLRenderer({antialias: true});
const clock = new THREE.Clock();
const loader = new GLTFLoader();
const zenClock = new THREE.Clock();
//const light = new THREE.SpotLight(0xffffff);
//const light = new THREE.AmbientLight( 0x404040 );
const light= new THREE.DirectionalLight( 0xffffff );
//light.rotation.z = 50;
light.position.x = 0.7;
light.position.z = 1;
//dirLight.position.set( -10, 10, 10 );

controls = new OrbitControls( camera, renderer.domElement );

const startSpeed = 0.3;
let currentSpeed = startSpeed; //is getting smaller if playing zen
let holdText = undefined;
let holdMat = undefined;
let holdBackMat = undefined;


let keyState = {};    
let froze = false;

export default function resetRound(){
    currentSpeed = startSpeed;
    resetBoard();
    resetBox();
    gameClock.stop();
    gameClock.start();
    updateScore();
    camera.position.z = 15;
    camera.position.x = 0;
    camera.position.y = 0;
    
}

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

    
    guiInit();
    

    let div = document.getElementById("webgl").appendChild(renderer.domElement); //sets the webgl renderer to the div
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("rgb(0,0,0)");
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    controls.enablePan = false; //disables dragging with right mouse button
    controls.rotateSpeed = 0.5; //makes the orbit rotating speed half of the original
    controls.update();
    camera.position.z = 20;
    scene.add(light);
    
    

    addBox();
    addBoard();

    //stars
    const amount = 1000;
    const distance = 500;
    const segments = 2;
    const safeDistance = new Point3(10,10,25); //the size of a cube in which stars won't spawn
    const calculatPosition = (sphere) =>{
        sphere.position.x = Math.random() * distance - distance / 2;
        sphere.position.y = Math.random() * distance - distance / 2;
        sphere.position.z = Math.random() * distance - distance / 2;
    }
    let material = new THREE.MeshBasicMaterial( {color: 0xffffff} ); //generates the material, only needs to be done once
    let geometry = new THREE.SphereGeometry(0.2,segments, segments); //generates the mesh
    for(let i = 0; i < amount; i++){
		let sphere = new THREE.Mesh(geometry, material);
        calculatPosition(sphere);
        while(sphere.position.x > -safeDistance.x && sphere.position.x < safeDistance.x && sphere.position.y > -safeDistance.y && sphere.position.y < safeDistance.y && sphere.position.z > -safeDistance.z && sphere.position.z < safeDistance.z){
            calculatPosition(sphere);
        }
        scene.add(sphere);
    }

    /*
    loader.load( './models/holdText.glb', function ( gltf ) {
        return;
         TODO add 3d model
        scene.add( gltf.scene );
        gltf.scene.name = "holdText";
        gltf.scene.scale.x = 2;
        gltf.scene.scale.y = 2;
        gltf.scene.scale.z = 2;

        gltf.scene.rotation.x = 1.56;
        gltf.scene.rotation.z = -fov/120;

        gltf.scene.position.x = -10.5;
        gltf.scene.position.y = 1;
        gltf.scene.position.z = 4.5;

        holdMat = new THREE.MeshPhongMaterial( { color: 0xffffff, emissive: 0xffffff,transparent: true,  opacity: 0 } );

        gltf.scene.traverse((o) => {
            if (o.isMesh) o.material = holdMat;
          });
        let boxGeomety = new THREE.BoxGeometry(5,7,0.3);
        holdBackMat = new THREE.MeshPhongMaterial({ color: 0x555555, emissive: 0x555555,transparent: true,  opacity: 0 })
        let cube = new THREE.Mesh(boxGeomety, holdBackMat);
        scene.add(cube);
        cube.position.x = -9.5;
        cube.position.y = -0.4;
        cube.position.z = 3.3;

        cube.rotation.y = fov/120

    }, undefined, function ( error ) {
        console.error( error );
    } );

    let myInterval = setInterval(() => {
        clearInterval(myInterval);
        return;
        holdText = scene.getObjectByName( "holdText" );
        if(holdText != undefined){
            clearInterval(myInterval);
        }
    }, 100);
   
    */
    updateScore();
    clock.start(); //starts the clock which is used for the chunks moving down
    zenClock.start();
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
        score = 0;
        updateScore();
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
        checkForFinishedLines();
        addBoard();
        resetBox();
    }
    else if(e.keyCode == keyShift){
        //holdMat.opacity = 0.7;
        //holdBackMat.opacity =0.2;
        if(myHold != undefined){
            scene.remove(myHold.group);
        }
        myHold = new MovingBox(myBox.type, myBoard.boardArray);
        myHold.type = myBox.type
        if(myBox.type == 0){
            myHold.offsetPosition.x = -8;
            myHold.offsetPosition.y = -9.5;
            myHold.offsetPosition.z = 2;
        }
        else if(myBox.type ==3){
            myHold.offsetPosition.x = -8.5;
            myHold.offsetPosition.y = -10.5;
            myHold.offsetPosition.z = 2;
        }
        else{
            myHold.offsetPosition.x = -7.5;
            myHold.offsetPosition.y = -10;
            myHold.offsetPosition.z = 2;
        }
        
        myHold.offsetRotation.y = fov/120;
        for(let i = 0 ; i < myHold.size; i++){
            for(let j = 0; j < myHold.size; j++){
                
                myHold.updateRectPos();
                
            } 
        }
        //TODO add shift
        //scene.add(myHold.group);
    }
    

},true);    
window.addEventListener('keyup',function(e){
    keyState[e.keyCode].setPressed(false);
    
},true);



function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
    if(clock.getElapsedTime() > currentSpeed){
        clock.stop();
        clock.start();
        moveDown();
        if(state != 4){ //move blocks randomly when in menu
            let randNum = Math.floor(Math.random() * 5)
            let randNumAmount = Math.floor(Math.random() * 4) +1//more numbers are generated than tested so that it sometimes doesnt move
            for(let i = 0; i < randNumAmount; i++){
                if(randNum == 0){
                    if (myBox.isCollidingX(myBoard.boardArray, 1).x == 0) {
                        myBox.moveX(-1, myBoard.boardArray);
                    }
                }
                else if(randNum == 1){
                    if (myBox.isCollidingX(myBoard.boardArray, 1).y == 0) {
                        myBox.moveX(1, myBoard.boardArray);
                    }
                }
            }
            
            if(randNum == 2 ){
                myBox.rotate(0, myBoard.boardArray);
            }
            
        }

        
    }

    if(zenClock.getElapsedTime() > 2){
        zenClock.stop();
        zenClock.start();
        if(gameMode == 1){
            currentSpeed -= zenSpeedUp/70000;
        }
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
        if(state == 4){
            handleState(5);
        }
        
       
    }
    if(myBoard.isLineFinished()){ 
        removeBoard();
    }
    checkForFinishedLines();
    addBoard();
    resetBox();
}

function checkForFinishedLines(){
    while(myBoard.checkFinishedLines()){
        score = score + 1000;
        updateScore();
        if(gameMode == 0 && state == 4 && score >= 40000){
            handleState(5);
        }
    }
}







main(); 
animate(); //starts main loop

