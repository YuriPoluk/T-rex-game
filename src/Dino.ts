import Sprite from './libs/Sprite';
import { CollisionBox, CollisionBoxes } from './CollisionBoxes';
import GameController from "./GameController";
import sound from "pixi-sound";

export enum DinoStates {
    RUN,
    JUMP,
    CROUCH,
    CRASH
}

export class Dino extends Sprite {
    viewCrashed: Sprite;
    viewJump: Sprite;
    viewRun: PIXI.AnimatedSprite;
    viewCrouched: PIXI.AnimatedSprite;
    views: (Sprite | PIXI.AnimatedSprite)[];
    state!: DinoStates;
    currentView!: Sprite | PIXI.AnimatedSprite;
    collisionBoxes = CollisionBoxes['dino_run'];
    JUMP_SPEED = -11;
    speedY: null | number = null;

    constructor() {
        super();
        this.viewCrashed = this.addChild(new Sprite('dino_5'));
        this.viewJump = this.addChild(new Sprite('dino_1'));
        let frames = ['dino_2', 'dino_3', 'dino_4']
        this.viewRun = this.addChild(PIXI.AnimatedSprite.fromFrames(frames));
        this.viewRun.onLoop = () => {
            if (Math.random() < 0.1)
                this.viewRun.gotoAndPlay(0);
            else
                this.viewRun.gotoAndPlay(1);
        }

        frames = ['dino_crouched_1', 'dino_crouched_2'];
        this.viewCrouched = this.addChild(PIXI.AnimatedSprite.fromFrames(frames));

        this.viewRun.anchor.set(0.5, 1);
        this.viewCrouched.anchor.set(0.5, 1);
        this.viewCrashed.anchor.set(0.5, 1);
        this.viewJump.anchor.set(0.5, 1);

        this.viewRun.animationSpeed = this.viewCrouched.animationSpeed = 0.25;

        this.views = [this.viewCrashed, this.viewJump, this.viewCrouched, this.viewRun];

        this.run();
    }

    run(): void {
        this.resetViews();
        this.currentView = this.viewRun;
        this.viewRun.visible = true;
        this.viewRun.play();
        this.speedY = null;
        this.state = DinoStates.RUN;
    }

    crouch(): void {
        this.resetViews();
        this.currentView = this.viewCrouched;
        this.viewCrouched.visible = true;
        this.viewCrouched.play();
        this.state = DinoStates.CROUCH;
    }

    jump(): void {
        sound.play('jump');
        this.resetViews();
        this.currentView = this.viewJump;
        this.viewJump.visible = true;
        this.speedY = this.JUMP_SPEED;
        this.state = DinoStates.JUMP;
    }

    crash(): void {
        sound.play('crash');
        this.resetViews();
        this.currentView = this.viewCrashed;
        this.viewCrashed.visible = true;
        this.state = DinoStates.CRASH;
    }

    resetViews(): void {
        for (const view of this.views) {
            view.visible = false;
            if(view instanceof PIXI.AnimatedSprite)
                view.stop();
        }
    }
}

