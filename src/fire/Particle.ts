import {Sprite} from "pixi.js";


export class Particle extends Sprite
{
    public directionX: number = 0;
    public directionY: number = 0;
    public originX: number = 0;
    public age: number = 0;
    public maxAge: number = 0;

}
