import {WorldObject, WorldObjectTypes} from "./WorldObject";

export default class Cloud extends WorldObject {
    constructor(texName: string, speedOffset: number) {
        super(WorldObjectTypes.CLOUD, texName);
        this.speedOffset = speedOffset;
    }

    static getRandomObj(): Cloud {
        return new Cloud('cloud', Math.random() * 0.5);
    }
}