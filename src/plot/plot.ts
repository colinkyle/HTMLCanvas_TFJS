import * as tf from '@tensorflow/tfjs';
import {Slide} from './slide'
let decor = (v:number, i:number) => [v, i];          // set index to value
let undecor = (a:Array<number>) => a[1];               // leave only index
let argsort = (arr:Array<number>) => arr.map(decor).sort((a,b)=>a[0]-b[0]).map(undecor);

function cyrb128(str:string) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

function sfc32(a:number, b:number, c:number, d:number) {
    return function() {
      a |= 0; b |= 0; c |= 0; d |= 0;
      let t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
  }

function splitmix32(a:number) {
return function() {
    a |= 0;
    a = a + 0x9e3779b9 | 0;
    let t = a ^ a >>> 16;
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ t >>> 15;
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
    }
}
// Create cyrb128 state:
var seed = cyrb128("bananas");
// Four 32-bit component hashes provide the seed for sfc32.
var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

// Or... only one 32-bit component hash is needed for splitmix32.
var rand = splitmix32(seed[0]);

export function random_rgba() {
    var o = Math.round, r = () => rand()/2+.5, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

export function maxDist(xyz1:tf.Tensor2D,xyz2:tf.Tensor2D){
    return tf.tidy(()=>{
        let diff = xyz1.sub(xyz2);
        let dist = diff.square().sum(1).sqrt();
        return Array.from(dist.max().bufferSync().values)[0];
    });
}

export class Figure {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public dpr: number;
    public left: Function;
    public top: Function;
    public right: Function;
    public bottom: Function;
    public primitives: Array<any>;
    public redrawTrigger: boolean;
    public gl: WebGLRenderingContext | null;

    constructor() {
        this.redrawTrigger = false;

        let canvas = document.getElementById('canvas') as
            HTMLCanvasElement;
        let context = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.gl = canvas.getContext("webgl");

        canvas.style.left = "0";
        canvas.style.top = "0";

        const dpr = window.devicePixelRatio || 1;
        console.log('dpr', dpr)
        console.log('code', dpr)

        this.canvas = canvas;
        this.context = context;
        this.dpr = dpr;

        // make this.left an arrow function to return zero
        this.left = () => 0;
        this.top = () => 0;

        // make this.right an arrow function that returns canvas width
        this.right = () => {
            let style_width = +getComputedStyle(this.canvas!).getPropertyValue("width").slice(0, -2);
            let width = style_width*dpr;
            return width;
        };

        this.bottom = () => {
            let style_height = +getComputedStyle(this.canvas!).getPropertyValue("height").slice(0, -2);
            let height = style_height*dpr;
            return height;
        };

        let style_width = +getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2);
        let width = style_width*dpr;
        canvas.setAttribute('width', String(width));

        let style_height = +getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2);
        let height = style_height*dpr;
        canvas.setAttribute('height', String(height));

        this.primitives = [];        
    }
    // Resize just gets width and height and resets it.  Everything else gets computed at runtime.
    onResize(){
        // try next line
        if (this.gl){
            this.gl.getExtension('WEBGL_lose_context')!.loseContext();
        }
        let style_width = +getComputedStyle(this.canvas).getPropertyValue("width").slice(0, -2);
        let width = style_width*this.dpr;
        this.canvas.setAttribute('width', String(width));

        let style_height = +getComputedStyle(this.canvas).getPropertyValue("height").slice(0, -2);
        let height = style_height*this.dpr;
        this.canvas.setAttribute('height', String(height));
    }

    draw(axs:Axes){
        // Update TForm
        axs.updateTForm();
        // Update all primitive locations -> goes into 2d tensor [Nx3]
        axs.updatePrimitives();
        // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
        axs.updateAxes();
        // Draw all points using screen coordinates.
        axs.draw();
    }

    getPosition(widthPercent:number, heightPercent:number){
        const widthFrac = widthPercent/100, heightFrac = heightPercent/100;
        // return the position in pixels from the fraction of width and height
        return [this.left() + this.right()*widthFrac, this.top() + this.bottom()*heightFrac]
    }

    getSize(percent:number){
        const frac = percent/100
        // return min of width and heigh pixels from fraction frac
        return Math.min(this.right(), this.bottom())*frac;
    }
    // Loop and call draw on each primitive (this gets called on resize)
    // drawPrimitives(){
    //     this.primitives.forEach(obj => {
    //         obj.draw();
    //     });
    // }
    // getAllRaw(){
    //     let allTensors:Array<tf.Tensor2D> = [];
    //     this.primitives.forEach(obj => {
    //         const result = obj.getRaw();
    //         if (result){
    //             result.forEach((tensor: tf.Tensor2D) => {
    //                 allTensors.push(tensor)
    //             })
    //         }
    //         // allTensors.push(obj.getRaw());
    //         // obj.registerData();
    //     });
    //     // allTensors.forEach(obj=>{

    //     // })
    //     const tensor = tf.concat(allTensors)
    //     return tensor
    // }
}

export interface PlotProps {
    figure: Figure;
    slide: Slide;
    name: string;
    n_rows: number;
    n_columns: number;
    row_id: number;
    col_id: number;
    row_id_max?: number;
    col_id_max?: number;
}

export class Plot {
    public props: PlotProps;
    public fig: Figure;
    public n_rows: number;
    public n_columns: number;
    public row_id_max: number;
    public col_id_max: number;
    public row_id: number;
    public col_id: number;
    public slide: Slide;
    
    constructor(
        props: PlotProps
    ) {
        this.props = props;
        this.fig = props.figure;

        this.n_rows = props.n_rows;
        this.n_columns = props.n_columns;

        this.row_id = props.row_id;
        this.col_id = props.col_id;

        this.row_id_max = props.row_id_max || props.row_id;
        this.col_id_max = props.col_id_max || props.col_id;
        // @ts-ignore
        props.slide.plots[props.name] = this;
        this.slide = props.slide;
    }

    left():number{
        let width = this.fig.right() - this.fig.left();
        let plot_width = width / this.n_columns;
        return plot_width * this.col_id;
    }

    right():number{
        let width = this.fig.right() - this.fig.left();
        let plot_width = width / this.n_columns;
        return plot_width * (this.col_id_max + 1);
    }

    top():number{
        let height = this.fig.bottom() - this.fig.top();
        let plot_height = height / this.n_rows;
        return plot_height * this.row_id;
    }

    bottom():number{
        let height = this.fig.bottom() - this.fig.top();
        let plot_height = height / this.n_rows;
        return plot_height * (this.row_id_max + 1);
    }

    center():[number,number]{

        return [
            (this.left() + this.right())/2, 
            (this.top() + this.bottom())/2
        ]
    }
}

export interface DotProps {
    fig: Figure;
    fillstyle: string;
    stroke: string;
    xyz: Function;
    radiusFraction: number;
    animate: boolean;
}

export class Dot {
    public fig: Figure;
    public fillstyle: string;
    public stroke: string;
    public xyz: Function;
    public radiusFraction: number;
    public getScreenPosition: Function;
    public animate: boolean;
    public inProgress: boolean;
    public last: number;
    public lastTime: number;
    public animating: boolean;

    constructor(
        props: DotProps
    ) {
        // Dummy during constructor, assigned later
        this.getScreenPosition = () => [0,0]
        this.fig = props.fig;
        this.fillstyle = props.fillstyle;
        this.stroke = props.stroke;
        this.xyz = props.xyz;
        // radiusFraction (scaling with x maybe?)
        this.radiusFraction = props.radiusFraction;
        this.animate = props.animate;

        this.last = 0;
        this.lastTime = 0;
        if (this.animate){
            this.inProgress = true;
        }else{
            this.inProgress = false;
            this.last = 2*Math.PI;
        }
        this.animating = false;
    }

