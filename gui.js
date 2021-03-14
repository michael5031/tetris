let titleDiv = document.getElementById("titleDiv");
let scoreDiv = document.getElementById("score");
let playDiv = document.getElementById("playDiv");
let settingsDiv = document.getElementById("setDiv");
let controlsDiv = document.getElementById("controlsDiv");
let deathDiv = document.getElementById("deathDiv");
import {resetRound} from "./main.js"
export function guiInit(){
    //state 0 == Title Screen
    //state 1 == Play Menu
    //state 2 == Settings Menu
    //state 3 == Controls Menu
    //state 4 == playing
    //state 5 == dead
    state = 0;
    handleState(state);




    //Buttons
    //Play
    document.querySelector("#titleDiv > button:nth-of-type(1)").addEventListener("click",() =>{
        handleState(1);    
    })
    //Play Back Button
    document.querySelector("#playDiv > div:nth-of-type(1) > button").addEventListener("click",() =>{
        handleState(0);    
    })

    document.querySelector("#playDiv > button:nth-of-type(1)").addEventListener("click",() =>{
        gameMode = 0;
        handleState(4); 
        
    })
    document.querySelector("#playDiv > button:nth-of-type(2)").addEventListener("click",() =>{
        gameMode = 1;
        handleState(4); 
        
    })

    //Settings
    document.querySelector("#titleDiv > button:nth-of-type(2)").addEventListener("click",() =>{
        handleState(2);    
    })
    //Settings Back Button
    document.querySelector("#setDiv > div:nth-of-type(1) > button").addEventListener("click",() =>{
        handleState(0);    
    })


    //Controls
    document.querySelector("#titleDiv > button:nth-of-type(3)").addEventListener("click",() =>{
        handleState(3);    
    })
    //Controls Back Button
    document.querySelector("#controlsDiv > div:nth-of-type(1) > button").addEventListener("click",() =>{
        handleState(0);    
    })



    //Death
    //Death Play Again
    document.querySelector("#deathDiv > div:nth-of-type(2) > button:nth-of-type(1)").addEventListener("click",() =>{
        handleState(4);    
    })

    //Death Return to Monke
    document.querySelector("#deathDiv > div:nth-of-type(2) > button:nth-of-type(2)").addEventListener("click",() =>{
        handleState(0);    
    })

}



export function handleState(state1){
    state = state1;
    scoreChange(false);
    if(state === 0){
        rotateBackground = true;
        titleChange(true);
        
    }
    else{
        
        titleChange(false);
        
    }
    
    if(state === 1){
        playChange(true);
    }
    else{
        playChange(false);
    }
    if(state === 2){
        settingsChange(true);
    }
    else{
        settingsChange(false);
    }
    if(state === 3){
        controlsChange(true);
    }
    else{
        controlsChange(false);
    }
    if(state === 5){
        deathChange(true);
        if(gameClock != undefined && gameClock.running === true){
            gameClock.stop();


        }
    }
    else{
        deathChange(false);
    }
    if(state === 4){
        if(gameClock == undefined){
            gameClock = new THREE.Clock();
            
        }
        if(gameClock.running == false){
            gameClock.start();

        }
        scoreChange(true);
        rotateBackground = false;
        resetRound();
    }
    else{
        
    }
    controls.autoRotate = rotateBackground;
    controls.autoRotateSpeed = 1.0;
}



function scoreChange(which){
    if(which === true){
        scoreDiv.style.color = "#ffffffAA";
        return;
    }
    scoreDiv.style.color = "#ffffff00";
    
}

function titleChange(which){
    const applyAnimation = ( stringToApply) =>{
        document.querySelector(stringToApply).classList.add("appear");
        document.querySelector(stringToApply).style.opacity = "100%";
    }
    if(which === true){
        titleDiv.style.display = "flex";

        document.querySelector("#titleDiv > button:nth-of-type(1)").style.opacity="0%";
        document.querySelector("#titleDiv > button:nth-of-type(2)").style.opacity="0%";
        document.querySelector("#titleDiv > button:nth-of-type(3)").style.opacity="0%";
        document.querySelector("#titleDiv > span").style.opacity="0%";
        setTimeout(() => applyAnimation("#titleDiv > span"), 100);
        setTimeout(() => applyAnimation("#titleDiv > button:nth-of-type(1)"), 300);
        setTimeout(() => applyAnimation("#titleDiv > button:nth-of-type(2)"), 400);
        setTimeout(() => applyAnimation("#titleDiv > button:nth-of-type(3)"), 500);
        setTimeout(() => {
        document.querySelector("#titleDiv > span").style.display=""; document.querySelector("#titleDiv > span").classList.remove("appear");
        document.querySelector("#titleDiv > button:nth-of-type(1)").style.display=""; document.querySelector("#titleDiv > button:nth-of-type(1)").classList.remove("appear");
        document.querySelector("#titleDiv > button:nth-of-type(2)").style.display=""; document.querySelector("#titleDiv > button:nth-of-type(2)").classList.remove("appear");
        document.querySelector("#titleDiv > button:nth-of-type(3)").style.display=""; document.querySelector("#titleDiv > button:nth-of-type(3)").classList.remove("appear");}, 2000);
        return;
    }
    titleDiv.style.display = "none";
    
}

function playChange(which){
    if(which === true){
        playDiv.style.display = "flex";
        playDiv.classList.add("appear");
        return;
    }
    playDiv.style.display = "none";
}


function settingsChange(which){
    if(which === true){
        settingsDiv.style.display = "flex";
        settingsDiv.classList.add("appear");
        return;
    }
    settingsDiv.style.display = "none";
}

function controlsChange(which){
    if(which === true){
        controlsDiv.style.display = "flex";
        controlsDiv.classList.add("appear");
        return;
    }
    controlsDiv.style.display = "none";
}


function deathChange(which){
    if(which === true){
        document.querySelector("#deathDiv > div:nth-of-type(1) > div:nth-of-type(1) > span:nth-of-type(1)").innerHTML = `Score: ${score}`;
        document.querySelector("#deathDiv > div:nth-of-type(1) > div:nth-of-type(2) > span:nth-of-type(1)").innerHTML = `Time: ${new Date(1000 * gameClock.getElapsedTime()).toISOString().substr(14, 5)}`;
        if(gameMode == 0 && score >= 40000){
            document.querySelector("#deathDiv").style.backgroundColor = "#33DD22BF";
            document.querySelector("#deathDiv > p").innerHTML = "You Won";
        }
        else{
            document.querySelector("#deathDiv").style.backgroundColor = "#D75059BF";
            document.querySelector("#deathDiv > p").innerHTML = "You Lost";
        }
        
        
        deathDiv.style.display = "flex";
        deathDiv.classList.add("appear");
        return;
    }
    deathDiv.style.display = "none";
}


