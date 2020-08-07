import {WorldObject, WorldObjectTypes} from "./WorldObject";
import {Dino, DinoStates} from "./Dino";
import {CollisionBox} from "./CollisionBoxes";
import * as Utils from "./Utils";
import sound from 'pixi-sound';
import Sprite from "./libs/Sprite";
import GameController from "./GameController";

export default class GameWorld extends PIXI.Container {
    floorTiles: WorldObject[] = []
    skyObjects: WorldObject[] = [];
    obstacles: WorldObject[] = [];
    allObjectsArrays: WorldObject[][] = [];
    objectsToSpawn: { type: WorldObjectTypes, spawnIn: number }[] = [];
    score = 0;
    scoreFloored = 0;
    lastScoreUp = 0;

    TILE_WIDTH = 200;
    FLOOR_TILES_QUANTITY = 8;
    HEIGHT = 160;
    WIDTH = this.FLOOR_TILES_QUANTITY * this.TILE_WIDTH;
    PLAYER_MOVE_SPEED = 0.3;
    SKY_OBJ_BASE_SPEED = 0.15;

    GRAV_ACCEL = 1.5;

    IS_TOUCH_ENABLED = ('ontouchstart' in window);

    isJumpKeyPressed = false;
    isCrouchKeyPressed = false;

    isGameOver = false;
    isPlayerLocked = false;
    isMaxJumpHeightReached = false;
    isMinJumpHeightReached = false;
    FLOOR_Y!: number;
    JUMP_HEIGHT = {
        max: 50
    };

    worldCnt = this.addChild(new PIXI.Container());
    playerCnt = this.addChild(new PIXI.Container());
    dino!: Dino;

    constructor() {
        super();
        this.allObjectsArrays = [this.floorTiles, this.skyObjects, this.obstacles];
        this.initWorld();
        this.initControls();
    }

    initControls() {
        if(this.IS_TOUCH_ENABLED) {
            const eventDown = new KeyboardEvent('keydown', { key: ' ' });
            const eventUp = new KeyboardEvent('keyup', { key: ' ' });
            document.addEventListener('pointerdown', ()=>{ this.handleControls(eventDown) });
            document.addEventListener('pointerup', ()=>{ this.handleControls(eventUp) });
        }
        else {
            document.addEventListener('keydown', this.handleControls.bind(this));
            document.addEventListener('keyup', this.handleControls.bind(this));
        }
    }

    handleControls(kbEvent: KeyboardEvent) {
        const type = kbEvent.type;
        const input = kbEvent.key;


        if(input == ' ') {
            this.isJumpKeyPressed = type == 'keydown';
        }
        if(input == 'Control') {
            this.isCrouchKeyPressed = type == 'keydown';
        }

        switch(this.dino.state) {
            case DinoStates.RUN:
                if(input == ' ') {
                    if(type == 'keydown') {
                        this.dino.jump();
                    }
                }
                else if(input == 'Control') {
                    if(type == 'keydown') {
                        this.dino.crouch();
                    }
                }
                break;
            case DinoStates.CROUCH:
                if(input == ' ') {
                    if(type == 'keydown') {
                        this.dino.run();
                    }
                }
                else if(input == 'Control') {
                    if(type == 'keyup') {
                        this.dino.run();
                    }
                }
                break;
            case DinoStates.CRASH:
                break;
        }
    }

    initWorld(): void {
        for(let i = 0; i < this.FLOOR_TILES_QUANTITY; i++) {
            this.spawnWorldObject(WorldObjectTypes.FLOOR);
        }
        this.spawnWorldObject(WorldObjectTypes.OBSTACLE);
        this.spawnWorldObject(WorldObjectTypes.SKY_OBJECT);


        this.dino = this.playerCnt.addChild(new Dino());
        this.dino.position.set(100, this.HEIGHT - 2);
        this.FLOOR_Y = this.dino.y;
    }

    spawnWorldObject(type: WorldObjectTypes): void {
        const worldObj = this.worldCnt.addChild(WorldObject.getRandomObj(type));
        if(type == WorldObjectTypes.FLOOR) {

            const lastTilePosX = this.floorTiles.length > 0 ? this.floorTiles[this.floorTiles.length - 1].x : -this.TILE_WIDTH/2;

            worldObj.position.set(lastTilePosX + worldObj.view.width, this.HEIGHT - worldObj.view.height/2);
            this.floorTiles.push(worldObj);
        }
        else if(type == WorldObjectTypes.SKY_OBJECT) {
            worldObj.position.set(this.WIDTH + worldObj.view.width, this.HEIGHT * 0.1);
            worldObj.speed = this.SKY_OBJ_BASE_SPEED * (1 + Math.random());
            this.skyObjects.push(worldObj);
        }
        else if(type == WorldObjectTypes.OBSTACLE) {
            worldObj.position.set(this.WIDTH + worldObj.view.width, this.HEIGHT - worldObj.view.height/2);
            this.obstacles.push(worldObj);
        }
    }

