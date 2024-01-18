import gsap from "gsap";
import {Container, Text} from "pixi.js";
import {AppScreen, navigation} from "../navigation/navigation";
import {CardScreen} from "./CardScreen";
import * as introText from "../introText.json";
import {designConfig} from "../designConfig";

/** The default load screen for the game. */
export class TitleScreen extends Container implements AppScreen
{
    /** A unique identifier for the screen */
    public static SCREEN_ID = this.name;
    /** An array of bundle IDs for dynamic asset loading. */
    public static assetBundles = ["images/title-screen"];

    /** A variable used to store the current time state of animation */
    //private _tick = 0;

    private titleTxt!: Text;
    private mainTxt!: Text;
    constructor()
    {
        super();
        this.titleTxt = new Text("TitleScreen", {fontFamily: "Bungee regular", fontSize: 30, stroke: 0x000000, strokeThickness: 2, fill: 0xffffff});
        this.addChild(this.titleTxt);
        this.titleTxt.anchor.set(0.5, 0);

        this.mainTxt = new Text(introText.intro, {fontFamily: "Verdana", fontSize: 18, stroke: 0x000000, strokeThickness: 2, fill: 0xffffff, wordWrap: true, wordWrapWidth: designConfig.content.width - 50});
        this.addChild(this.mainTxt);
        this.mainTxt.anchor.set(0.5, 0);

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


    /**
     * Gets called every time the screen resizes.
     * @param width - width of the screen.
     * @param height - height of the screen.
     */
    public resize(width: number, height: number)
    {
        // Fit background to screen
        this.titleTxt.position.set(width / 2, 0);
        this.mainTxt.position.set(width / 2, 120);
    }
}