    draw(){
        if (this.fig.redrawTrigger || !this.animate){
            this.redraw();
        }
        if (this.inProgress){
            this.drawUpdate();
        }
    }
    // This is the standard animate loop
    drawUpdate(){

        let ctx = this.fig.context
        ctx.fillStyle = this.fillstyle;

        ctx.lineWidth = Math.round(this.radius() / 5);
        ctx.strokeStyle = this.stroke;
        
        let r = () => this.radius();

        // create plotProps interface
        // interface PlotProps {
        //     obj: Dot;
        //     xy: Function;
        //     r: Function;
        //     rate: number;
        // }
        
        // let plotProps = {
        //     obj: this,
        //     'xy':this.getScreenPosition,
        //     'r':r,
        //     'rate':.01
        // }

        const currentTime = performance.now();
        this.lastTime = currentTime;
        // let plotFunc = (props:PlotProps) => {
        //     ctx.fillStyle = this.fillstyle;

        //     ctx.lineWidth = Math.round(this.radius() / 5);
        //     ctx.strokeStyle = this.stroke;
        //     const currentTime = performance.now();
        //     const elapsedTime = currentTime - props.obj.lastTime;
        //     props.obj.lastTime = currentTime;

        //     if (props.obj.inProgress){
        //         ctx.beginPath();
        //         const radians = props.obj.last + elapsedTime*.005;
        //         let [x,y] = props.xy();
        //         if (props.obj.last< 2 * Math.PI){
        //             ctx.arc(x, y, props.r(), props.obj.last, radians);
        //         }else{
        //             ctx.arc(x, y, props.r(), 0, 2 * Math.PI);
        //             ctx.fill();
        //             props.obj.inProgress = false;
        //             this.animating=false;
        //         }
        //         ctx.stroke();
        //         ctx.closePath();
        //         props.obj.last = radians;
        //     }
            
        // };
        if (this.last< 2 * Math.PI && (this.animating==false)){
            this.animating=true;
            //let animationId = createAnimation(()=>plotFunc(plotProps));
        }
    }
    // This is the redraw loop
    redraw(){

        let ctx = this.fig.context
        ctx.fillStyle = this.fillstyle;

        ctx.lineWidth = Math.round(this.radius() / 5);
        ctx.strokeStyle = this.stroke;

        let [x,y] = this.getScreenPosition();

        ctx.beginPath();
        ctx.arc(x, y, this.radius(), 0, this.last);
        
        if (!this.inProgress){
            ctx.fill();
        }
        ctx.stroke();
        ctx.closePath();
    }
    // registerData(){
    //     // tensor3d
    //     let getScreen = this.axs.registerPrimitive(this.xyz());
    //     // this.getScreenPosition = getScreen;
    // }
    assignScreenPos(screenPos:Function){
        this.getScreenPosition = screenPos;
    }
    radius(){
        // TODO: probably scale with x, function of data
        return this.radiusFraction*Math.min(
            this.fig.bottom()-this.fig.top(),
            this.fig.right()-this.fig.left(),
        )
    }
    getRaw():Array<tf.Tensor2D>{
        return [this.xyz()];
    }
}

export interface TextProps {
    fig: Figure;
    slide: Slide;
    name: string;
    fillstyle?: string;
    stroke?: string;
    font?: string;
    xyz: Function;
    text: string;
    xScreenOffset?: number;
    yScreenOffset?: number;
}

export class Text {
    public fig: Figure;
    public fillstyle: string;
    public stroke: string;
    public font: string;
    public xyz: Function;
    public getScreenPosition: Function;
    public text: string;
    public xScreenOffset: number;
    public yScreenOffset: number;
    public slide: Slide;

    constructor(
        props: TextProps
    ) {
        // Dummy during constructor, assigned later
        var myFont = new FontFace('myFont', 'url(../garet/Garet-Book.otf)');
        var myFontBold = new FontFace('myFontBold', 'url(../garet/Garet-Heavy.otf)');
        myFont.load().then(function(font){
            // with canvas, if this is ommited won't work
            document.fonts.add(font);          
        });

        myFontBold.load().then(function(font){
            // with canvas, if this is ommited won't work
            document.fonts.add(font);          
        });

        this.getScreenPosition = () => [0,0]
        this.fig = props.fig;
        this.fillstyle = props.fillstyle || 'white';
        this.stroke = props.stroke || '1';
        this.font = props.font || '30px myFont';
        this.xyz = props.xyz;
        this.text = props.text;
        this.xScreenOffset = props.xScreenOffset || 0;
        this.yScreenOffset = props.yScreenOffset || 0;
        // @ts-ignore
        props.slide.texts[props.name] = this;
        this.slide = props.slide;

        // Check if the string contains a %
        if (this.font.includes('%')) {
            let font = this.font.split('%')
            let sizeInPx = this.fig.getSize(Number(font[0]))
            this.font = sizeInPx +'px ' + font[1]
        }
    }

    draw(){
        // Check if the string contains a %
        if (this.font.includes('%')) {
            let font = this.font.split('%')
            let sizeInPx = this.fig.getSize(Number(font[0]))
            this.font = sizeInPx +'px ' + font[1]
        }
        let ctx = this.fig.context
        ctx.fillStyle = this.fillstyle;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = this.stroke;
        ctx.font = this.font;

        var lineHeight = ctx.measureText("M").width*1.2;
        var lines = this.text.split("\n");
        var nLines = lines.length;

        let [x,y] = this.getScreenPosition();
        if (nLines>1){
            if (nLines% 2 === 0){
                y -= lineHeight/2 + lineHeight*Math.floor(nLines/4)
            }else{
                y -= lineHeight*Math.floor(nLines/2)
            }
        }
        for (var i = 0; i < lines.length; ++i) {
            ctx.fillText(lines[i], x+this.xScreenOffset, y-this.yScreenOffset);
            y += lineHeight;
        }

        // ctx.fillText(this.text,x+this.xScreenOffset,y-this.yScreenOffset,this.fig.right()-this.fig.left()-x/2);
  
    }

    assignScreenPos(screenPos:Function){
        this.getScreenPosition = screenPos;
    }

    getRaw():Array<tf.Tensor2D>{
        return [this.xyz()];
    }
        
}

export interface ImageProps {
    fig: Figure;
    slide: Slide;
    name: string;
    plt: Plot;
    image: HTMLImageElement;
    margin?: number;
}

export class Image {
    public fig: Figure;
    public plt: Plot;
    public image: HTMLImageElement;
    public margin: number;
    public slide: Slide;

    constructor(props: ImageProps) {
        this.fig = props.fig;
        this.plt = props.plt;
        this.image = props.image;
        this.margin = props.margin || 0;
        // @ts-ignore
        props.slide.images[props.name] = this;
        this.slide = props.slide;
    }

    draw() {
        const ctx = this.fig.context;


        const top = this.plt.top();
        const bottom = this.plt.bottom();

        const left = this.plt.left();
        const right = this.plt.right();

        const width = right - left;
        const height = bottom - top;

        const centerW = (left+right)/2;
        const centerH = (top+bottom)/2;

        const imageHeight = this.image.height;
        const imageWidth = this.image.width;

        // now we need to preserve aspect ratio of image while plotting it within the boundaries (0.8*width, 0.8*height)
        const scale = Math.min((1-this.margin)*width/imageWidth, (1-this.margin)*height/imageHeight);
        const scaledWidth = imageWidth*scale;
        const scaledHeight = imageHeight*scale;
        const scaledLeft = centerW - scaledWidth/2;
        const scaledTop = centerH - scaledHeight/2;

        // ctx.strokeStyle = 'white';
        // ctx.lineWidth = 1;

        // ctx.beginPath();
        // ctx.rect(left, top, width, height);
        // ctx.stroke();

        ctx.drawImage(
            this.image,
            scaledLeft,
            scaledTop,
            scaledWidth,
            scaledHeight
        );

    }
}

export interface MatrixProps {
    fig: Figure;
    slide: Slide;
    name: string;
    plt: Plot;
    elements: Array<Array<string>>;
    fillstyle?: string;
    stroke?: string;
    shape?: [number, number];
    margin?: number;
}

export class Matrix {
    public fig: Figure;
    public plt: Plot;
    public elements:  Array<Array<string>>;
    public fillstyle: string;
    public stroke: string;
    public shape: [number, number];
    public margin: number;
    public printCol: boolean;
    public printRow: boolean;
    public slide: Slide;

    constructor(props: MatrixProps) {
        this.fig = props.fig;
        this.plt = props.plt;
        this.elements = props.elements;
        this.fillstyle = props.fillstyle || 'white';
        this.stroke = props.stroke || '1';
        this.margin = props.margin || 0;
        this.shape = props.shape || [this.elements.length, this.elements[0].length];

        this.printCol = false;
        this.printRow = false;

        if (this.elements.length < this.shape[0]){
            this.printCol = true;
        }
        if (this.elements[0].length < this.shape[1]){
            this.printRow = true;
        }
        // @ts-ignore
        props.slide.matrices[props.name] = this;
        this.slide = props.slide;
    }

