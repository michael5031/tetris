import { Box, Color, Point, someVars } from "./usefulStuff.js";

export default class Board {
    constructor(){
        //creates array and changes size
        this.boardArray = new Array(20);
        for (let i = 0; i < this.boardArray.length; i++) {
            this.boardArray[i] = new Array(10);
        }
        //sets the type
        for(let i = 0; i < this.boardArray.length; i++){
            for(let j = 0; j < this.boardArray[0].length; j++){
                this.boardArray[i][j] = new Box();
            }
        }
        this.updatePos();

    }

    updatePos(){
        for(let i = 0; i < this.boardArray.length; i++){
            for(let j = 0; j < this.boardArray[0].length; j++){
                if(isCurved == false){
                    this.boardArray[i][j].rectMesh.position.x = j * someVars.size - someVars.offsetX;
                }
                else{
                    this.boardArray[i][j].rectMesh.position.x = Math.cos((j * someVars.size - someVars.offsetX)/curveAmountX + 4.7 ) * scaleAmountX;
                    this.boardArray[i][j].rectMesh.position.z = Math.sin((j* someVars.size - someVars.offsetX)/curveAmountY + 4.7) * scaleAmountY + 5;
                }
                
                this.boardArray[i][j].rectMesh.position.y = i * -someVars.size + someVars.offsetY;
                
                if(this.boardArray[i][j].full){
                    this.boardArray[i][j].rectMesh.scale.x = someVars.size;
                    this.boardArray[i][j].rectMesh.scale.y = someVars.size;
                    this.boardArray[i][j].rectMesh.scale.z = someVars.size;
                }
                else{
                    this.boardArray[i][j].rectMesh.scale.x = someVars.size-someVars.gap;
                    this.boardArray[i][j].rectMesh.scale.y = someVars.size-someVars.gap;
                    this.boardArray[i][j].rectMesh.scale.z = someVars.size-someVars.gap;
                }
            }
        }
    }
    //returns true if it goes above the screen lol
    placeBlock(boxToPlace){
        for(let i = 0; i < boxToPlace.size; i++){
            for(let j = 0; j < boxToPlace.size; j++){
                if(boxToPlace.boxArray[i][j].full == true){
                    if(boxToPlace.position.y <=0){
                        return true;
                    }
                    this.boardArray[i+ boxToPlace.position.y][j + boxToPlace.position.x].setFull(true);
                    this.boardArray[i+ boxToPlace.position.y][j + boxToPlace.position.x].color = boxToPlace.boxArray[i][j].color;
                    this.boardArray[i+ boxToPlace.position.y][j + boxToPlace.position.x].update();
                    this.updatePos();
                }   
            }
        }
        return false;
    }

    isLineFinished(){
        for(let j = 0; j < this.boardArray.length; j++){
            let foundHole = false;
            for(let i = 0; i < this.boardArray[0].length; i++){
                if(!this.boardArray[j][i].full){
                    foundHole = true;
                }
            }
            if(!foundHole){
                return true;
            }
        }
        return false;
    }

    checkFinishedLines(){
        let foundAtLine = -1;
        for(let j = 0; j < this.boardArray.length; j++){
            let foundHole = false;
            for(let i = 0; i < this.boardArray[0].length; i++){
                if(!this.boardArray[j][i].full){
                    foundHole = true;
                }
            }
            if(!foundHole){
                foundAtLine = j;
                break;
            }
        }
        if(foundAtLine == -1){
            return false;
        }
        for(let i = 0; i < this.boardArray[0].length; i++){
            this.boardArray[foundAtLine][i].setFull(false);
            this.boardArray[foundAtLine][i].update();
        }

        //creates array and changes size
        let temp1 = new Array(20);
        for (let i = 0; i < temp1.length; i++) {
            temp1[i] = new Array(10);
        }
        //sets the type
        for(let i = 0; i < temp1.length; i++){
            for(let j = 0; j < temp1[0].length; j++){
                temp1[i][j] = new Box();
            }
        }


        for(let i = 1; i < this.boardArray.length - (this.boardArray.length - (foundAtLine + 1)); i++){
            for(let j = 0; j < this.boardArray[0].length; j++){
                temp1[i][j] = this.boardArray[i-1][j];
            }
        }

        for(let i = foundAtLine+1; i < this.boardArray.length; i++){
            for(let j = 0; j < this.boardArray[0].length; j++){
                temp1[i][j] = this.boardArray[i][j];
            }
        }

        this.boardArray = temp1;
        for(let i = 0; i < this.boardArray.length; i++){
            for(let j = 0; j < this.boardArray[0].length; j++){
                this.boardArray[i][j].update();
            }
        }
        this.updatePos();
        return true;


    }

}