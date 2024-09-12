import * as plt from './plot';
import { registerListeners } from './listeners';

export class Slide{
    public figure: plt.Figure;
    public animationId: number | undefined | void;
    public animateBool: Array<boolean>;
    public currDraw: number;
    public plots: { [key: string]: plt.Plot };
    public images: { [key: string]: plt.Image };
    public axes: { [key: string]: plt.Axes };
    public matrices: { [key: string]: plt.Matrix };
    public texts: { [key: string]: plt.Text };

    constructor(){
        this.animationId = 0
        this.animateBool = [];
        this.currDraw = 0;
        this.figure = new plt.Figure();

        this.plots = {};
        this.images = {};
        this.axes = {};
        this.matrices = {};
        this.texts = {};
        registerListeners(this)
    }

    getAnimateBool(index:number){
        return this.animateBool[index]
    }

    router(){        
        // this.animateBool.fill(false);
        // do a try and log error
        // function wait(ms:number) {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        // }
        // await wait(100);

        try{
            // @ts-ignore
            this[`draw${this.currDraw}`]();
        }catch(e){
            console.log(e)
        }
        
        // this[`draw${this.currDraw}`]();// ts-ignore
    }

    createAnimation(func:Function,scriptName:string){
        this.animateBool.fill(false);
        this.animateBool.push(true);
        let animationId = plt.createAnimation(func, this.getAnimateBool.bind(this), this.animateBool.length-1, scriptName);
    }

}