import gsap from "gsap";
import {Container, Graphics, Text, TextStyle} from "pixi.js";
import {AppScreen} from "../navigation/navigation";
import SpecialText from "../specialText/SpecialText";
import {designConfig} from "../designConfig";


/**
 * A demonstration of a SpecialText component that can display text with images
 * it creates a new SpecialText with randomtext every 2 seconds, and draws a blue outline to show the components size
 */
export class SpecialTextScreen extends Container implements AppScreen
{
    /** A unique identifier for the screen */
    public static SCREEN_ID = this.name;
    /** An array of bundle IDs for dynamic asset loading. */
    public static assetBundles = ["images/special-text-screen"];

    // configurable values for this excercise
    readonly maxWidth: number = 900; // max width of the specialText
    readonly newTextInterval: number = 2000;// interval time for the creation of a new random text

    private titleTxt!: Text;
    private specialText!: SpecialText | undefined;
    private randomInterval!: NodeJS.Timer;
    private box!: Graphics | undefined; // used to draw the rectangle to show the component size

    constructor()
    {
        super();
        this.titleTxt = new Text("Text with images", {fontFamily: "Bungee regular", fontSize: 30, stroke: 0x000000, strokeThickness: 2, fill: 0xffffff});
        this.addChild(this.titleTxt);
        this.titleTxt.anchor.set(0.5, 0);
    }

    /** Called when the screen is being shown.*/
    public async show()
    {
        // Kill tweens of the screen container
        gsap.killTweensOf(this);

        this.alpha = 0;

        this.createSpecialTextComponent("Special Text Component\n\ncan contain text and graphics", {fill: 0xffffff}, this.maxWidth);
        this.drawComponentsize();

        // Tween screen into being visible
        await gsap.to(this, {
            alpha: 1,
            delay: 0.2,
            duration: .2,
            ease: "linear",
        });



        // start the interval that triuggers new random texts
        this.randomInterval = setInterval(() => this.createRandomText(), this.newTextInterval)
    }


    /**
     * Create a new SpecialText component with a random font, fontSize and random text
     */
    private createRandomText()
    {
        // determine a new style
        let family: string = ["Arial", "helvetica", "verdana", "Bungee regular"][Math.floor(Math.random() * 4)];
        let fontSize = Math.random() * 50 + 10;

        // set new style, but don't rebuild yet, since we're also setting text after this
        this.specialText!.setStyle({fontFamily: family, fontSize: fontSize}, false);

        // set new text, this will also rebuild
        this.specialText!.text = this.makeRandomString();
        // draw the size of the component
        this.drawComponentsize();
    }


    /**
     * draw a box behind the specialtext to show the components size.    
     */
    private drawComponentsize()
    {
        if (this.box == undefined)
        {
            return;
        }
        this.box.clear();
        this.box.beginFill(0x2222ff).drawRoundedRect(0, 0, this.maxWidth, this.specialText!.height, 10).endFill();
        this.box.position.set(this.specialText!.position.x, this.specialText!.position.y);
    }

    /**
     * create a new SpecialText
     * @param text 
     * @param style 
     * @param maxWidth 
     */
    private createSpecialTextComponent(text: string, style: Partial<TextStyle>, maxWidth: number)
    {
        this.specialText = new SpecialText(text, style, maxWidth);
        this.box = new Graphics();
        this.addChild(this.box);
        this.addChild(this.specialText);
        this.specialText.position.set((designConfig.content.width - this.maxWidth) / 2, 150)
    }

    /** Called when the screen is being hidden. */
    public async hide()
    {
        this.box?.destroy();
        this.box = undefined;
        clearTimeout(this.randomInterval);
        // Kill tweens of the screen container
        gsap.killTweensOf(this);
        this.specialText?.destroy();
        this.specialText = undefined;

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
        if (this.specialText)
        {
            this.specialText?.position.set((width - this.maxWidth) / 2, 150)
            this.box?.position.set(this.specialText.position.x, this.specialText.position.y);
        }
    }

    /**
     * create a random textstring containing some words and images.
     * @returns randomized text
     */
    private makeRandomString()
    {
        let size: number = Math.floor(Math.random() * 45 + 1);
        let text: string = "";
        let options: string[] = ["Lorem", "ipsum", "dolor", "sit", "amet", "game", "images", "fun", "text", "[img1]", "[img2]", "[img3]", "[img4]", "some more text", "i am not a text! just kidding"];
        for (let t = 0; t < size; t++)
        {
            let rnd = Math.floor(Math.random() * options.length);
            text = text + options[rnd];
            if (t < size) text = text + " ";
        }
        return text;
    }
}