    draw() {
        const ctx = this.fig.context;
        ctx.fillStyle = this.fillstyle;

        const top = this.plt.top();
        const bottom = this.plt.bottom();

        const left = this.plt.left();
        const right = this.plt.right();

        const width = right - left;
        const height = bottom - top;

        const centerW = (left+right)/2;
        const centerH = (top+bottom)/2;


        // now we need to preserve aspect ratio of image while plotting it within the boundaries (0.8*width, 0.8*height)
        const scaledWidth = width*(1-this.margin);
        const scaledHeight = height*(1-this.margin);

        const scaledLeft = centerW - scaledWidth/2;
        const scaledTop = centerH - scaledHeight/2;

        const scaledRight = centerW + scaledWidth/2;
        const scaledBottom = centerH + scaledHeight/2;

        const cellWidth = scaledWidth/this.shape[1];
        const cellHeight = scaledHeight/this.shape[0];

        let fontSize = Math.min(cellWidth, cellHeight)/this.elements[0].length;

        ctx.font = `${fontSize}px myFont`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (this.printCol){
            let i0 = Math.floor(this.shape[0]/2);
            for (let i=0; i<this.shape[0]; i++){
                for (let j=0; j<this.shape[1]; j++){
                    if (i == i0){
                        ctx.fillText(this.elements[0][j], scaledLeft + cellWidth/2 + j*cellWidth, scaledTop + cellHeight/2 + i*cellHeight,cellWidth/2);
                    } else {
                        ctx.save();
                        ctx.translate(scaledLeft + cellWidth/2 + j*cellWidth, scaledTop + cellHeight/2 + i*cellHeight);
                        ctx.rotate(-Math.PI/2);
                        ctx.fillText("···", 0, 0);
                        ctx.restore();
                    }
                }
            }
        } else if (this.printRow){
            let j0 = Math.floor(this.shape[1]/2);
            for (let i=0; i<this.shape[0]; i++){
                for (let j=0; j<this.shape[1]; j++){
                    if (j == j0){
                        ctx.fillText(this.elements[i][0], scaledLeft + cellWidth/2 + j*cellWidth, scaledTop + cellHeight/2 + i*cellHeight, cellWidth/2);
                    } else{
                        ctx.fillText("···", scaledLeft + cellWidth/2 + j*cellWidth, scaledTop + cellHeight/2 + i*cellHeight,cellWidth);
                    }
                }
            }

        } else {
            for (let i=0; i<this.shape[0]; i++){
                for (let j=0; j<this.shape[1]; j++){
                    ctx.fillText(this.elements[i][j], scaledLeft + cellWidth/2 + j*cellWidth, scaledTop + cellHeight/2 + i*cellHeight,cellWidth);
                }
            }
        }

        fontSize = 1.2*scaledHeight;
        ctx.font = `${fontSize}px myFont`;

        ctx.fillText('[',scaledLeft,scaledTop + scaledHeight/2, cellWidth/4);
        ctx.fillText(']',scaledRight,scaledTop + scaledHeight/2, cellWidth/4);
        

    }
}

export interface LineProps{
    fig: Figure;
    strokeStyle?: string;
    lineWidthFraction?: number;
    xyz1: Function;
    xyz2: Function;
    dashed?: boolean;
}

export class Line {
    public fig: Figure;
    public strokeStyle: string;
    public lineWidthFraction: number;
    public xyz1: Function;
    public xyz2: Function;
    public screen1 : Function;
    public screen2: Function;
    public dashed: boolean;

    constructor(props:LineProps){
        this.fig = props.fig;
        this.strokeStyle = props.strokeStyle || "white";
        this.lineWidthFraction = props.lineWidthFraction || 1/500;
        this.dashed = props.dashed || false;
        this.xyz1 = props.xyz1;
        this.xyz2 = props.xyz2;
        this.screen1 = () => [0,0]
        this.screen2 = () => [0,0]
    }

    draw(){
        let ctx = this.fig.context;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = Math.round(this.lineWidth());
        let [x1,y1] = this.screen1();
        let [x2,y2] = this.screen2();

        // let dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2)

        ctx.beginPath();
        if (this.dashed){
            
            ctx.setLineDash([this.fig.right()/101,this.fig.right()/101])
        }
        ctx.moveTo(x1,y1)
        ctx.lineTo(x2,y2)
        ctx.stroke();
        ctx.closePath();
        if (this.dashed){
            ctx.setLineDash([])
        }
    }

    // registerData(){
    //     // tensor3d
    //     let getScreen1 = this.axs.registerPrimitive(this.xyz1())
    //     let getScreen2 = this.axs.registerPrimitive(this.xyz2())
    //     // this.screen1 = getScreen1;
    //     // this.screen2 = getScreen2;
    // }
    assignScreenPos(screenPos:[Function,Function]){
        this.screen1 = screenPos[0];
        this.screen2 = screenPos[1];
        // this.screen1,this.screen2 = screenPos;
    }

    lineWidth(){
        // lineWidth as fraction of entire figure
        return this.lineWidthFraction*Math.max(
            this.fig.bottom() - this.fig.top(),
            this.fig.right() - this.fig.left()
        )
    }
    getRaw():Array<tf.Tensor2D>{
        return [this.xyz1(), this.xyz2()];
    }

    xyz():Array<tf.Tensor2D>{
        return this.getRaw()
    }
}

export function genGrid(data:tf.Tensor2D,figure:Figure, strokeStyle?:string, lineWidthFraction?:number, dashed?:boolean){

    let baseLineProps = {
        fig: figure,
        strokeStyle: strokeStyle || 'grey',
        lineWidthFraction: lineWidthFraction || 1/1200,
        dashed: dashed || false
    }

    
    let gridLines = []
    if (data.shape[1] === 2){
        let datMin = tf.min(data, 0).bufferSync().values
        let datMax = tf.max(data, 0).bufferSync().values
        let xMin = datMin[0], xMax = datMax[0], yMin = datMin[1], yMax = datMax[1]
        xMin = Math.floor(xMin)
        xMax = Math.ceil(xMax)
        yMin = Math.floor(yMin)
        yMax = Math.ceil(yMax)
        // loop from xMin to xMax and create vertical grid lines
        for (let x=xMin; x<=xMax; x++){
            let lineProps = {...baseLineProps, xyz1: () => [x,yMin], xyz2: () => [x,yMax]}
            gridLines.push(new Line(lineProps))
        }
        // loop from yMin to yMax and create horizontal grid lines
        for (let y=yMin; y<=yMax; y++){
            let lineProps = {...baseLineProps, xyz1: () => [xMin,y], xyz2: () => [xMax,y]}
            gridLines.push(new Line(lineProps))
        }
    }else if(data.shape[1] === 3){
        let datMin = tf.min(data, 0).bufferSync().values
        let datMax = tf.max(data, 0).bufferSync().values
        let xMin = datMin[0], xMax = datMax[0], yMin = datMin[1], yMax = datMax[1], zMin = datMin[2], zMax = datMax[2]
        xMin = Math.floor(xMin)
        xMax = Math.ceil(xMax)
        yMin = Math.floor(yMin)
        yMax = Math.ceil(yMax)
        zMin = Math.floor(zMin)
        zMax = Math.ceil(zMax)
        // loop from xMin to xMax and create vertical grid lines
        for (let x=xMin; x<=xMax; x++){
            for (let y=yMin; y<=yMax; y++){
                let lineProps = {...baseLineProps, xyz1: () => [x,y,zMin], xyz2: () => [x,y,zMax]}
                gridLines.push(new Line(lineProps))
            }
        }
        // loop from yMin to yMax and create horizontal grid lines
        for (let y=yMin; y<=yMax; y++){
            for (let z=zMin; z<=zMax; z++){
                let lineProps = {...baseLineProps, xyz1: () => [xMin,y,z], xyz2: () => [xMax,y,z]}
                gridLines.push(new Line(lineProps))
            }
        }
        // loop from zMin to zMax and create vertical grid lines
        for (let z=zMin; z<=zMax; z++){
            for (let x=xMin; x<=xMax; x++){
                let lineProps = {...baseLineProps, xyz1: () => [x,yMin,z], xyz2: () => [x,yMax,z]}
                gridLines.push(new Line(lineProps))
            }
        }
        
    }
    return gridLines
}

export interface BoxProps{
    fig: Figure;
    plt: Plot;
    strokeStyle?: string;
    lineWidthFraction?: number;
    dashed?: boolean;
    margin?: number;
}

