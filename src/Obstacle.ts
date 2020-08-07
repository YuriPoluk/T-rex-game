import {WorldObject, WorldObjectTypes} from "./WorldObject";
import {CollisionBox, CollisionBoxes} from "./CollisionBoxes";

export default class Obstacle extends WorldObject {
    collisionBoxes: {[key: string]: CollisionBox[]} = {};
    constructor(frames: string | string[]) {
        super(WorldObjectTypes.OBSTACLE, frames);

            if(typeof frames == 'string')
                this.collisionBoxes[frames] = CollisionBoxes[frames];
            else
                for(const frame of frames) {
                    this.collisionBoxes[frame] = CollisionBoxes[frame];
                }
    }

    static getRandomObj(): Obstacle {
        const obstacles = [
            ['bird_1', 'bird_2'],
            'cactus_0',
            'cactus_1',
            'cactus_2',
            'cactus_3',
            'cactus_4',
        ];
        const frames = obstacles[Math.floor(Math.random() * obstacles.length)]
        return new Obstacle(frames);
    }

    getCurrCollBoxes(): CollisionBox[] {
        return this.collisionBoxes[this.getCurrFrame()]
    }
}