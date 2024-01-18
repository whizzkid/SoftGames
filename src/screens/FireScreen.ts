import gsap from "gsap";
import {Container, Text} from "pixi.js";
import {AppScreen} from "../navigation/navigation";
import FireEffect from "../fire/FireEffect";
import {designConfig} from "../designConfig";


/** The default load screen for the game. */
export class FireScreen extends Container implements AppScreen
{
    /** A unique identifier for the screen */
    public static SCREEN_ID = this.name;
    /** An array of bundle IDs for dynamic asset loading. */
    public static assetBundles = ["images/fire-screen"];

    // configurable values for this excercise
    readonly particleCount: number = 10;


    private currentWidth: number = 0;
    private currentHeight: number = 0;
    private titleTxt!: Text;
    private fireEffect!: FireEffect;
    // internal counter for the emitter movement
    private age: number = 0;

    constructor()
    {
        super();
        this.titleTxt = new Text("Fire effect", {fontFamily: "Bungee regular", fontSize: 30, stroke: 0x000000, strokeThickness: 2, fill: 0xffffff});
        this.addChild(this.titleTxt);
        this.titleTxt.anchor.set(0.5, 0);
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


        this.fireEffect = new FireEffect(this.particleCount)
        this.fireEffect.emitterPosition.set(designConfig.content.width / 2, 200);
        this.addChild(this.fireEffect);
        this.fireEffect.alpha = 0;
        gsap.to(this.fireEffect, {alpha: 1, delay: 0.5, duration: 1})


    }

    public update(delta: number)
    {
        this.age += delta;
        this.fireEffect.update(delta);
        // make the emitter move around a little
        this.fireEffect.emitterPosition.set(Math.cos(this.age * 0.02) * 140 + this.currentWidth / 2, this.currentHeight / 2);
    }


    /** Called when the screen is being hidden. */
    public async hide()
    {
        this.fireEffect.destroy();
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
        this.currentWidth = width;
        this.currentHeight = height;
    }

}