export class Box {
    public fig: Figure;
    public plt: Plot;
    public strokeStyle: string;
    public lineWidthFraction: number;
    public dashed: boolean;
    public margin: number;

    constructor(props:BoxProps){
        this.fig = props.fig;
        this.plt = props.plt;
        this.strokeStyle = props.strokeStyle || "white";
        this.lineWidthFraction = props.lineWidthFraction || 1/500;
        this.dashed = props.dashed || false;
        this.margin = props.margin || 0;
    }

    draw(){
        let ctx = this.fig.context;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = Math.round(this.lineWidth());
        let [x1,y1] = [this.plt.left(), this.plt.top()];
        let [x2,y2] = [this.plt.right(), this.plt.bottom()];
        // adjust screen points for margin
        let width = this.plt.right() - this.plt.left();
        let height = this.plt.bottom() - this.plt.top();
        x1 += this.margin*width;
        x2 -= this.margin*width;

        y1 += this.margin*height;
        y2 -= this.margin*height;

        ctx.beginPath();
        if (this.dashed){
            ctx.setLineDash([this.fig.right()/101,this.fig.right()/101])
        }
        ctx.moveTo(x1,y1)
        ctx.lineTo(x1,y2)
        ctx.lineTo(x2,y2)
        ctx.lineTo(x2,y1)
        ctx.lineTo(x1, y1)
        ctx.stroke();
        ctx.closePath();
        if (this.dashed){
            ctx.setLineDash([])
        }
    }

    lineWidth(){
        // lineWidth as fraction of entire figure
        return this.lineWidthFraction*Math.max(
            this.fig.bottom() - this.fig.top(),
            this.fig.right() - this.fig.left()
        )
    }
}

export interface RayProps{
    fig: Figure;
    strokeStyle?: string;
    lineWidthFraction?: number;
    arrowLengthFraction?: number;
    xyz1: Function;
    xyz2: Function;
}

export class Ray {
    public fig: Figure;
    public strokeStyle: string;
    public lineWidthFraction: number;
    public arrowLengthFraction: number;
    public xyz1: Function;
    public xyz2: Function;
    public screen1 : Function;
    public screen2: Function;

    constructor(props:RayProps){
        this.fig = props.fig;
        this.strokeStyle = props.strokeStyle || "white";
        this.lineWidthFraction = props.lineWidthFraction || 1/500;
        this.arrowLengthFraction = props.arrowLengthFraction || 1/50;
        this.xyz1 = props.xyz1;
        this.xyz2 = props.xyz2;
        this.screen1 = () => [0,0]
        this.screen2 = () => [0,0]
    }

    draw(){
        let ctx = this.fig.context;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = Math.round(this.lineWidth());
        let [x1,y1] = this.screen1();
        let [x2,y2] = this.screen2();

        const angle = Math.atan2((y2-y1),(x2-x1));
        const anglePos = angle + 3*Math.PI/4;
        const angleNeg = angle - 3*Math.PI/4;

        const arrowSize = this.arrowLength();

        const xPos = x2 + arrowSize*Math.cos(anglePos);
        const yPos = y2 + arrowSize*Math.sin(anglePos);

        const xNeg = x2 + arrowSize*Math.cos(angleNeg);
        const yNeg = y2 + arrowSize*Math.sin(angleNeg);

        ctx.beginPath();
        // main line
        ctx.moveTo(x1,y1)
        ctx.lineTo(x2,y2)
        // top arrow
        ctx.moveTo(xPos,yPos)
        ctx.lineTo(x2,y2)
        // bottom arrow
        ctx.moveTo(xNeg,yNeg)
        ctx.lineTo(x2,y2)
        ctx.stroke();
        ctx.closePath();
    }

    assignScreenPos(screenPos:[Function,Function]){
        this.screen1 = screenPos[0];
        this.screen2 = screenPos[1];
        // this.screen1,this.screen2 = screenPos;
    }

    lineWidth(){
        // lineWidth as fraction of entire figure
        return this.lineWidthFraction*Math.max(
            this.fig.bottom() - this.fig.top(),
            this.fig.right() - this.fig.left()
        )
    }

    arrowLength(){
        // lineWidth as fraction of entire figure
        return this.arrowLengthFraction*Math.max(
            this.fig.bottom() - this.fig.top(),
            this.fig.right() - this.fig.left()
        )
    }

    getRaw():Array<tf.Tensor2D>{
        return [this.xyz1(), this.xyz2()];
    }
}

export interface AxesProps {
    plt: Plot;
    slide: Slide;
    name: string;
    strokeStyle?: string;
    lineWidthFraction?: number;
    margin?: number;
    axisEqual?: boolean;
    axisCenter?: boolean;
    axisAbsolute?: boolean;
    thetaX?: Function;
    thetaY?: Function;
    ticks?: boolean;
    primitives: Array<Dot | Line | Ray>;
    grids?: Array<Line>;
    drawnAxes?: Array<Number>;
    // bounds??
}

export class Axes {
    public plt: Plot;
    public strokeStyle: string;
    public lineWidthFraction: number;
    public margin: number;
    public dimensions: Function;

    public xMaxProjected:number; 
    public xMinProjected:number; 
    public yMaxProjected:number; 
    public yMinProjected:number; 

    public rawMax:tf.Tensor2D;
    public rawMin:tf.Tensor2D;

    public axisEqual:boolean;
    public axisCenter:boolean;
    public axisAbsolute: boolean;

    public thetaX: Function;
    public thetaY: Function;

    public ticks: boolean;

    public TForm: tf.Tensor2D;
    public extraTForm: Array<tf.Tensor2D>;
    public primitives: Array<Dot|Line|Ray>;
    public grids: Array<Line>;
    public axesLines: Array<Line>;
    public axesLabels: Array<Text>;
    public dataRaw: tf.Tensor2D;
    public dataProjected: tf.Tensor2D;
    public primitiveDepth: tf.Tensor2D;
    public axesLineDepth: tf.Tensor2D;
    public axesLabelDepth: tf.Tensor2D;
    public dataScreen: tf.Tensor2D;

    public actFunc: Array<Function>;
    public bias: Array<tf.Tensor2D>;
    public drawnAxes: Array<Number>;

    public slide: Slide;

    constructor(
        props: AxesProps
    ) {
        
        this.xMinProjected = NaN;
        this.xMaxProjected = NaN;
        this.yMinProjected = NaN;
        this.yMaxProjected = NaN;

        this.primitives = props.primitives;
        this.grids = props.grids || [];

        this.dimensions = () => 2;
        if (this.primitives[0] instanceof Dot){
            this.dimensions = () => this.primitives[0].getRaw()[0].shape[1];
        }else if (this.primitives[0] instanceof Line){
            //@ts-expect-error
            this.dimensions = () => this.primitives[0].getRaw()[0].length;
        }

        if (this.dimensions() === 2) {
            this.rawMax = tf.tensor2d([[0,0]]);
            this.rawMin = tf.tensor2d([[0,0]]);
            this.TForm = tf.tensor2d([[1,0],[0,1]]);
            this.extraTForm = [tf.tensor2d([[1,0],[0,1]])];
            this.dataRaw = tf.tensor2d([[0,0]]);
            this.bias = [tf.tensor2d([[0,0]])];
            this.drawnAxes = props.drawnAxes || [0,1]

        } else if (this.dimensions() === 3) {
            this.rawMax = tf.tensor2d([[0, 0, 0]]);
            this.rawMin = tf.tensor2d([[0, 0, 0]]);
            this.TForm = tf.tensor2d([[1,0,0],[0,1,0],[0,0,1]]);
            this.extraTForm = [tf.tensor2d([[1,0,0],[0,1,0],[0,0,1]])];
            this.dataRaw = tf.tensor2d([[0,0,0]]);
            this.bias = [tf.tensor2d([[0,0,0]])];
            this.drawnAxes = props.drawnAxes || [0,1,2]
        } else {
            throw new Error('Unsupported data dimensions');
        }

        this.axisEqual = props.axisEqual || false;
        this.axisCenter = props.axisCenter || false;
        this.axisAbsolute = props.axisAbsolute || false;
        

        // TODO: this depends on 2d or 3d (maybe it'll just be ignored though)
        let getThetaX = () => 0;
        let getThetaY = () => 0;
        if (this.dimensions() === 3){
            getThetaX = () => -Math.PI/16;
            getThetaY = () => Math.PI/8;
        }

        this.thetaX = props.thetaX || getThetaX;
        this.thetaY = props.thetaY || getThetaY;

        this.ticks = props.ticks || false;

        this.plt = props.plt;

        this.strokeStyle = props.strokeStyle || "white";
        this.lineWidthFraction = props.lineWidthFraction || 1/500;
        this.margin = props.margin || 0.2;

        this.primitives = props.primitives;

        // TODO: this depends on 2d or 3d
        
        this.dataProjected = tf.tensor2d([[0,0]]);
        this.primitiveDepth = tf.tensor2d([[0]],[1,1]);
        this.axesLineDepth = tf.tensor2d([[0]],[1,1]);
        this.axesLabelDepth = tf.tensor2d([[0]],[1,1]);
        this.dataScreen = tf.tensor2d([[0,0]]);

        this.axesLines = [];
        this.axesLabels = [];

        this.actFunc = [(x:tf.Tensor2D) => x];
        
        props.slide.axes[props.name] = this;
        this.slide = props.slide;
    }
    // {plt.left, plt.right, margin} -> left
    // {plt.left, plt.right, margin} -> right
    // {left, right, xZeroRatio} -> xZero
    // {xMin, xMax} -> xZeroRatio

