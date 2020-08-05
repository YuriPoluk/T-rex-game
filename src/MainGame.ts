import Sprite from './libs/Sprite'
import { LayoutManager, Orientation } from './libs/LayoutManager';
import GameController from "./GameController";
import GameWorld from "./GameWorld";
import GameScene from './GameScene'

export default class MainGame extends GameScene  {
    background!: PIXI.Sprite;
    gameWorld!: GameWorld;
    UICnt!: PIXI.Sprite;
    retryBtn!: PIXI.Sprite;
    gameController = GameController.getInstance();

    constructor() {
        super();
        this.createChildren();
        this.start();

        this.gameWorld.on('game_over', this.onGameOver, this);
        this.retryBtn.on('pointerdown', this.retry, this);

    }

    createChildren(): void {
        this.background = this.addChild(new Sprite('sky'));
        this.gameWorld = this.addChild(new GameWorld());
        this.UICnt = this.addChild(new Sprite());
        this.retryBtn = this.UICnt.addChild(new Sprite('retry'));
        this.retryBtn.interactive = true;
        this.retryBtn.visible = false;
    }

    onResize(): void {
        const w = LayoutManager.gameWidth;
        const h = LayoutManager.gameHeight;

        this.background.width = w;
        this.background.height = h;

        this.gameWorld.scale.set(h*0.5 / this.gameWorld.HEIGHT);
        this.gameWorld.position.set(-w/2, -h/4);

        this.retryBtn.scale.set(w * 0.075 / this.retryBtn.getLocalBounds().width);
    }

    start(): void {

    }

    onGameOver(): void {
        this.retryBtn.visible = true;
    }

    retry(): void {
        this.gameController.start();
    }

    tick(delta: number): void {
        this.gameWorld.tick(delta);
    }
}
