import {Container} from "pixi.js";
import {AppScreenConstructor} from './navigation';
import {NavigationButton} from "./NavigationButton";
import {NavigationOption} from "./NavigationOption";

export default class NavigationMenu extends Container
{
    private currentWidth: number = 0;

    private activeScreen!: AppScreenConstructor;

    public static NAVIGATE_TO: string = "navigateTo";

    private options: NavigationOption[] = [];

    private buttons: Container[] = [];

    public addNavigationOption(name: string, constructor: AppScreenConstructor)
    {
        this.options.push(new NavigationOption(name, constructor));
    }

    /**
     * Draw the menu, if a page is active, the corresponding button is displayed differently, and is not clickable
     */
    public drawMenu()
    {
        // remove old buttons
        this.removeButtons();
        let x: number = 0;
        let spacing: number = 10;
        for (const option of this.options)
        {
            let button = new NavigationButton(option.name, this.activeScreen == option.appScreen);
            this.addChild(button)
            button.x = x;
            x += button.width + spacing;
            if (this.activeScreen != option.appScreen)
            {
                button.on("pointertap", () => this.onButtonClick(option))
            }
            this.buttons.push(button);
        }
        this.position.set(this.currentWidth / 2, 50)
        this.pivot.set(this.width / 2, 0);
    }

    private onButtonClick(e: NavigationOption)
    {
        this.emit(NavigationMenu.NAVIGATE_TO, e.appScreen);
    }

    private removeButtons()
    {
        for (const button of this.buttons)
        {
            button.destroy();
        }
        this.buttons = [];
    }

    /**
     * set the active screen, the button corresponding to this screen will be shown in yellow, and won't be clickable
     * @param screen 
     */
    public setActiveScreen(screen: AppScreenConstructor)
    {
        this.activeScreen = screen
        this.drawMenu();
    }

    resize(width: number, height: number)
    {
        this.currentWidth = width;
        this.position.set(width / 2, 50)
    }

}