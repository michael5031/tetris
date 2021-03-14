import { Vector3 } from "./lib/three.module.js";
import { Box, Color, Point, Point3, someVars } from "./usefulStuff.js";

const types = ["0000111100000000", "100111000", "001111000", "1111", "011110000", "010111000", "110011000"];

export default class MovingBox{
    constructor(newType, board){
        //Type Int(only stores which)
        this.type = newType;
        //BoxArray
        this.boxArray = new Array(4);
        //sets size
        for (let i = 0; i < this.boxArray.length; i++) {
            this.boxArray[i] = new Array(4);
        }

        //GhostArray
        this.ghostArray = new Array(4);
        //sets size
        for (let i = 0; i < this.ghostArray.length; i++) {
            this.ghostArray[i] = new Array(4);
        }

        //size
        this.size = Math.sqrt(types[this.type].length);

        //sets position
        this.position = new Point(Math.floor(10/2-this.size/2),0);

        //offsetPosition
        this.offsetPosition = new Point3(0,0,0);

        //offsetRotation
        this.offsetRotation = new Point3(0,0,0);


        //group
        this.group = new THREE.Group();

        //sets lowest position gets updated every moveX
        this.ghostPosition = new Point(0,0);

        //sets type
        for(let i = 0; i < this.size; i++ ){
            for(let j = 0; j < this.size; j++ ){
                this.boxArray[i][j] = new Box();
                this.ghostArray[i][j] = new Box();
                let isFull = false;
                if(types[this.type][j*this.size+i] == '1'){ 
                    isFull = true;
                }
                this.boxArray[i][j].setFull(isFull);
                this.ghostArray[i][j].setFull(isFull);
                this.group.add(this.boxArray[i][j].rectMesh);
                if(isFull){
                    switch(this.type){ //checks type and changes color
                        case 0:
                            this.boxArray[i][j].color = new Color(76,214,164);
                        break;
                        case 1:
                            this.boxArray[i][j].color = new Color(105, 87, 195);
                        break;
                        case 2:
                            this.boxArray[i][j].color = new Color(219,129,74);
                        break;
                        case 3:
                            this.boxArray[i][j].color = new Color(215,192,74);
                        break;
                        case 4:
                            this.boxArray[i][j].color = new Color(163,217,73);
                        break;
                        case 5:
                            this.boxArray[i][j].color = new Color(198,87,186);
                        break;
                        case 6:
                            this.boxArray[i][j].color = new Color(223, 75, 83);
                        break;
                    }
                    this.ghostArray[i][j].color = new  Color(55,55,55);
                    this.ghostArray[i][j].update();
                    this.boxArray[i][j].update(); //applies color to the texture
                }
            }   
        }   

        
        //current Rotation
        this.curRotation = 0;


        this.calculateGhostPos(board);
    }


    calculateGhostPos = (board) =>{
        let checkamount = 0;
        while(this.isCollidingAt(board, checkamount) == 0){
            checkamount++;
        }
        this.ghostPosition.x = this.position.x;
        this.ghostPosition.y = checkamount-1; 
        this.updateRectPos();
    }

    updateRectPos = () =>{
        this.group.rotation.x = this.offsetRotation.x;
        this.group.rotation.y = this.offsetRotation.y;
        this.group.rotation.z = this.offsetRotation.z;
        this.group.position.x = this.offsetPosition.x;
        this.group.position.y = this.offsetPosition.y;
        this.group.position.z = this.offsetPosition.z;

                    
        for(let i = 0; i < this.size; i++){
            for(let j = 0 ; j < this.size; j++){
                if(this.boxArray[i][j].full){
                    this.boxArray[i][j].rectMesh.scale.x = someVars.size;
                    this.boxArray[i][j].rectMesh.scale.y = someVars.size;
                    this.boxArray[i][j].rectMesh.scale.z = someVars.size;
                    this.boxArray[i][j].rectMesh.position.x = (j + this.position.x ) * someVars.size - someVars.offsetX ;
                    this.boxArray[i][j].rectMesh.position.y = (i + this.position.y) * -someVars.size + someVars.offsetY ;
                    this.boxArray[i][j].rectMesh.position.z = this.offsetPosition.z;

                    


                    this.ghostArray[i][j].rectMesh.scale.x = someVars.size-0.01;
                    this.ghostArray[i][j].rectMesh.scale.y = someVars.size-0.01;
                    this.ghostArray[i][j].rectMesh.scale.z = someVars.size-0.01;
                    


                    this.ghostArray[i][j].rectMesh.position.x = (j + this.ghostPosition.x) * someVars.size - someVars.offsetX;
                    this.ghostArray[i][j].rectMesh.position.y = (i + this.ghostPosition.y) * -someVars.size + someVars.offsetY;
                }
                else{
                    this.boxArray[i][j].rectMesh.scale.x = 0;
                    this.boxArray[i][j].rectMesh.scale.y = 0;
                    this.boxArray[i][j].rectMesh.scale.z = 0;


                    this.ghostArray[i][j].rectMesh.scale.x = 0;
                    this.ghostArray[i][j].rectMesh.scale.y = 0;
                    this.ghostArray[i][j].rectMesh.scale.z = 0;
                }
            }
        }
        
    }

