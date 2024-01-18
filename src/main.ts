
import {initAssets} from './assets';
/**
import {audio, bgm} from './audio';
**/
import {designConfig} from './designConfig';
import {AppScreenConstructor, navigation} from './navigation/navigation';
import {LoadScreen} from './screens/LoadScreen';
import {Application, Ticker, UPDATE_PRIORITY} from 'pixi.js';
import {addStats, StatsJSAdapter} from 'pixi-stats';
import {CardScreen} from './screens/CardScreen';
import gsap from 'gsap';
import {SpecialTextScreen} from './screens/SpecialTextScreen';
import {FireScreen} from './screens/FireScreen';
import NavigationMenu from './navigation/NavigationMenu';
import {PixiPlugin} from 'gsap/PixiPlugin';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import {TitleScreen} from './screens/TitleScreen';
import FullScreen from './utils/FullScreen';
gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);

/** The PixiJS app Application instance, shared across the project */
export const app = new Application<HTMLCanvasElement>({
    resolution: Math.max(window.devicePixelRatio, 2),
    backgroundColor: 0x000000,
});

// for pixiJS chrome debugger extension
declare const globalThis: any;
globalThis.__PIXI_APP__ = app;

export default class Main
{
    private navMenu!: NavigationMenu;

    /** Set up a resize function for the app */
    private resize()
    {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const minWidth = designConfig.content.width;
        const minHeight = designConfig.content.height;

        // Calculate renderer and canvas sizes based on current dimensions
        const scaleX = minWidth / windowWidth;
        const scaleY = minHeight / windowHeight;
        const scale = scaleX > scaleY ? scaleX : scaleY;
        const width = windowWidth * scale;
        const height = windowHeight * scale;

        // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
        app.renderer.view.style.width = `${windowWidth}px`;
        app.renderer.view.style.height = `${windowHeight}px`;
        window.scrollTo(0, 0);
        // Update renderer  and navigation screens dimensions
        app.renderer.resize(width, height);
        navigation.init();
        navigation.resize(width, height);
        this.navMenu.resize(width, height);
    }

    private addFpsCounter()
    {
        const stats: StatsJSAdapter = addStats(document, app);
        const ticker: Ticker = Ticker.shared;
        ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);
    }


    /** Setup app and initialise assets */
    public async init()
    {
        // Add pixi canvas element (app.view) to the document's body
        document.body.appendChild(app.view);

        // add the fps counter, check index.html for the position of this component
        this.addFpsCounter();

        // set which Screen to use when something is loading
        navigation.setLoadScreen(LoadScreen);

        // Setup assets bundles (see assets.ts) and start up loading everything in background
        await initAssets();

        // create the navigationmenu which is always positioned at the top of the screen
        let navMenu = new NavigationMenu()
        navMenu.addNavigationOption("Title", TitleScreen);
        navMenu.addNavigationOption("Cards", CardScreen);
        navMenu.addNavigationOption("Text", SpecialTextScreen);
        navMenu.addNavigationOption("Fire", FireScreen);
        navMenu.on(NavigationMenu.NAVIGATE_TO, (e) =>
        {
            this.navigateTo(e)
        });
        this.navMenu = navMenu;
        app.stage.addChild(navMenu);



        // goto the first screen
        this.navigateTo(TitleScreen);

        // Whenever the window resizes, call the 'resize' function
        window.addEventListener('resize', () => this.resize());

        // Trigger the first resize
        this.resize();

    }

    navigateTo(e: AppScreenConstructor)
    {
        // apparantly clicking on an interactive object in pixi does not also trigger the document.onPointerdown
        // so we'll also go fullscreen whenever we click on a menu item.
        navigation.goToScreen(e);
        this.navMenu.setActiveScreen(e);
        FullScreen.goFullScreen();
    }

}

// Init everything
new Main().init();
