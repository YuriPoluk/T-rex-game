import Sprite from './libs/Sprite'

export enum WorldObjectTypes {
    FLOOR_TILE,
    CLOUD,
    OBSTACLE
}

export abstract class WorldObject extends Sprite {
    type: WorldObjectTypes;
    view: Sprite | PIXI.AnimatedSprite;
    isGarbage = false;
    speedOffset: number;
    currFrame!: string;
    framesList: string[] = [];

    constructor(type: WorldObjectTypes, frames: string | string[], speedOffset = 0) {
        super();
        this.type = type;
        this.speedOffset = speedOffset;
        if (typeof frames === 'string') {
            this.view = this.addChild(new Sprite(frames));
            this.framesList = [frames];
        } else {
            this.view = this.addChild(PIXI.AnimatedSprite.fromFrames(frames));
            if (this.view instanceof PIXI.AnimatedSprite) {
                this.view.play();
                this.view.animationSpeed = frames.length / 24;
                this.framesList = frames;
            }
        }
    }

    getCurrFrame(): string {
        if(this.view instanceof PIXI.AnimatedSprite) {
            return this.framesList[this.view.currentFrame];
        }
        else {
            return this.framesList[0];
        }
    }
}