    draw(){

        // Step one, put line, text, and primitives into one array.
        const allElements = [];
        allElements.push(...this.axesLines);
        allElements.push(...this.axesLabels);
        allElements.push(...this.primitives);

        const allDepths = [];
        allDepths.push(...Array.from(this.axesLineDepth.bufferSync().values));
        allDepths.push(...Array.from(this.axesLabelDepth.bufferSync().values));
        allDepths.push(...Array.from(this.primitiveDepth.bufferSync().values));

        // Step two, sort
        const plotOrder = argsort(allDepths)
        

        // Step four plot
        for (let i=0; i<this.grids.length; i++){
            this.grids[i].draw();
        }

        for (let i=0; i<allElements.length; i++){
            allElements[plotOrder[i]].draw();
        }
    }

    updateAxes() {
        this.rawMax.dispose();
        this.rawMin.dispose();
        this.rawMax = tf.max(this.dataRaw,0,true);
        this.rawMin = tf.min(this.dataRaw,0,true);
        

        let lineProps = {
            fig: this.plt.fig,
            strokeStyle: "white",
            lineWidthFraction: 1 / 500,
        }

        let textProps = {
            fig: this.plt.fig,
            slide: this.slide,
            fillstyle: "white",
            stroke:"1",
        }

        const axesLines = [];
        const axesLabels = [];

        if (this.dimensions() === 2){
            this.rawMax.dispose();
            this.rawMin.dispose();
            this.rawMax = tf.max(this.dataProjected,0,true);
            this.rawMin = tf.min(this.dataProjected,0,true);
            // 2D data
            const xMin = () => this.rawMin.bufferSync().get(0,0);
            const yMin = () => this.rawMin.bufferSync().get(0,1);
            const xMax = () => this.rawMax.bufferSync().get(0,0);
            const yMax = () => this.rawMax.bufferSync().get(0,1);

            const ratio = () => this.width()/this.height()
            const arrowSizeX = () => Math.max(
                (1)*(yMax()-yMin())/70,
            )

            const arrowSizeY = () => Math.max(
                (ratio())*(xMax()-xMin())/70
            )

            // const arrowSize3d = () => Math.max(
            //     (yMax()-yMin())/50,
            //     (xMax()-xMin())/50
            // );

            // X
            if (this.drawnAxes.includes(0)){
                
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[xMin(), 0]],
                        'xyz2':() => [[xMax(), 0]]
                    }
                ))
                axesLabels.push(new Text(
                    {
                        ...textProps,
                        'name':'x-',
                        'xyz':() => [[xMin()-.000001, 0]],
                        'text': 'x(-)',
                        'xScreenOffset':0,
                        'yScreenOffset':-(this.bottom()-this.top())/20,
                    }
                ))
                axesLabels.push(new Text(
                    {
                        ...textProps,
                        'name':'x+',
                        'xyz':() => [[xMax()+.000001, 0]],
                        'text': 'x(+)',
                        'xScreenOffset':0,
                        'yScreenOffset':-(this.bottom()-this.top())/20,
                    }
                ))

                // xmin arrow
                if (xMin() != 0){

                    axesLines.push(new Line(
                        {
                            ...lineProps,
                            'xyz1':() => [[xMin(), 0]],
                            'xyz2':() => [[xMin()+arrowSizeY(), arrowSizeY()]]
                        }
                    ))
                    axesLines.push(new Line(
                        {
                            ...lineProps,
                            'xyz1':() => [[xMin(), 0]],
                            'xyz2':() => [[xMin()+arrowSizeY(), -arrowSizeY()]]
                        }
                    ))
                }
                // xmax arrow
                if (xMax() != 0){
                    axesLines.push(new Line(
                        {
                            ...lineProps,
                            'xyz1':() => [[xMax(), 0]],
                            'xyz2':() => [[xMax()-arrowSizeY(), arrowSizeY()]]
                        }
                    ))
                    axesLines.push(new Line(
                        {
                            ...lineProps,
                            'xyz1':() => [[xMax(), 0]],
                            'xyz2':() => [[xMax()-arrowSizeY(), -arrowSizeY()]]
                        }
                    ))
                }
                if (this.ticks){    
                    // x ticks
                    for (let i=Math.ceil(Math.ceil(this.rawMin.bufferSync().get(0,0))); i<= Math.floor(this.rawMax.bufferSync().get(0,0)); i++){
                        axesLines.push(new Line(
                            {
                                ...lineProps,
                                'xyz1':() => [[i,-arrowSizeY()/1.5]],
                                'xyz2':() => [[i,arrowSizeY()/1.5]]
                            }
                        ))
                    }
                }
            }
            // Y
            if (this.drawnAxes.includes(1)){
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[0, yMin()]],
                        'xyz2':() => [[0, yMax()]]
                    }
                ))
                axesLabels.push(new Text(
                    {
                        ...textProps,
                        'name':'y-',
                        'xyz':() => [[0, yMin()-.000001]],
                        'text': 'y(-)',
                        'xScreenOffset':(this.right()-this.left())/20,
                        'yScreenOffset':0,
                    }
                ))
                axesLabels.push(new Text(
                    {
                        ...textProps,
                        'xyz':() => [[0, yMax()+.000001]],
                        'name':'y+',
                        'text': 'y(+)',
                        'xScreenOffset':(this.right()-this.left())/20,
                        'yScreenOffset':0,
                    }
                ))
                // ymin arrow
                if (yMin() != 0){
                    axesLines.push(new Line(
                        {
                            ...lineProps,
                            'xyz1':() => [[0, yMin()]],
                            'xyz2':() => [[arrowSizeX(), yMin()+arrowSizeX()]]
                        }
                    ))
                    axesLines.push(new Line(
                        {
                            ...lineProps,
                            'xyz1':() => [[0, yMin()]],
                            'xyz2':() => [[-arrowSizeX(), yMin()+arrowSizeX()]]
                        }
                    ))
                }
                // ymax arrow
                if (yMax() != 0){
                    axesLines.push(new Line(
                        {
                            ...lineProps,
                            'xyz1':() => [[0, yMax()]],
                            'xyz2':() => [[arrowSizeX(), yMax()-arrowSizeX()]]
                        }
                    ))
                    axesLines.push(new Line(
                        {
                            ...lineProps,
                        'xyz1':() => [[0, yMax()]],
                        'xyz2':() => [[-arrowSizeX(), yMax()-arrowSizeX()]]
                    }
                ))
                }
                if (this.ticks){
                    // y ticks
                    for (let i=Math.ceil(this.rawMin.bufferSync().get(0,1)); i<= Math.floor(this.rawMax.bufferSync().get(0,1)); i++){
                        axesLines.push(new Line(
                            {
                                ...lineProps,
                                'xyz1':() => [[-arrowSizeX()/1.5,i]],
                                'xyz2':() => [[arrowSizeX()/1.5, i]]
                            }
                        ))
                    }
                }
            }
            
        } else if (this.dimensions() ===3){
            const xMin = () => this.rawMin.bufferSync().get(0,0);
            const yMin = () => this.rawMin.bufferSync().get(0,1);
            const zMin = () => this.rawMin.bufferSync().get(0,2);

            const xMax = () => this.rawMax.bufferSync().get(0,0);
            const yMax = () => this.rawMax.bufferSync().get(0,1);
            const zMax = () => this.rawMax.bufferSync().get(0,2);

            const arrowSize3d = () => Math.max(
                (yMax()-yMin())/50,
                (xMax()-xMin())/50,
                (zMax()-zMin())/50,
            );

            // X
            axesLines.push(new Line(
                {
                    ...lineProps,
                    'xyz1':() => [[xMin(), 0, 0]],
                    'xyz2':() => [[xMax(), 0, 0]]
                }
            ))
            axesLabels.push(new Text(
                {
                    ...textProps,
                    'xyz':() => [[xMin()-.000001, 0, 0]],
                    'name':'x-',
                    'text': 'x(-)',
                    'xScreenOffset':0,
                    'yScreenOffset':-(this.bottom()-this.top())/20,
                }
            ))
            axesLabels.push(new Text(
                {
                    ...textProps,
                    'xyz':() => [[xMax()+.000001, 0, 0]],
                    'name':'x+',
                    'text': 'x(+)',
                    'xScreenOffset':0,
                    'yScreenOffset':-(this.bottom()-this.top())/20,
                }
            ))

            // Y
            axesLines.push(new Line(
                {
                    ...lineProps,
                    'xyz1':() => [[0, yMin(), 0]],
                    'xyz2':() => [[0, yMax(), 0]]
                }
            ))
            axesLabels.push(new Text(
                {
                    ...textProps,
                    'name':'y-',
                    'xyz':() => [[0, yMin()-.000001, 0]],
                    'text': 'y(-)',
                    'xScreenOffset':(this.right()-this.left())/20,
                    'yScreenOffset':0,
                }
            ))
            axesLabels.push(new Text(
                {
                    ...textProps,
                    'name':'y+',
                    'xyz':() => [[0, yMax()+.000001, 0]],
                    'text': 'y(+)',
                    'xScreenOffset':(this.right()-this.left())/20,
                    'yScreenOffset':0,
                }
            ))

            // Z
            axesLines.push(new Line(
                {
                    ...lineProps,
                    'xyz1':() => [[0, 0, zMin()]],
                    'xyz2':() => [[0, 0, zMax()]]
                }
            ))
            axesLabels.push(new Text(
                {
                    ...textProps,
                    'name':'z-',
                    'xyz':() => [[0, 0, zMin()-.000001]],
                    'text': 'z(-)',
                    'xScreenOffset':0,
                    'yScreenOffset':-(this.bottom()-this.top())/20,
                }
            ))
            axesLabels.push(new Text(
                {
                    ...textProps,
                    'name':'z+',
                    'xyz':() => [[0, 0, zMax()+.000001]],
                    'text': 'z(+)',
                    'xScreenOffset':0,
                    'yScreenOffset':-(this.bottom()-this.top())/20,
                }
            ))

            // xmin arrow
            if (xMin() != 0){

                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[xMin(), 0, 0]],
                        'xyz2':() => [[xMin()+arrowSize3d(), arrowSize3d(), 0]]
                    }
                ))
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[xMin(), 0, 0]],
                        'xyz2':() => [[xMin()+arrowSize3d(), -arrowSize3d(), 0]]
                    }
                ))
            }
            // xmax arrow
            if (xMax() != 0){
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[xMax(), 0, 0]],
                        'xyz2':() => [[xMax()-arrowSize3d(), arrowSize3d(), 0]]
                    }
                ))
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[xMax(), 0, 0]],
                        'xyz2':() => [[xMax()-arrowSize3d(), -arrowSize3d(), 0]]
                    }
                ))
            }
            // ymin arrow
            if (yMin() != 0){
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[0, yMin(), 0]],
                        'xyz2':() => [[arrowSize3d(), yMin()+arrowSize3d(), 0]]
                    }
                ))
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[0, yMin(), 0]],
                        'xyz2':() => [[-arrowSize3d(), yMin()+arrowSize3d(), 0]]
                    }
                ))
            }
            // ymax arrow
            if (yMax() != 0){
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[0, yMax(), 0]],
                        'xyz2':() => [[arrowSize3d(), yMax()-arrowSize3d(), 0]]
                    }
                ))
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[0, yMax(), 0]],
                        'xyz2':() => [[-arrowSize3d(), yMax()-arrowSize3d(), 0]]
                    }
                ))
            }
            // zmin arrow
            if (zMin() != 0){
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[0, 0, zMin()]],
                        'xyz2':() => [[0, arrowSize3d(), zMin()+arrowSize3d()]]
                    }
                ))
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[0, 0, zMin()]],
                        'xyz2':() => [[0, -arrowSize3d(), zMin()+arrowSize3d()]]
                    }
                ))
            }
            // zmax arrow
            if (zMax() != 0){
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[0, 0, zMax()]],
                        'xyz2':() => [[0, arrowSize3d(), zMax()-arrowSize3d()]]
                    }
                ))
                axesLines.push(new Line(
                    {
                        ...lineProps,
                        'xyz1':() => [[0, 0, zMax()]],
                        'xyz2':() => [[0, -arrowSize3d(), zMax()-arrowSize3d()]]
                    }
                ))
            }
        }

        this.axesLines = axesLines;
        this.axesLabels = axesLabels;

        let allRaw:Array<tf.Tensor2D> = [];

        this.axesLines.forEach(line=>{
            allRaw.push(line.xyz1())
            allRaw.push(line.xyz2())
        })
        
        const lines3D = tf.concat(allRaw,0);


        let linesDepth = tf.tensor2d([0],[1,1]);
        let lines2D = tf.tensor2d([0],[1,1]);
        [lines2D,linesDepth] = this.raw2projected(lines3D);
        lines3D.dispose();

        // const lines2D = this.raw2projected(lines3D)[0];
        const linesScreen = this.projected2Screen(lines2D);
        lines2D.dispose();
        let avgLineDepth = [];
        // Tell the primitives the screen positions
        for (let i=0; i<this.axesLines.length; i++){
            this.axesLines[i].assignScreenPos([()=>
                [
                    linesScreen.bufferSync().get(2*i,0),
                    linesScreen.bufferSync().get(2*i,1)
                ],()=>
                [
                    linesScreen.bufferSync().get(2*i+1,0),
                    linesScreen.bufferSync().get(2*i+1,1)
                ]
            ]);
            avgLineDepth.push(
                (linesDepth.bufferSync().get(2*i,0) + linesDepth.bufferSync().get(2*i+1,0))/2
            )
        }
        linesDepth.dispose();
        this.axesLineDepth.dispose();
        this.axesLineDepth = tf.tensor2d(avgLineDepth,[this.axesLines.length,1]);

        // collect 3d data into tensor
        let allRawText:Array<tf.Tensor2D> = [];
        this.axesLabels.forEach(text=>{
            allRawText.push(text.xyz())
        })

        let textData3D = tf.concat(allRawText,0);
        // allRawText.forEach(t=>t.dispose());
    
        // transform 3D to 2D
        let textDepth = tf.tensor2d([0],[1,1]);
        let textLoc2D = tf.tensor2d([0],[1,1]);
        [textLoc2D,textDepth] = this.raw2projected(textData3D);
        textData3D.dispose();
        const textLocScreen = this.projected2Screen(textLoc2D);
        textLoc2D.dispose();

        for (let i=0; i<this.axesLabels.length; i++){
            this.axesLabels[i].assignScreenPos(()=>[textLocScreen.bufferSync().get(i,0),textLocScreen.bufferSync().get(i,1)])
        }
        this.axesLabelDepth.dispose();
        this.axesLabelDepth = textDepth;
    }

    // activationFunction(dataProjected:tf.Tensor2D){
    //     return this.actFunc(dataProjected)
    // }

    updatePrimitives(){
        if (this.grids.length>0){
            let allGridsRaw:Array<tf.Tensor2D> = [];
            let i = 0
            this.grids.forEach(obj=>{
                allGridsRaw.push(tf.tensor2d(obj.xyz1(),[1,this.dimensions()]))
                allGridsRaw.push(tf.tensor2d(obj.xyz2(),[1,this.dimensions()]))
            })

            let gridsRaw = tf.concat(allGridsRaw,0);
        }

        // collect 3d data into tensor
        let allRaw:Array<tf.Tensor2D> = [];
        let objMap:Array<Dot | Line | Ray> = [];
        this.primitives.forEach(obj=>{
            if (obj instanceof Dot){
                allRaw.push(obj.xyz())
                objMap.push(obj)
            }
            if (obj instanceof Line || obj instanceof Ray){

                allRaw.push(tf.tensor2d(obj.xyz1(),[1,this.dimensions()]))
                allRaw.push(tf.tensor2d(obj.xyz2(),[1,this.dimensions()]))
                objMap.push(obj)
                objMap.push(obj)
            }
        })
        this.dataRaw.dispose();
        this.dataRaw = tf.concat(allRaw,0);

        try{
            allRaw.forEach(t=>t.dispose());
        }catch{
        }
        // This is an extra TForm for visualizing transformations
        for (let i=0; i<this.extraTForm.length; i++){
            this.dataRaw = tf.matMul(this.dataRaw,this.extraTForm[i]);
            
            // Also do bias for visualizations
            this.dataRaw = this.dataRaw.add(this.bias[i]);
            if (this.grids.length){
                //@ts-expect-error
                gridsRaw = tf.matMul(gridsRaw,this.extraTForm[i]);
                //@ts-expect-error
                gridsRaw = gridsRaw.add(this.bias[i])
            }
            this.dataRaw = this.actFunc[i](this.dataRaw);
        }

        // put transformed grids back to

    
        // transform 3D to 2D
        let dataDepth:tf.Tensor2D = tf.tensor2d([[0]],[1,1]);
        this.dataProjected.dispose();
        // const dataXtra:tf.Tensor2D = tf.matMul(this.dataRaw,this.extraTForm);
        [this.dataProjected,dataDepth] = this.raw2projected(this.dataRaw);
        if (this.grids.length){
            //@ts-expect-error
            let [gridProjected, gridDepth] = this.raw2projected(gridsRaw)
        }
        this.primitiveDepth.dispose();
        this.primitiveDepth = dataDepth;

        // use the 2d positions to figure out how to convert to screen coordinates
        this.updateScreenMaxes();

        // Do activation function after maxes
        // this.dataProjected.dispose();
        


        // this.primitiveDepth.dispose();
        this.primitiveDepth = dataDepth;

        // use the above to calculate screen coords for each primitive
        this.dataScreen.dispose();
        this.dataScreen = this.projected2Screen(this.dataProjected)

        let adj = 0;
        if (this.grids.length>0){
            //@ts-expect-error
            let gridScreen = this.projected2Screen(gridProjected)
            
            for (let i=0; i<this.grids.length; i++){
                const mod = adj;
                this.grids[i].assignScreenPos([
                    ()=>[gridScreen.bufferSync().get(i.valueOf()+mod.valueOf(),0),gridScreen.bufferSync().get(i.valueOf()+mod.valueOf(),1)],
                    ()=>[gridScreen.bufferSync().get(i.valueOf()+1+mod.valueOf(),0),gridScreen.bufferSync().get(i.valueOf()+1+mod.valueOf(),1)],
                    ])//
                adj+=1
            }
            try{
                //@ts-expect-error
                gridProjected.dispose();
                // gridScreen.dispose();
                //@ts-expect-error
                gridDepth.dispose();
                //@ts-expect-error
                gridsRaw.dispose();
                //@ts-expect-error
                allGridsRaw.forEach(t=>t.dispose());
            }catch{

            }
        }

        adj = 0;
        let depth:Array<number> = [];

        for (let i=0; i<this.primitives.length; i++){
            const mod = adj;
            if (this.primitives[i] instanceof Dot){
                //@ts-expect-error
                this.primitives[i].assignScreenPos(()=>[this.dataScreen.bufferSync().get(i.valueOf()+mod.valueOf(),0),this.dataScreen.bufferSync().get(i.valueOf()+mod.valueOf(),1)])//
                depth.push(this.primitiveDepth.bufferSync().get(i.valueOf()+mod.valueOf(),0));
            }
            if (this.primitives[i] instanceof Line || this.primitives[i] instanceof Ray){
                //@ts-expect-error
                this.primitives[i].assignScreenPos([
                    ()=>[this.dataScreen.bufferSync().get(i.valueOf()+mod.valueOf(),0),this.dataScreen.bufferSync().get(i.valueOf()+mod.valueOf(),1)],
                    ()=>[this.dataScreen.bufferSync().get(i.valueOf()+1+mod.valueOf(),0),this.dataScreen.bufferSync().get(i.valueOf()+1+mod.valueOf(),1)],
                    ])//
                
                    depth.push(
                        (this.primitiveDepth.bufferSync().get(i.valueOf()+mod.valueOf()) +
                        this.primitiveDepth.bufferSync().get(i.valueOf()+1+mod.valueOf())/2
                        ,0));
                adj+=1
            }
        }
        this.primitiveDepth.dispose()
        this.primitiveDepth = tf.tensor2d(depth,[this.primitives.length,1])
    }

    updateScreenMaxes(){

        const xyMax = tf.max(this.dataProjected,0,true);
        const xyMin = tf.min(this.dataProjected,0,true);

        // Do 2d maxes;

        const [xMax,yMax] = [xyMax.bufferSync().get(0,0),xyMax.bufferSync().get(0,1)]
        const [xMin,yMin] = [xyMin.bufferSync().get(0,0),xyMin.bufferSync().get(0,1)]

        
        xyMax.dispose();
        xyMin.dispose();

        this.xMaxProjected = xMax
        this.xMinProjected = xMin
        this.yMaxProjected = yMax
        this.yMinProjected = yMin

        if (this.axisEqual){
            this.xMinProjected = Math.min(this.xMinProjected,this.yMinProjected);
            this.yMinProjected = this.xMinProjected;
            this.xMaxProjected = Math.max(this.xMaxProjected, this.yMaxProjected);
            this.yMaxProjected = this.xMaxProjected;
        } 
        
        if (this.axisCenter){
            this.xMinProjected = Math.min(this.xMinProjected,-1*this.xMaxProjected);
            this.yMinProjected = Math.min(this.yMinProjected,-1*this.yMaxProjected);
            // this.yMinProjected = this.xMinProjected;
            this.xMaxProjected = Math.max(-1*this.xMinProjected, this.xMaxProjected);
            this.yMaxProjected = Math.max(-1*this.yMinProjected, this.yMaxProjected);
            // this.yMaxProjected = this.xMaxProjected;
        }

        if (this.axisAbsolute){
            const max_dist = maxDist(this.dataProjected,tf.tensor2d([[0, 0]]));

            this.xMinProjected = -max_dist//Math.min(this.xMinProjected,this.yMinProjected,-this.xMaxProjected,-this.yMaxProjected);
            this.yMinProjected = -max_dist//this.xMinProjected;
            this.xMaxProjected = max_dist//Math.max(this.xMaxProjected, this.yMaxProjected, -this.xMinProjected,-this.yMinProjected);
            this.yMaxProjected = max_dist//this.xMaxProjected;

        }

    }

    xZeroRatio(){
        // Fairly major overhaul - probably should do this on screen dimensions
        // Need to check where this is used - might need z ratio or scrap alltogether.

        // finds the location of the zero point as a fraction of the plot bounds
        let leftSideDist = Math.abs(Math.min(0,this.xMinProjected));
        let rightSideDist = Math.abs(Math.max(0,this.xMaxProjected));
        return leftSideDist/(leftSideDist+rightSideDist);
    }

    yZeroRatio(){
        // finds the location of the zero point as a fraction of the plot bounds
        let bottomDist = Math.abs(Math.min(0,this.yMinProjected));
        let topDist = Math.abs(Math.max(0,this.yMaxProjected));
        return 1.0 - bottomDist/(bottomDist + topDist);
    }

    left(){
        const width = (this.plt.right() - this.plt.left())* (1-this.margin);
        const height = (this.plt.bottom() - this.plt.top())* (1-this.margin);
        const center = (this.plt.right() + this.plt.left())/2;

        if (this.axisEqual){
            // is width smaller than height?
            if (width <= height){
                // if so, set left to zero
                return center - width/2;
            } else {
                // otherwise, set left to midpoint - half of height
                return center - height/2;;
            }
        }
        
        // finds bound based on margin and plot/subplot
        return center - width/2;
    }
    right(){
        const width = (this.plt.right() - this.plt.left())* (1-this.margin);
        const height = (this.plt.bottom() - this.plt.top())* (1-this.margin);
        const center = (this.plt.right() + this.plt.left())/2;

        if (this.axisEqual){
            // is width smaller than height?
            if (width <= height){
                // if so, set left to zero
                return center + width/2;
            } else {
                // otherwise, set left to midpoint - half of height
                return center + height/2;
            }
        }
        // finds bound based on margin and plot/subplot
        return center + width/2;
    }
    top(){
        const width = (this.plt.right() - this.plt.left())* (1-this.margin);
        const height = (this.plt.bottom() - this.plt.top())* (1-this.margin);
        const center = (this.plt.bottom() + this.plt.top())/2;

        if (this.axisEqual){
            // is width smaller than height?
            if (width <= height){
                // if so, set left to zero
                return center - width/2;
            } else {
                // otherwise, set left to midpoint - half of height
                return center - height/2;;
            }
        }
        
        // finds bound based on margin and plot/subplot
        return this.plt.top() + (this.plt.bottom() - this.plt.top()) * this.margin;
    }
    bottom(){
        const width = (this.plt.right() - this.plt.left())* (1-this.margin);
        const height = (this.plt.bottom() - this.plt.top())* (1-this.margin);
        const center = (this.plt.bottom() + this.plt.top())/2;

        if (this.axisEqual){
            // is width smaller than height?
            if (width <= height){
                // if so, set left to zero
                return center + width/2;
            } else {
                // otherwise, set left to midpoint - half of height
                return center + height/2;;
            }
        }
        // finds bound based on margin and plot/subplot
        return this.plt.bottom() - (this.plt.bottom() - this.plt.top()) * this.margin;
    }

    width(){
        return this.right() - this.left()
    }

    height(){
        return this.bottom() - this.top()
    }

    xZero(){
        // finds zero location based on margins and zeroRatio
        if (Number.isNaN(this.xZeroRatio())){
            return this.left() + (this.right() - this.left())/2;
        }else{
            return this.left() + (this.right() - this.left()) * this.xZeroRatio();
        }
    }
    yZero(){
        // finds zero location based on margins and zeroRatio
        if (Number.isNaN(this.yZeroRatio())){
            return this.top() + (this.bottom() - this.top())/2;
        }else{
            return this.top() + (this.bottom() - this.top()) * this.yZeroRatio();
        }
    }

    // transform(xyz:tf.Tensor2D):tf.Tensor2D{
    //     // converts data point to screen location
    //     // Method is used only by the primitive to convert data to screen scaling

    //     const output = tf.tidy(()=>{

    //         let [xy,z] = this.raw2projected(xyz);

    //         //TODO: Now need to get from 2d to screen

    //         // converts data point to screen location
    //         // Method is used only by the primitive to convert data to screen scaling
    //         let scaleX = ()=> (this.right()-this.left())/ (this.xMaxProjected-this.xMinProjected);

    //         if ((this.xMaxProjected-this.xMinProjected) == 0){
    //             scaleX = ()=> (this.right()-this.left())/ 1;
    //         }

    //         let scaleY = ()=> (this.top() - this.bottom()) / (this.yMaxProjected - this.yMinProjected);

    //         if ((this.yMaxProjected-this.yMinProjected) == 0){
    //             scaleY = ()=> (this.top() - this.bottom())/ 1;
    //         }

    //         xy = xy.mul(tf.tensor2d([[scaleX(),scaleY()]]));
    //         xy = xy.add(tf.tensor2d([[this.xZero(), this.yZero()]]))
    //         return xy
    //     })
    //     return output
    // }

    projected2Screen(xy:tf.Tensor2D){
        const output = tf.tidy(()=>{
            // converts data point to screen location
            // Method is used only by the primitive to convert data to screen scaling
            let scaleX = ()=> (this.right()-this.left())/ (this.xMaxProjected-this.xMinProjected);
            // console.log(this.xMaxProjected,this.xMinProjected)
            if ((this.xMaxProjected-this.xMinProjected) == 0){
                scaleX = ()=> (this.right()-this.left())/ 1;
            }

            let scaleY = ()=> (this.top() - this.bottom()) / (this.yMaxProjected - this.yMinProjected);

            if ((this.yMaxProjected-this.yMinProjected) == 0){
                scaleY = ()=> (this.top() - this.bottom())/ 1;
            }

            const xy1 = xy.mul(tf.tensor2d([[scaleX(),scaleY()]]));
            const xy2:tf.Tensor2D = xy1.add(tf.tensor2d([[this.xZero(), this.yZero()]]))
            return xy2
        })

        return output
    }

    raw2projected(xyz:tf.Tensor2D):[tf.Tensor2D,tf.Tensor2D]{
        const xy2d:tf.Tensor2D = tf.matMul(xyz,this.TForm);
        let projectedXY:tf.Tensor2D;
        let projectedDepth:tf.Tensor2D;
        
        if (this.dimensions() === 2){
            projectedXY = tf.gather(xy2d,[0,1],1);
            projectedDepth = tf.tensor2d(Array(projectedXY.shape[0]).fill(0),[projectedXY.shape[0],1]);
        } else if (this.dimensions() === 3){
            projectedXY = tf.gather(xy2d, [0, 1], 1);
            projectedDepth = tf.gather(xy2d,[2],1);
        } else {
            throw Error("Invalid dimensions")
        }
        return [projectedXY, projectedDepth]
        // return xy2d.arraySync()
    }

    updateTForm(){
        if (this.dimensions() === 2){
            this.TForm = tf.tidy(()=>
                {
                    const R = tf.tensor2d([
                        [Math.cos(this.thetaY()), -Math.sin(this.thetaY())],
                        [Math.sin(this.thetaY()), Math.cos(this.thetaY())]]
                    );
                    return R
                }
            )
        } else if (this.dimensions() === 3){
            this.TForm = tf.tidy(()=>
                {
                    const Rx = tf.tensor(
                        [
                            [1, 0, 0],
                            [0, Math.cos(this.thetaX()), Math.sin(this.thetaX())],
                            [0, -Math.sin(this.thetaX()), Math.cos(this.thetaX())]
                        ]
                    ).transpose();
    
                    const Ry = tf.tensor(
                        [
                            [Math.cos(-this.thetaY()), 0, Math.sin(-this.thetaY())], 
                            [0, 1, 0],
                            [-Math.sin(-this.thetaY()), 0, Math.cos(-this.thetaY())]
                        ]
                    ).transpose();
                    
    
                    const Rz = tf.tensor(
                        [
                            [1, 0, 0],
                            [0, 1, 0],
                            [0, 0, 1]
                        ]
                    ).transpose();
    
                    const R:tf.Tensor2D = tf.matMul(tf.matMul(Ry, Rx),Rz);
                    
                    return R
                }
            )

        }
        
    }

    lineWidth(){
        // lineWidth as fraction of entire figure
        return this.lineWidthFraction*Math.max(
            this.plt.bottom() - this.plt.top(),
            this.plt.right() - this.plt.left()
        )
    }

}

