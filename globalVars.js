
const defaultFov = 75;


let rotateBackground = false; 
let controls = undefined;   //Orbitcontrols 
let state = 0;
let score = 23; //the number displayed in the top of the screen
let gameMode = 0; //0 == Zen 1 == 40 Lines
let zenSpeedUp = 100;
let fov = loadFromSave("fov", defaultFov);
let gameClock = undefined;
//curvestuff
let curveAmountX = 10;
let curveAmountY = 7;
let scaleAmountX = 10;
let scaleAmountY = 5;
let isCurved = true;


//threejs stuff
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth/ window.innerHeight, 0.1, 1000);




function loadFromSave(what, defaultNumber){
    if(localStorage.getItem(what) != undefined ){
        console.log(localStorage.getItem(what));
        return parseFloat(localStorage.getItem(what));
    }
    else{
        return defaultNumber;
    }
}