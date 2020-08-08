import Sprite from './libs/Sprite'
import { LayoutManager } from './libs/LayoutManager';
import GameController from "./GameController";
import GameWorld from "./GameWorld";
import GameScene from './GameScene'

export default class MainGame extends GameScene  {

    gameController = GameController.getInstance();
    background!: PIXI.Sprite;
    gameWorld!: GameWorld;
    UICnt!: PIXI.Sprite;
    retryBtn!: PIXI.Sprite;
    score!: PIXI.Text;

    constructor() {
        super();
        this.createChildren();

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
        const scoreStyle = new PIXI.TextStyle({
            fontFamily: "PressStart2P",
            fontSize: 100,
            fill: "white",
            stroke: '#000000',
            strokeThickness: 2,
        });
        this.score = this.UICnt.addChild(new PIXI.Text('00000', scoreStyle));
        this.score.anchor.set(1, 0);
    }

    onResize(): void {
        const w = LayoutManager.gameWidth;
        const h = LayoutManager.gameHeight;

        this.background.width = w;
        this.background.height = h;

        this.gameWorld.scale.set(h*0.5 / this.gameWorld.HEIGHT);
        this.gameWorld.position.set(-w/2, -h/4);

        this.retryBtn.scale.set(w * 0.075 / this.retryBtn.getLocalBounds().width);
        this.score.height = h*0.05;
        this.score.scale.x = this.score.scale.y;
        this.score.position.set(w*0.49, -h*0.45);
    }

    onGameOver(): void {
        this.retryBtn.visible = true;
    }

    retry(): void {
        this.gameController.start();
    }

    updateScore(): void {
        if(this.gameWorld.scoreFloored > parseInt(this.score.text)) {
            let newScore = '';
            const lengthDiff = 5 - (this.gameWorld.scoreFloored+'').length;
            if(lengthDiff > 0) {
                for(let i = 0; i < lengthDiff; i++) {
                    newScore += '0'
                }
            }
            this.score.text = newScore + this.gameWorld.scoreFloored;
        }
    }

    tick(delta: number): void {
        this.gameWorld.tick(delta);
        this.updateScore();
    }
}
