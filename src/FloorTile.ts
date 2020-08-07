import {WorldObject, WorldObjectTypes} from "./WorldObject";

export default class FloorTile extends WorldObject {
    constructor(texName: string ) {
        super(WorldObjectTypes.FLOOR_TILE, texName);

    }

    static getRandomObj(): FloorTile {
        return new FloorTile('floor_tile_' + Math.floor(Math.random() * 3));
    }
}