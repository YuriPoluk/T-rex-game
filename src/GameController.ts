import MainGame from './MainGame'
import GameScene from "./GameScene";
import {LayoutManager} from "./libs/LayoutManager";
import {preloadAssets} from "./libs/assetsLoading";

export default class GameController {
    private static instance: GameController;
    layoutManager!: LayoutManager;
    app: PIXI.Application;
    size: {w: number, h: number};
    currentWindow!: GameScene;

    constructor(parent: HTMLCanvasElement) {
        this.size = {w: 800, h: 600};

        this.app = new PIXI.Application({
            transparent: false,
            backgroundColor : 0x000000,
            view: parent || document.body,
            antialias: true
        });

        this.app.ticker.add(this.tick, this);
        this.initLayoutManager();

        //@ts-ignore
        window.GAME = this;
        window.PIXI = PIXI;

        preloadAssets().then(()=>{this.start()});
    }

    public static getInstance(): GameController {
        const parent = document.getElementById("scene") as  HTMLCanvasElement;
        if (!GameController.instance) {
            GameController.instance = new GameController(parent);
        }

        return GameController.instance;
    }

    initLayoutManager(): void {
        this.layoutManager = new LayoutManager(this);
        this.layoutManager.fitLayout();
        window.addEventListener("resize", this.onResize.bind(this));
        let resizeTimeout: any;
        window.addEventListener("resize", () => {
            if(resizeTimeout)
                clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.layoutManager.fitLayout.bind(this.layoutManager), 100);
        });
    }

    showWindow(w: GameScene): GameScene {
        if (this.currentWindow) this.app.stage.removeChild(this.currentWindow);
        this.app.stage.addChildAt(w, 0);
        this.currentWindow = w;
        w.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2);
        w.onResize();
        return w;
    }

    onResize(): void {
        if(this.currentWindow) {
            this.currentWindow.position.set(this.app.renderer.width/2, this.app.renderer.height/2);
            if(this.currentWindow.onResize) this.currentWindow.onResize();
        }
    }

    start(): void {
        this.showWindow(new MainGame());
    }

    tick(): void {
        const delta = PIXI.Ticker.shared.elapsedMS;

        // if(window.SpineSprite) SpineSprite.update(delta);
        // if(window.ParticlesSprite) ParticlesSprite.update(delta);

        if(this?.currentWindow) {
            this.currentWindow.tick(delta);
        }
    }
}