const options = {
    fps: 50,
    duration: 1000,
    canvas: document.querySelector('#canvas')
};

const frameDuration = 1e3 / options.fps;
const frames = Math.round(options.duration / frameDuration);
const framesNameLength = Math.ceil(Math.log10(frames));

let canvas = document.getElementById('canvas') as
    HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;

async function sendFrameToServer(frameData: string, frameName: string){
    try {
        let response = fetch('http://localhost:3000/save-images', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ frameData, frameName }),
            signal: AbortSignal.timeout(10000)
        });
        // if (!response.ok) {
        //     console.log(`HTTP error! status: ${response.status}`);
        //     return new Response();
        // }
        // const responseText = await response.text();
        // console.log(`Server response: ${responseText}`); 
        // return response;
        return new Response();
    } catch (error) {
        console.error('Error sending frame to server:', error);
        // return dummy response
        return new Response();
    }
}

export function createAnimation(func:Function, animateBool:Function, index:number, scriptName:string) {
    let i = 0;
    let animate = async (timestamp:number) => {

        if (animateBool(index)){
            i += 1;
            const frameName = scriptName+'/'+i.toString().padStart(framesNameLength, '0');
            // ignore ts
            // @ts-ignore
            func()
            if (i<=3000){
                const frameData = canvas.toDataURL('image/png');
                try{
                    await sendFrameToServer(frameData, frameName);
                    // console.log(`Frame ${frameName} sent to server`);
                }catch{
                    console.log('caught in createAnimation')
                }
            }
            
        }
        requestAnimationFrame(animate);    
    };
    return animate(0)
}

export function cancelAnimation(animationId:number) {
    window.cancelAnimationFrame(animationId);
}