    destroyGarbageObjects(): void {
        let garbageObjects: WorldObject[] = [];
        for(let i = 0; i < this.allObjectsArrays.length; i++) {
            garbageObjects = [...garbageObjects, ...this.allObjectsArrays[i].filter(e => e.isGarbage)];
            this.allObjectsArrays[i] = this.allObjectsArrays[i].filter(e => !e.isGarbage);

        }

        [ this.floorTiles, this.skyObjects, this.obstacles ] = this.allObjectsArrays;

        for(const obj of garbageObjects) {
            obj.parent.removeChild(obj);
            if(obj.type == WorldObjectTypes.FLOOR) {
                this.spawnWorldObject(WorldObjectTypes.FLOOR)
            }
            else {
                this.queueWorldObject(obj.type);
            }
        }
    }

    queueWorldObject(type: WorldObjectTypes): void {
        if(type == WorldObjectTypes.SKY_OBJECT) {
            this.objectsToSpawn.push({
                type: type,
                spawnIn: Math.random() * 3000,
            });
        }
        else if(type == WorldObjectTypes.OBSTACLE) {
            this.objectsToSpawn.push({
                type: type,
                spawnIn: Math.random() * 1000,
            });
        }
    }

    spawnQueuedObjects(delta: number): void {
        for (const obj of this.objectsToSpawn) {
            obj.spawnIn -= delta;
            if(obj.spawnIn <= 0) {
                this.spawnWorldObject(obj.type)
            }
        }

        let arrCleared = !this.objectsToSpawn.length;
        while (!arrCleared) {
            for(let i = 0; i < this.objectsToSpawn.length; i++) {
                if(i == this.objectsToSpawn.length - 1)
                    arrCleared = true;
                if(this.objectsToSpawn[i].spawnIn <= 0) {
                    this.objectsToSpawn.splice(i, 1);
                    break;
                }
            }
        }
    }

    moveWorldObjects(delta: number): void {
        for(const arr of this.allObjectsArrays) {
            for(const gameObj of arr) {
                const speed = gameObj.type === WorldObjectTypes.SKY_OBJECT && gameObj['speed'] ? gameObj.speed : this.PLAYER_MOVE_SPEED;
                gameObj.x -= speed * delta;
                if(gameObj.x < -gameObj.view.width/2) {
                    gameObj.isGarbage = true;
                }
            }
        }
    }

    controls(): void {
        if(this.dino.speedY != null) {
            console.log(this.dino.y, this.JUMP_HEIGHT.max, this.dino.speedY)
            if(this.isJumpKeyPressed && this.dino.y > this.JUMP_HEIGHT.max && this.dino.speedY < 0) {
                this.dino.speedY -= this.GRAV_ACCEL;
            }
            else if(this.isCrouchKeyPressed) {
                this.dino.speedY += this.GRAV_ACCEL*0.5  ;
            }

            this.dino.y += this.dino.speedY;
            this.dino.speedY += this.GRAV_ACCEL;
            if(this.dino.y >= this.FLOOR_Y) {
                this.dino.y = this.FLOOR_Y;
                this.dino.run();
            }
        }
    }

    checkCollisions(): void {
        for(const obstacle of this.obstacles) {
            //primary AABB collision check
            const dinoMainBox = Utils.adjustCollisionBox(this.dino, this.dino.viewRun, {x: 0, y: 0, width: this.dino.viewRun.width, height: this.dino.viewRun.height});
            const obstacleMainBox = Utils.adjustCollisionBox(obstacle, obstacle.view, {x: 0, y: 0, width: obstacle.view.width, height: obstacle.view.height});
            if(Utils.AABBOverlap(dinoMainBox, obstacleMainBox)) {
                let dinoColBoxes: CollisionBox[];
                if(this.dino.state == DinoStates.CROUCH) {
                    dinoColBoxes = [{
                        x: 0,
                        y: 0,
                        width: this.dino.currentView.width,
                        height: this.dino.currentView.height
                    }];
                }
                else {
                    dinoColBoxes = this.dino.collisionBoxes;
                }

                for(const dinoColBox of dinoColBoxes) {
                    let adjustedDinoColBox = Utils.adjustCollisionBox(this.dino, this.dino.viewRun, dinoColBox);

                    //@ts-ignore
                    for(const obsColBox of obstacle.collisionBoxes) {
                        let adjustedObsColBox = Utils.adjustCollisionBox(obstacle, obstacle.view, obsColBox);
                        if(Utils.AABBOverlap(adjustedDinoColBox, adjustedObsColBox)) {
                            this.onGameOver();
                            return;
                        }
                    }
                }
            }
        }
    }

    updateScore(delta: number) {
        this.score += delta/100;
        this.scoreFloored = Math.floor(this.score);
        const scoreUp = Math.floor(this.score/100);
        if(scoreUp > 0 && scoreUp > this.lastScoreUp) {
            this.lastScoreUp = scoreUp;
            sound.play('score_up');
        }
    }

    onGameOver(): void {
        this.dino.crash();
        this.isGameOver = true;
        this.emit('game_over');
    }

    tick(delta: number): void {

        if(this.isGameOver) return;

        this.controls();

        this.moveWorldObjects(delta);
        this.destroyGarbageObjects();
        this.spawnQueuedObjects(delta);
        this.checkCollisions();
        this.updateScore(delta);
    }

}
