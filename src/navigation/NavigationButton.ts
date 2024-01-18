import {Container, Text} from "pixi.js";


/**
 * A simple clickable text button
 */
export class NavigationButton extends Container
{
    /**
     * 
     * @param name displayed name
     * @param isSelected if true, the button is colored yellow and is no longer clickable
     */
    constructor(name: string, isSelected: boolean)
    {
        super();
        let txt = new Text(name, {fontSize: 20, fill: isSelected ? 0xffff00 : 0xeeeeee, fontFamily: "Bungee regular"});
        this.addChild(txt);
        if (!isSelected)
        {
            this.eventMode = "dynamic";
            this.cursor = "pointer";
        }
    }
}
