import { camelCase } from 'lodash';
import * as plt from '../plot';



class Intro extends plt.Slide {

    public titlePlot: plt.Plot;
    public title: plt.Text;

    public plot: plt.Plot;

    public data: plt.Tensor2D;

    public dataText: plt.Text;

    public eqn1: plt.Text;

    public eqn2: plt.Text;

    public eqn3: plt.Text;


    constructor(){
        super()
        // Create Plots:

        let titleProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
            n_rows: 8,
            n_columns: 1,
            row_id: 0,
            col_id: 0,
        }

        new plt.Plot(titleProps);

        this.title = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "Feed Forward network",
            font: "10% myFontBold",
        });

        this.title.assignScreenPos(this.plots['title'].center.bind(this.plots['title']));

        let plotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'sub',
            n_rows: 3,
            n_columns: 3,
            row_id: .6,
            col_id: 0,
            row_id_max:2.4,
            col_id_max:2
        }

        this.plot = new plt.Plot(plotProps);
        
        let primitives:Array<plt.Dot> = [];

        this.data = plt.randomNormal([20, 2], 0, 1, 'float32', 1234);

        let grids = plt.genGrid(this.data,this.figure)

        for (let i = 0; i<this.data.shape[0]; i++){
            const rand_rgba = plt.random_rgba();
            primitives.push(new plt.Dot({fig:this.figure,fillstyle: rand_rgba, 
                stroke: "gray", 
                xyz: () => this.data.slice([i],[1]),
                radiusFraction: .02, animate: false })
            );
        }

        


        let axesProps: plt.AxesProps = {
            plt: this.plot,
            slide:this,
            name:'m',
            primitives: primitives,
            grids: grids,
            axisEqual: true,
            // axisCenter: true,
            // axisCenter: true,
            axisAbsolute: true,
            ticks: true
            // margin: 0
        }
        new plt.Axes(axesProps);


        this.dataText = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'data',
            xyz: () => [0,0,0],
            text: "X\n \n \n ",
            font: "5% myFont",
        });
        this.dataText.assignScreenPos(()=>this.figure.getPosition.bind(this.figure)(13,25));

        this.eqn1 = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'eqn1',
            xyz: () => [0,0,0],
            text: "FF(X) → X'\nrotate\n+bias\nrelu",
            font: "5% myFont",
        });
        this.eqn1.assignScreenPos(()=>this.figure.getPosition.bind(this.figure)(37,25));

        this.eqn2 = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'eqn2',
            xyz: () => [0,0,0],
            text: "FF(X') → X''\nproject↓\n-bias\nlinear",
            font: "5% myFont",
        });
        this.eqn2.assignScreenPos(()=>this.figure.getPosition.bind(this.figure)(62,25));

        this.eqn3 = new plt.Text({
            fig: this.figure,
            slide:this,
            name:'eqn3',
            xyz: () => [0,0,0],
            text: "X'' = Ŷ\n \n \n",
            font: "5% myFont",
        });
        this.eqn3.assignScreenPos(()=>this.figure.getPosition.bind(this.figure)(87,25));

        this.router();
    }

    draw0(){
        // create animation function
        let plot_func = () =>{
             this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
             this.title.draw();
             this.dataText.draw();
             this.eqn1.draw();
             this.eqn2.draw();
             this.eqn3.draw();
         }
         // repeatedly call plot_func
         this.createAnimation(plot_func,'slide13/draw0')
     }
    

    draw1(){
        // this.w.elements = [['cos(45)','sin(45)'],['-sin(45)','cos(45)']];
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [Math.cos(Math.PI/4), Math.sin(Math.PI/4)],
                [-Math.sin(Math.PI/4), Math.cos(Math.PI/4)],
            ]
        );
        let tFormW2= plt.tensor2d(
            [
                [1, 0],
                [2, 0],
            ]
        );
        let inc = 5;
        let step = -199;
        let warpStep = 0;
        let warpStep2 = 0;
        let clip = 0;
        let bias = 0;
        let bias2 = 0;
        let biasWeight = 2;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            
            step += inc;
            if (step <= -200){
                inc = 5;
                clip = 0;
                warpStep = 0
                bias = 0
                warpStep2 = 0
                bias2 = 0
                // biasWeight = -1*biasWeight
            }
            if (step < 0){
                bias = 0;
                clip = 0;
                warpStep = 0;
                bias2 = 0;
                this.dataText.font = "5% myFontBold"
                this.dataText.fillstyle = "red"
                this.eqn1.fillstyle = "white"
                this.eqn1.font = "5% myFont"
            }
            if (step >=0 && step<= 1000){       
                warpStep = step
                this.dataText.fillstyle = "white"
                this.dataText.font = "5% myFont"
                this.eqn1.fillstyle = "red"
                this.eqn1.font = "5% myFontBold"
                this.eqn2.fillstyle = "white"
                this.eqn2.font = "5% myFont"
            }else if (step>1000 && step <=1500) {
                bias = biasWeight*(step-1000)/1500
            }else if (step>1500 && step <=2000){
                bias = 1000/1500
                clip += inc
                clip = Math.min(clip,500)
                warpStep2 = 0
            }
            if (step>2000 && step <=2500){
                warpStep2 = 0
                bias2 = 0
                this.eqn1.fillstyle = "red"
                this.eqn1.font = "5% myFontBold"
                this.eqn2.fillstyle = "white"
                this.eqn2.font = "5% myFont"
            }

            if (step >2500 && step<= 3500){       
                warpStep2 = step-2500
                bias2 = 0
                this.eqn1.fillstyle = "white"
                this.eqn1.font = "5% myFont"
                this.eqn2.fillstyle = "red"
                this.eqn2.font = "5% myFontBold"
                this.eqn3.fillstyle = "white"
                this.eqn3.font = "5% myFont"
            }else if (step>3500 && step <=4000) {
                bias2 = -biasWeight*(step-3500)/1500
                this.eqn2.fillstyle = "red"
                this.eqn2.font = "5% myFontBold"
                this.eqn3.fillstyle = "white"
                this.eqn3.font = "5% myFont"
            }
            if (step>4000){
                this.eqn2.fillstyle = "white"
                this.eqn2.font = "5% myFont"
                this.eqn3.fillstyle = "red"
                this.eqn3.font = "5% myFontBold"
            }

            if (step > 4500){
                inc = -32
            }

            let tForm1: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            let tForm2: plt.Tensor2D = tFormI.mul((1000-warpStep2)/1000).add(tFormW2.mul((warpStep2)/1000));
            this.axes['m'].extraTForm = [tForm1,tForm2];

            let clipFunc1 = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }
            let clipFunc2 = function(x:plt.Tensor){
                // x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }
            this.axes['m'].actFunc = [clipFunc1, clipFunc2];

            this.axes['m'].bias[0].dispose();
            // this.axes['m'].bias[1].dispose();
            this.axes['m'].bias = [plt.tensor2d([[bias,bias]]),plt.tensor2d([[2*bias2,0]])];

            this.axes['m'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            // tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['m'].TForm = tFormI;
            
            this.axes['m'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['m'].draw();
            this.title.draw();
            this.dataText.draw();
            this.eqn1.draw();
            this.eqn2.draw();
            this.eqn3.draw();

            // this.figure.draw(this.axes);
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide13/draw1');
    }

    // draw2(){
    //     this.w.elements = [['cos(45)','sin(45)'],['-sin(45)','cos(45)']];
    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0], 
    //             [0,1], 
    //         ]
    //     );
    //     let tFormW = plt.tensor2d(
    //         [
    //             [Math.cos(Math.PI/4), Math.sin(Math.PI/4)],
    //             [-Math.sin(Math.PI/4), Math.cos(Math.PI/4)],
    //         ]
    //     );
    //     let inc = 5;
    //     let step = -199;
    //     let warpStep = step;
    //     let clip = 0;
    //     let bias = 0;
    //     let biasWeight = 2;
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.x.draw();
    //         this.w.draw();
    //         this.plusText.draw();
    //         this.b.draw();
    //         step += inc;
    //         if (step <= -200){
    //             inc = 5;
    //             clip = 0;
    //             // biasWeight = -1*biasWeight
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //         }else if (step>1000 && step <=1500) {
    //             bias = biasWeight*(step-1000)/1500
    //         }else if (step>1500 && step <=2000){
    //             clip += inc
    //         }

    //         if (step > 2100){
    //             // inc = -32
    //             // biasWeight = -1*biasWeight
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].extraTForm = tForm;

    //         let clipFunc = function(x:plt.Tensor){
    //             x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
    //             return x
    //         }

    //         this.axes['m'].actFunc = clipFunc;

    //         this.axes['m'].updatePrimitives();
    //         // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
    //         tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].TForm = tForm;
    //         this.axes['m'].bias.dispose();
    //         this.axes['m'].bias = plt.tensor2d([[bias,bias]]);
    //         this.axes['m'].updateAxes();
    //         // Draw all points using screen coordinates.
    //         this.axes['m'].draw();

    //         // this.figure.draw(this.axes);
    //     }
    //     // repeatedly call plot_func
    //     this.createAnimation(plot_func,' ');
    // }

    // draw5(){
    //     this.w.elements = [['1','0'],['2','1']];
    //     this.w.shape = [2,2]
    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0], 
    //             [0,1], 
    //         ]
    //     );
    //     let tFormW = plt.tensor2d(
    //         [
    //             [1, 0],
    //             [2, 1],
    //         ]
    //     );
    //     let inc = 10;
    //     let step = -199;
    //     let warpStep = 0;
    //     let clip = 0;
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.x.draw();
    //         this.w.draw();
    //         step += inc;
    //         if (step <= -200){
    //             inc = 10;
    //             clip = 0;
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //         }else if (step>1000 && step <=1500){
    //             clip += inc
    //         }

    //         if (step > 1600){
    //             inc = -32
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].extraTForm = tForm;

    //         let clipFunc = function(x:plt.Tensor){
    //             x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
    //             return x
    //         }

    //         this.axes['m'].actFunc = clipFunc;

    //         this.axes['m'].updatePrimitives();
    //         // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
    //         tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].TForm = tForm;
    //         this.axes['m'].updateAxes();
    //         // Draw all points using screen coordinates.
    //         this.axes['m'].draw();

    //         // this.figure.draw(this.axes);
    //     }
    //     // repeatedly call plot_func
    //     let animationId = plt.createAnimation(plot_func);
    // }

    // draw6(){
    //     this.w.elements = [['1'],['2']];
    //     this.w.shape = [2,1]
    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0], 
    //             [0,1], 
    //         ]
    //     );
    //     let tFormW = plt.tensor2d(
    //         [
    //             [1, 0],
    //             [2, 0],
    //         ]
    //     );
    //     let inc = 5;
    //     let step = -199;
    //     let warpStep = 0;
    //     let clip = 0;
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.x.draw();
    //         this.w.draw();
    //         step += inc;
    //         if (step <= -200){
    //             inc = 5;
    //             clip = 0;
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //         }else if (step>1000 && step <=1500){
    //             clip += inc
    //         }

    //         if (step > 1600){
    //             inc = -32
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].extraTForm = tForm;

    //         let clipFunc = function(x:plt.Tensor){
    //             x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
    //             return x
    //         }

    //         this.axes['m'].actFunc = clipFunc;

    //         this.axes['m'].updatePrimitives();
    //         // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
    //         tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes['m'].TForm = tForm;
    //         this.axes['m'].updateAxes();
    //         // Draw all points using screen coordinates.
    //         this.axes['m'].draw();

    //         // this.figure.draw(this.axes);
    //     }
    //     // repeatedly call plot_func
    //     let animationId = plt.createAnimation(plot_func);
    // }

    // draw7(){
    //     // this.axes['m'].draw = () => null;
    //     this.w.elements = [['1','0','1'],['0','1','1']];
    //     this.w.shape = [2,3]

    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0,0], 
    //             [0,1,0], 
    //             [0,0,1]
    //         ]
    //     );
    //     let tFormW = plt.tensor2d(
    //         [
    //             [1, 0, 1],
    //             [0, 1, 1],
    //             [0, 0, 1]
    //         ]
    //     );

    //     let inc = 1;
    //     let step = -199;
    //     let warpStep = 0;
    //     let clip = 0;
    //     // create animation function
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.title.draw();
    //         this.x.draw();
    //         this.w.draw();

    //         step += inc;
    //         if (step <= -200){
    //             inc = 2;
    //             clip = 0;
    //         }
    //         if (step >=0 && step<= 1000){       
    //             warpStep = step
    //         }else if (step>1000 && step <=1500){
    //             clip += inc
    //         }

    //         if (step > 1600){
    //             inc = -32
    //             // clip = 0
    //             // step = 0
    //             // clip = 0
    //         }

    //         let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         this.axes3d.extraTForm = tForm;

    //         let clipFunc = function(x:plt.Tensor){
    //             x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
    //             return x
    //         }

    //         this.axes3d.actFunc = clipFunc;
    //         this.axes3d.updateTForm();

    //         this.axes3d.updatePrimitives();

    //         // console.log(this.axes3d.dataRaw.arraySync());
    //         // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
    //         // tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
    //         // this.axes3d.TForm = tForm;
    //         this.axes3d.updateAxes();
    //         // Draw all points using screen coordinates.
    //         this.axes3d.draw();

    //         // this.figure.draw(this.axes);
    //     }
    //     // repeatedly call plot_func
    //     let animationId = plt.createAnimation(plot_func);
    // }

   
}

let app = new Intro();
