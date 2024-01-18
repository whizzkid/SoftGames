import {Sprite} from "pixi.js";
import CardStack from "./CardStack";

export default class Card extends Sprite
{
    public currentStack: CardStack | undefined;
    private clip: Sprite;

    constructor(face: string)
    {
        super();
        this.clip = Sprite.from(face);
        this.addChild(this.clip);
        this.clip.anchor.set(0.5);
    }
}