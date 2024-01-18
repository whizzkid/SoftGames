import {AppScreenConstructor} from './navigation';

export class NavigationOption
{
    public name: string;
    public appScreen: AppScreenConstructor;

    constructor(name: string, appScreen: AppScreenConstructor)
    {
        this.name = name;
        this.appScreen = appScreen;
    }
}
