import gsap, {Sine} from "gsap";
import {Container, Point, Text} from 'pixi.js';
import {AppScreen} from "../navigation/navigation";
import CardStack from "../cards/CardStack";
import Card from "../cards/Card";
import {designConfig} from "../designConfig";


/**
 * A demonstration where 144 sprites are displayed on a stack,  the cards animate to a 2nd stack,  
 * the animation takes 2 seconds, and every 1 second a new card will be triggered to move
 */
export class CardScreen extends Container implements AppScreen
{
    /** A unique identifier for the screen */
    public static SCREEN_ID = this.name;
    /** An array of bundle IDs for dynamic asset loading. */
    public static assetBundles = ["images/card-screen"];

    // configurable values for this excercise
    readonly totalCards: number = 144;
    readonly cardsPerSuit: number = 13;
    readonly moveDelay: number = 1000; // time between card moves in ms
    readonly animDuration: number = 2; // duration of the animation in seconds
    readonly archHeight: number = 100; // height of the arch of the card-movement.
    readonly suits: string[] = ["clubs", "diamonds", "hearts", "spades"];

    private titleTxt!: Text;
    private cards!: Card[];
    private leftStack!: CardStack;
    private rightstack!: CardStack;
    private moveInterval!: NodeJS.Timer;
    private container!: Container;


    constructor()
    {
        super();
        this.titleTxt = new Text("Cards", {fontFamily: "Bungee regular", fontSize: 30, stroke: 0x000000, strokeThickness: 2, fill: 0xffffff});
        this.addChild(this.titleTxt);
        this.titleTxt.anchor.set(0.5, 0);
        this.container = new Container();
        this.addChild(this.container);
    }

    public async show()
    {
        // Kill tweens of the screen container
        gsap.killTweensOf(this);

        // Reset screen data
        this.alpha = 0;

        // make 2 card stacks, one on the left and one on the right
        let margin: number = 300;
        this.leftStack = new CardStack(margin, designConfig.content.height - 80);
        this.rightstack = new CardStack(designConfig.content.width - margin, designConfig.content.height - 80);

        this.container.addChild(this.leftStack);
        this.container.addChild(this.rightstack);

        // create all our cards
        this.createCards(this.totalCards);

        // add the cards to the left stack
        for (const card of this.cards)
        {
            this.leftStack.addToStack(card);
            this.leftStack.placeOnTop(card);
        }


        // fade in, 
        // cacheAsBitmap to fade the entire screen (and not see the cards go transparent themselves)
        this.cacheAsBitmap = true;
        await gsap.to(this, {
            alpha: 1,
            delay: 0.2,
            duration: .2,
            ease: "linear",
        });
        // dont cache anymore after fade
        this.cacheAsBitmap = false;

        // start moving the cards at the specified interval
        this.moveInterval = setInterval(() => {this.moveCard()}, this.moveDelay)
    }

    // move card from 1 stack to another,
    // place card in parent container while moving, so it's always on top
    private moveCard()
    {
        let card: Card | undefined = this.leftStack.removeTopCard();
        if (card == undefined)
        {
            clearInterval(this.moveInterval);
            return;
        }
        this.rightstack.addToStack(card);
        this.container.addChild(card);
        if (card != undefined)
        {
            let newPos: Point = this.rightstack.getNewCardPosition();

            // the height of the arch is calculated by the taking the highest stackposition - archHeight
            // otherwise you get a weird animation if the right stack is higher than the left.
            let tl = gsap.timeline();
            tl.to(card, {
                y: Math.min(card.y, this.rightstack.y + newPos.y) - this.archHeight,
                duration: this.animDuration / 2,
                ease: Sine.easeOut,
            });
            tl.to(card, {
                y: this.rightstack.y + newPos.y,
                duration: this.animDuration / 2,
                ease: Sine.easeIn,
            });
            tl.to(card, {
                x: this.rightstack.x + newPos.x,
                duration: this.animDuration,
                ease: Sine.easeInOut,
            }, 0);

        }

    }

    /**
     * create all the cards and add them to stage
     * @param total 
     */
    private createCards(total: number)
    {
        this.cards = [];
        for (let t = 0; t < total; t++)
        {
            let newCard = new Card(this.makeCardName(t))
            this.container.addChild(newCard);
            this.cards.push(newCard);
        }
    }

    // the exercise needed 144 cards, and there's only 52 in my deck
    // so we'll loop through all cardnames repeatedly    
    private makeCardName(t: number): string
    {
        let suitCount: number = this.suits.length;
        return "card-" + this.suits[Math.floor(t / this.cardsPerSuit) % suitCount] + "-" + (t % this.cardsPerSuit + 1);
    }

    /** Called when the screen is being hidden. */
    public async hide()
    {
        // stop interval
        clearInterval(this.moveInterval);

        // kill all  timelines.
        gsap.globalTimeline.clear();

        // remove all cards
        for (let t = 0; t < this.cards?.length; t++)
        {
            this.cards[t].destroy();
        }
        // clear the cardlist
        this.cards = [];

        // remove the stacks
        this.leftStack?.destroy();
        this.rightstack?.destroy();

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
        this.container.x = width / 2 - (designConfig.content.width / 2);
    }
}
