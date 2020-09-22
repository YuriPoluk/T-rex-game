import {WorldObject, WorldObjectTypes} from "./WorldObject";
import {CollisionBox, CollisionBoxes} from "./CollisionBoxes";
import * as utils from "./Utils";


export default class Obstacle extends WorldObject {
    collisionBoxes: {[key: string]: CollisionBox[]} = {};
    speedOffset: number;

    constructor(frames: string | string[]) {
        super(WorldObjectTypes.OBSTACLE, frames);

        if(typeof frames == 'string')
            this.collisionBoxes[frames] = CollisionBoxes[frames];
        else {
            for(const frame of frames) {
                this.collisionBoxes[frame] = CollisionBoxes[frame];
            }
        }

        this.speedOffset = this.getSubtype() == 'bird' ? utils.randomFloat(0.01, 0.03) : 0;
    }

    static getRandomObj(cactusOnly?: boolean): Obstacle {
        const obstacles = [
            ['bird_1', 'bird_2'],
            'cactus_0',
            'cactus_1',
            'cactus_2',
            'cactus_3',
            'cactus_4',
        ];
        const offset = cactusOnly ? 1 : 0;
        const frames = obstacles[Math.floor(offset + Math.random() * (obstacles.length - offset))];
        return new Obstacle(frames);
    }

    getSubtype(): string {
        return this.framesList[0].split('_')[0];
    }

    getCurrCollBoxes(): CollisionBox[] {
        return this.collisionBoxes[this.getCurrFrame()]
    }
}