import {Container, Point, Sprite, Text, TextMetrics, TextStyle, ITextStyle} from 'pixi.js';

/**
 * A special text component that can display text with inline images, with wordwrapping
 * example text:  "Hello, here is an image [img1] and here is some more text"
 * 
 */
export default class SpecialText extends Container
{
    private style: TextStyle;

    private maxWidth: number = 0;
    private currentPos: Point = new Point(0, 0);
    private currentLine: Container[] = [];
    private currentLineHeight: number = 0;
    private sourceText: string = "";
    private elements: string[] = [];

    /**
     * 
     * @param text a text that can contain [img] where img is the name of a loaded imageasset
     * @param style textstyle to use
     * @param maxWidth maximum width of the component, text is wordwrapped to this width
     */
    constructor(text: string, style: Partial<TextStyle>, maxWidth: number = 500)
    {
        super();
        this.style = new TextStyle();
        Object.assign(this.style, style);

        // force wordWrap to be false, we want full control of the wordwrap
        this.style.wordWrap = false;

        // store the maximum width
        this.maxWidth = maxWidth;

        // set our text (and render it)
        this.text = text;
    }


    public set text(value: string)
    {
        // parse the text and store all elements
        this.sourceText = value;
        this.currentPos.set(0, 0);
        this.currentLineHeight = 0;
        this.elements = this.parseText();
        // render our texts and images
        this.buildElements();
    }

    public get text(): string
    {
        return this.sourceText;
    }

    /**
     * set the style of this component
     * @param style textstyle
     * @param rebuild rebuild the component if true
     */
    public setStyle(style: Partial<ITextStyle>, rebuild: boolean = true)
    {
        Object.assign(this.style, style);
        if (rebuild) this.buildElements();
    }


    /**
     * split a sourcetext into text and [data] elements
     * @param sourceText 
     * @returns 
     */
    private parseText(): string[]
    {
        // regexp to split text and [data]
        const regex = /(\[.*?\])|([^[\]\n]+)|(\n)/g;

        // create a list of all found segments
        const list: string[] = [];
        let match;
        while ((match = regex.exec(this.sourceText)) !== null)
        {
            const matchText = match[0];
            list.push(matchText);
        }

        return list;
    }

    /**
     * Builds all the elements for this text
     * @param list list of text or [data] elements
     */
    private buildElements()
    {
        this.removeChildren();
        for (const element of this.elements)
        {
            if (element.startsWith("["))
            {
                this.addImage(element.substring(1, element.length - 1));
            }
            else if (element == "\n")
            {
                this.drawCurrentLine();
            }
            else
            {
                this.addText(element);
            }
        }
        this.placeCurrentLine();
    }

    /**
     * Add a newline,  render what we already have and advance the cursor to the next line
     */
    private drawCurrentLine()
    {
        this.placeCurrentLine();
        this.currentPos.x = 0;
        this.currentLineHeight = 0;
    }

    /**
     * add an image to the component
     * @param name Add an image to the text
     */
    private addImage(name: string)
    {
        let newSprite = Sprite.from(name);
        this.addChild(newSprite);
        newSprite.position.set(this.currentPos.x, this.currentPos.y);
        this.addToLine(newSprite);
    }


    /**
     * add a container to the current line, this can be an image, or a text or any other container
     * its width/height is used to set lineHeight and advance the cursor position.
     * @param container 
     */
    private addToLine(container: Container)
    {
        // if this new container will make this line larget than maxwidth, 
        // 'wordwrap' it by drawing the current line, so this container
        // will be added on a new line.
        if (this.currentPos.x + container.width > this.maxWidth)
        {
            this.drawCurrentLine();
        }
        this.currentLine.push(container);
        container.x = this.currentPos.x;
        if (container.height > this.currentLineHeight)
        {
            this.currentLineHeight = container.height;
        }
        this.currentPos.x += container.width;
    }

    /**
     * Draw everything we have in the current line to the screen on the correct position
     */
    private placeCurrentLine()
    {
        // everything is bottom-aligned
        // so we advance our current Y position before placing stuff in the Y coord
        this.currentPos.y += this.currentLineHeight;
        for (const element of this.currentLine)
        {
            element.pivot.set(0, element.height);
            element.y = this.currentPos.y;
        }
        this.currentLine = [];
    }

    /**
     * Add a text with wordwrap, and trying to make as few Text instances as we can.
     * @param text 
     */
    private addText(text: string)
    {
        let words = text.split(" ");
        let line: string = "";

        // we build the text word for word, checking every word if we still fit on the line
        // if we don't fit.  we add 1 Text object containing the line so far, and continue on the next line.
        for (let t = 0; t < words.length; t++)
        {
            let word: string = words[t];
            if (t < words.length)
            {
                word = word + " ";
            }
            // if the current line + the current word exceeds maxWidth,  add what we have so far as 1 text object)
            // the actual wrapping to the next line will occur in addToLine()
            let metrics = TextMetrics.measureText(line + word, this.style)
            if (this.currentPos.x + metrics.width >= this.maxWidth)
            {
                let newText = new Text(line, this.style);
                this.addChild(newText);
                this.addToLine(newText);
                line = "";
            }
            // add the word to the line.
            line = line + word;
        }
        // add what we have left, wrapping was not needed.
        if (line != "")
        {
            let newText = new Text(line, this.style);
            this.addChild(newText);
            this.addToLine(newText);
        }
    }
}