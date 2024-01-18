export default class MathUtils
{
    /***
     * gets a random integer in a range
     * @param minInt    minimum, inclusive
     * @param maxInt    maximum, inclusive.
     */
    static randRange(minInt: number, maxInt: number): number
    {
        return (Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt);
    }


    /**
     * Linear interpolate between the values a and b by amount
     * @param a startValue
     * @param b endValue
     * @param amount value between 0 and 1
     * @returns value between a and b by amount
     */
    static lerp(a: number, b: number, amount: number)
    {
        return (a * (1.0 - amount)) + (b * amount);
    }
    /**
     * Linear interpolate between 2 rgb values a and b by amount
     * @param color1 startColor
     * @param color2 endColor
     * @param amount value between 0 and 1
     * @returns rgb value of lerped color
     */

    static colorLerp(color1: number, color2: number, amount: number): number
    {
        let r1 = (color1 >> 16) & 0xff;
        let g1 = (color1 >> 8) & 0xff;
        let b1 = color1 & 0xff;
        let r2 = (color2 >> 16) & 0xff;
        let g2 = (color2 >> 8) & 0xff;
        let b2 = color2 & 0xff;
        return MathUtils.combineRGBComponents(r1 + (r2 - r1) * amount, g1 + (g2 - g1) * amount, b1 + (b2 - b1) * amount)
    }

    /**
     * combine separate r g and b value into 1 rgb value
     * @param r 
     * @param g 
     * @param b 
     * @returns 
     */
    static combineRGBComponents(r: number, g: number, b: number)
    {
        return r << 16 | g << 8 | b;
    }

}