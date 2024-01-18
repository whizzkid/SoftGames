import {BLEND_MODES, ParticleContainer, Point} from "pixi.js";
import MathUtils from "../utils/MathUtils";
import {Particle} from "./Particle";

/**
 * A simple fire particle emitter-effect
 * note from martijn: Since I'm no graphic artist, using an existing particle library would probably look just as 'good'  ahem...
 * and writing your own particle system is more fun than just including an existing one and doing some configuring there.
 */
export default class FireEffect extends ParticleContainer
{
    // list of all particles, since this is such a simple effect, with a low amount of particles, 
    // particles get reused immediately,  
    // therefore I chose not to use an object pool, since that would be a bit overkill here.
    private particles: Particle[] = [];

    // how long particles maximally live, new particles get a random of max maxAge
    readonly maxAge: number = 30;
    readonly maxParticles: number = 10;

    // new particles spawn horizontally at a random position +/- spread from the center of the emitter
    readonly spread: number = 20;

    // position where particles emit from
    public emitterPosition: Point = new Point(0, 0);

    constructor(maxParticles: number)
    {
        super(maxParticles, {alpha: true, position: true, rotation: true, scale: true, tint: true, });

        this.maxParticles = maxParticles;

        // create all the particles, each one with a random flame-image
        for (let t = 0; t < this.maxParticles; t++)
        {
            let image: string = "fire" + MathUtils.randRange(1, 3);
            let spark: Particle = Particle.from(image) as Particle;
            spark.anchor.set(0.5, 0.5);
            this.addChild(spark);
            this.particles.push(spark);
            // set initial values
            this.resetParticle(spark);

            // 'prewarm' the particles, give a random age at start, so they dont all apear in 1 big clump
            spark.age = MathUtils.randRange(0, this.maxAge);
        }
        // set the ADD blend mode to make it look a bit nicer.
        this.blendMode = BLEND_MODES.ADD

    }

    public update(delta: number)
    {
        for (const particle of this.particles)
        {
            particle.age += delta;
            if (particle.age >= particle.maxAge)
            {
                this.resetParticle(particle);
                continue;
            }

            let progress: number = (1 / particle.maxAge * particle.age);
            // fade and scale with age
            // ease alpha to new value instead of applying it instantly, makes particles appear nicer after being reset
            particle.alpha += ((1 - progress) - particle.alpha) / 2;
            // set scale to the same value as the alpha
            particle.scale.set(particle.alpha);
            // accellerate upward
            particle.directionY -= 0.012;
            // slowly float towards center horizontally
            particle.directionX = particle.directionX - ((particle.x - particle.originX) * 0.02);
            // rotate towards direction
            particle.rotation = Math.atan2(particle.directionY, particle.directionX) + Math.PI / 2;
            // color the particle from red to yellow along its lifetime.  with a slight offset, because that looked niced
            particle.tint = MathUtils.colorLerp(0xff0000, 0xeebb00, progress * 0.8 + 0.2);

            // move the particle
            particle.y += particle.directionY;
            particle.x += particle.directionX;
        }
    }

    /**
     * reset a particle
     * @param particle 
     */
    public resetParticle(particle: Particle)
    {
        particle.age = 0;
        // give it a random maxAge, not all particles live the same amount of time
        particle.maxAge = Math.random() * this.maxAge / 2 + this.maxAge / 2;
        // pick a new random position next to the emitter
        particle.x = this.emitterPosition.x + Math.random() * this.spread - this.spread / 2;
        particle.y = this.emitterPosition.y;
        // also store where we spawned because the flame goes towards this 'center'
        // this is important if you move the emitter position
        particle.originX = this.emitterPosition.x;
        // give the particles a random direction, but always upward.
        particle.directionX = Math.random() * 2 - 1;
        particle.directionY = -Math.random() * 2 - 1;
        //random scale
        particle.scale.set(Math.random() * 1);
        // make it invisible at start
        particle.alpha = 0;
    }
}