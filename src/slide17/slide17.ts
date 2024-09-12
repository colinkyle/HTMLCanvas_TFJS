import * as plt from '../plot';



class Intro extends plt.Slide {

    constructor(){
        super()
        // Create Plots:

        let titleProps: plt.PlotProps = {
            figure: this.figure,
            slide:this,
            name:'title',
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
            text: "Error",
            font: "10% myFont",
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

        let primitives:Array<plt.Dot | plt.Line | plt.Ray> = [];

        let data = plt.randomNormal([20, 2], 0, 1, 'float32', 1234);
        // add linearly spaced numbers from -2 to 2 to data
        let x = plt.linspace(-4, 4, 20).reshape([20,1]);
        data = data.add(x)

        const theta = Math.atan2(1,1);

        primitives.push(new plt.Line({fig:this.figure, 
            xyz1: () => [-5,-5],
            xyz2: () => [0,0],
            strokeStyle:"green",
            dashed: true
        })
        );

        primitives.push(new plt.Line({fig:this.figure, 
            xyz1: () => [5,5],
            xyz2: () => [0,0],
            strokeStyle:"green",
            dashed: true
        })
        );

        // const dot:number = plt.tensor2d([[1,1]]).dot(plt.tensor2d([[1,1]]).transpose()).bufferSync().get(0);

        // primitives.push(new plt.Line({fig:this.figure, 
        //     xyz1: () => [1,1],
        //     xyz2: () => [Math.cos(theta)*dot/Math.sqrt(5),Math.sin(theta)*dot/Math.sqrt(5)],
        //     dashed: true})
        // );

        var colors = new Array(20).fill(0);
        for (let i = 0; i<data.shape[0]; i++){
            colors[i] = plt.random_rgba();
            primitives.push(new plt.Dot({fig:this.figure,fillstyle: colors[i], 
                stroke: "gray", 
                xyz: () => data.slice([i],[1]),
                radiusFraction: .02, animate: false })
            );

            const dot:number = plt.tensor2d([[1,1]]).dot(data.slice([i],[1]).transpose()).bufferSync().get(0);

            primitives.push(new plt.Line({fig:this.figure, 
                xyz1: (() => [data.slice([i],[1]).bufferSync().get(0,0),data.slice([i],[1]).bufferSync().get(0,1)]).bind(null),
                xyz2: (() => [data.slice([i],[1]).bufferSync().get(0,0),data.slice([i],[1]).bufferSync().get(0,0)]).bind(null),
                dashed: true})
            );
            
        }

        let axesProps: plt.AxesProps = {
            plt: this.plots['main'],
            slide:this,
            name:'main',
            primitives: primitives,
            axisEqual: true,
            axisAbsolute: true,
            ticks: true
            // margin: 0
        }

        new plt.Axes(axesProps);

        this.router();
    }
    // draw0(){
    //     let tFormI = plt.tensor2d(
    //         [
    //             [1,0], 
    //             [0,1], 
    //         ]
    //     );
    //     let tFormW = plt.tensor2d(
    //         [
    //             [Math.cos(Math.PI/4), 2*Math.sin(Math.PI/4)],
    //             [-Math.sin(Math.PI/4), 3*Math.cos(Math.PI/4)],
    //         ]
    //     );
    //     let inc = 5;
    //     let step = -199;
    //     let warpStep = step;
    //     let clip = 0;
    //     let bias = 0;
    //     let biasWeight = 2;
    //     let plot_func = () =>{
    //         this.figure.context.clearRect(0, 0, this.figure.canvas.width, this.figure.canvas.height);
    //         this.texts['title'].draw();
    //         this.axes['main'].draw();
    //     }
    //     // repeatedly call plot_func
    //     this.createAnimation(plot_func,'slide17/draw0');
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

            // let tForm: plt.Tensor2D = tFormI.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            // this.axes['main'].extraTForm = [tForm];

            // let clipFunc = function(x:plt.Tensor){
            //     x = x.clipByValue(Math.min((-500+clip)/75,0), 10000);
            //     return x
            // }

            // this.axes['main'].actFunc = [clipFunc];

            this.axes['main'].updatePrimitives();
            // // Update Axes and it’s primitive locations (maxes -> lines) -> goes into Matrix3D 
            // tForm = tFormI//.mul((1000-warpStep)/1000).add(tFormW.mul((warpStep)/1000));
            // this.axes['main'].TForm = tForm;
            // this.axes['main'].bias[0].dispose();
            // this.axes['main'].bias = [plt.tensor2d([[bias,bias]])];
            this.axes['main'].updateAxes();
            // Draw all points using screen coordinates.
            this.axes['main'].draw();

        }
        // repeatedly call plot_func
        this.createAnimation(plot_func,'slide17/draw0')
    }
}

let app = new Intro();
