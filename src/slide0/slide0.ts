import * as plt from '../plot';

class Intro extends plt.Slide {

    // public titlePlot: plt.Plot;
    // public title: plt.Text;

    // public plot: plt.Plot;
    // public data: plt.Tensor2D;

    // public animationId: number | undefined | void;

    constructor(){
        super()
        let titleProps: plt.PlotProps = {
            slide:this,
            name:'title',
            figure: this.figure,
            n_rows: 3,
            n_columns: 1,
            row_id: 0,
            col_id: 0,
        }

        new plt.Plot(titleProps);

        new plt.Text({
            fig: this.figure,
            slide:this,
            name:'title',
            xyz: () => [0,0,0],
            text: "Neural Nets Uncomplicated",
            font: "100px myFont",
        });

        this.texts.title.assignScreenPos(this.plots.title.center.bind(this.plots.title));

        let plotProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'main',
            n_rows: 3,
            n_columns: 3,
            row_id: 0.3,
            col_id: 0,
            row_id_max:2,
            col_id_max:2
        }

        new plt.Plot(plotProps);
        let primitives:Array<plt.Dot | plt.Line> = [];
        // this.data = plt.tensor(
        //     [
        //         [-1,-1], 
        //         [0,0], 
        //         [1,0.2],
        //         [2,-.4],
        //         [0,1],
        //         [.3,2],
        //         [-.1,3],
        //         [2,2],
        //         [-1.5,1.5],
        //         [1,1],
        //         [-1,-3],
        //         [2,-3],
        //         [-2,1],
        //         [0.8,-1.6]
        //     ]
        // );

        const data: plt.Tensor2D = plt.randomNormal([20,2]);

        let gridLines = plt.genGrid(data,this.figure)

        for (let i = 0; i<data.shape[0]; i++){
            // push a new random color dot for each data point.
            // the x, y, and r values are evaluated at each draw.
            // draw is held off until animation.
            const rand_rgba = plt.random_rgba();
            primitives.push(new plt.Dot({fig:this.figure,fillstyle: rand_rgba, 
                stroke: "gray", 
                xyz: () => data.slice([i],[1]),
                radiusFraction: .02, animate: false })
            );
        }

        let axesProps: plt.AxesProps = {
            plt: this.plots['main'],
            slide:this,
            name:'main',
            primitives: primitives,
            // axisEqual: true,
            axisAbsolute: true,
            ticks: true,
            grids: gridLines,
            // margin: 0
        }

        new plt.Axes(axesProps);

        this.router();
    }
    // getAnimateBool(){
    //     return this.animateBool
    // }

    draw0(){
        // this.w.elements = [['cos(45)','sin(45)'],['-sin(45)','cos(45)']];
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [Math.cos(Math.PI/4), 2*Math.sin(Math.PI/4)],
                [-Math.sin(Math.PI/4), 3*Math.cos(Math.PI/4)],
            ]
        );
        let inc = 5;
        let step = -200;
        let warpStep = step;
        let clip = 0;
        let bias = 0;
        let biasWeight = 2;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.texts.title.draw();
            // this.x.draw();
            // this.w.draw();
            // this.plusText.draw();
            // this.b.draw();
            step += inc;
            if (step <= -500){
                inc = 5;
                clip = 0;
                warpStep = 0;
                // biasWeight = -1*biasWeight
            }
            if (step < 0){
                // inc = 5;
                clip = 0;
                warpStep = 0;
                bias = 0;
                // biasWeight = -1*biasWeight
            }
            if (step >=0 && step<= 1000){       
                bias = 0;
                warpStep = step
            }else if (step>1000 && step <=1500) {
                bias = biasWeight*(step-1000)/1500
            }else if (step>1500 && step <=2000){
                clip += inc
            }

            if (step > 2100){
                inc = -32
                // biasWeight = -1*biasWeight
                // clip = 0
                // step = 0
                // clip = 0
            }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['main'].extraTForm = [tForm];

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }

            this.axes['main'].actFunc = [clipFunc];

            this.axes['main'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['main'].TForm = tForm;
            this.axes['main'].bias[0].dispose();
            this.axes['main'].bias = [plt.tensor2d([[bias,bias]])];
            this.axes['main'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['main'].draw();

        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide0/draw0')
    }
    
    draw1(){
        this.animateBool[-1] = false
        // this.w.elements = [['cos(45)','sin(45)'],['-sin(45)','cos(45)']];
        let tFormI = plt.tensor2d(
            [
                [1,0], 
                [0,1], 
            ]
        );
        let tFormW = plt.tensor2d(
            [
                [Math.cos(Math.PI/4), 2*Math.sin(Math.PI/4)],
                [-Math.sin(Math.PI/4), 3*Math.cos(Math.PI/4)],
            ]
        );
        let inc = 5;
        let step = -199;
        let warpStep = step;
        let clip = 0;
        let bias = 0;
        let biasWeight = 2;
        // create animation function
        let plot_func = () =>{
            this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
            this.texts.title.draw();
            // this.x.draw();
            // this.w.draw();
            // this.plusText.draw();
            // this.b.draw();
            // step += inc;
            // if (step <= -200){
            //     inc = 5;
            //     clip = 0;
            //     // biasWeight = -1*biasWeight
            // }
            // if (step >=0 && step<= 1000){       
            //     warpStep = step
            // }else if (step>1000 && step <=1500) {
            //     bias = biasWeight*(step-1000)/1500
            // }else if (step>1500 && step <=2000){
            //     clip += inc
            // }

            // if (step > 2100){
            //     inc = -32
            //     // biasWeight = -1*biasWeight
            //     // clip = 0
            //     // step = 0
            //     // clip = 0
            // }

            let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['main'].extraTForm = [tForm];

            let clipFunc = function(x:plt.Tensor){
                x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
                return x
            }

            this.axes['main'].actFunc = [clipFunc];

            this.axes['main'].updatePrimitives();
            // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            this.axes['main'].TForm = tForm;
            this.axes['main'].bias[0].dispose();
            this.axes['main'].bias = [plt.tensor2d([[bias,bias]])];
            this.axes['main'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['main'].draw();
        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide0/draw1')
    }

}

let app = new Intro();

// export { app };