    rotate = (direction, board) =>{
        let temp = new Array(4);
        for (let i = 0; i < temp.length; i++) {
            temp[i] = new Array(4);
        }
        //sets the type
        for(let i = 0; i < temp.length; i++){
            for(let j = 0; j < temp[0].length; j++){
                temp[i][j] = new Box();
            }
        }


        let ghostTemp = new Array(4);
        for (let i = 0; i < ghostTemp.length; i++) {
            ghostTemp[i] = new Array(4);
        }
        //sets the type
        for(let i = 0; i < ghostTemp.length; i++){
            for(let j = 0; j < ghostTemp[0].length; j++){
                ghostTemp[i][j] = new Box();
            }
        }



        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                if(this.boxArray[i][j] != false){
                    let newX;
                    let newY;
                    if(direction == true){
                        newX = 1 - (j - (this.size - 2));
                        newY = i;
                    }
                    else{
                        newX = j;
                        newY = -(i - 1 - (this.size - 2));
                    }
                    temp[newX][newY] = this.boxArray[i][j];
                    ghostTemp[newX][newY] = this.ghostArray[i][j];
                }
            }
        }

        this.colCheck = (first, second) =>{
            return !this.isColliding(board, temp, new Point(first, second));
        }
        this.colApply = (first, second) =>{
            this.boxArray = temp;
            this.ghostArray = ghostTemp;
            this.position.x += first;
            this.position.y += second;
            this.curRotation++;
            if(this.curRotation >= 4){
                this.curRotation = 0;
            }

        }

        if(!this.isColliding(board, temp, new Point(0,0))){
            this.boxArray = temp;
            this.ghostArray = ghostTemp;
            this.curRotation++;
            if(this.curRotation >= 4){
                this.curRotation = 0;
            }
        }
        else if(this.type == 0){
            if(this.curRotation == 0){
                if(this.colCheck( -2, 0)){
                    this.colApply(-2, 0);
                }
                else if(this.colCheck(1, 0)){
                    this.colApply(1, 0);
                }
                else if(this.colCheck(-2, -1)){
                    this.colApply(-2, -1);
                }
                else if(this.colCheck(1, 2)){
                    this.colApply(1, 2);
                }
            }
            else if(this.curRotation == 1){
                if(this.colCheck( -1, 0)){
                    this.colApply(-1, 0);
                }
                else if(this.colCheck(2, 0)){
                    this.colApply(2, 0);
                }
                else if(this.colCheck(-1, 2)){
                    this.colApply(-1, 2);
                }
                else if(this.colCheck(2, -1)){
                    this.colApply(2, -1);
                }
            }
            else if(this.curRotation == 2){
                if(this.colCheck( 2, 0)){
                    this.colApply(2, 0);
                }
                else if(this.colCheck(-1, 0)){
                    this.colApply(-1, 0);
                }
                else if(this.colCheck(2, 1)){
                    this.colApply(2, 1);
                }
                else if(this.colCheck(-1, -2)){
                    this.colApply(-1, -2);
                }
            }
            else if(this.curRotation == 3){
                if(this.colCheck( 1, 0)){
                    this.colApply(1, 0);
                }
                else if(this.colCheck(-2, 0)){
                    this.colApply(-2, 0);
                }
                else if(this.colCheck(1, -2)){
                    this.colApply(1, -2);
                }
                else if(this.colCheck(-2, 1)){
                    this.colApply(-2, 1);
                }
            }
        }
        else if( this.type != 3){
            if(this.curRotation == 0){
                if(this.colCheck( -1, 0)){
                    this.colApply(-1, 0);
                }
                else if(this.colCheck(-1, 1)){
                    this.colApply(-1, 1);
                }
                else if(this.colCheck(0, -2)){
                    this.colApply(0, -2);
                }
                else if(this.colCheck(-1, -2)){
                    this.colApply(-1, -2);
                }
            }
            else if(this.curRotation == 1){
                if(this.colCheck( 1, 0)){
                    this.colApply(1, 0);
                }
                else if(this.colCheck(1, -1)){
                    this.colApply(1, -1);
                }
                else if(this.colCheck(0, 2)){
                    this.colApply(0, 2);
                }
                else if(this.colCheck(1, 2)){
                    this.colApply(1, 2);
                }
            }
            else if(this.curRotation == 2){
                if(this.colCheck( 1, 0)){
                    this.colApply(1, 0);
                }
                else if(this.colCheck(1, 1)){
                    this.colApply(1, 1);
                }
                else if(this.colCheck(0, -2)){
                    this.colApply(0, -2);
                }
                else if(this.colCheck(1, -2)){
                    this.colApply(1, -2);
                }
            }
            else if(this.curRotation == 3){
                if(this.colCheck( -1, 0)){
                    this.colApply(-1, 0);
                }
                else if(this.colCheck(-1, 1)){
                    this.colApply(-1, 1);
                }
                else if(this.colCheck(0, 2)){
                    this.colApply(0, 2);
                }
                else if(this.colCheck(-1, 2)){
                    this.colApply(-1, 2);
                }
            }
        }
        this.calculateGhostPos(board);

    }

    

    moveX = (amount, board) =>{
        this.position.x += amount;
        this.calculateGhostPos(board);
    }

    moveY = (amount) =>{
        this.position.y += amount;
        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                //TODO update POSition
                //this.boxArray[i][j].rect.
            }
        }
        this.updateRectPos();
    }


    isCollidingX = (board, already) =>{
        let foundLeft = 0; 
        let foundRight = 0;

        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                if(this.boxArray[j][i].full == true){
                    let lookHereLeft = this.position.x + i - already;
                    let lookHereRight = this.position.x + i + already;

                    if(lookHereRight <= 1){
                        foundLeft = 1;
                    }
                    if(lookHereRight >= board[0].length){
                        foundRight = 1;
                    }

                    if(foundLeft == 0){
                        if(board[j+this.position.y][this.position.x+i+already-2].full){
                            foundLeft = 1;
                        }
                    }

                    if(foundRight == 0){
                        if(board[j+this.position.y][this.position.x+i+already].full){
                            foundRight = 1;
                        }
                    }

                    if(foundRight == 1 && foundLeft == 1){
                        return new Point(1,1);
                    }
                }
            }
        }
        return new Point(foundLeft, foundRight);
    }

    
    isCollidingY = (board, already) =>{
        let foundUp = 0;
        let foundDown = 0;
        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                if(!this.boxArray[j][i].full){continue;}
                let lookHereUp = this.position.y + j - already;
                let lookHereDown = this.position.y + j + already;

                if(lookHereUp < 0){
                    foundUp = 1;
                }

                if(lookHereDown > board.length - 1){
                    foundDown = 1;
                }

                if(lookHereUp >= 0 && lookHereDown <= board.length - 1){
                    if(board[this.position.y + j - already][this.position.x + i].full){
                        foundUp = 1;
                    }
                    if(board[this.position.y + j + already][this.position.x + i].full){
                        foundDown = 1;
                    }
                }
            }
        }
        return new Point(foundUp, foundDown);
    }


    isCollidingAt = (board,offset) =>{
        let foundDown = 0;
        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                if(!this.boxArray[j][i].full){continue;}
                let lookHereDown =  j + offset;
                if(lookHereDown > board.length - 1){
                    foundDown = 1;
                }
                if( lookHereDown <= board.length - 1){
                    if(board[j + offset][this.position.x + i].full){
                        foundDown = 1;
                    }
                }
            }
        }
        return foundDown;
    }


    isColliding = (board, offsetArray, offsetPosition) =>{
        for(let i = 0; i < this.size; i++){
            for(let j = 0; j < this.size; j++){
                if(offsetArray[j][i].full){
                    if(j + this.position.y + offsetPosition.y < 0){
                        return true;
                    }
                    if(j + this.position.y + offsetPosition.y >= board.length){
                        return true;
                    }
                    if(i + this.position.x + offsetPosition.x < 0){
                        return true;
                    }
                    if(i + this.position.x + offsetPosition.x >= board[0].length){
                        return true;
                    }
                    if(board[j + this.position.y + offsetPosition.y][i + this.position.x + offsetPosition.x].full){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
}