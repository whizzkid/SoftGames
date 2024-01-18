import gsap from "gsap";
import {Container, Text} from "pixi.js";
import {AppScreen} from "../navigation/navigation";


/** The default load screen for the game. */
export class LoadScreen extends Container implements AppScreen
{
    /** A unique identifier for the screen */
    public static SCREEN_ID = this.name;
    /** An array of bundle IDs for dynamic asset loading. */
    //public static assetBundles = ["images/preload"];

    /** A variable used to store the current time state of animation */
    //private _tick = 0;

    private loadingTxt!: Text;
    constructor()
    {
        super();
        this.loadingTxt = new Text("Loading", {fontSize: 30, stroke: 0x000000, strokeThickness: 2, fill: 0xffffff});
        this.addChild(this.loadingTxt);
        this.loadingTxt.anchor.set(0.5);
    }

    /** Called when the screen is being shown.*/
    public async show()
    {
        // Kill tweens of the screen container
        gsap.killTweensOf(this);

        // Reset screen data
        this.alpha = 0;

        // Tween screen into being visible
        gsap.to(this, {
            alpha: 1,
            delay: 0.2,
            duration: .2,
            ease: "linear",
        });
    }

    /** Called when the screen is being hidden. */
    public async hide()
    {
        // Kill tweens of the screen container
        gsap.killTweensOf(this);

        // Tween screen into being invisible
        gsap.to(this, {
            alpha: 0,

            duration: 0.2,
            ease: "linear",
        });
    }


    public prepare(data: any)
    {
        console.log("prepare", data);
    }

    /**
     * Called every frame
     * @param delta - The time elapsed since the last update.
     */
    // public update(delta: number)
    // {
    //     // Decremented every frame using delta time
    //     // this._tick -= delta / 60;
    // }

    /**
     * Gets called every time the screen resizes.
     * @param w - width of the screen.
     * @param h - height of the screen.
     */
    public resize(w: number, h: number)
    {
        // Fit background to screen
        this.loadingTxt.position.set(w / 2, h / 2);
    }

}
