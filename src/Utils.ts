import {CollisionBox} from "./CollisionBoxes";
import Sprite from "./libs/Sprite";


export const adjustCollisionBox = (obj: {x: number, y: number}, view: Sprite, box: CollisionBox): CollisionBox => {
    const adjustedCollisionBox = Object.assign({}, box);
    adjustedCollisionBox.x = obj.x - view.width * view.anchor.x + adjustedCollisionBox.x;
    adjustedCollisionBox.y = obj.y - view.height * view.anchor.y + adjustedCollisionBox.y;

    return adjustedCollisionBox;
}

export const AABBOverlap = (boxA: CollisionBox, boxB: CollisionBox): boolean => {
    return ( Math.abs(boxA.x - boxB.x) < (boxA.width + boxB.width)*0.5 &&
        Math.abs(boxA.y - boxB.y) < (boxA.height + boxB.height)*0.5);
}

export const randomFloat = (min: number, max: number): number => {
    return min + (max - min) * Math.random();
}