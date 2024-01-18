import {Container, IPointData, Point} from "pixi.js";
import Card from "./Card";

/**
 * A container that holds a stack of cards
 * it can automatically place a card on top of the stack 
 */
export default class CardStack extends Container
{
    // space between cards on the stack
    readonly cardSpacing: number = 1;

    private cards: Card[] = [];

    constructor(x: number, y: number)
    {
        super();
        this.position.set(x, y);
    }


    /**
     * calculate the position where a new card should be shown on the stack.
     * @returns the position of a new top card
     */
    public getNewCardPosition(): Point
    {
        return new Point(0, -this.cards.length * this.cardSpacing);
    }

    /**
     *  Add card to stacklist
     */
    public addToStack(card: Card)
    {
        this.cards.push(card);
    }

    /**
     * place the card on top of the stack, depending on the stacksize.
     * this is the resting position of a card. when animating a card, you can use getTopStackPosition to calculate the position you
     * want to animate towards.
     * @param card 
     */
    public placeOnTop(card: Card)
    {
        // make the card our child
        this.addChild(card);

        // calculate the top position and place the card there.
        let topPos: Point = this.getNewCardPosition();
        card.position.set(topPos.x, topPos.y);
    }


    /**
     * remove top card from stack, place it in our parent container, retaining its position on screen for easy animating
     
     * @returns card    the card that was removed, or undefined when the stack is empty
     */
    public removeTopCard(): Card | undefined
    {
        // return null if the stack is empty
        if (this.cards.length == 0) return undefined;

        // remove card from top of stack
        let card: Card | undefined = this.cards.pop();

        // calculate the correct position when moving card from stack to parent
        let position: IPointData = this.toGlobal(card!.position);
        position = this.parent.toLocal(position);

        // place card in our parent and set its new coordinates.
        this.parent.addChild(card!);
        card!.position.set(position.x, position.y);
        return card;
    }

}